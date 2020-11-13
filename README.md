# immutable-tree

An immutable tree structure because it's very difficult to correctly handle
tree-like data in React.

An ImmutableTree is a tree structure that can have any number of ordered
children. This means deleting the first child in a node shifts the second child
to the first position, so it's not a good fit for binary data where right/left
child relationships matter.

It is a subclass of `EventTarget`, which makes it easy to subscribe to changes.

When a node changes, its ancestors are all replaced, but its siblings are not
(the siblings' `.parent` property changes, it's the same object). That makes
this library good for use with things like `React.memo()`.

## Example

```javascript
import { ImmutableTree } from 'immutable-tree';

// Construct a tree
const tableOfContents = new ImmutableTree();
tableOfContents.addRootWithData({ title: null });

tableOfContents.root.insertChildWithData({ title: '1. How I did it' });
tableOfContents.root.insertChildWithData({ title: '3. Why I did it' });
tableOfContents.root.insertChildWithData({ title: '2. If I did it' }, 1); // index optional

tableOfContents.root.children[0].insertChildWithData({ title: '1.1. How' });
tableOfContents.root.children[0].insertChildWithData({ title: '1.2. I' });
tableOfContents.root.children[0].insertChildWithData({ title: '1.3. did' });
tableOfContents.root.children[0].removeChildAt(2);
tableOfContents.root.children[0].removeChildrenMatching((data) => data.title.includes('How'));
tableOfContents.root.children[2].remove();

```

## API Refernce

### `ImutableTree`

A subclass of `EventTarget`. Emmitted events may include:

- ...

#### Methods

- `new ImmutableTree()` - Creates a new tree. It is not initialized with a root.
- `ImmutableTree#addRootWithData(data: any): ImmutableTreeNode` - Create a root node with the given data object. Returns said root.

Create a root node with the given data object.

### `ImmutableTreeNode`

#### Properties
- `ImmutableTreeNode#children: ImmutableTreeNode[]` - an array of child nodes
- `ImmutableTreeNode#parent: ImmutableTreeNode | null` - the parent node, or null for the root
- `ImmutableTreeNode#data: any` - the data associated with the node

#### Transformation Methods

- `ImmutableTreeNode#updateData(updater: (oldData: any | undefined) => any): ImmutableTreeNode` - Update the data at the given node. Returns the new tree node that will replace this one.
- `ImmutableTreeNode#insertChildWithData(data: any, index?: number): ImmutableTreeNode` - Inserts a child to the node. Index Defaults to the end of the list if unset. Returns the new child TreeNode.
- `ImmutableTreeNode#remove(): ImmutableTreeNode` - Remove this node. Returns the removed node.
- `ImmutableTreeNode#removeChildAt(index: number): ImmutableTreeNode` - Remove the child with the given index. Returns the removed node.
- `ImmutableTreeNote#removeChildrenMatching(predicate: (child: ImmutableTreeNode) => boolean): ImmutableTreeNode[]` - Remove one or more of the node's children based on a given filter function. Returns  an array of the removed children.

#### Traversal Methods

- `findOne(predicate: (data: any) => boolean): ImmutableTreeNode | null` - Traverse the whole sub-tree until a matching node is found.