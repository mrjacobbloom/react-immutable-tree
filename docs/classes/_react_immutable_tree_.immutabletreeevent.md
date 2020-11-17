**[react-immutable-tree](../README.md)**

> [Globals](../globals.md) / ["react-immutable-tree"](../modules/_react_immutable_tree_.md) / ImmutableTreeEvent

# Class: ImmutableTreeEvent\<DataType>

The `Event` subtype that `ImmutableTree` dispatches

## Type parameters

Name | Description |
------ | ------ |
`DataType` | The type of the data object associated with a given node.  |

## Hierarchy

* [Event](_react_immutable_tree_.immutabletreeevent.md#event)

  ↳ **ImmutableTreeEvent**

## Index

### Constructors

* [constructor](_react_immutable_tree_.immutabletreeevent.md#constructor)

### Properties

* [AT\_TARGET](_react_immutable_tree_.immutabletreeevent.md#at_target)
* [BUBBLING\_PHASE](_react_immutable_tree_.immutabletreeevent.md#bubbling_phase)
* [CAPTURING\_PHASE](_react_immutable_tree_.immutabletreeevent.md#capturing_phase)
* [NONE](_react_immutable_tree_.immutabletreeevent.md#none)
* [bubbles](_react_immutable_tree_.immutabletreeevent.md#bubbles)
* [cancelBubble](_react_immutable_tree_.immutabletreeevent.md#cancelbubble)
* [cancelable](_react_immutable_tree_.immutabletreeevent.md#cancelable)
* [composed](_react_immutable_tree_.immutabletreeevent.md#composed)
* [currentTarget](_react_immutable_tree_.immutabletreeevent.md#currenttarget)
* [defaultPrevented](_react_immutable_tree_.immutabletreeevent.md#defaultprevented)
* [eventPhase](_react_immutable_tree_.immutabletreeevent.md#eventphase)
* [isTrusted](_react_immutable_tree_.immutabletreeevent.md#istrusted)
* [returnValue](_react_immutable_tree_.immutabletreeevent.md#returnvalue)
* [rootNode](_react_immutable_tree_.immutabletreeevent.md#rootnode)
* [srcElement](_react_immutable_tree_.immutabletreeevent.md#srcelement)
* [target](_react_immutable_tree_.immutabletreeevent.md#target)
* [targetNode](_react_immutable_tree_.immutabletreeevent.md#targetnode)
* [timeStamp](_react_immutable_tree_.immutabletreeevent.md#timestamp)
* [type](_react_immutable_tree_.immutabletreeevent.md#type)
* [Event](_react_immutable_tree_.immutabletreeevent.md#event)

### Methods

* [composedPath](_react_immutable_tree_.immutabletreeevent.md#composedpath)
* [initEvent](_react_immutable_tree_.immutabletreeevent.md#initevent)
* [preventDefault](_react_immutable_tree_.immutabletreeevent.md#preventdefault)
* [stopImmediatePropagation](_react_immutable_tree_.immutabletreeevent.md#stopimmediatepropagation)
* [stopPropagation](_react_immutable_tree_.immutabletreeevent.md#stoppropagation)

## Constructors

### constructor

\+ **new ImmutableTreeEvent**(`type`: [ImmutableTreeEventType](../modules/_react_immutable_tree_.md#immutabletreeeventtype), `targetNode`: [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null, `rootNode`: [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null): [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md)

*Defined in [src/react-immutable-tree.ts:21](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L21)*

#### Parameters:

Name | Type |
------ | ------ |
`type` | [ImmutableTreeEventType](../modules/_react_immutable_tree_.md#immutabletreeeventtype) |
`targetNode` | [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null |
`rootNode` | [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null |

**Returns:** [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md)

## Properties

### AT\_TARGET

• `Readonly` **AT\_TARGET**: number

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[AT_TARGET](_react_immutable_tree_.immutabletreeevent.md#at_target)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5347*

___

### BUBBLING\_PHASE

• `Readonly` **BUBBLING\_PHASE**: number

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[BUBBLING_PHASE](_react_immutable_tree_.immutabletreeevent.md#bubbling_phase)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5348*

___

### CAPTURING\_PHASE

• `Readonly` **CAPTURING\_PHASE**: number

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[CAPTURING_PHASE](_react_immutable_tree_.immutabletreeevent.md#capturing_phase)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5349*

___

### NONE

• `Readonly` **NONE**: number

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[NONE](_react_immutable_tree_.immutabletreeevent.md#none)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5350*

___

### bubbles

• `Readonly` **bubbles**: boolean

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[bubbles](_react_immutable_tree_.immutabletreeevent.md#bubbles)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5289*

Returns true or false depending on how event was initialized. True if event goes through its target's ancestors in reverse tree order, and false otherwise.

___

### cancelBubble

•  **cancelBubble**: boolean

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[cancelBubble](_react_immutable_tree_.immutabletreeevent.md#cancelbubble)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5290*

___

### cancelable

• `Readonly` **cancelable**: boolean

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[cancelable](_react_immutable_tree_.immutabletreeevent.md#cancelable)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5294*

Returns true or false depending on how event was initialized. Its return value does not always carry meaning, but true can indicate that part of the operation during which event was dispatched, can be canceled by invoking the preventDefault() method.

___

### composed

• `Readonly` **composed**: boolean

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[composed](_react_immutable_tree_.immutabletreeevent.md#composed)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5298*

Returns true or false depending on how event was initialized. True if event invokes listeners past a ShadowRoot node that is the root of its target, and false otherwise.

___

### currentTarget

• `Readonly` **currentTarget**: [EventTarget](_react_immutable_tree_.immutabletree.md#eventtarget) \| null

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[currentTarget](_react_immutable_tree_.immutabletreeevent.md#currenttarget)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5302*

Returns the object whose event listener's callback is currently being invoked.

___

### defaultPrevented

• `Readonly` **defaultPrevented**: boolean

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[defaultPrevented](_react_immutable_tree_.immutabletreeevent.md#defaultprevented)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5306*

Returns true if preventDefault() was invoked successfully to indicate cancelation, and false otherwise.

___

### eventPhase

• `Readonly` **eventPhase**: number

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[eventPhase](_react_immutable_tree_.immutabletreeevent.md#eventphase)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5310*

Returns the event's phase, which is one of NONE, CAPTURING_PHASE, AT_TARGET, and BUBBLING_PHASE.

___

### isTrusted

• `Readonly` **isTrusted**: boolean

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[isTrusted](_react_immutable_tree_.immutabletreeevent.md#istrusted)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5314*

Returns true if event was dispatched by the user agent, and false otherwise.

___

### returnValue

•  **returnValue**: boolean

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[returnValue](_react_immutable_tree_.immutabletreeevent.md#returnvalue)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5315*

___

### rootNode

•  **rootNode**: [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null

*Defined in [src/react-immutable-tree.ts:22](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L22)*

___

### srcElement

• `Readonly` **srcElement**: [EventTarget](_react_immutable_tree_.immutabletree.md#eventtarget) \| null

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[srcElement](_react_immutable_tree_.immutabletreeevent.md#srcelement)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5317*

**`deprecated`** 

___

### target

• `Readonly` **target**: [EventTarget](_react_immutable_tree_.immutabletree.md#eventtarget) \| null

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[target](_react_immutable_tree_.immutabletreeevent.md#target)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5321*

Returns the object to which event is dispatched (its target).

___

### targetNode

•  **targetNode**: [ImmutableTreeNode](_react_immutable_tree_.immutabletreenode.md)\<DataType> \| null

*Defined in [src/react-immutable-tree.ts:22](https://github.com/mrjacobbloom/react-immutable-tree/blob/90d8872/src/react-immutable-tree.ts#L22)*

___

### timeStamp

• `Readonly` **timeStamp**: number

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[timeStamp](_react_immutable_tree_.immutabletreeevent.md#timestamp)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5325*

Returns the event's timestamp as the number of milliseconds measured relative to the time origin.

___

### type

• `Readonly` **type**: string

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[type](_react_immutable_tree_.immutabletreeevent.md#type)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5329*

Returns the type of event, e.g. "click", "hashchange", or "submit".

___

### Event

▪ `Static` **Event**: { constructor: (type: string, eventInitDict?: EventInit) => [Event](_react_immutable_tree_.immutabletreeevent.md#event) ; AT_TARGET: number ; BUBBLING_PHASE: number ; CAPTURING_PHASE: number ; NONE: number ; prototype: [Event](_react_immutable_tree_.immutabletreeevent.md#event)  }

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5353*

#### Type declaration:

Name | Type |
------ | ------ |
`constructor` | (type: string, eventInitDict?: EventInit) => [Event](_react_immutable_tree_.immutabletreeevent.md#event) |
`AT_TARGET` | number |
`BUBBLING_PHASE` | number |
`CAPTURING_PHASE` | number |
`NONE` | number |
`prototype` | [Event](_react_immutable_tree_.immutabletreeevent.md#event) |

## Methods

### composedPath

▸ **composedPath**(): [EventTarget](_react_immutable_tree_.immutabletree.md#eventtarget)[]

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[composedPath](_react_immutable_tree_.immutabletreeevent.md#composedpath)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5333*

Returns the invocation target objects of event's path (objects on which listeners will be invoked), except for any nodes in shadow trees of which the shadow root's mode is "closed" that are not reachable from event's currentTarget.

**Returns:** [EventTarget](_react_immutable_tree_.immutabletree.md#eventtarget)[]

___

### initEvent

▸ **initEvent**(`type`: string, `bubbles?`: undefined \| false \| true, `cancelable?`: undefined \| false \| true): void

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[initEvent](_react_immutable_tree_.immutabletreeevent.md#initevent)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5334*

#### Parameters:

Name | Type |
------ | ------ |
`type` | string |
`bubbles?` | undefined \| false \| true |
`cancelable?` | undefined \| false \| true |

**Returns:** void

___

### preventDefault

▸ **preventDefault**(): void

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[preventDefault](_react_immutable_tree_.immutabletreeevent.md#preventdefault)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5338*

If invoked when the cancelable attribute value is true, and while executing a listener for the event with passive set to false, signals to the operation that caused event to be dispatched that it needs to be canceled.

**Returns:** void

___

### stopImmediatePropagation

▸ **stopImmediatePropagation**(): void

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[stopImmediatePropagation](_react_immutable_tree_.immutabletreeevent.md#stopimmediatepropagation)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5342*

Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects.

**Returns:** void

___

### stopPropagation

▸ **stopPropagation**(): void

*Inherited from [ImmutableTreeEvent](_react_immutable_tree_.immutabletreeevent.md).[stopPropagation](_react_immutable_tree_.immutabletreeevent.md#stoppropagation)*

*Defined in node_modules/typescript/lib/lib.dom.d.ts:5346*

When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object.

**Returns:** void
