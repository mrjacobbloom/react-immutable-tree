> [Globals](../README.md) / "react-immutable-tree"

# Module: "react-immutable-tree"

This module contains the package's core functionality. It can be accessed by
importing `react-immutable-tree`.

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

*Defined in [src/react-immutable-tree.ts:74](https://github.com/mrjacobbloom/react-immutable-tree/blob/482e402/src/react-immutable-tree.ts#L74)*

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

*Defined in [src/react-immutable-tree.ts:55](https://github.com/mrjacobbloom/react-immutable-tree/blob/482e402/src/react-immutable-tree.ts#L55)*

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

*Defined in [src/react-immutable-tree.ts:17](https://github.com/mrjacobbloom/react-immutable-tree/blob/482e402/src/react-immutable-tree.ts#L17)*

The event types that `ImmutableTree` dispatches

___

### NodeWillUpdateCallback

Ƭ  **NodeWillUpdateCallback**\<DataType>: (unmodifiedData: Readonly\<DataType>, newChildren: ReadonlyArray\<[ImmutableTreeNode](../classes/_react_immutable_tree_.immutabletreenode.md)\<DataType>>, oldChildren: ReadonlyArray\<[ImmutableTreeNode](../classes/_react_immutable_tree_.immutabletreenode.md)\<DataType>> \| null) => DataType

*Defined in [src/react-immutable-tree.ts:45](https://github.com/mrjacobbloom/react-immutable-tree/blob/482e402/src/react-immutable-tree.ts#L45)*

The type of function you can set as [ImmutableTree.nodeWillUpdate](../classes/_react_immutable_tree_.immutabletree.md#nodewillupdate).

**`param`** The data object that would've been associated with a
given node if this function wasn't here to intercept it.

**`param`** The new set of child nodes.

**`param`** The set of child nodes from before whatever operation
triggered this function to run.

#### Type parameters:

Name | Description |
------ | ------ |
`DataType` | The type of the data object associated with a given node.  |

___

### Serializer

Ƭ  **Serializer**\<SerializedType, DataType>: (data: DataType, children: SerializedType[]) => SerializedType

*Defined in [src/react-immutable-tree.ts:66](https://github.com/mrjacobbloom/react-immutable-tree/blob/482e402/src/react-immutable-tree.ts#L66)*

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
