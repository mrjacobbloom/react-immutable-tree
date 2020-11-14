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

/******* CONSTRUCTING/TRANSFORMING A TREE *******/

const tableOfContents = new ImmutableTree();
tableOfContents.addRootWithData({ title: null });

tableOfContents.root.insertChildWithData({ title: '1. How I did it' });
tableOfContents.root.insertChildWithData({ title: '3. Why I did it' }); // root is a different object now!
tableOfContents.root.insertChildWithData({ title: '2. If I did it' }, 1); // optional second argument is index in children list

// If we don't need the tree to behave immutably yet, it's easier to build a tree
// that isn't constantly replacing its own nodes. You can use this function in that case
tableOfContents.root.dangerouslyMutablyInsertChildWithData({ title: '4. But... I did it...' }, 1);

// Because all ancestors are replaced on every operation, we have to walk the entire tree for every operation
tableOfContents.root.children[0].insertChildWithData({ title: '1.1. How' });
tableOfContents.root.children[0].insertChildWithData({ title: '1.2. I' });
tableOfContents.root.children[0].insertChildWithData({ title: '1.3. did' });
tableOfContents.root.children[0].removeChildAt(2);
tableOfContents.root.children[0].removeChildrenMatching((data) => data.title.includes('How'));
tableOfContents.root.children[2].remove();

// You can also do it this way
const newChild = tableOfContents.root.children[0].insertChildWithData({ title: '1.4. It' });
newChild.parent.removeChildAt(0);
// todo: should there be a way to get treeNode.newestVersion or something? Or would that cause all manner of memory leaks? Hm...
// (if I do add that, update the error message in assertNotDead to be more helpful)


/******* CONSTRUCTING A TREE FROM JSON DATA *******/

// There's a convenience function that will build a tree from plain JS objects
// You just need to provide a function that tells ImmutableTree what a given object's data and children are
function jsonDataToTree(jsonNode) {
  return {
    data: jsonNode.firstName,
    children: jsonNode.friends
  }
}
const myTree = ImmutableTree.parse(JSON.parse("..."), jsonDataToTree);
```

### Using in a React app

```jsx

const NodeView = ({ node }) => (
  <li>
    {node.data.name}
    <ul>
      {node.children.map(child => (
        <NodeView node={child} key={child.data.name}/>
      ))}
    </ul>
  </li>
);

import { useTree } from 'immutable-tree/react';
const App = ({tree}) => {
  const rootNode = useTree(tree);

  return (
    <ul>
      <NodeView node={rootNode}/>
    </ul>
  );
};

ReactDOM.render(<App tree={myTree} />, document.getElementById('app'));
```


## API Refernce

### `ImutableTree`

A subclass of `EventTarget`. Emmitted events may include:

- `immutabletree.updatenode`
- `immutabletree.createnode`
- `immutabletree.deletenode`

Each event has a `.targetNode` property containing the affected node. Note that
for `immutabletree.updatenode`, `targetNode` is the OLD copy of the node, which
is read-only.

#### Static Methods

- `ImmutableTree.parse(rootPojo: yourObjectType, transformer: (pojo: yourObjectType) => { data: any, children: yourObjectType[]}): ImmutableTree` - Given a JS object representing your root node, and a function that can convert a node into a { data, children } tuple, returns an ImmutableTree representing the data.

#### Methods

- `new ImmutableTree()` - Creates a new tree. It is not initialized with a root.
- `ImmutableTree#addRootWithData(data: any): ImmutableTreeNode` - Create a root
  node with the given data object. Returns said root.

### `ImmutableTreeNode`

#### Properties
- `ImmutableTreeNode#children: ImmutableTreeNode[]` - an array of child nodes
- `ImmutableTreeNode#parent: ImmutableTreeNode | null` - the parent node, or null for the root
- `ImmutableTreeNode#data: any` - the data associated with the node

#### Transformation Methods

- `ImmutableTreeNode#updateData(updater: (oldData: any | undefined) => any): ImmutableTreeNode` - Update the data at the given node. Returns the new tree node that will replace this one.
- `ImmutableTreeNode#insertChildWithData(data: any, index?: number): ImmutableTreeNode` - Inserts a child to the node. Index Defaults to the end of the list if unset. Returns the new child TreeNode.
- `ImmutableTreeNode#dangerouslyMutablyInsertChildWithData(data: any, index?: number): ImmutableTreeNode` - Same as insertChildWithData but does not replace itself. Use this to build the tree before it needs to be immutable.
- `ImmutableTreeNode#remove(): ImmutableTreeNode` - Remove this node. Returns the removed node.
- `ImmutableTreeNode#removeChildAt(index: number): ImmutableTreeNode` - Remove the child with the given index. Returns the removed node.
- `ImmutableTreeNote#removeChildrenMatching(predicate: (child: ImmutableTreeNode) => boolean): ImmutableTreeNode[]` - Remove one or more of the node's children based on a given filter function. Returns  an array of the removed children.

#### Traversal Methods

- `findOne(predicate: (data: any) => boolean): ImmutableTreeNode | null` - Traverse the whole sub-tree until a matching node is found.