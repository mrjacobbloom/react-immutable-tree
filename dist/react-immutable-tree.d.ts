declare const IS_INTERNAL: unique symbol;
declare type ImmutableTreeEventType = 'immutabletree.updatenode' | 'immutabletree.insertchild' | 'immutabletree.movenode' | 'immutabletree.removenode';
export declare class ImmutableTreeEvent<T> extends Event {
    targetNode: ImmutableTreeNode<T> | null;
    rootNode: ImmutableTreeNode<T> | null;
    constructor(type: ImmutableTreeEventType, targetNode: ImmutableTreeNode<T> | null, rootNode: ImmutableTreeNode<T> | null);
}
declare type Deserializer<POJO, T> = (pojo: POJO) => {
    data: T;
    children: POJO[];
};
declare type Serializer<POJO, T> = (data: T, children: POJO[]) => POJO;
interface DefaultSerializedTreeNode<T> {
    data: T;
    children: DefaultSerializedTreeNode<T>[];
}
export declare class ImmutableTreeNode<T> {
    #private;
    /**
     * A node is stale if it has been removed from the tree or is an old version of the node.
     */
    get isStale(): boolean;
    /**
     * A frozen array of child nodes. Accessing this will throw an error for stale nodes.
     */
    get children(): ReadonlyArray<ImmutableTreeNode<T>>;
    /**
     * The parent node, or null for the root. Accessing this will throw an error for stale nodes.
     */
    get parent(): ImmutableTreeNode<T> | null;
    /**
     * The data associated with the node. Accessing this will throw an error for stale nodes.
     */
    get data(): T;
    constructor(isInternal: typeof IS_INTERNAL, tree: ImmutableTree<T>, parent: ImmutableTreeNode<T> | null, data: T, children: ImmutableTreeNode<T>[] | ReadonlyArray<ImmutableTreeNode<T>>);
    /**
     * Update the data at the given node.
     * @param updater
     * @returns The new tree node that will replace this one
     */
    updateData(updater: (oldData: Readonly<T> | undefined) => T): ImmutableTreeNode<T>;
    /**
     * Set the data at the given node.
     * @param newData
     * @returns The new tree node that will replace this one
     */
    setData(newData: T): ImmutableTreeNode<T>;
    /**
     * Inserts a child to the node.
     * @param index Defaults to the end of the list.
     * @returns The new tree node that will replace this one
     */
    insertChildWithData(data: T, index?: number): ImmutableTreeNode<T>;
    /**
     * Same as insertChildWithData but does not replace itself. Use this to build
     * the tree before it needs to be immutable.
     */
    dangerouslyMutablyInsertChildWithData(data: T, index?: number): this;
    /**
     * Move this node to the given position.
     * @param newParent Parent node to add to
     * @param index Defaults to the end of the list.
     * @returns Itself, since this operation does not technically modify this node
     */
    moveTo(newParent: ImmutableTreeNode<T>, index?: number): this;
    /**
     * Remove this node.
     * @returns The removed node
     */
    remove(): this;
    /**
     * Traverse the whole sub-tree until a matching node is found.
     */
    findOne(predicate: (data: T) => boolean): ImmutableTreeNode<T> | null;
    /**
     * Transform the sub-tree into the default serailized format.
     */
    serialize(): DefaultSerializedTreeNode<T>;
    /**
     * Transform the sub-tree into a serialized format.
     * @param transformer A function that can convert any node's data object
     * and an array of its already-serialized children into a sirealized form.
     */
    serialize<POJO>(serializer: Serializer<POJO, T>): POJO;
    /**
     * Prints the subtree starting at this node. Prints [STALE] by each stale node.
     */
    print(depth?: number): void;
    /**
     * Create a clone of this node to replace itself with, so that object reference changes on update
     */
    private clone;
    /**
     * Connect parent and children to an updated version of this node
     */
    private replaceSelf;
    /**
     * Throws if this node is marked stale. Used to ensure that no changes are made to old node objects.
     */
    private assertNotStale;
    /**
     * Dispatch an event on the tree
     */
    private dispatch;
}
export declare class ImmutableTree<T> extends EventTarget {
    #private;
    /**
     * The root node of the tree
     */
    get root(): ImmutableTreeNode<T> | null;
    /**
     * Create a root node with the given data object.
     * @returns The new root.
     */
    addRootWithData(data: T): ImmutableTreeNode<T>;
    /**
     * Traverse the whole tree until a matching node is found.
     */
    findOne(predicate: (data: T) => boolean): ImmutableTreeNode<T> | null;
    /**
     * Prints the tree.
     */
    print(): void;
    /**
     * Transform the sub-tree into the default serailized format.
     */
    serialize(): DefaultSerializedTreeNode<T>;
    /**
     * Transform the sub-tree into a serialized format.
     * @param transformer A function that can convert any node's data object
     * and an array of its already-serialized children into a sirealized form.
     */
    serialize<POJO>(serializer: Serializer<POJO, T>): POJO;
    /**
     * Given a JS object representing your root node in the default serialized
     * format, returns an ImmutableTree representing the data.
     */
    static deserialize<T>(rootPojo: DefaultSerializedTreeNode<T>): ImmutableTree<T>;
    /**
     * Given a JS object representing your root node, and a function that can
     * convert a node into a { data, children } tuple, returns an ImmutableTree
     * representing the data.
     */
    static deserialize<POJO, T>(rootPojo: POJO, deserializer: Deserializer<POJO, T>): ImmutableTree<T>;
    private static deserializeHelper;
    /**
     * [INTERNAL, DO NOT USE] Update the tree's root.
     */
    _changeRoot(newRoot: ImmutableTreeNode<T> | null, isInternal: typeof IS_INTERNAL): void;
}
export {};
