declare const IS_INTERNAL: unique symbol;
declare type ImmutableTreeEventType = 'immutabletree.updatenode' | 'immutabletree.insertchild' | 'immutabletree.movenode' | 'immutabletree.removenode';
export declare class ImmutableTreeEvent<T> extends Event {
    targetNode: ImmutableTreeNode<T> | null;
    rootNode: ImmutableTreeNode<T> | null;
    constructor(type: ImmutableTreeEventType, targetNode: ImmutableTreeNode<T> | null, rootNode: ImmutableTreeNode<T> | null);
}
export declare type BeforeUpdateModifier<DataType> = (oldData: Readonly<DataType> | null, newChildren: ReadonlyArray<ImmutableTreeNode<DataType>>, oldChildren: ReadonlyArray<ImmutableTreeNode<DataType>> | null) => DataType;
export declare type Deserializer<SerializedType, DataType> = (pojo: SerializedType) => {
    data: DataType;
    children: SerializedType[];
};
export declare type Serializer<SerializedType, DataType> = (data: DataType, children: SerializedType[]) => SerializedType;
export interface DefaultSerializedTreeNode<DataType> {
    data: DataType;
    children: DefaultSerializedTreeNode<DataType>[];
}
export declare class ImmutableTreeNode<DataType> {
    #private;
    /**
     * A node is stale if it has been removed from the tree or is an old version of the node.
     */
    get isStale(): boolean;
    /**
     * A frozen array of child nodes. Accessing this will throw an error for stale nodes.
     */
    get children(): ReadonlyArray<ImmutableTreeNode<DataType>>;
    /**
     * The parent node, or null for the root. Accessing this will throw an error for stale nodes.
     */
    get parent(): ImmutableTreeNode<DataType> | null;
    /**
     * The data associated with the node. Accessing this will throw an error for stale nodes.
     */
    get data(): Readonly<DataType>;
    constructor(isInternal: typeof IS_INTERNAL, tree: ImmutableTree<DataType>, parent: ImmutableTreeNode<DataType> | null, data: DataType, children: ImmutableTreeNode<DataType>[] | ReadonlyArray<ImmutableTreeNode<DataType>>);
    /**
     * Update the data at the given node.
     * @param updater
     * @returns The new tree node that will replace this one
     */
    updateData(updater: (oldData: Readonly<DataType> | undefined) => DataType): ImmutableTreeNode<DataType>;
    /**
     * Set the data at the given node.
     * @param newData
     * @returns The new tree node that will replace this one
     */
    setData(newData: DataType): ImmutableTreeNode<DataType>;
    /**
     * Inserts a child to the node.
     * @param index Defaults to the end of the list.
     * @returns The new tree node that will replace this one
     */
    insertChildWithData(data: DataType, index?: number): ImmutableTreeNode<DataType>;
    /**
     * Same as insertChildWithData but does not replace itself. Use this to build
     * the tree before it needs to be immutable.
     */
    dangerouslyMutablyInsertChildWithData(data: DataType, index?: number): this;
    /**
     * Move this node to the given position.
     * @param newParent Parent node to add to
     * @param index Defaults to the end of the list.
     * @returns Itself, since this operation does not technically modify this node
     */
    moveTo(newParent: ImmutableTreeNode<DataType>, index?: number): this;
    /**
     * Remove this node.
     * @returns The removed node
     */
    remove(): this;
    /**
     * Traverse the whole sub-tree until a matching node is found.
     */
    findOne(predicate: (data: DataType) => boolean): ImmutableTreeNode<DataType> | null;
    /**
     * Transform the sub-tree into the default serailized format.
     */
    serialize(): DefaultSerializedTreeNode<DataType>;
    /**
     * Transform the sub-tree into a serialized format.
     * @param transformer A function that can convert any node's data object
     * and an array of its already-serialized children into a sirealized form.
     */
    serialize<SerializedType>(serializer: Serializer<SerializedType, DataType>): SerializedType;
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
export declare class ImmutableTree<DataType> extends EventTarget {
    #private;
    /**
     * A function called on a node when it will update, including the node's
     * initial creation or a parent updating due to a child's update. The returned
     * value will be used as the updated data value for this node. This will not
     * trigger any additional events.
     */
    nodeWillUpdate: null | BeforeUpdateModifier<DataType>;
    /**
     * The root node of the tree
     */
    get root(): ImmutableTreeNode<DataType> | null;
    /**
     * Create a root node with the given data object.
     * @returns The new root.
     */
    addRootWithData(data: DataType): ImmutableTreeNode<DataType>;
    /**
     * Traverse the whole tree until a matching node is found.
     */
    findOne(predicate: (data: DataType) => boolean): ImmutableTreeNode<DataType> | null;
    /**
     * Prints the tree.
     */
    print(): void;
    /**
     * Transform the sub-tree into the default serailized format.
     */
    serialize(): DefaultSerializedTreeNode<DataType>;
    /**
     * Transform the sub-tree into a serialized format.
     * @param transformer A function that can convert any node's data object
     * and an array of its already-serialized children into a sirealized form.
     */
    serialize<SerializedType>(serializer: Serializer<SerializedType, DataType>): SerializedType;
    /**
     * Given a JS object representing your root node in the default serialized
     * format, returns an ImmutableTree representing the data.
     */
    static deserialize<DataType>(rootPojo: DefaultSerializedTreeNode<DataType>): ImmutableTree<DataType>;
    /**
     * Given a JS object representing your root node, and a function that can
     * convert a node into a { data, children } tuple, returns an ImmutableTree
     * representing the data.
     */
    static deserialize<SerializedType, DataType>(rootPojo: SerializedType, deserializer: Deserializer<SerializedType, DataType>): ImmutableTree<DataType>;
    private static deserializeHelper;
    /**
     * [INTERNAL, DO NOT USE] Update the tree's root.
     */
    _changeRoot(newRoot: ImmutableTreeNode<DataType> | null, isInternal: typeof IS_INTERNAL): void;
}
export {};
