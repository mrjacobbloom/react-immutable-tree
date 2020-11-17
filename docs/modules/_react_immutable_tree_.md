**[react-immutable-tree](../README.md)**

> [Globals](../globals.md) / "react-immutable-tree"

# Module: "react-immutable-tree"

## Index

### Classes

* [ImmutableTree](../classes/_react_immutable_tree_.immutabletree.md)
* [ImmutableTreeNode](../classes/_react_immutable_tree_.immutabletreenode.md)

### Type aliases

* [DefaultSerializedTreeNode](_react_immutable_tree_.md#defaultserializedtreenode)
* [Deserializer](_react_immutable_tree_.md#deserializer)
* [ImmutableTreeEventType](_react_immutable_tree_.md#immutabletreeeventtype)
* [Serializer](_react_immutable_tree_.md#serializer)

## Type aliases

### DefaultSerializedTreeNode

Ƭ  **DefaultSerializedTreeNode**\<DataType>: { children: [DefaultSerializedTreeNode](_react_immutable_tree_.md#defaultserializedtreenode)\<DataType>[] ; data: DataType  }

*Defined in [src/react-immutable-tree.ts:57](https://github.com/mrjacobbloom/react-immutable-tree/blob/48fb442/src/react-immutable-tree.ts#L57)*

The default serialization format for {@link ImmutableTree#serialize},
{@link ImmutableTreeNode#serialize}, and [ImmutableTree.deserialize](../classes/_react_immutable_tree_.immutabletree.md#deserialize). If this
is your preferred format, you don't need serializer/deserializer functions.

#### Type parameters:

Name | Description |
------ | ------ |
`DataType` | The type of the data object associated with a given node.  |

#### Type declaration:

Name | Type |
------ | ------ |
`children` | [DefaultSerializedTreeNode](_react_immutable_tree_.md#defaultserializedtreenode)\<DataType>[] |
`data` | DataType |

___

### Deserializer

Ƭ  **Deserializer**\<SerializedType, DataType>: (serialized: SerializedType) => { children: SerializedType[] ; data: DataType  }

*Defined in [src/react-immutable-tree.ts:38](https://github.com/mrjacobbloom/react-immutable-tree/blob/48fb442/src/react-immutable-tree.ts#L38)*

A function of this type can optionally be passed to [ImmutableTree.deserialize](../classes/_react_immutable_tree_.immutabletree.md#deserialize)
to tell it how to parse your serialized data. Not required if your serialized
data is already in `{ data, children }` (the default format of
{@link ImmutableTree#serialize}).

#### Type parameters:

Name | Description |
------ | ------ |
`SerializedType` | Your serialization format. |
`DataType` | The type of the data object associated with a given node.  |

___

### ImmutableTreeEventType

Ƭ  **ImmutableTreeEventType**: \"immutabletree.changed\" \| \"immutabletree.updatenode\" \| \"immutabletree.insertchild\" \| \"immutabletree.movenode\" \| \"immutabletree.removenode\"

*Defined in [src/react-immutable-tree.ts:11](https://github.com/mrjacobbloom/react-immutable-tree/blob/48fb442/src/react-immutable-tree.ts#L11)*

The event types that `ImmutableTree` dispatches

___

### Serializer

Ƭ  **Serializer**\<SerializedType, DataType>: (data: DataType, children: SerializedType[]) => SerializedType

*Defined in [src/react-immutable-tree.ts:49](https://github.com/mrjacobbloom/react-immutable-tree/blob/48fb442/src/react-immutable-tree.ts#L49)*

A function of this type can optionally be passed to [ImmutableTree.serialize](../classes/_react_immutable_tree_.immutabletree.md#serialize)
or [ImmutableTreeNode.serialize](../classes/_react_immutable_tree_.immutabletreenode.md#serialize) to serialize the tree into a custom
format. Not required if your preferred serialization format is
`{ data, children }` (the default format of
[ImmutableTree.deserialize](../classes/_react_immutable_tree_.immutabletree.md#deserialize)).

#### Type parameters:

Name | Description |
------ | ------ |
`SerializedType` | Your serialization format. |
`DataType` | The type of the data object associated with a given node.  |
