# react-immutable-tree [![license](https://img.shields.io/npm/l/react-immutable-tree)](https://github.com/mrjacobbloom/echo/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/react-immutable-tree)](https://www.npmjs.com/package/react-immutable-tree)

An immutable tree structure because it's very difficult to correctly handle
tree-like data in React. Despite the name, this can be used as a standalone
library, or even (theoretically) with other JS frameworks. It's just called
this because `immutable-tree` was already taken on npm (whoops!)

An `ImmutableTree` is a tree structure that can have any number of ordered
children. (Note: it's not a good fit for binary tree data where right/left child
relationships matter, because deleting the first child in a node shifts the
second child to the first position.) It is a subclass of `EventTarget`, which
makes it easy to subscribe to changes.

When a node changes, its ancestors are all replaced, but its siblings
and children are not (the siblings and children's `.parent` properties change,
but it's the same object). Given the following graph (adapted from
[here](https://commons.wikimedia.org/wiki/File:Tree_(computer_science).svg)),
updating the purple node causes that node, as well as all green nodes, to be
replaced. Orange nodes are reused.

![Image representing upward propagation of changes](https://raw.githubusercontent.com/mrjacobbloom/react-immutable-tree/main/tree-example.svg)

That makes this library compatible with things like `React.memo()`, which use a
simple equality check to decide whether to re-render. Simply subscribe to changes to the tree and grab the new root object when those changes occur.

## Getting started

## Installation/Importing

To install, run

```shell
npm install react-immutable@VERSION tree --save
```

...where `VERSION` is the version you'd like to use. Pinning to a specific
version because, until version 1.0.0 is released, the API is not guaranteed to
be stable.

If you're using it on a frontend, you can import the UMD packages from unpkg:
```html
<script crossorigin src="https://unpkg.com/react-immutable-tree@VERSION/dist/react-immutable-tree.umd.js"></script>
<script crossorigin src="https://unpkg.com/react-immutable-tree@VERSION/dist/react-immutable-tree-hook.umd.js"></script>
```

Your imports might look like this:

```javascript
import { ImmutableTree } from 'react-immutable-tree';
import { useTree } from 'react-immutable-tree/hook'
```

If you're using TypeScript, a bunch of handy types are also exported. Check out
the docs for [`react-immutable-tree`](/docs/_react_immutabe_tree_.md) and
[`react-immutable-tree/hook`](/docs/_react_immutabe_tree_hook_.md) for a full
list.

### Constructing your tree the easy way

...that is, from JSON data. `ImmutableTree` provides a helper method, `deserialize`,
which will construct a tree out of your tree-like data. Just provide:

1. The object representing your root node
1. A function that, given an object representing a node, returns
  `{ data, children }` (the data object you want associated with the node in the
  ImmutableTree, and an array of JSON data objects representing children yet to
  be parsed). This function is not required if your data is already in
  `{ data, children }` form (which is the default output of `tree.serialize()`).

```javascript
import { ImmutableTree } from 'react-immutable-tree';

// Deserializer to convert my JSON data to { data, children } format
// let's say our data looks like { firstName: 'John', lastName: 'Doe', friends: [ ...more people... ] }
function jsonDataToTree(jsonNode) {
  return {
    data: { firstName: jsonNode.firstName, lastName: jsonNode.lastName },
    children: jsonNode.friends,
  }
}
const myTree = ImmutableTree.deserialize(JSON.parse(" (data) "), jsonDataToTree);

// ...do things with the tree...

// Serializer to turn treeNode data back into our JSON format
// This function is unnecessary if our preferred format is { children, data }
function treeNodeToJsonData(data, children) {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    friends: children,
  };
}
const serialized = myTree.serialize(treeNodeToJsonData);
```

### Using in a React app

```jsx
const NodeView = React.memo(({ node }) => (
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
));

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

// If we don't need the tree to behave immutably yet, the easiest way to build it is using this function
const root = tableOfContents.root;
root.dangerouslyMutablyInsertChildWithData({ title: '1. How I did it' });
root.dangerouslyMutablyInsertChildWithData({ title: '3. Why I did it' });
root.dangerouslyMutablyInsertChildWithData({ title: '2. If I did it' }, 1); // optional second argument is index

// That's because most other functions cause the nodes to replace themselves, dispatch events, etc.
// And since they behave that way, we often have to walk the entire tree for subsequent operations

tableOfContents.root.children[0].insertChildWithData({ title: '1.1. How' });
tableOfContents.root.children[0].insertChildWithData({ title: '1.3. did' }); // root is a different object now!
tableOfContents.root.children[0].insertChildWithData({ title: '1.2. I' }, 1); // again, optional second argument is index
tableOfContents.root.children[0].children[2].remove(2);

// HOWEVER, many functions return the updated version of the node you're operating on, making it easy to keep working with the same node
let myNode = tableOfContents.root.children[0];
myNode = myNode.updateData(oldData => { ...oldData, title: 'my very exciting title' });
myNode = myNode.insertChildWithData({ title: 'my even more exciting title' });
myNode = myNode.moveTo(someOtherNode, 2); // No new node is generated for this one, it returns itself. Also, optional second arg is index
myNode = myNode.remove(); // Same here
```

## API Refernce

Check out the [Docs](/docs)!

## Running tests

Running the test suite requires Node 15 because Node only recently added
`EventTarget` and I don't want to polyfill it just for the tests.
