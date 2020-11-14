var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _markedDead, _children, _parent, _data, _tree, _root;
const IS_INTERNAL = Symbol('IS_INTERNAL');
class ImmutableTreeEvent extends Event {
    constructor(type, targetNode) {
        super(type);
        this.targetNode = targetNode;
    }
}
class ImmutableTreeNode {
    constructor(tree, parent, data, children) {
        /**
         * When a node is removed from the tree, markedDead = true, which makes
         * its update methods throw
         */
        _markedDead.set(this, false);
        _children.set(this, void 0); // todo: change to .length and .at(index) or.child(index)
        _parent.set(this, void 0); // this will actually change mutably, whoopsie
        _data.set(this, void 0);
        _tree.set(this, void 0);
        __classPrivateFieldSet(this, _tree, tree);
        __classPrivateFieldSet(this, _parent, parent);
        __classPrivateFieldSet(this, _data, data);
        __classPrivateFieldSet(this, _children, Object.isFrozen(children) ? children : Object.freeze(children));
    }
    get children() { return __classPrivateFieldGet(this, _children); }
    ;
    get parent() { return __classPrivateFieldGet(this, _parent); }
    ;
    get data() { return __classPrivateFieldGet(this, _data); }
    ;
    /**
     * Update the data at the given node.
     * @param updater
     * @returns The new tree node that will replace this one
     */
    updateData(updater) {
        this.assertNotDead();
        const newData = updater(__classPrivateFieldGet(this, _data));
        const myReplacement = this.clone();
        __classPrivateFieldSet(myReplacement, _data, newData);
        this.replaceSelf(myReplacement);
        myReplacement.dispatch('immutabletree.updatenode');
        return myReplacement;
    }
    /**
     * Set the data at the given node.
     * @param newData
     * @returns The new tree node that will replace this one
     */
    setData(newData) {
        this.assertNotDead();
        const myReplacement = this.clone();
        __classPrivateFieldSet(myReplacement, _data, newData);
        this.replaceSelf(myReplacement);
        myReplacement.dispatch('immutabletree.updatenode');
        return myReplacement;
    }
    /**
     * Inserts a child to the node.
     * @param index Defaults to the end of the list.
     * @returns The new tree node that will replace this one
     */
    insertChildWithData(data, index = __classPrivateFieldGet(this, _children).length) {
        this.assertNotDead();
        const newChild = new ImmutableTreeNode(__classPrivateFieldGet(this, _tree), this, data, []);
        const myReplacement = this.clone();
        const children = __classPrivateFieldGet(myReplacement, _children).slice();
        children.splice(index, 0, newChild); // hey future me: this may be a deoptimization point to watch out for
        Object.freeze(children);
        __classPrivateFieldSet(myReplacement, _children, children);
        this.replaceSelf(myReplacement);
        myReplacement.dispatch('immutabletree.insertchild');
        return myReplacement;
    }
    /**
     * Same as insertChildWithData but does not replace itself. Use this to build
     * the tree before it needs to be immutable.
     */
    dangerouslyMutablyInsertChildWithData(data, index = __classPrivateFieldGet(this, _children).length) {
        this.assertNotDead();
        const newChild = new ImmutableTreeNode(__classPrivateFieldGet(this, _tree), this, data, []);
        const children = __classPrivateFieldGet(this, _children).slice();
        children.splice(index, 0, newChild); // hey future me: this may be a deoptimization point to watch out for
        Object.freeze(children);
        __classPrivateFieldSet(this, _children, children);
        // newChild.dispatch('immutabletree.createnode');
        return this;
    }
    // todo: a way to delete without losing grandchildren?
    /**
     * Move this node to the given position.
     * @param newParent Parent node to add to
     * @param index Defaults to the end of the list.
     * @returns Itself, since this operation does not technically modify this node
     */
    moveTo(newParent, index = __classPrivateFieldGet(newParent, _children).length) {
        this.assertNotDead();
        // Note: the below assertions are there to leave the design space open.
        // Just because I can't think of a useful meaning for these operations right now doesn't mean there isn't one
        // Assert this node is not root
        if (!__classPrivateFieldGet(this, _parent)) {
            throw new Error('Attempted to move a TreeNode out of root position');
        }
        // Assert newParent is not this node or a descendant of this node
        let current = newParent;
        while (current) {
            if (current === this)
                throw new Error('Attempted to move a TreeNode into itself or a descendant');
            current = __classPrivateFieldGet(current, _parent);
        }
        const oldParent = __classPrivateFieldGet(this, _parent);
        const oldParentReplacement = oldParent.clone();
        __classPrivateFieldSet(oldParentReplacement, _children, Object.freeze(__classPrivateFieldGet(oldParentReplacement, _children).filter(child => child !== this)));
        oldParent.replaceSelf(oldParentReplacement);
        // todo: figure out how to stop replaceSelf from running redundantly after it reaches oldParent and newParent's common ancestor
        const newParentReplacement = newParent.clone();
        const newParentChildren = __classPrivateFieldGet(newParentReplacement, _children).slice();
        newParentChildren.splice(index, 0, this); // hey future me: this may be a deoptimization point to watch out for
        Object.freeze(newParentChildren);
        __classPrivateFieldSet(newParentReplacement, _children, newParentChildren);
        newParent.replaceSelf(newParentReplacement);
        this.dispatch('immutabletree.movenode');
        return this;
    }
    /**
     * Remove this node.
     * @returns The removed node
     */
    remove() {
        this.assertNotDead();
        if (__classPrivateFieldGet(this, _parent)) {
            const parentReplacement = __classPrivateFieldGet(this, _parent).clone();
            __classPrivateFieldSet(parentReplacement, _children, Object.freeze(__classPrivateFieldGet(parentReplacement, _children).filter(child => child !== this)));
            __classPrivateFieldGet(this, _parent).replaceSelf(parentReplacement);
        }
        else {
            __classPrivateFieldGet(this, _tree)._changeRoot(null, IS_INTERNAL);
        }
        __classPrivateFieldSet(this, _markedDead, true);
        // todo: recursively mark children as dead?
        this.dispatch('immutabletree.removenode');
        return this;
    }
    /**
     * Traverse the whole sub-tree until a matching node is found.
     */
    findOne(predicate) {
        if (predicate(__classPrivateFieldGet(this, _data)))
            return this;
        for (const child of __classPrivateFieldGet(this, _children)) {
            const found = child.findOne(predicate);
            if (found)
                return found;
        }
        return null;
    }
    /**
     * Prints the subtree starting at this node. Prints [DEAD] by each node that no
     * longer exists in the tree.
     */
    print(depth = 0) {
        const indent = '  '.repeat(depth);
        console.log(indent + JSON.stringify(__classPrivateFieldGet(this, _data)) + (__classPrivateFieldGet(this, _markedDead) ? ' [DEAD]' : ''));
        __classPrivateFieldGet(this, _children).forEach(child => child.print(depth + 1));
    }
    ;
    /**
     * Create a clone of this node to replace itself with, so that object reference changes on update
     */
    clone() {
        return new ImmutableTreeNode(__classPrivateFieldGet(this, _tree), __classPrivateFieldGet(this, _parent), __classPrivateFieldGet(this, _data), __classPrivateFieldGet(this, _children));
    }
    /**
     * Connect parent and children to an updated version of this node
     */
    replaceSelf(myReplacement) {
        for (const child of __classPrivateFieldGet(this, _children)) {
            __classPrivateFieldSet(child, _parent, myReplacement);
        }
        if (__classPrivateFieldGet(this, _parent)) {
            const parentReplacement = __classPrivateFieldGet(this, _parent).clone();
            __classPrivateFieldSet(parentReplacement, _children, Object.freeze(__classPrivateFieldGet(parentReplacement, _children).map(child => child === this ? myReplacement : child)));
            __classPrivateFieldGet(this, _parent).replaceSelf(parentReplacement);
        }
        else {
            __classPrivateFieldGet(this, _tree)._changeRoot(myReplacement, IS_INTERNAL);
        }
        __classPrivateFieldSet(this, _markedDead, true);
    }
    /**
     * Throws if this node is marked dead. Used to ensure that no changes are made to old node objects.
     */
    assertNotDead() {
        if (__classPrivateFieldGet(this, _markedDead)) {
            throw new Error('Illegal attempt to modify an old version of a node, or a node that no longer exists');
        }
    }
    /**
     * Dispatch an event on the tree
     */
    dispatch(type) {
        __classPrivateFieldGet(this, _tree).dispatchEvent(new ImmutableTreeEvent(type, this));
    }
}
_markedDead = new WeakMap(), _children = new WeakMap(), _parent = new WeakMap(), _data = new WeakMap(), _tree = new WeakMap();
export class ImmutableTree extends EventTarget /* will this break in Node? Who knodes */ {
    constructor() {
        super(...arguments);
        _root.set(this, null);
    }
    /**
     * The root node of the tree
     */
    get root() { return __classPrivateFieldGet(this, _root); }
    ;
    /**
     * Create a root node with the given data object.
     * @returns The new root.
     */
    addRootWithData(data) {
        if (__classPrivateFieldGet(this, _root)) {
            throw new Error('Attempted to add a root to an ImmutableTree that already has a root node. Try removing it.');
        }
        __classPrivateFieldSet(this, _root, new ImmutableTreeNode(this, null, data, []));
        this.dispatchEvent(new ImmutableTreeEvent('immutabletree.insertchild', null));
        return __classPrivateFieldGet(this, _root);
    }
    /**
     * Traverse the whole tree until a matching node is found.
     */
    findOne(predicate) {
        return __classPrivateFieldGet(this, _root) ? __classPrivateFieldGet(this, _root).findOne(predicate) : null;
    }
    /**
     * Prints the tree. Prints [DEAD] by each node that no longer exists in the
     * tree.
     */
    print() {
        var _a;
        (_a = __classPrivateFieldGet(this, _root)) === null || _a === void 0 ? void 0 : _a.print(0);
    }
    /**
     * Given a JS object representing your root node, and a function that can
     * convert a node into a { data, children } tuple, returns an ImmutableTree
     * representing the data.
     */
    static parse(rootPojo, transformer) {
        const tree = new ImmutableTree();
        const rootTransformed = transformer(rootPojo);
        tree.addRootWithData(rootTransformed.data);
        for (const childPojo of rootTransformed.children) {
            ImmutableTree.parseHelper(__classPrivateFieldGet(tree, _root), childPojo, transformer);
        }
        return tree;
    }
    ;
    static parseHelper(parent, pojo, transformer) {
        const transformed = transformer(pojo);
        parent = parent.dangerouslyMutablyInsertChildWithData(transformed.data);
        const treeNode = parent.children[parent.children.length - 1];
        for (const childPojo of transformed.children) {
            ImmutableTree.parseHelper(treeNode, childPojo, transformer);
        }
    }
    /**
     * [INTERNAL, DO NOT USE] Update the tree's root.
     */
    _changeRoot(newRoot, isInternal) {
        if (isInternal !== IS_INTERNAL) {
            throw new Error('Illegal invocation of internal method');
        }
        __classPrivateFieldSet(this, _root, newRoot);
    }
}
_root = new WeakMap();
