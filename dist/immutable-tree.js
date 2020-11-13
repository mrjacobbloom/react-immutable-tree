const IS_INTERNAL = Symbol('IS_INTERNAL');
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
        return myReplacement;
    }
    /**
     * Inserts a child to the node.
     * @param index Defaults to the end of the list.
     * @returns The new child TreeNode
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
        return newChild;
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
        return this;
    }
    /**
     * Remove the child with the given index
     * @returns The removed node
     */
    removeChildAt(index) {
        this.assertNotDead();
        const child = this.#children[index];
        const myReplacement = this.clone();
        const children = myReplacement.#children.slice();
        children.splice(index, 0);
        Object.freeze(children);
        myReplacement.#children = children;
        this.replaceSelf(myReplacement);
        // todo: recursively mark grandchildren as dead?
        return child;
    }
    /**
     * Remove one or more of the node's children based on a given filter function.
     * @returns Array of removed children
     */
    removeChildrenMatching(predicate) {
        this.assertNotDead();
        const removedChildren = []; // hey future me: this may be a deoptimization point to watch out for
        const newChildren = [];
        for (const child of this.#children) {
            if (predicate(child)) {
                newChildren.push(child);
            }
            else {
                removedChildren.push(child);
                // todo: recursively mark grandchildren as dead?
            }
        }
        const myReplacement = this.clone();
        myReplacement.#children = Object.freeze(newChildren);
        this.replaceSelf(myReplacement);
        return removedChildren;
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
    // public findOneBinary(predicate: (data: T) => 'found' | 'left' | 'right'): ImmutableTreeNode<T> | null {
    //   const where = predicate(this.#data);
    //   if (where === 'found') return this;
    //   if (where === 'left' && this.#children[0]) return this.#children[0].findOneBinary(predicate);
    //   if (where === 'right' && this.#children[1]) return this.#children[1].findOneBinary(predicate);
    //   return null;
    // }
    clone() {
        return new ImmutableTreeNode(this.#tree, this.#parent, this.#data, this.#children);
    }
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
    assertNotDead() {
        if (this.#markedDead) {
            throw new Error(`Illegal attempt to modify a node that no longer exists`);
        }
    }
}
export class ImmutableTree extends EventTarget /* will this break in Node? Who knodes */ {
    constructor() {
        super(...arguments);
        this.#root = null; // todo: this should nbe more immutable
    }
    #root; // todo: this should nbe more immutable
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
        return this.#root;
    }
    /**
     * Traverse the whole tree until a matching node is found.
     */
    findOne(predicate) {
        return this.#root ? this.#root.findOne(predicate) : null;
    }
    _changeRoot(newRoot, isInternal) {
        if (isInternal !== IS_INTERNAL) {
            throw new Error('Illegal invocation of internal method');
        }
        this.#root = newRoot;
    }
}
// todo: write some react hooks as needed
