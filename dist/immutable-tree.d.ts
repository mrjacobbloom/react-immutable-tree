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
    private clone;
    private replaceSelf;
    private assertNotDead;
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
    _changeRoot(newRoot: ImmutableTreeNode<T> | null, isInternal: typeof IS_INTERNAL): void;
}
export {};
