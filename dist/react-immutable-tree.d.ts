/**
 * This module contains the package's core functionality. It can be accessed by
 * importing `react-immutable-tree`.
 * @packageDocumentation
 */
/**
 * Shibboleth to ensure that certain actions, like constructing an
 * ImmutableTreeNode, are only done from trusted code.
 * @hidden
 */
declare const IS_INTERNAL: unique symbol;
/**
 * The event types that `ImmutableTree` dispatches
 */
declare type ImmutableTreeEventType = 'immutabletree.changed' | 'immutabletree.updatenode' | 'immutabletree.insertchild' | 'immutabletree.movenode' | 'immutabletree.removenode';
/**
 * The `Event` subtype that `ImmutableTree` dispatches
 * @typeParam DataType The type of the data object associated with a given node.
 * @hidden
 */
export declare class ImmutableTreeEvent<DataType> extends Event {
    targetNode: ImmutableTreeNode<DataType> | null;
    rootNode: ImmutableTreeNode<DataType> | null;
    type: ImmutableTreeEventType;
    constructor(type: ImmutableTreeEventType, targetNode: ImmutableTreeNode<DataType> | null, rootNode: ImmutableTreeNode<DataType> | null);
}
/**
 * The type of function you can set as {@link ImmutableTree.nodeWillUpdate}.
 * @param unmodifiedData The data object that would've been associated with a
 * given node if this function wasn't here to intercept it.
 * @param newChildren The new set of child nodes.
 * @param oldChildren The set of child nodes from before whatever operation
 * triggered this function to run.
 * @typeParam DataType The type of the data object associated with a given node.
 */
export declare type NodeWillUpdateCallback<DataType> = (unmodifiedData: Readonly<DataType>, newChildren: ReadonlyArray<ImmutableTreeNode<DataType>>, oldChildren: ReadonlyArray<ImmutableTreeNode<DataType>> | null) => DataType;
/**
 * A function of this type can optionally be passed to {@link ImmutableTree.deserialize}
 * to tell it how to parse your serialized data. Not required if your serialized
 * data is already in `{ data, children }` (the default format of
 * {@link ImmutableTree.serialize}).
 * @typeParam SerializedType Your serialization format.
 * @typeParam DataType The type of the data object associated with a given node.
 */
export declare type Deserializer<SerializedType, DataType> = (serialized: SerializedType) => {
    data: DataType;
    children: SerializedType[];
};
/**
 * A function of this type can optionally be passed to {@link ImmutableTree.serialize}
 * or {@link ImmutableTreeNode.serialize} to serialize the tree into a custom
 * format. Not required if your preferred serialization format is
 * `{ data, children }` (the default format of
 * {@link ImmutableTree.deserialize}).
 * @typeParam SerializedType Your serialization format.
 * @typeParam DataType The type of the data object associated with a given node.
 */
export declare type Serializer<SerializedType, DataType> = (data: DataType, children: SerializedType[]) => SerializedType;
/**
 * The default serialization format for {@link ImmutableTree.serialize},
 * {@link ImmutableTreeNode.serialize}, and {@link ImmutableTree.deserialize}. If this
 * is your preferred format, you don't need serializer/deserializer functions.
 * @typeParam DataType The type of the data object associated with a given node.
 */
export declare type DefaultSerializedTreeNode<DataType> = {
    data: DataType;
    children: DefaultSerializedTreeNode<DataType>[];
};
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
export declare class ImmutableTreeNode<DataType> {
    #private;
    /**
     * A node is stale if it has been removed from the tree or is an old version of the node.
     */
    get isStale(): boolean;
    /**
     * A frozen array of child nodes. Accessing this will throw an error if the node is stale.
     */
    get children(): ReadonlyArray<ImmutableTreeNode<DataType>>;
    /**
     * The parent node, or null for the root. Accessing this will throw an error if the node is stale.
     */
    get parent(): ImmutableTreeNode<DataType> | null;
    /**
     * The data associated with the node. Accessing this will throw an error if the node is stale.
     */
    get data(): Readonly<DataType>;
    /**
     * [INTERNAL, DO NOT USE] Construct a new `ImmutableTreeNode`.
     * @hidden
     */
    constructor(isInternal: typeof IS_INTERNAL, tree: ImmutableTree<DataType>, parent: ImmutableTreeNode<DataType> | null, data: DataType, children: ImmutableTreeNode<DataType>[] | ReadonlyArray<ImmutableTreeNode<DataType>>);
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
    updateData(updater: (oldData: Readonly<DataType>) => DataType): ImmutableTreeNode<DataType>;
    /**
     * Set the data at the given node. This method will throw an error if the node
     * is stale.
     * @param newData The new data object to associate with the node.
     * @returns The new tree node that will replace this one
     */
    setData(newData: DataType): ImmutableTreeNode<DataType>;
    /**
     * Inserts a child to the node. This method will throw an error if the node is
     * stale.
     * @param data The data associated with the new child.
     * @param index Defaults to the end of the list.
     * @returns The new tree node that will replace this one (NOT the new child).
     */
    insertChildWithData(data: DataType, index?: number): ImmutableTreeNode<DataType>;
    /**
     * Same as insertChildWithData but does not replace itself or fire any events.
     * Use this to build the tree before it needs to be immutable. This method
     * will throw an error if the node is stale.
     * @param data The data associated with the new child.
     * @param index Defaults to the end of the list.
     * @returns This node
     */
    dangerouslyMutablyInsertChildWithData(data: DataType, index?: number): this;
    /**
     * Move this node to the given position. This method will throw an error if
     * the node is stale.
     * @param newParent Parent node to add to
     * @param index Defaults to the end of the list.
     * @returns Itself, since this operation does not technically modify this node
     */
    moveTo(newParent: ImmutableTreeNode<DataType>, index?: number): this;
    /**
     * Remove this node from the tree. This method will throw an error if the node
     * is stale.
     * @returns The removed node
     */
    remove(): this;
    /**
     * Traverse the whole sub-tree until a matching node is found.
     */
    findOne(predicate: (data: DataType) => boolean): ImmutableTreeNode<DataType> | null;
    /**
     * Transform the sub-tree into the default serialized format:
     * `{ data, children }`.
     */
    serialize(): DefaultSerializedTreeNode<DataType>;
    /**
     * Transform the sub-tree into a serialized format.
     * @param transformer A function that can convert any node's data object
     * and an array of its already-serialized children into a serialized form.
     * @typeParam SerializedType Your serialization format.
     */
    serialize<SerializedType>(serializer: Serializer<SerializedType, DataType>): SerializedType;
    /**
     * Prints the subtree starting at this node. Prints [STALE] by each stale node.
     */
    print(): void;
    /** @hidden */ print(depth: number): void;
    /**
     * Create a clone of this node to replace itself with, so that object reference changes on update
     * @hidden
     */
    private clone;
    /**
     * Connect parent and children to an updated version of this node
     * @hidden
     */
    private replaceSelf;
    /**
     * Throws if this node is marked stale. Used to ensure that no changes are made to old node objects.
     * @hidden
     */
    private assertNotStale;
    /**
     * Dispatch an event on the tree
     * @hidden
     */
    private dispatch;
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
export declare class ImmutableTree<DataType> extends EventTarget {
    #private;
    /**
     * A function called on a node when it will update, including the node's
     * initial creation or a parent updating due to a child's update. The returned
     * value will be used as the updated data value for this node. This will not
     * trigger any additional events.
     */
    nodeWillUpdate: null | NodeWillUpdateCallback<DataType>;
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
     * Same as addRootWithData but does not fire any events.
     * @returns The new root.
     */
    dangerouslyMutablyAddRootWithData(data: DataType): ImmutableTreeNode<DataType>;
    /**
     * Traverse the whole tree until a matching node is found.
     */
    findOne(predicate: (data: DataType) => boolean): ImmutableTreeNode<DataType> | null;
    /**
     * Prints the tree.
     */
    print(): void;
    /**
     * Transform the sub-tree into the default serialized format:
     * `{ data, children }`.
     */
    serialize(): DefaultSerializedTreeNode<DataType>;
    /**
     * Transform the sub-tree into a serialized format.
     * @param transformer A function that can convert any node's data object
     * and an array of its already-serialized children into a serialized form.
     * @typeParam SerializedType Your serialization format.
     */
    serialize<SerializedType>(serializer: Serializer<SerializedType, DataType>): SerializedType;
    /**
     * Given a JS object representing your root node in the default serialized
     * format, returns an ImmutableTree representing the data.
     * @param rootSerialized A JS object representing your root node in
     * `{ data, children }` format.
     * @typeParam DataType The type of the data object associated with a given node.
     */
    static deserialize<DataType>(rootSerialized: DefaultSerializedTreeNode<DataType>): ImmutableTree<DataType>;
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
    static deserialize<SerializedType, DataType>(rootSerialized: SerializedType, deserializer: Deserializer<SerializedType, DataType>): ImmutableTree<DataType>;
    /**
     * Helper function to recursively deserialize a POJO tree
     * @hidden
     */
    private static deserializeHelper;
    /**
     * [INTERNAL, DO NOT USE] Update the tree's root.
     * @hidden
     */
    _changeRoot(newRoot: ImmutableTreeNode<DataType> | null, isInternal: typeof IS_INTERNAL): void;
}
export {};
