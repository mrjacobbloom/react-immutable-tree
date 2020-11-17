**[react-immutable-tree](../README.md)**

> [Globals](../globals.md) / "react-immutable-tree"

# Module: "react-immutable-tree"

## Index

### Classes

* [ImmutableTree](../classes/_react_immutable_tree_.immutabletree.md)
* [ImmutableTreeEvent](../classes/_react_immutable_tree_.immutabletreeevent.md)
* [ImmutableTreeNode](../classes/_react_immutable_tree_.immutabletreenode.md)

### Interfaces

* [DefaultSerializedTreeNode](../interfaces/_react_immutable_tree_.defaultserializedtreenode.md)

### Type aliases

* [Deserializer](_react_immutable_tree_.md#deserializer)
* [ImmutableTreeEventType](_react_immutable_tree_.md#immutabletreeeventtype)
* [Serializer](_react_immutable_tree_.md#serializer)

## Type aliases

### Deserializer

Ƭ  **Deserializer**\<SerializedType, DataType>: (serialized: SerializedType) => { children: SerializedType[] ; data: DataType  }

*Defined in [src/react-immutable-tree.ts:35](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L35)*

A function of this type can optionally be passed to `ImmutableTree.deserialize`
to tell it how to parse your serialuzed data. Not required if your serialized
data is already in `{ data, children }` (the default format of
`ImmutableTree#serialize()`).

#### Type parameters:

Name | Description |
------ | ------ |
`SerializedType` | Your serialization format. |
`DataType` | The type of the data object associated with a given node.  |

___

### ImmutableTreeEventType

Ƭ  **ImmutableTreeEventType**: \"immutabletree.updatenode\" \| \"immutabletree.insertchild\" \| \"immutabletree.movenode\" \| \"immutabletree.removenode\"

*Defined in [src/react-immutable-tree.ts:11](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L11)*

The event types that `ImmutableTree` dispatches

___

### Serializer

Ƭ  **Serializer**\<SerializedType, DataType>: (data: DataType, children: SerializedType[]) => SerializedType

*Defined in [src/react-immutable-tree.ts:46](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L46)*

A function of this type can optionally be passed to `ImmutableTree#serialize()`
or `ImmutableTreeNode#serialize()` to serialize the tree into a custom
format. Not required if your preferred serialization format is
`{ data, children }` (the default format of
`ImmutableTree.deserialize()`).

#### Type parameters:

Name | Description |
------ | ------ |
`SerializedType` | Your serialization format. |
`DataType` | The type of the data object associated with a given node.  |
