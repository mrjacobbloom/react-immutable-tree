# react-immutable-tree

An immutable tree structure because it's very difficult to correctly handle
tree-like data in React. Despite the name, this can be used as a standalone
library, or even (theoretically) with other JS frameworks. It's just called
this because `immutable-tree` was already taken on npm (whoops!)

An `ImmutableTree` is a tree structure that can have any number of ordered
children. (Note: it's not a good fit for binary tree data where right/left child
relationships matter, because deleting the first child in a node shifts the
second child to the first position.) It is a subclass of `EventTarget`, which
makes it easy to subscribe to changes.

When a node changes, its ancestors are all replaced, but its siblings are not
(the sibling's `.parent` property changes, but it's the same object). In the
following image (adapted from [here](https://commons.wikimedia.org/wiki/File:Tree_(computer_science).svg))
updating the purple node causes it, as well as all green nodes, to be replaced.

![Image representing upward propagation of changes](https://raw.githubusercontent.com/mrjacobbloom/react-immutable-tree/main/tree-example.svg)

That makes this library compatible with things like `React.memo()`, which use a
simple equality check to decide whether to re-render.

## Getting started

### Constructing your tree the easy way

...that is, from JSON data. `ImmutableTree` provides a helper method, `parse`,
which will construct a tree out of your tree-like data. Just provide:

1. The object representing your root node
1. A function that, given an object representing a node, returns
  `{ data, children }` (the data object you want associated with the node in the
  ImmutableTree, and an array of JSON data objects representing children yet to
  be parsed)

```javascript
import { ImmutableTree } from 'react-immutable-tree';

function jsonDataToTree(jsonNode) {
  return {
    data: { firstName: jsonNode.firstName, lastName: jsonNode.lastName },
    children: jsonNode.friends
  }
}
const myTree = ImmutableTree.parse(JSON.parse("..."), jsonDataToTree);
```

### Using in a React app

```jsx
const NodeView = ({ node }) => (
  <li>
    {node.data.counter}
    <Button onClick={() => node.remove()}>Delete this node</Button>
    <Button onClick={() => node.setData({ counter: 0 })}>Reset this node</Button>
    <Button onClick={() => node.updateData(oldData => ({ counter: oldData.counter + 1 }))}>Increment this node</Button>
    <ul>
      {node.children.map(child => (
        <NodeView node={child} key={child.data.id}/>
      ))}
    </ul>
  </li>
);

import { useTree } from 'react-immutable-tree/hook';
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

### Constructing/modifying your tree the harder way (manually)

```javascript
import { ImmutableTree } from 'react-immutable-tree';

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
tableOfContents.root.children[0].children[2].remove(2);

// Many functions return the updated version of the node you're operating on, making it easy to keep "transforming" the same node
let myNode = tableOfContents.root.children[0];
myNode = myNode.updateData(oldData => { ...oldData, title: 'my very exciting title' });
myNode = myNode.insertChildWithData({ title: 'my even more exciting title' });
myNode = myNode.moveTo(someOtherNode, 2); // No new node is generated for this one, it returns itself. Also, optional second arg is index
myNode = myNode.remove(); // Same here
```


## API Refernce

### `ImmutableTree`

A subclass of `EventTarget`. Emmitted events may include:

- `immutabletree.updatenode`
- `immutabletree.insertchild` (note: `targetNode` is the parent)
- `immutabletree.movenode`
- `immutabletree.removenode`

Each event has a `.targetNode` property containing the affected node.

#### Static Methods

- `ImmutableTree.parse(rootPojo: yourObjectType, transformer: (pojo: yourObjectType) => { data: any, children: yourObjectType[]}): ImmutableTree` - Given a JS object representing your root node, and a function that can convert a node into a { data, children } tuple, returns an ImmutableTree representing the data.

#### Methods

- `new ImmutableTree()` - Creates a new tree. It is not initialized with a root.
- `ImmutableTree#addRootWithData(data: any): ImmutableTreeNode` - Create a root
  node with the given data object. Returns said root.
- `findOne(predicate: (data: any) => boolean): ImmutableTreeNode | null` - Traverse the whole tree until a matching node is found.
- `print(): void` - Prints the whole tree. Prints `[DEAD]` by each node that no longer exists in the tree.

### `ImmutableTreeNode`

#### Properties
- `ImmutableTreeNode#children: ImmutableTreeNode[]` - an array of child nodes
- `ImmutableTreeNode#parent: ImmutableTreeNode | null` - the parent node, or null for the root
- `ImmutableTreeNode#data: any` - the data associated with the node

#### Transformation Methods

Each of these methods returns the next version of the modified node (or itself,
if the operation does not modify the node). The old version of the node is then
marked dead, which means it'll throw an error if you try to modify it further.

- `ImmutableTreeNode#updateData(updater: (oldData: any | undefined) => any): ImmutableTreeNode` - Update the data at the given node. Returns the new tree node that will replace this one.
- `ImmutableTreeNode#setData(newData: any): ImmutableTreeNode` - Set the data at the given node. Returns the new tree node that will replace this one.
- `ImmutableTreeNode#insertChildWithData(data: any, index?: number): ImmutableTreeNode` - Inserts a child to the node. Index defaults to the end of the list if unset. Returns the new tree node that will replace this one.
- `ImmutableTreeNode#dangerouslyMutablyInsertChildWithData(data: any, index?: number): ImmutableTreeNode` - Same as insertChildWithData but does not replace itself and does not dispatch events. Use this to build the tree before it needs to be immutable. Returns this node.
- `ImmutableTreeNode#moveTo(newParent: ImmutableTreeNode, index?: number): ImmutableTreeNode` - Move this node to the given position. Index defaults to the end of the list if unset. Returns the removed node.
- `ImmutableTreeNode#remove(): ImmutableTreeNode` - Remove this node. Returns the removed node.

#### Traversal Methods

- `findOne(predicate: (data: any) => boolean): ImmutableTreeNode | null` - Traverse the whole sub-tree until a matching node is found.
- `print(): void` - Prints the sub-tree. Prints `[DEAD]` by each node that no longer exists in the tree.

### React hook

- `useTree(tree: ImmutableTree): ImmutableTreeNode` - see example

## Running tests

Running the test suite requires Node 15 because Node only recently added
`EventTarget` and I don't want to polyfill it just for the tests.
