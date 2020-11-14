const IS_INTERNAL = Symbol('IS_INTERNAL');

type ImmutableTreeEventType =
  | 'immutabletree.updatenode'
  | 'immutabletree.insertchild'
  | 'immutabletree.movenode'
  | 'immutabletree.removenode';

class ImmutableTreeEvent<T> extends Event {
  constructor(type: ImmutableTreeEventType, public targetNode: ImmutableTreeNode<T> | null) {
    super(type);
  }
}

class ImmutableTreeNode<T> {
  /**
   * When a node is removed from the tree, markedDead = true, which makes
   * its update methods throw
   */
  #markedDead: boolean = false;

  #children: ReadonlyArray<ImmutableTreeNode<T>>; // todo: change to .length and .at(index) or.child(index)
  #parent: ImmutableTreeNode<T> | null; // this will actually change mutably, whoopsie
  #data: T;
  #tree: ImmutableTree<T>;

  public get children(): ReadonlyArray<ImmutableTreeNode<T>> { return this.#children; };
  public get parent(): ImmutableTreeNode<T> | null { return this.#parent; };
  public get data(): T { return this.#data; };

  constructor(tree: ImmutableTree<T>, parent: ImmutableTreeNode<T> | null, data: T, children: ImmutableTreeNode<T>[] | ReadonlyArray<ImmutableTreeNode<T>>) {
    this.#tree = tree;
    this.#parent = parent;
    this.#data = data;
    this.#children = Object.isFrozen(children) ? children : Object.freeze(children);
  }

  /**
   * Update the data at the given node.
   * @param updater 
   * @returns The new tree node that will replace this one
   */
  public updateData(updater: (oldData: Readonly<T> | undefined) => T): ImmutableTreeNode<T> {
    this.assertNotDead();
    const newData = updater(this.#data);
    const myReplacement = this.clone();
    myReplacement.#data = newData;
    this.replaceSelf(myReplacement);
    myReplacement.dispatch('immutabletree.updatenode');
    return myReplacement;
  }

  /**
   * Set the data at the given node.
   * @param newData
   * @returns The new tree node that will replace this one
   */
  public setData(newData: T): ImmutableTreeNode<T> {
    this.assertNotDead();
    const myReplacement = this.clone();
    myReplacement.#data = newData;
    this.replaceSelf(myReplacement);
    myReplacement.dispatch('immutabletree.updatenode');
    return myReplacement;
  }

  /**
   * Inserts a child to the node.
   * @param index Defaults to the end of the list.
   * @returns The new tree node that will replace this one
   */
  public insertChildWithData(data: T, index: number = this.#children.length): ImmutableTreeNode<T> {
    this.assertNotDead();
    const newChild = new ImmutableTreeNode<T>(this.#tree, this, data, []);

    const myReplacement = this.clone();
    const children = myReplacement.#children.slice();
    children.splice(index, 0, newChild); // hey future me: this may be a deoptimization point to watch out for
    Object.freeze(children);
    myReplacement.#children = children;
    this.replaceSelf(myReplacement);
    myReplacement.dispatch('immutabletree.insertchild');
    return myReplacement;
  }

  /**
   * Same as insertChildWithData but does not replace itself. Use this to build
   * the tree before it needs to be immutable.
   */
  public dangerouslyMutablyInsertChildWithData(data: T, index: number = this.#children.length): this {
    this.assertNotDead();
    const newChild = new ImmutableTreeNode<T>(this.#tree, this, data, []);

    const children = this.#children.slice();
    children.splice(index, 0, newChild); // hey future me: this may be a deoptimization point to watch out for
    Object.freeze(children);
    this.#children = children;
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
  public moveTo(newParent: ImmutableTreeNode<T>, index: number = newParent.#children.length): this {
    this.assertNotDead();

    // Note: the below assertions are there to leave the design space open.
    // Just because I can't think of a useful meaning for these operations right now doesn't mean there isn't one

    // Assert this node is not root
    if (!this.#parent) {
      throw new Error('Attempted to move a TreeNode out of root position');
    }

    // Assert newParent is not this node or a descendant of this node
    let current: ImmutableTreeNode<T> | null = newParent;
    while(current) {
      if (current === this) throw new Error('Attempted to move a TreeNode into itself or a descendant');
      current = current.#parent;
    }


    const oldParent = this.#parent;
    const oldParentReplacement = oldParent.clone();
    oldParentReplacement.#children = Object.freeze(oldParentReplacement.#children.filter(child => child !== this));
    oldParent.replaceSelf(oldParentReplacement);
    // todo: figure out how to stop replaceSelf from running redundantly after it reaches oldParent and newParent's common ancestor
    const newParentReplacement = newParent.clone();
    const newParentChildren = newParentReplacement.#children.slice();
    newParentChildren.splice(index, 0, this); // hey future me: this may be a deoptimization point to watch out for
    Object.freeze(newParentChildren);
    newParentReplacement.#children = newParentChildren;
    newParent.replaceSelf(newParentReplacement);
    this.dispatch('immutabletree.movenode');
    return this;
  }

  /**
   * Remove this node.
   * @returns The removed node
   */
  public remove(): this {
    this.assertNotDead();
    if (this.#parent) {
      const parentReplacement = this.#parent.clone();
      parentReplacement.#children = Object.freeze(parentReplacement.#children.filter(child => child !== this));
      this.#parent.replaceSelf(parentReplacement);
    } else {
      this.#tree._changeRoot(null, IS_INTERNAL);
    }
    this.#markedDead = true;
    // todo: recursively mark children as dead?
    this.dispatch('immutabletree.removenode');
    return this;
  }

  /**
   * Traverse the whole sub-tree until a matching node is found.
   */
  public findOne(predicate: (data: T) => boolean): ImmutableTreeNode<T> | null {
    if (predicate(this.#data)) return this;
    for(const child of this.#children) {
      const found = child.findOne(predicate);
      if (found) return found;
    }
    return null;
  }

  /**
   * Prints the subtree starting at this node. Prints [DEAD] by each node that no
   * longer exists in the tree.
   */
  public print(depth = 0): void {
    const indent = '  '.repeat(depth);
    console.log(indent + JSON.stringify(this.#data) + (this.#markedDead ? ' [DEAD]' : ''));
    this.#children.forEach(child => child.print(depth + 1));
  };

  /**
   * Create a clone of this node to replace itself with, so that object reference changes on update
   */
  private clone(): ImmutableTreeNode<T> {
    return new ImmutableTreeNode<T>(this.#tree, this.#parent, this.#data, this.#children);
  }

  /**
   * Connect parent and children to an updated version of this node
   */
  private replaceSelf(myReplacement: ImmutableTreeNode<T>): void {
    for(const child of this.#children) {
      child.#parent = myReplacement;
    }
    if (this.#parent) {
      const parentReplacement = this.#parent.clone();
      parentReplacement.#children = Object.freeze(parentReplacement.#children.map(child => child === this ? myReplacement : child));
      this.#parent.replaceSelf(parentReplacement);
    } else {
      this.#tree._changeRoot(myReplacement, IS_INTERNAL);
    }
    this.#markedDead = true;
  }

  /**
   * Throws if this node is marked dead. Used to ensure that no changes are made to old node objects.
   */
  private assertNotDead(): void {
    if(this.#markedDead) {
      throw new Error('Illegal attempt to modify an old version of a node, or a node that no longer exists');
    }
  }

  /**
   * Dispatch an event on the tree
   */
  private dispatch(type: ImmutableTreeEventType) {
    this.#tree.dispatchEvent(new ImmutableTreeEvent(type, this));
  }
}

export class ImmutableTree<T> extends EventTarget /* will this break in Node? Who knodes */ {
  #root: ImmutableTreeNode<T> | null = null;

  /**
   * The root node of the tree
   */
  public get root(): ImmutableTreeNode<T> | null { return this.#root; };

  /**
   * Create a root node with the given data object. 
   * @returns The new root.
   */
  public addRootWithData(data: T): ImmutableTreeNode<T> {
    if (this.#root) {
      throw new Error('Attempted to add a root to an ImmutableTree that already has a root node. Try removing it.');
    }
    this.#root = new ImmutableTreeNode<T>(this, null, data, []);
    this.dispatchEvent(new ImmutableTreeEvent<T>('immutabletree.insertchild', null));
    return this.#root;
  }

  /**
   * Traverse the whole tree until a matching node is found.
   */
  public findOne(predicate: (data: T) => boolean): ImmutableTreeNode<T> | null {
    return this.#root ? this.#root.findOne(predicate) : null;
  }

  /**
   * Prints the tree. Prints [DEAD] by each node that no longer exists in the
   * tree.
   */
  public print(): void {
    this.#root?.print(0);
  }

  /**
   * Given a JS object representing your root node, and a function that can
   * convert a node into a { data, children } tuple, returns an ImmutableTree
   * representing the data.
   */
  public static parse<POJO, T>(rootPojo: POJO, transformer: (pojo: POJO) => { data: T, children: POJO[]}): ImmutableTree<T> {
    const tree = new ImmutableTree<T>();
    const rootTransformed = transformer(rootPojo);
    tree.addRootWithData(rootTransformed.data);
    for(const childPojo of rootTransformed.children) {
      ImmutableTree.parseHelper(tree.#root!, childPojo, transformer);
    }
    return tree;
  };

  private static parseHelper<POJO, T>(parent: ImmutableTreeNode<T>, pojo: POJO, transformer: (pojo: POJO) => { data: T, children: POJO[]}): void {
    const transformed = transformer(pojo);
    parent = parent.dangerouslyMutablyInsertChildWithData(transformed.data);
    const treeNode = parent.children[parent.children.length - 1];
    for(const childPojo of transformed.children) {
      ImmutableTree.parseHelper(treeNode, childPojo, transformer);
    }
  }

  /**
   * [INTERNAL, DO NOT USE] Update the tree's root.
   */
  public _changeRoot(newRoot: ImmutableTreeNode<T> | null, isInternal: typeof IS_INTERNAL): void {
    if(isInternal !== IS_INTERNAL) {
      throw new Error('Illegal invocation of internal method');
    }
    this.#root = newRoot;
  }
}
