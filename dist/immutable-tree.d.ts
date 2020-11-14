declare const IS_INTERNAL: unique symbol;
declare class ImmutableTreeNode<T> {
    #private;
    get children(): ReadonlyArray<ImmutableTreeNode<T>>;
    get parent(): ImmutableTreeNode<T> | null;
    get data(): T;
    constructor(tree: ImmutableTree<T>, parent: ImmutableTreeNode<T> | null, data: T, children: ImmutableTreeNode<T>[] | ReadonlyArray<ImmutableTreeNode<T>>);
    /**
     * Update the data at the given node.
     * @param updater
     * @returns The new tree node that will replace this one
     */
    updateData(updater: (oldData: Readonly<T> | undefined) => T): ImmutableTreeNode<T>;
    /**
     * Inserts a child to the node.
     * @param index Defaults to the end of the list.
     * @returns The new child TreeNode
     */
    insertChildWithData(data: T, index?: number): ImmutableTreeNode<T>;
    /**
     * Same as insertChildWithData but does not replace itself. Use this to build
     * the tree before it needs to be immutable.
     */
    dangerouslyMutablyInsertChildWithData(data: T, index?: number): ImmutableTreeNode<T>;
    /**
     * Remove this node.
     * @returns The removed node
     */
    remove(): this;
    /**
     * Remove the child with the given index
     * @returns The removed node
     */
    removeChildAt(index: number): ImmutableTreeNode<T>;
    /**
     * Remove one or more of the node's children based on a given filter function.
     * @returns Array of removed children
     */
    removeChildrenMatching(predicate: (child: ImmutableTreeNode<T>) => boolean): ImmutableTreeNode<T>[];
    /**
     * Traverse the whole sub-tree until a matching node is found.
     */
    findOne(predicate: (data: T) => boolean): ImmutableTreeNode<T> | null;
    /**
     * Create a clone of this node to replace itself with, so that object reference changes on update
     */
    private clone;
    /**
     * Connect parent and children to an updated version of this node
     */
    private replaceSelf;
    /**
     * Throws if this node is marked dead. Used to ensure that no changes are made to old node objects.
     */
    private assertNotDead;
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
     * Given a JS object representing your root node, and a function that can
     * convert a node into a { data, children } tuple, returns an ImmutableTree
     * representing the data.
     */
    static parse<POJO, T>(rootPojo: POJO, transformer: (pojo: POJO) => {
        data: T;
        children: POJO[];
    }): ImmutableTree<T>;
    private static parseHelper;
    /**
     * Traverse the whole tree until a matching node is found.
     */
    findOne(predicate: (data: T) => boolean): ImmutableTreeNode<T> | null;
    /**
     * [INTERNAL, DO NOT USE] Update the tree's root.
     */
    _changeRoot(newRoot: ImmutableTreeNode<T> | null, isInternal: typeof IS_INTERNAL): void;
}
export {};
