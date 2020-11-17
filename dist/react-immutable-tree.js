/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

var _tree, _isStale, _children, _parent, _data, _root;
/**
 * Shibboleth to ensure that certain actions, like constructing an
 * ImmutableTreeNode, are only done from trusted code.
 * @hidden
 */
const IS_INTERNAL = Symbol('IS_INTERNAL');
/**
 * The `Event` subtype that `ImmutableTree` dispatches
 * @typeParam DataType The type of the data object associated with a given node.
 * @hidden
 */
class ImmutableTreeEvent extends Event {
    constructor(type, targetNode, rootNode) {
        super(type);
        this.targetNode = targetNode;
        this.rootNode = rootNode;
    }
}
/**
 * The default serializer function.
 * @hidden
 */
const defaultSerializer = (data, children) => ({ data, children });
/**
 * The default deserializer function.
 * @hidden
 */
const defaultDeserializer = (pojo) => pojo;
/**
 * An `ImmutableTreeNode` represents a node in the tree. They cannot be
 * constructed directly.
 *
 * Each of the methods that modify the node return the next version of the
 * modified node (or itself, if the operation does not modify the node).
 *
 * Changes to the tree will result in the old version of a node being marked
 * "stale." When a node is stale, attempts to modify it or read its data (except
 * {@link .isStale}) will throw an error.
 * @typeParam DataType The type of the data object associated with a given node.
 */
class ImmutableTreeNode {
    /**
     * [INTERNAL, DO NOT USE] Construct a new `ImmutableTreeNode`.
     * @hidden
     */
    constructor(isInternal, tree, parent, data, children) {
        // @todo: should there be a way to get treeNode.newestVersion or something? Or would that cause all manner of memory leaks? Hm...
        // (if I do add that, update the error message in assertNotDead to be more helpful)
        /**
         * The `ImmutableTree` that this node is a part of.
         * @hidden
         */
        _tree.set(this, void 0);
        /** @hidden */ _isStale.set(this, false);
        /** @hidden */ _children.set(this, void 0);
        /** @hidden */ _parent.set(this, void 0);
        /** @hidden */ _data.set(this, void 0);
        if (isInternal !== IS_INTERNAL) {
            throw new Error('Illegal construction of ImmutableTreeNode');
        }
        __classPrivateFieldSet(this, _tree, tree);
        __classPrivateFieldSet(this, _parent, parent);
        __classPrivateFieldSet(this, _data, data);
        __classPrivateFieldSet(this, _children, Object.isFrozen(children) ? children : Object.freeze(children));
    }
    /**
     * A node is stale if it has been removed from the tree or is an old version of the node.
     */
    get isStale() { return __classPrivateFieldGet(this, _isStale); }
    /**
     * A frozen array of child nodes. Accessing this will throw an error if the node is stale.
     */
    get children() { this.assertNotStale(); return __classPrivateFieldGet(this, _children); }
    ;
    /**
     * The parent node, or null for the root. Accessing this will throw an error if the node is stale.
     */
    get parent() { this.assertNotStale(); return __classPrivateFieldGet(this, _parent); }
    ;
    /**
     * The data associated with the node. Accessing this will throw an error if the node is stale.
     */
    get data() { this.assertNotStale(); return __classPrivateFieldGet(this, _data); }
    ;
    /**
     * Update the data at the given node. This method will throw an error if the
     * node is stale.
     * @param updater A function that, given the old data, can produce the next
     * version of the data object to associate with this node.
     * @returns The new tree node that will replace this one
     * @example
     * You can use `updateData` to only change one property on the data object:
     *
     * ```javascript
     * myNode.updateData(oldData => ({ ...oldData, myProp: 'new value' }))
     * ```
     */
    updateData(updater) {
        this.assertNotStale();
        const newData = updater(__classPrivateFieldGet(this, _data));
        const myReplacement = this.clone();
        __classPrivateFieldSet(myReplacement, _data, newData);
        this.replaceSelf(myReplacement);
        myReplacement.dispatch('immutabletree.updatenode');
        return myReplacement;
    }
    /**
     * Set the data at the given node. This method will throw an error if the node
     * is stale.
     * @param newData The new data object to associate with the node.
     * @returns The new tree node that will replace this one
     */
    setData(newData) {
        this.assertNotStale();
        const myReplacement = this.clone();
        __classPrivateFieldSet(myReplacement, _data, newData);
        this.replaceSelf(myReplacement);
        myReplacement.dispatch('immutabletree.updatenode');
        return myReplacement;
    }
    /**
     * Inserts a child to the node. This method will throw an error if the node is
     * stale.
     * @param data The data associated with the new child.
     * @param index Defaults to the end of the list.
     * @returns The new tree node that will replace this one (NOT the new child).
     */
    insertChildWithData(data, index = __classPrivateFieldGet(this, _children).length) {
        this.assertNotStale();
        const newChild = new ImmutableTreeNode(IS_INTERNAL, __classPrivateFieldGet(this, _tree), this, data, []);
        if (__classPrivateFieldGet(this, _tree).nodeWillUpdate) {
            __classPrivateFieldSet(newChild, _data, __classPrivateFieldGet(this, _tree).nodeWillUpdate(data, __classPrivateFieldGet(newChild, _children), null));
        }
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
     * Same as insertChildWithData but does not replace itself or fire any events.
     * Use this to build the tree before it needs to be immutable. This method
     * will throw an error if the node is stale.
     * @param data The data associated with the new child.
     * @param index Defaults to the end of the list.
     * @returns This node
     */
    dangerouslyMutablyInsertChildWithData(data, index = __classPrivateFieldGet(this, _children).length) {
        this.assertNotStale();
        const newChild = new ImmutableTreeNode(IS_INTERNAL, __classPrivateFieldGet(this, _tree), this, data, []);
        if (__classPrivateFieldGet(this, _tree).nodeWillUpdate) {
            __classPrivateFieldSet(newChild, _data, __classPrivateFieldGet(this, _tree).nodeWillUpdate(data, __classPrivateFieldGet(newChild, _children), null));
        }
        const children = __classPrivateFieldGet(this, _children).slice();
        children.splice(index, 0, newChild); // hey future me: this may be a deoptimization point to watch out for
        Object.freeze(children);
        __classPrivateFieldSet(this, _children, children);
        return this;
    }
    /**
     * Move this node to the given position. This method will throw an error if
     * the node is stale.
     * @param newParent Parent node to add to
     * @param index Defaults to the end of the list.
     * @returns Itself, since this operation does not technically modify this node
     */
    moveTo(newParent, index = __classPrivateFieldGet(newParent, _children).length) {
        this.assertNotStale();
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
     * Remove this node from the tree. This method will throw an error if the node
     * is stale.
     * @returns The removed node
     */
    remove() {
        this.assertNotStale();
        if (__classPrivateFieldGet(this, _parent)) {
            const parentReplacement = __classPrivateFieldGet(this, _parent).clone();
            __classPrivateFieldSet(parentReplacement, _children, Object.freeze(__classPrivateFieldGet(parentReplacement, _children).filter(child => child !== this)));
            __classPrivateFieldGet(this, _parent).replaceSelf(parentReplacement);
        }
        else {
            __classPrivateFieldGet(this, _tree)._changeRoot(null, IS_INTERNAL);
        }
        __classPrivateFieldSet(this, _isStale, true);
        // todo: recursively mark children as stale?
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
    serialize(serializer = defaultSerializer) {
        const serializedChildren = __classPrivateFieldGet(this, _children).map(child => child.serialize(serializer));
        return serializer(__classPrivateFieldGet(this, _data), serializedChildren);
    }
    print(depth = 0) {
        const indent = '  '.repeat(depth);
        console.log(indent + JSON.stringify(__classPrivateFieldGet(this, _data)) + (__classPrivateFieldGet(this, _isStale) ? ' [STALE]' : ''));
        __classPrivateFieldGet(this, _children).forEach(child => child.print(depth + 1));
    }
    ;
    /**
     * Create a clone of this node to replace itself with, so that object reference changes on update
     * @hidden
     */
    clone() {
        return new ImmutableTreeNode(IS_INTERNAL, __classPrivateFieldGet(this, _tree), __classPrivateFieldGet(this, _parent), __classPrivateFieldGet(this, _data), __classPrivateFieldGet(this, _children));
    }
    /**
     * Connect parent and children to an updated version of this node
     * @hidden
     */
    replaceSelf(myReplacement) {
        if (__classPrivateFieldGet(this, _tree).nodeWillUpdate) {
            __classPrivateFieldSet(myReplacement, _data, __classPrivateFieldGet(this, _tree).nodeWillUpdate(__classPrivateFieldGet(myReplacement, _data), __classPrivateFieldGet(myReplacement, _children), __classPrivateFieldGet(this, _children)));
        }
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
        __classPrivateFieldSet(this, _isStale, true);
    }
    /**
     * Throws if this node is marked stale. Used to ensure that no changes are made to old node objects.
     * @hidden
     */
    assertNotStale() {
        if (__classPrivateFieldGet(this, _isStale)) {
            throw new Error('Illegal attempt to modify a stale version of a node, or a node that no longer exists');
        }
    }
    /**
     * Dispatch an event on the tree
     * @hidden
     */
    dispatch(type) {
        __classPrivateFieldGet(this, _tree).dispatchEvent(new ImmutableTreeEvent(type, this, __classPrivateFieldGet(this, _tree).root));
        __classPrivateFieldGet(this, _tree).dispatchEvent(new ImmutableTreeEvent('immutabletree.changed', null, __classPrivateFieldGet(this, _tree).root));
    }
}
_tree = new WeakMap(), _isStale = new WeakMap(), _children = new WeakMap(), _parent = new WeakMap(), _data = new WeakMap();
/**
 * An `ImmutableTree` is a tree structure that can have any number of ordered
 * children. (Note: it's not a good fit for binary tree data where right/left
 * child relationships matter, because deleting the first child in a node shifts
 * the second child to the first position.)
 *
 * When a node changes, its ancestors are all replaced, but its siblings and
 * children are not (the siblings and children's .parent properties change, but
 * it's the same object).
 *
 * `ImmutableTree`s are not initialized with a root node. Use {@link .addRootWithData}
 * to create the root.
 *
 * It is a subclass of `EventTarget`. Emmitted events may include:
 *
 * - `immutabletree.changed` - dispatched for all changes
 * - `immutabletree.updatenode`
 * - `immutabletree.insertchild` (note: `targetNode` is the parent)
 * - `immutabletree.movenode`
 * - `immutabletree.removenode`
 *
 * Each event has a `.targetNode` property containing the affected node and a
 * `.rootNode` property containing the new root.
 * @typeParam DataType The type of the data object associated with a given node.
 */
class ImmutableTree extends EventTarget /* will this break in Node? Who knodes */ {
    constructor() {
        super(...arguments);
        /**
         * A function called on a node when it will update, including the node's
         * initial creation or a parent updating due to a child's update. The returned
         * value will be used as the updated data value for this node. This will not
         * trigger any additional events.
         */
        this.nodeWillUpdate = null;
        /** @hidden */ _root.set(this, null);
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
        __classPrivateFieldSet(this, _root, new ImmutableTreeNode(IS_INTERNAL, this, null, data, []));
        this.dispatchEvent(new ImmutableTreeEvent('immutabletree.insertchild', null, __classPrivateFieldGet(this, _root)));
        this.dispatchEvent(new ImmutableTreeEvent('immutabletree.changed', null, __classPrivateFieldGet(this, _root)));
        return __classPrivateFieldGet(this, _root);
    }
    /**
     * Traverse the whole tree until a matching node is found.
     */
    findOne(predicate) {
        return __classPrivateFieldGet(this, _root) ? __classPrivateFieldGet(this, _root).findOne(predicate) : null;
    }
    /**
     * Prints the tree.
     */
    print() {
        var _a;
        (_a = __classPrivateFieldGet(this, _root)) === null || _a === void 0 ? void 0 : _a.print(0);
    }
    serialize(serializer = defaultSerializer) {
        var _a, _b;
        return (_b = (_a = __classPrivateFieldGet(this, _root)) === null || _a === void 0 ? void 0 : _a.serialize(serializer)) !== null && _b !== void 0 ? _b : null;
    }
    static deserialize(rootSerialized, deserializer = defaultDeserializer) {
        const tree = new ImmutableTree();
        const rootTransformed = deserializer(rootSerialized);
        tree.addRootWithData(rootTransformed.data);
        for (const childPojo of rootTransformed.children) {
            ImmutableTree.deserializeHelper(__classPrivateFieldGet(tree, _root), childPojo, deserializer);
        }
        return tree;
    }
    ;
    static deserializeHelper(parent, pojo, deserializer) {
        const transformed = deserializer(pojo);
        parent = parent.dangerouslyMutablyInsertChildWithData(transformed.data);
        const treeNode = parent.children[parent.children.length - 1];
        for (const childPojo of transformed.children) {
            ImmutableTree.deserializeHelper(treeNode, childPojo, deserializer);
        }
    }
    /**
     * [INTERNAL, DO NOT USE] Update the tree's root.
     * @hidden
     */
    _changeRoot(newRoot, isInternal) {
        if (isInternal !== IS_INTERNAL) {
            throw new Error('Illegal invocation of internal method');
        }
        __classPrivateFieldSet(this, _root, newRoot);
    }
}
_root = new WeakMap();

export { ImmutableTree, ImmutableTreeEvent, ImmutableTreeNode };
