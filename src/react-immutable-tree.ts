/**
 * Shibboleth to ensure that certain actions, like constructing an
 * ImmutableTreeNode, are only done from trusted code.
 * @hidden
 */
const IS_INTERNAL = Symbol('IS_INTERNAL');

/**
 * The event types that `ImmutableTree` dispatches
 */
type ImmutableTreeEventType =
  | 'immutabletree.changed'
  | 'immutabletree.updatenode'
  | 'immutabletree.insertchild'
  | 'immutabletree.movenode'
  | 'immutabletree.removenode';

/**
 * The `Event` subtype that `ImmutableTree` dispatches
 * @typeParam DataType The type of the data object associated with a given node.
 * @hidden
 */
export class ImmutableTreeEvent<DataType> extends Event {
  declare type: ImmutableTreeEventType;
  constructor(type: ImmutableTreeEventType, public targetNode: ImmutableTreeNode<DataType> | null, public rootNode: ImmutableTreeNode<DataType> | null) {
    super(type);
  }
}

/**
 * A function of this type can optionally be passed to {@link ImmutableTree.deserialize}
 * to tell it how to parse your serialized data. Not required if your serialized
 * data is already in `{ data, children }` (the default format of
 * {@link ImmutableTree.serialize}).
 * @typeParam SerializedType Your serialization format.
 * @typeParam DataType The type of the data object associated with a given node.
 */
export type Deserializer<SerializedType, DataType> = (serialized: SerializedType) => { data: DataType, children: SerializedType[]};

/**
 * A function of this type can optionally be passed to {@link ImmutableTree.serialize}
 * or {@link ImmutableTreeNode.serialize} to serialize the tree into a custom
 * format. Not required if your preferred serialization format is
 * `{ data, children }` (the default format of
 * {@link ImmutableTree.deserialize}).
 * @typeParam SerializedType Your serialization format.
 * @typeParam DataType The type of the data object associated with a given node.
 */
export type Serializer<SerializedType, DataType> = (data: DataType, children: SerializedType[]) => SerializedType;

/**
 * The default serialization format for {@link ImmutableTree.serialize},
 * {@link ImmutableTreeNode.serialize}, and {@link ImmutableTree.deserialize}. If this
 * is your preferred format, you don't need serializer/deserializer functions.
 * @typeParam DataType The type of the data object associated with a given node.
 */
export type DefaultSerializedTreeNode<DataType> = {
  data: DataType;
  children: DefaultSerializedTreeNode<DataType>[]
}

/**
 * The default serializer function.
 * @hidden
 */
const defaultSerializer = <DataType>(data: Readonly<DataType>, children: DefaultSerializedTreeNode<DataType>[]) => ({ data, children });

/**
 * The default deserializer function.
 * @hidden
 */
const defaultDeserializer = <DataType>(pojo: DefaultSerializedTreeNode<DataType>) => pojo;

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
export class ImmutableTreeNode<DataType> {
  // @todo: should there be a way to get treeNode.newestVersion or something? Or would that cause all manner of memory leaks? Hm...
  // (if I do add that, update the error message in assertNotDead to be more helpful)

  /**
   * The `ImmutableTree` that this node is a part of.
   * @hidden
   */
  #tree: ImmutableTree<DataType>;

  /**
   * A node is stale if it has been removed from the tree or is an old version of the node.
   */
  public get isStale(): boolean { return this.#isStale; }
  /** @hidden */ #isStale: boolean = false;

  /**
   * A frozen array of child nodes. Accessing this will throw an error if the node is stale.
   */
  public get children(): ReadonlyArray<ImmutableTreeNode<DataType>> { this.assertNotStale(); return this.#children; };
  /** @hidden */ #children: ReadonlyArray<ImmutableTreeNode<DataType>>;

  /**
   * The parent node, or null for the root. Accessing this will throw an error if the node is stale.
   */
  public get parent(): ImmutableTreeNode<DataType> | null { this.assertNotStale(); return this.#parent; };
  /** @hidden */ #parent: ImmutableTreeNode<DataType> | null;

  /**
   * The data associated with the node. Accessing this will throw an error if the node is stale.
   */
  public get data(): Readonly<DataType> { this.assertNotStale(); return this.#data; };
  /** @hidden */ #data: DataType;

  /**
   * [INTERNAL, DO NOT USE] Construct a new `ImmutableTreeNode`.
   * @hidden
   */
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
   * Set the data at the given node. This method will throw an error if the node
   * is stale.
   * @param newData The new data object to associate with the node.
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
   * Inserts a child to the node. This method will throw an error if the node is
   * stale.
   * @param data The data associated with the new child.
   * @param index Defaults to the end of the list.
   * @returns The new tree node that will replace this one (NOT the new child).
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
   * Same as insertChildWithData but does not replace itself or fire any events.
   * Use this to build the tree before it needs to be immutable. This method
   * will throw an error if the node is stale.
   * @param data The data associated with the new child.
   * @param index Defaults to the end of the list.
   * @returns This node
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
    return this;
  }

  /**
   * Move this node to the given position. This method will throw an error if
   * the node is stale.
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
   * Remove this node from the tree. This method will throw an error if the node
   * is stale.
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
   * Transform the sub-tree into the default serialized format:
   * `{ data, children }`.
   */
  public serialize(): DefaultSerializedTreeNode<DataType>;
  /**
   * Transform the sub-tree into a serialized format.
   * @param transformer A function that can convert any node's data object
   * and an array of its already-serialized children into a serialized form.
   * @typeParam SerializedType Your serialization format.
   */
  public serialize<SerializedType>(serializer: Serializer<SerializedType, DataType>): SerializedType;
  public serialize<SerializedType>(serializer = defaultSerializer as unknown as Serializer<SerializedType, DataType>): SerializedType {
    const serializedChildren = this.#children.map(child => child.serialize(serializer));
    return serializer(this.#data, serializedChildren);
  }

  /**
   * Prints the subtree starting at this node. Prints [STALE] by each stale node.
   */
  public print(): void;
  /** @hidden */ public print(depth: number): void;
  public print(depth = 0): void {
    const indent = '  '.repeat(depth);
    console.log(indent + JSON.stringify(this.#data) + (this.#isStale ? ' [STALE]' : ''));
    this.#children.forEach(child => child.print(depth + 1));
  };

  /**
   * Create a clone of this node to replace itself with, so that object reference changes on update
   * @hidden
   */
  private clone(): ImmutableTreeNode<DataType> {
    return new ImmutableTreeNode<DataType>(IS_INTERNAL, this.#tree, this.#parent, this.#data, this.#children);
  }

  /**
   * Connect parent and children to an updated version of this node
   * @hidden
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
   * @hidden
   */
  private assertNotStale(): void {
    if(this.#isStale) {
      throw new Error('Illegal attempt to modify a stale version of a node, or a node that no longer exists');
    }
  }

  /**
   * Dispatch an event on the tree
   * @hidden
   */
  private dispatch(type: ImmutableTreeEventType) {
    this.#tree.dispatchEvent(new ImmutableTreeEvent(type, this, this.#tree.root));
    this.#tree.dispatchEvent(new ImmutableTreeEvent('immutabletree.changed', null, this.#tree.root));
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
export class ImmutableTree<DataType> extends EventTarget /* will this break in Node? Who knodes */ {

  /**
   * A function called on a node when it will update, including the node's
   * initial creation or a parent updating due to a child's update. The returned
   * value will be used as the updated data value for this node. This will not
   * trigger any additional events.
   */
  public nodeWillUpdate: null | ((oldData: Readonly<DataType> | null, newChildren: ReadonlyArray<ImmutableTreeNode<DataType>>, oldChildren: ReadonlyArray<ImmutableTreeNode<DataType>> | null) => DataType) = null;

  /**
   * The root node of the tree
   */
  public get root(): ImmutableTreeNode<DataType> | null { return this.#root; };
  /** @hidden */ #root: ImmutableTreeNode<DataType> | null = null;

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
    this.dispatchEvent(new ImmutableTreeEvent<DataType>('immutabletree.changed', null, this.#root));
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
   * Transform the sub-tree into the default serialized format:
   * `{ data, children }`.
   */
  public serialize(): DefaultSerializedTreeNode<DataType>;
  /**
   * Transform the sub-tree into a serialized format.
   * @param transformer A function that can convert any node's data object
   * and an array of its already-serialized children into a serialized form.
   * @typeParam SerializedType Your serialization format.
   */
  public serialize<SerializedType>(serializer: Serializer<SerializedType, DataType>): SerializedType;
  public serialize<SerializedType>(serializer = defaultSerializer as unknown as Serializer<SerializedType, DataType>): SerializedType | null {
    return this.#root?.serialize(serializer) ?? null;
  }

  /**
   * Given a JS object representing your root node in the default serialized
   * format, returns an ImmutableTree representing the data.
   * @param rootSerialized A JS object representing your root node in
   * `{ data, children }` format.
   * @typeParam DataType The type of the data object associated with a given node.
   */
  public static deserialize<DataType>(rootSerialized: DefaultSerializedTreeNode<DataType>): ImmutableTree<DataType>;
  /**
   * Given a JS object representing your root node, and a function that can
   * convert a node into a `{ data, children }` tuple, returns an ImmutableTree
   * representing the data.
   * @param rootSerialized A JS object representing your root node in your
   * serialization format.
   * @param deserializer A function that can turn data in your serialization
   * format into a `{ data, children }` tuple.
   * @typeParam SerializedType Your serialization format.
   * @typeParam DataType The type of the data object associated with a given node.
   */
  public static deserialize<SerializedType, DataType>(rootSerialized: SerializedType, deserializer: Deserializer<SerializedType, DataType>): ImmutableTree<DataType>;
  public static deserialize<SerializedType, DataType extends unknown>(rootSerialized: SerializedType, deserializer = defaultDeserializer as unknown as Deserializer<SerializedType, DataType>): ImmutableTree<DataType> {
    const tree = new ImmutableTree<DataType>();
    const rootTransformed = deserializer(rootSerialized);
    tree.addRootWithData(rootTransformed.data);
    for(const childPojo of rootTransformed.children) {
      ImmutableTree.deserializeHelper(tree.#root!, childPojo, deserializer);
    }
    return tree;
  };

  /**
   * Helper function to recursively deserialize a POJO tree
   * @hidden
   */
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
   * @hidden
   */
  public _changeRoot(newRoot: ImmutableTreeNode<DataType> | null, isInternal: typeof IS_INTERNAL): void {
    if(isInternal !== IS_INTERNAL) {
      throw new Error('Illegal invocation of internal method');
    }
    this.#root = newRoot;
  }
}
