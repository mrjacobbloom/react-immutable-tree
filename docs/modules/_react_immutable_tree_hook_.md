**[react-immutable-tree](../README.md)**

> [Globals](../globals.md) / "react-immutable-tree-hook"

# Module: "react-immutable-tree-hook"

## Index

### Functions

* [useTree](_react_immutable_tree_hook_.md#usetree)

## Functions

### useTree

▸ **useTree**\<DataType>(`tree`: [ImmutableTree](../classes/_react_immutable_tree_.immutabletree.md)\<DataType>): [ImmutableTreeNode](../classes/_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null

*Defined in [src/react-immutable-tree-hook.ts:40](https://github.com/mrjacobbloom/react-immutable-tree/blob/1ffbe27/src/react-immutable-tree-hook.ts#L40)*

A React hook. Given an `ImmutableTree`, returns its root node and triggers a
re-render when the tree updates.

**`example`** 
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

#### Type parameters:

Name | Description |
------ | ------ |
`DataType` | The type of the data object associated with a given node. |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`tree` | [ImmutableTree](../classes/_react_immutable_tree_.immutabletree.md)\<DataType> | Your `ImmutableTree` |

**Returns:** [ImmutableTreeNode](../classes/_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null

The up-to-date root node of the tree
