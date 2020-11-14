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
        this.#markedDead = false;
        this.#tree = tree;
        this.#parent = parent;
        this.#data = data;
        this.#children = Object.isFrozen(children) ? children : Object.freeze(children);
    }
    /**
     * When a node is removed from the tree, markedDead = true, which makes
     * its update methods throw
     */
    #markedDead;
    #children; // todo: change to .length and .at(index) or.child(index)
    #parent; // this will actually change mutably, whoopsie
    #data;
    #tree;
    get children() { return this.#children; }
    ;
    get parent() { return this.#parent; }
    ;
    get data() { return this.#data; }
    ;
    /**
     * Update the data at the given node.
     * @param updater
     * @returns The new tree node that will replace this one
     */
    updateData(updater) {
        this.assertNotDead();
        const newData = updater(this.#data);
        const myReplacement = this.clone();
        myReplacement.#data = newData;
        this.replaceSelf(myReplacement);
        this.dispatch('immutabletree.updatenode');
        return myReplacement;
    }
    /**
     * Inserts a child to the node.
     * @param index Defaults to the end of the list.
     * @returns The new tree node that will replace this one
     */
    insertChildWithData(data, index = this.#children.length) {
        this.assertNotDead();
        const newChild = new ImmutableTreeNode(this.#tree, this, data, []);
        const myReplacement = this.clone();
        const children = myReplacement.#children.slice();
        children.splice(index, 0, newChild); // hey future me: this may be a deoptimization point to watch out for
        Object.freeze(children);
        myReplacement.#children = children;
        this.replaceSelf(myReplacement);
        newChild.dispatch('immutabletree.createnode');
        return myReplacement;
    }
    /**
     * Same as insertChildWithData but does not replace itself. Use this to build
     * the tree before it needs to be immutable.
     */
    dangerouslyMutablyInsertChildWithData(data, index = this.#children.length) {
        this.assertNotDead();
        const newChild = new ImmutableTreeNode(this.#tree, this, data, []);
        const children = this.#children.slice();
        children.splice(index, 0, newChild); // hey future me: this may be a deoptimization point to watch out for
        Object.freeze(children);
        this.#children = children;
        // newChild.dispatch('immutabletree.createnode');
        return this;
    }
    // todo: a way to move nodes around in the tree?
    // todo: a way to delete without losing grandchildren?
    /**
     * Remove this node.
     * @returns The removed node
     */
    remove() {
        if (this.#parent) {
            const parentReplacement = this.#parent.clone();
            parentReplacement.#children = Object.freeze(parentReplacement.#children.filter(child => child !== this));
            this.#parent.replaceSelf(parentReplacement);
        }
        else {
            this.#tree._changeRoot(null, IS_INTERNAL);
        }
        this.#markedDead = true;
        // todo: recursively mark children as dead?
        this.dispatch('immutabletree.deletenode');
        return this;
    }
    /**
     * Traverse the whole sub-tree until a matching node is found.
     */
    findOne(predicate) {
        for (const child of this.#children) {
            const found = child.findOne(predicate);
            if (found)
                return found;
        }
        return null;
    }
    /**
     * Create a clone of this node to replace itself with, so that object reference changes on update
     */
    clone() {
        return new ImmutableTreeNode(this.#tree, this.#parent, this.#data, this.#children);
    }
    /**
     * Connect parent and children to an updated version of this node
     */
    replaceSelf(myReplacement) {
        for (const child of this.#children) {
            child.#parent = myReplacement;
        }
        if (this.#parent) {
            const parentReplacement = this.#parent.clone();
            parentReplacement.#children = Object.freeze(parentReplacement.#children.map(child => child === this ? myReplacement : child));
            this.#parent.replaceSelf(parentReplacement);
        }
        else {
            this.#tree._changeRoot(myReplacement, IS_INTERNAL);
        }
        this.#markedDead = true;
    }
    /**
     * Throws if this node is marked dead. Used to ensure that no changes are made to old node objects.
     */
    assertNotDead() {
        if (this.#markedDead) {
            throw new Error(`Illegal attempt to modify a node that no longer exists`);
        }
    }
    /**
     * Dispatch an event on the tree
     */
    dispatch(type) {
        this.#tree.dispatchEvent(new ImmutableTreeEvent(type, this));
    }
}
export class ImmutableTree extends EventTarget /* will this break in Node? Who knodes */ {
    constructor() {
        super(...arguments);
        this.#root = null;
    }
    #root;
    /**
     * The root node of the tree
     */
    get root() { return this.#root; }
    ;
    /**
     * Create a root node with the given data object.
     * @returns The new root.
     */
    addRootWithData(data) {
        if (this.#root) {
            throw new Error('Attempted to add a root to an ImmutableTree that already has a root node. Try removing it.');
        }
        this.#root = new ImmutableTreeNode(this, null, data, []);
        this.dispatchEvent(new ImmutableTreeEvent('immutabletree.createnode', this.#root));
        return this.#root;
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
            ImmutableTree.parseHelper(tree.#root, childPojo, transformer);
        }
        return tree;
    }
    ;
    static parseHelper(parent, pojo, transformer) {
        const transformed = transformer(pojo);
        const treeNode = parent.dangerouslyMutablyInsertChildWithData(transformed.data);
        for (const childPojo of transformed.children) {
            ImmutableTree.parseHelper(treeNode, childPojo, transformer);
        }
    }
    /**
     * Traverse the whole tree until a matching node is found.
     */
    findOne(predicate) {
        return this.#root ? this.#root.findOne(predicate) : null;
    }
    /**
     * [INTERNAL, DO NOT USE] Update the tree's root.
     */
    _changeRoot(newRoot, isInternal) {
        if (isInternal !== IS_INTERNAL) {
            throw new Error('Illegal invocation of internal method');
        }
        this.#root = newRoot;
    }
}
