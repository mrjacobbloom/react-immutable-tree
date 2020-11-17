**[react-immutable-tree](../README.md)**

> [Globals](../globals.md) / ["react-immutable-tree"](../modules/_react_immutable_tree_.md) / ImmutableTree

# Class: ImmutableTree\<DataType>

An `ImmutableTree` is a tree structure that can have any number of ordered
children. (Note: it's not a good fit for binary tree data where right/left
child relationships matter, because deleting the first child in a node shifts
the second child to the first position.)

When a node changes, its ancestors are all replaced, but its siblings and
children are not (the siblings and children's .parent properties change, but
it's the same object).

`ImmutableTree`s are not initialized with a root node. Use `addRootWithData`
to create the root.

It is a subclass of `EventTarget`. Emmitted events may include:

- `immutabletree.updatenode`
- `immutabletree.insertchild` (note: `targetNode` is the parent)
- `immutabletree.movenode`
- `immutabletree.removenode`

Each event has a `.targetNode` property containing the affected node and a
`.rootNode` property containing the new root.

## Type parameters

Name | Description |
------ | ------ |
`DataType` | The type of the data object associated with a given node.  |

## Hierarchy

* [EventTarget](_react_immutable_tree_.immutabletree.md#eventtarget)

  ↳ **ImmutableTree**

## Index

### Properties

* [nodeWillUpdate](_react_immutable_tree_.immutabletree.md#nodewillupdate)
* [EventTarget](_react_immutable_tree_.immutabletree.md#eventtarget)

### Accessors

* [root](_react_immutable_tree_.immutabletree.md#root)

### Methods

* [addEventListener](_react_immutable_tree_.immutabletree.md#addeventlistener)
* [addRootWithData](_react_immutable_tree_.immutabletree.md#addrootwithdata)
* [dispatchEvent](_react_immutable_tree_.immutabletree.md#dispatchevent)
* [findOne](_react_immutable_tree_.immutabletree.md#findone)
* [print](_react_immutable_tree_.immutabletree.md#print)
* [removeEventListener](_react_immutable_tree_.immutabletree.md#removeeventlistener)
* [serialize](_react_immutable_tree_.immutabletree.md#serialize)
* [deserialize](_react_immutable_tree_.immutabletree.md#deserialize)
* [deserializeHelper](_react_immutable_tree_.immutabletree.md#deserializehelper)

## Properties

### nodeWillUpdate

•  **nodeWillUpdate**: null \| (oldData: Readonly\<DataType> \| null, newChildren: ReadonlyArray\<[ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>>, oldChildren: ReadonlyArray\<[ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>> \| null) => DataType = null

*Defined in [src/react-immutable-tree.ts:415](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L415)*

A function called on a node when it will update, including the node's
initial creation or a parent updating due to a child's update. The returned
value will be used as the updated data value for this node. This will not
trigger any additional events.

___

### EventTarget

▪ `Static` **EventTarget**: { constructor: () => [EventTarget](_react_immutable_tree_.immutabletree.md#eventtarget) ; prototype: [EventTarget](_react_immutable_tree_.immutabletree.md#eventtarget)  }

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5435*

#### Type declaration:

Name | Type |
------ | ------ |
`constructor` | () => [EventTarget](_react_immutable_tree_.immutabletree.md#eventtarget) |
`prototype` | [EventTarget](_react_immutable_tree_.immutabletree.md#eventtarget) |

## Accessors

### root

• get **root**(): [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null

*Defined in [src/react-immutable-tree.ts:420](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L420)*

The root node of the tree

**Returns:** [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null

## Methods

### addEventListener

▸ **addEventListener**(`type`: string, `listener`: EventListenerOrEventListenerObject \| null, `options?`: boolean \| AddEventListenerOptions): void

*Inherited from [ImmutableTree](_react_immutable_tree_.immutabletree.md).[addEventListener](_react_immutable_tree_.immutabletree.md#addeventlistener)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5424*

Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.

The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.

When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.

When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.

When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.

The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.

#### Parameters:

Name | Type |
------ | ------ |
`type` | string |
`listener` | EventListenerOrEventListenerObject \| null |
`options?` | boolean \| AddEventListenerOptions |

**Returns:** void

___

### addRootWithData

▸ **addRootWithData**(`data`: DataType): [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>

*Defined in [src/react-immutable-tree.ts:427](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L427)*

Create a root node with the given data object.

#### Parameters:

Name | Type |
------ | ------ |
`data` | DataType |

**Returns:** [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>

The new root.

___

### dispatchEvent

▸ **dispatchEvent**(`event`: [Event](_react_immutable_tree_.immutabletreeevent.md#event)): boolean

*Inherited from [ImmutableTree](_react_immutable_tree_.immutabletree.md).[dispatchEvent](_react_immutable_tree_.immutabletree.md#dispatchevent)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5428*

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

#### Parameters:

Name | Type |
------ | ------ |
`event` | [Event](_react_immutable_tree_.immutabletreeevent.md#event) |

**Returns:** boolean

___

### findOne

▸ **findOne**(`predicate`: (data: DataType) => boolean): [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null

*Defined in [src/react-immutable-tree.ts:439](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L439)*

Traverse the whole tree until a matching node is found.

#### Parameters:

Name | Type |
------ | ------ |
`predicate` | (data: DataType) => boolean |

**Returns:** [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null

___

### print

▸ **print**(): void

*Defined in [src/react-immutable-tree.ts:446](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L446)*

Prints the tree.

**Returns:** void

___

### removeEventListener

▸ **removeEventListener**(`type`: string, `callback`: EventListenerOrEventListenerObject \| null, `options?`: EventListenerOptions \| boolean): void

*Inherited from [ImmutableTree](_react_immutable_tree_.immutabletree.md).[removeEventListener](_react_immutable_tree_.immutabletree.md#removeeventlistener)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5432*

Removes the event listener in target's event listener list with the same type, callback, and options.

#### Parameters:

Name | Type |
------ | ------ |
`type` | string |
`callback` | EventListenerOrEventListenerObject \| null |
`options?` | EventListenerOptions \| boolean |

**Returns:** void

___

### serialize

▸ **serialize**(): [DefaultSerializedTreeNode](../interfaces/_react_immutable_tree_.defaultserializedtreenode.md)\<DataType>

*Defined in [src/react-immutable-tree.ts:454](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L454)*

Transform the sub-tree into the default serialized format:
`{ data, children }`.

**Returns:** [DefaultSerializedTreeNode](../interfaces/_react_immutable_tree_.defaultserializedtreenode.md)\<DataType>

▸ **serialize**\<SerializedType>(`serializer`: [Serializer](../modules/_react_immutable_tree_.md#serializer)\<SerializedType, DataType>): SerializedType

*Defined in [src/react-immutable-tree.ts:461](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L461)*

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

### deserialize

▸ `Static`**deserialize**\<DataType>(`rootSerialized`: [DefaultSerializedTreeNode](../interfaces/_react_immutable_tree_.defaultserializedtreenode.md)\<DataType>): [ImmutableTree](_react_immutable_tree_.immutabletree.md)\<DataType>

*Defined in [src/react-immutable-tree.ts:473](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L473)*

Given a JS object representing your root node in the default serialized
format, returns an ImmutableTree representing the data.

#### Type parameters:

Name | Description |
------ | ------ |
`DataType` | The type of the data object associated with a given node.  |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`rootSerialized` | [DefaultSerializedTreeNode](../interfaces/_react_immutable_tree_.defaultserializedtreenode.md)\<DataType> | A JS object representing your root node in `{ data, children }` format. |

**Returns:** [ImmutableTree](_react_immutable_tree_.immutabletree.md)\<DataType>

▸ `Static`**deserialize**\<SerializedType, DataType>(`rootSerialized`: SerializedType, `deserializer`: [Deserializer](../modules/_react_immutable_tree_.md#deserializer)\<SerializedType, DataType>): [ImmutableTree](_react_immutable_tree_.immutabletree.md)\<DataType>

*Defined in [src/react-immutable-tree.ts:485](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L485)*

Given a JS object representing your root node, and a function that can
convert a node into a `{ data, children }` tuple, returns an ImmutableTree
representing the data.

#### Type parameters:

Name | Description |
------ | ------ |
`SerializedType` | Your serialization format. |
`DataType` | The type of the data object associated with a given node.  |

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`rootSerialized` | SerializedType | A JS object representing your root node in your serialization format. |
`deserializer` | [Deserializer](../modules/_react_immutable_tree_.md#deserializer)\<SerializedType, DataType> | A function that can turn data in your serialization format into a `{ data, children }` tuple. |

**Returns:** [ImmutableTree](_react_immutable_tree_.immutabletree.md)\<DataType>

___

### deserializeHelper

▸ `Static` `Private`**deserializeHelper**\<SerializedType, DataType>(`parent`: [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType>, `pojo`: SerializedType, `deserializer`: [Deserializer](../modules/_react_immutable_tree_.md#deserializer)\<SerializedType, DataType>): void

*Defined in [src/react-immutable-tree.ts:496](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L496)*

#### Type parameters:

Name |
------ |
`SerializedType` |
`DataType` |

#### Parameters:

Name | Type |
------ | ------ |
`parent` | [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> |
`pojo` | SerializedType |
`deserializer` | [Deserializer](../modules/_react_immutable_tree_.md#deserializer)\<SerializedType, DataType> |

**Returns:** void