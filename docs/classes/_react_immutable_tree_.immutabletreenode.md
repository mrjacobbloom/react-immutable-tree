> [Globals](../README.md) / ["react-immutable-tree"](../modules/_react_immutable_tree_.md) / ImmutableTreeNode

# Class: ImmutableTreeNode\<DataType>

An `ImmutableTreeNode` represents a node in the tree. They cannot be
constructed directly.

Each of the methods that modify the node return the next version of the
modified node (or itself, if the operation does not modify the node).

Changes to the tree will result in the old version of a node being marked
"stale." When a node is stale, attempts to modify it or read its data (except
[.isStale](_react_immutable_tree_.immutabletreenode.md#isstale)) will throw an error.

## Type parameters

Name | Description |
------ | ------ |
`DataType` | The type of the data object associated with a given node.  |

## Hierarchy

* **ImmutableTreeNode**

## Index

### Accessors

* [children](_react_immutable_tree_.immutabletreenode.md#children)
* [data](_react_immutable_tree_.immutabletreenode.md#data)
* [isStale](_react_immutable_tree_.immutabletreenode.md#isstale)
* [parent](_react_immutable_tree_.immutabletreenode.md#parent)

### Methods

* [dangerouslyMutablyInsertChildWithData](_react_immutable_tree_.immutabletreenode.md#dangerouslymutablyinsertchildwithdata)
* [findOne](_react_immutable_tree_.immutabletreenode.md#findone)
* [insertChildWithData](_react_immutable_tree_.immutabletreenode.md#insertchildwithdata)
* [moveTo](_react_immutable_tree_.immutabletreenode.md#moveto)
* [print](_react_immutable_tree_.immutabletreenode.md#print)
* [remove](_react_immutable_tree_.immutabletreenode.md#remove)
* [serialize](_react_immutable_tree_.immutabletreenode.md#serialize)
* [setData](_react_immutable_tree_.immutabletreenode.md#setdata)
* [updateData](_react_immutable_tree_.immutabletreenode.md#updatedata)

## Accessors

### children

• get **children**(): ReadonlyArray\<[ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>>

*Defined in [src/react-immutable-tree.ts:125](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L125)*

A frozen array of child nodes. Accessing this will throw an error if the node is stale.

**Returns:** ReadonlyArray\<[ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>>

___

### data

• get **data**(): Readonly\<DataType>

*Defined in [src/react-immutable-tree.ts:137](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L137)*

The data associated with the node. Accessing this will throw an error if the node is stale.

**Returns:** Readonly\<DataType>

___

### isStale

• get **isStale**(): boolean

*Defined in [src/react-immutable-tree.ts:119](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L119)*

A node is stale if it has been removed from the tree or is an old version of the node.

**Returns:** boolean

___

### parent

• get **parent**(): [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null

*Defined in [src/react-immutable-tree.ts:131](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L131)*

The parent node, or null for the root. Accessing this will throw an error if the node is stale.

**Returns:** [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null

## Methods

### dangerouslyMutablyInsertChildWithData

▸ **dangerouslyMutablyInsertChildWithData**(`data`: DataType, `index?`: number): this

*Defined in [src/react-immutable-tree.ts:225](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L225)*

Same as insertChildWithData but does not replace itself or fire any events.
Use this to build the tree before it needs to be immutable. This method
will throw an error if the node is stale.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`data` | DataType | - | The data associated with the new child. |
`index` | number | this.#children.length | Defaults to the end of the list. |

**Returns:** this

This node

___

### findOne

▸ **findOne**(`predicate`: (data: DataType) => boolean): [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null

*Defined in [src/react-immutable-tree.ts:303](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L303)*

Traverse the whole sub-tree until a matching node is found.

#### Parameters:

Name | Type |
------ | ------ |
`predicate` | (data: DataType) => boolean |

**Returns:** [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null

___

### insertChildWithData

▸ **insertChildWithData**(`data`: DataType, `index?`: number): [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>

*Defined in [src/react-immutable-tree.ts:199](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L199)*

Inserts a child to the node. This method will throw an error if the node is
stale.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`data` | DataType | - | The data associated with the new child. |
`index` | number | this.#children.length | Defaults to the end of the list. |

**Returns:** [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>

The new tree node that will replace this one (NOT the new child).

___

### moveTo

▸ **moveTo**(`newParent`: [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>, `index?`: number): this

*Defined in [src/react-immutable-tree.ts:247](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L247)*

Move this node to the given position. This method will throw an error if
the node is stale.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`newParent` | [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> | - | Parent node to add to |
`index` | number | newParent.#children.length | Defaults to the end of the list. |

**Returns:** this

Itself, since this operation does not technically modify this node

___

### print

▸ **print**(): void

*Defined in [src/react-immutable-tree.ts:332](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L332)*

Prints the subtree starting at this node. Prints [STALE] by each stale node.

**Returns:** void

___

### remove

▸ **remove**(): this

*Defined in [src/react-immutable-tree.ts:285](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L285)*

Remove this node from the tree. This method will throw an error if the node
is stale.

**Returns:** this

The removed node

___

### serialize

▸ **serialize**(): [DefaultSerializedTreeNode](../modules/_react_immutable_tree_.md#defaultserializedtreenode)\<DataType>

*Defined in [src/react-immutable-tree.ts:316](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L316)*

Transform the sub-tree into the default serialized format:
`{ data, children }`.

**Returns:** [DefaultSerializedTreeNode](../modules/_react_immutable_tree_.md#defaultserializedtreenode)\<DataType>

▸ **serialize**\<SerializedType>(`serializer`: [Serializer](../modules/_react_immutable_tree_.md#serializer)\<SerializedType, DataType>): SerializedType

*Defined in [src/react-immutable-tree.ts:323](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L323)*

Transform the sub-tree into a serialized format.

#### Type parameters:

Name | Description |
------ | ------ |
`SerializedType` | Your serialization format.  |

#### Parameters:

Name | Type |
------ | ------ |
`serializer` | [Serializer](../modules/_react_immutable_tree_.md#serializer)\<SerializedType, DataType> |

**Returns:** SerializedType

___

### setData

▸ **setData**(`newData`: DataType): [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>

*Defined in [src/react-immutable-tree.ts:183](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L183)*

Set the data at the given node. This method will throw an error if the node
is stale.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`newData` | DataType | The new data object to associate with the node. |

**Returns:** [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>

The new tree node that will replace this one

___

### updateData

▸ **updateData**(`updater`: (oldData: Readonly\<DataType>) => DataType): [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>

*Defined in [src/react-immutable-tree.ts:167](https://github.com/mrjacobbloom/react-immutable-tree/blob/47d0a03/src/react-immutable-tree.ts#L167)*

Update the data at the given node. This method will throw an error if the
node is stale.

**`example`** 
You can use `updateData` to only change one property on the data object:

```javascript
myNode.updateData(oldData => ({ ...oldData, myProp: 'new value' }))
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`updater` | (oldData: Readonly\<DataType>) => DataType | A function that, given the old data, can produce the next version of the data object to associate with this node. |

**Returns:** [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>

The new tree node that will replace this one
