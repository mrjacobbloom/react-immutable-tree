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
* [NodeWillUpdateCallback](_react_immutable_tree_.md#nodewillupdatecallback)
* [Serializer](_react_immutable_tree_.md#serializer)

## Type aliases

### DefaultSerializedTreeNode

Ƭ  **DefaultSerializedTreeNode**\<DataType>: { children: [DefaultSerializedTreeNode](_react_immutable_tree_.md#defaultserializedtreenode)\<DataType>[] ; data: DataType  }

*Defined in [src/react-immutable-tree.ts:63](https://github.com/mrjacobbloom/react-immutable-tree/blob/1ffbe27/src/react-immutable-tree.ts#L63)*

The default serialization format for [ImmutableTree.serialize](../classes/_react_immutable_tree_.immutabletree.md#serialize),
[ImmutableTreeNode.serialize](../classes/_react_immutable_tree_.immutabletreenode.md#serialize), and [ImmutableTree.deserialize](../classes/_react_immutable_tree_.immutabletree.md#deserialize). If this
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

*Defined in [src/react-immutable-tree.ts:44](https://github.com/mrjacobbloom/react-immutable-tree/blob/1ffbe27/src/react-immutable-tree.ts#L44)*

A function of this type can optionally be passed to [ImmutableTree.deserialize](../classes/_react_immutable_tree_.immutabletree.md#deserialize)
to tell it how to parse your serialized data. Not required if your serialized
data is already in `{ data, children }` (the default format of
[ImmutableTree.serialize](../classes/_react_immutable_tree_.immutabletree.md#serialize)).

#### Type parameters:

Name | Description |
------ | ------ |
`SerializedType` | Your serialization format. |
`DataType` | The type of the data object associated with a given node.  |

___

### ImmutableTreeEventType

Ƭ  **ImmutableTreeEventType**: \"immutabletree.changed\" \| \"immutabletree.updatenode\" \| \"immutabletree.insertchild\" \| \"immutabletree.movenode\" \| \"immutabletree.removenode\"

*Defined in [src/react-immutable-tree.ts:11](https://github.com/mrjacobbloom/react-immutable-tree/blob/1ffbe27/src/react-immutable-tree.ts#L11)*

The event types that `ImmutableTree` dispatches

___

### NodeWillUpdateCallback

Ƭ  **NodeWillUpdateCallback**\<DataType>: (oldData: Readonly\<DataType> \| null, newChildren: ReadonlyArray\<[ImmutableTreeNode](../classes/_react_immutable_tree_.immutabletreenode.md)\<DataType>>, oldChildren: ReadonlyArray\<[ImmutableTreeNode](../classes/_react_immutable_tree_.immutabletreenode.md)\<DataType>> \| null) => DataType

*Defined in [src/react-immutable-tree.ts:34](https://github.com/mrjacobbloom/react-immutable-tree/blob/1ffbe27/src/react-immutable-tree.ts#L34)*

The type of function you can set as [ImmutableTree.nodeWillUpdate](../classes/_react_immutable_tree_.immutabletree.md#nodewillupdate).

#### Type parameters:

Name | Description |
------ | ------ |
`DataType` | The type of the data object associated with a given node.  |

___

### Serializer

Ƭ  **Serializer**\<SerializedType, DataType>: (data: DataType, children: SerializedType[]) => SerializedType

*Defined in [src/react-immutable-tree.ts:55](https://github.com/mrjacobbloom/react-immutable-tree/blob/1ffbe27/src/react-immutable-tree.ts#L55)*

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
