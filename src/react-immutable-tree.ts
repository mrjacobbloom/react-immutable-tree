const IS_INTERNAL = Symbol('IS_INTERNAL');

type ImmutableTreeEventType =
  | 'immutabletree.updatenode'
  | 'immutabletree.insertchild'
  | 'immutabletree.movenode'
  | 'immutabletree.removenode';

export class ImmutableTreeEvent<T> extends Event {
  constructor(type: ImmutableTreeEventType, public targetNode: ImmutableTreeNode<T> | null, public rootNode: ImmutableTreeNode<T> | null) {
    super(type);
  }
}

export type BeforeUpdateModifier<DataType> = (oldData: Readonly<DataType> | null, newChildren: ReadonlyArray<ImmutableTreeNode<DataType>>, oldChildren: ReadonlyArray<ImmutableTreeNode<DataType>> | null) => DataType;

export type Deserializer<SerializedType, DataType> = (pojo: SerializedType) => { data: DataType, children: SerializedType[]};
export type Serializer<SerializedType, DataType> = (data: DataType, children: SerializedType[]) => SerializedType;

export interface DefaultSerializedTreeNode<DataType> {
  data: DataType;
  children: DefaultSerializedTreeNode<DataType>[]
}

const defaultSerializer = <DataType>(data: Readonly<DataType>, children: DefaultSerializedTreeNode<DataType>[]) => ({ data, children });
const defaultDeserializer = <DataType>(pojo: DefaultSerializedTreeNode<DataType>) => pojo;

export class ImmutableTreeNode<DataType> {
  /**
   * When a node is removed from the tree, markedDead = true, which makes
   * its update methods throw
   */
  #isStale: boolean = false;
  // @todo: should there be a way to get treeNode.newestVersion or something? Or would that cause all manner of memory leaks? Hm...
  // (if I do add that, update the error message in assertNotDead to be more helpful)

  #children: ReadonlyArray<ImmutableTreeNode<DataType>>;
  #parent: ImmutableTreeNode<DataType> | null;
  #data: DataType;
  #tree: ImmutableTree<DataType>;

  /**
   * A node is stale if it has been removed from the tree or is an old version of the node.
   */
  public get isStale(): boolean { return this.#isStale; }

  /**
   * A frozen array of child nodes. Accessing this will throw an error for stale nodes.
   */
  public get children(): ReadonlyArray<ImmutableTreeNode<DataType>> { this.assertNotStale(); return this.#children; };

  /**
   * The parent node, or null for the root. Accessing this will throw an error for stale nodes.
   */
  public get parent(): ImmutableTreeNode<DataType> | null { this.assertNotStale(); return this.#parent; };

  /**
   * The data associated with the node. Accessing this will throw an error for stale nodes.
   */
  public get data(): Readonly<DataType> { this.assertNotStale(); return this.#data; };

  constructor(isInternal: typeof IS_INTERNAL, tree: ImmutableTree<DataType>, parent: ImmutableTreeNode<DataType> | null, data: DataType, children: ImmutableTreeNode<DataType>[] | ReadonlyArray<ImmutableTreeNode<DataType>>) {
    if(isInternal !== IS_INTERNAL) {
      throw new Error('Illegal construction of ImmutableTreeNode');
    }
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
  public updateData(updater: (oldData: Readonly<DataType> | undefined) => DataType): ImmutableTreeNode<DataType> {
    this.assertNotStale();
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
  public setData(newData: DataType): ImmutableTreeNode<DataType> {
    this.assertNotStale();
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
  public insertChildWithData(data: DataType, index: number = this.#children.length): ImmutableTreeNode<DataType> {
    this.assertNotStale();
    const newChild = new ImmutableTreeNode<DataType>(IS_INTERNAL, this.#tree, this, data, []);

    if (this.#tree.nodeWillUpdate) {
      newChild.#data = this.#tree.nodeWillUpdate(data, newChild.#children, null);
    }

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
  public dangerouslyMutablyInsertChildWithData(data: DataType, index: number = this.#children.length): this {
    this.assertNotStale();
    const newChild = new ImmutableTreeNode<DataType>(IS_INTERNAL, this.#tree, this, data, []);

    if (this.#tree.nodeWillUpdate) {
      newChild.#data = this.#tree.nodeWillUpdate(data, newChild.#children, null);
    }

    const children = this.#children.slice();
    children.splice(index, 0, newChild); // hey future me: this may be a deoptimization point to watch out for
    Object.freeze(children);
    this.#children = children;
    // newChild.dispatch('immutabletree.createnode');
    return this;
  }

  /**
   * Move this node to the given position.
   * @param newParent Parent node to add to
   * @param index Defaults to the end of the list.
   * @returns Itself, since this operation does not technically modify this node
   */
  public moveTo(newParent: ImmutableTreeNode<DataType>, index: number = newParent.#children.length): this {
    this.assertNotStale();

    // Note: the below assertions are there to leave the design space open.
    // Just because I can't think of a useful meaning for these operations right now doesn't mean there isn't one

    // Assert this node is not root
    if (!this.#parent) {
      throw new Error('Attempted to move a TreeNode out of root position');
    }

    // Assert newParent is not this node or a descendant of this node
    let current: ImmutableTreeNode<DataType> | null = newParent;
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
    this.assertNotStale();
    if (this.#parent) {
      const parentReplacement = this.#parent.clone();
      parentReplacement.#children = Object.freeze(parentReplacement.#children.filter(child => child !== this));
      this.#parent.replaceSelf(parentReplacement);
    } else {
      this.#tree._changeRoot(null, IS_INTERNAL);
    }
    this.#isStale = true;
    // todo: recursively mark children as stale?
    this.dispatch('immutabletree.removenode');
    return this;
  }

  /**
   * Traverse the whole sub-tree until a matching node is found.
   */
  public findOne(predicate: (data: DataType) => boolean): ImmutableTreeNode<DataType> | null {
    if (predicate(this.#data)) return this;
    for(const child of this.#children) {
      const found = child.findOne(predicate);
      if (found) return found;
    }
    return null;
  }

  /**
   * Transform the sub-tree into the default serailized format.
   */
  public serialize(): DefaultSerializedTreeNode<DataType>;
  /**
   * Transform the sub-tree into a serialized format.
   * @param transformer A function that can convert any node's data object
   * and an array of its already-serialized children into a sirealized form.
   */
  public serialize<SerializedType>(serializer: Serializer<SerializedType, DataType>): SerializedType;
  public serialize<SerializedType>(serializer = defaultSerializer as unknown as Serializer<SerializedType, DataType>): SerializedType {
    const serializedChildren = this.#children.map(child => child.serialize(serializer));
    return serializer(this.#data, serializedChildren);
  }

  /**
   * Prints the subtree starting at this node. Prints [STALE] by each stale node.
   */
  public print(depth = 0): void {
    const indent = '  '.repeat(depth);
    console.log(indent + JSON.stringify(this.#data) + (this.#isStale ? ' [STALE]' : ''));
    this.#children.forEach(child => child.print(depth + 1));
  };

  /**
   * Create a clone of this node to replace itself with, so that object reference changes on update
   */
  private clone(): ImmutableTreeNode<DataType> {
    return new ImmutableTreeNode<DataType>(IS_INTERNAL, this.#tree, this.#parent, this.#data, this.#children);
  }

  /**
   * Connect parent and children to an updated version of this node
   */
  private replaceSelf(myReplacement: ImmutableTreeNode<DataType>): void {

    if (this.#tree.nodeWillUpdate) {
      myReplacement.#data = this.#tree.nodeWillUpdate(myReplacement.#data, myReplacement.#children, this.#children);
    }
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
    this.#isStale = true;
  }

  /**
   * Throws if this node is marked stale. Used to ensure that no changes are made to old node objects.
   */
  private assertNotStale(): void {
    if(this.#isStale) {
      throw new Error('Illegal attempt to modify a stale version of a node, or a node that no longer exists');
    }
  }

  /**
   * Dispatch an event on the tree
   */
  private dispatch(type: ImmutableTreeEventType) {
    this.#tree.dispatchEvent(new ImmutableTreeEvent(type, this, this.#tree.root));
  }

  // private static findCommonAncestor<T>(node1: ImmutableTreeNode<T>, node2: ImmutableTreeNode<T>): ImmutableTreeNode<T> {
  //   const node1Ancestors = new Set<ImmutableTreeNode<T>>();
  //   let current1: ImmutableTreeNode<T> | null = node1;
  //   while(current1) {
  //     node1Ancestors.add(current1); // hey future me: this may be a deoptimization point to watch out for
  //     current1 = current1.#parent;
  //   }

  //   let current2: ImmutableTreeNode<T> | null = node2;
  //   while(current2) {
  //     if (node1Ancestors.has(current2)) return current2;
  //     current2 = current2.#parent;
  //   }

  //   return undefined as never;
  // }
}

export class ImmutableTree<DataType> extends EventTarget /* will this break in Node? Who knodes */ {
  #root: ImmutableTreeNode<DataType> | null = null;

  /**
   * A function called on a node when it will update, including the node's
   * initial creation or a parent updating due to a child's update. The returned
   * value will be used as the updated data value for this node. This will not
   * trigger any additional events.
   */
  public nodeWillUpdate: null | BeforeUpdateModifier<DataType> = null;

  /**
   * The root node of the tree
   */
  public get root(): ImmutableTreeNode<DataType> | null { return this.#root; };

  /**
   * Create a root node with the given data object. 
   * @returns The new root.
   */
  public addRootWithData(data: DataType): ImmutableTreeNode<DataType> {
    if (this.#root) {
      throw new Error('Attempted to add a root to an ImmutableTree that already has a root node. Try removing it.');
    }
    this.#root = new ImmutableTreeNode<DataType>(IS_INTERNAL, this, null, data, []);
    this.dispatchEvent(new ImmutableTreeEvent<DataType>('immutabletree.insertchild', null, this.#root));
    return this.#root;
  }

  /**
   * Traverse the whole tree until a matching node is found.
   */
  public findOne(predicate: (data: DataType) => boolean): ImmutableTreeNode<DataType> | null {
    return this.#root ? this.#root.findOne(predicate) : null;
  }

  /**
   * Prints the tree.
   */
  public print(): void {
    this.#root?.print(0);
  }

  /**
   * Transform the sub-tree into the default serailized format.
   */
  public serialize(): DefaultSerializedTreeNode<DataType>;
  /**
   * Transform the sub-tree into a serialized format.
   * @param transformer A function that can convert any node's data object
   * and an array of its already-serialized children into a sirealized form.
   */
  public serialize<SerializedType>(serializer: Serializer<SerializedType, DataType>): SerializedType;
  public serialize<SerializedType>(serializer = defaultSerializer as unknown as Serializer<SerializedType, DataType>): SerializedType | null {
    return this.#root?.serialize(serializer) ?? null;
  }

  /**
   * Given a JS object representing your root node in the default serialized
   * format, returns an ImmutableTree representing the data.
   */
  public static deserialize<DataType>(rootPojo: DefaultSerializedTreeNode<DataType>): ImmutableTree<DataType>;
  /**
   * Given a JS object representing your root node, and a function that can
   * convert a node into a { data, children } tuple, returns an ImmutableTree
   * representing the data.
   */
  public static deserialize<SerializedType, DataType>(rootPojo: SerializedType, deserializer: Deserializer<SerializedType, DataType>): ImmutableTree<DataType>;
  public static deserialize<SerializedType, DataType extends unknown>(rootPojo: SerializedType, deserializer = defaultDeserializer as unknown as Deserializer<SerializedType, DataType>): ImmutableTree<DataType> {
    const tree = new ImmutableTree<DataType>();
    const rootTransformed = deserializer(rootPojo);
    tree.addRootWithData(rootTransformed.data);
    for(const childPojo of rootTransformed.children) {
      ImmutableTree.deserializeHelper(tree.#root!, childPojo, deserializer);
    }
    return tree;
  };

  private static deserializeHelper<SerializedType, DataType>(parent: ImmutableTreeNode<DataType>, pojo: SerializedType, deserializer: Deserializer<SerializedType, DataType>): void {
    const transformed = deserializer(pojo);
    parent = parent.dangerouslyMutablyInsertChildWithData(transformed.data);
    const treeNode = parent.children[parent.children.length - 1];
    for(const childPojo of transformed.children) {
      ImmutableTree.deserializeHelper(treeNode, childPojo, deserializer);
    }
  }

  /**
   * [INTERNAL, DO NOT USE] Update the tree's root.
   */
  public _changeRoot(newRoot: ImmutableTreeNode<DataType> | null, isInternal: typeof IS_INTERNAL): void {
    if(isInternal !== IS_INTERNAL) {
      throw new Error('Illegal invocation of internal method');
    }
    this.#root = newRoot;
  }
}
