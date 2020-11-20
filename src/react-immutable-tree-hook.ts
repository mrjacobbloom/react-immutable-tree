/**
 * This module contains all React-specific functionality. It's
 * separate because it has `react` is a dependency, which is not required for
 * the core module. It can be accessed by importing `react-immutable-tree/hook`.
 * @packageDocumentation
 */

import { useState, useEffect } from 'react';
import type { ImmutableTree, ImmutableTreeNode, ImmutableTreeEvent } from './react-immutable-tree';

/**
 * A React hook. Given an `ImmutableTree`, returns its root node and triggers a
 * re-render when the tree updates.
 * @param treeOrTreeGenerator Your `ImmutableTree`, or a function that will run
 * one time to generate your `ImmutableTree`.
 * @typeParam DataType The type of the data object associated with a given node.
 * @returns The up-to-date root node of the tree, and the tree
 * @example
 * ```jsx
 * const NodeView = React.memo(({ node }) => (
 *   <li>
 *     {node.data.counter}
 *     <Button onClick={() => node.remove()}>Delete this node</Button>
 *     <Button onClick={() => node.setData({ counter: 0 })}>Reset this node</Button>
 *     <Button onClick={() => node.updateData(oldData => ({ counter: oldData.counter + 1 }))}>Increment this node</Button>
 *     <ul>
 *       {node.children.map(child => (
 *         <NodeView node={child} key={child.data.id}/>
 *       ))}
 *     </ul>
 *   </li>
 * ));
 * 
 * import { useTree } from 'react-immutable-tree/hook';
 * const App = ({tree}) => {
 *   const [rootNode] = useTree(tree);
 * 
 *   return (
 *     <ul>
 *       <NodeView node={rootNode}/>
 *     </ul>
 *   );
 * };
 * 
 * ReactDOM.render(<App tree={myTree} />, document.getElementById('app'));
 * ```
 * 
 * useTree can also accept a "tree generator" function: A function that runs
 * once to initialize the tree.
 * 
 * ```jsx
 * import { ImmutableTree } from 'react-immutable-tree';
 * import { useTree } from 'react-immutable-tree/hook';
 * const App = () => {
 *   const [rootNode, tree] = useTree(() => {
 *     return ImmutableTree.deserialize(MY_SERIALIZED_DATA);
 *     // or anything else required to build the tree, as long as an ImmutableTree is returned
 *   });
 * 
 *   return (
 *     <ul>
 *       <NodeView node={rootNode}/>
 *     </ul>
 *   );
 * };
 * 
 * ReactDOM.render(<App />, document.getElementById('app'));
 * ```
 */
export function useTree<DataType>(treeOrTreeGenerator: ImmutableTree<DataType> | (() => ImmutableTree<DataType>)): [ImmutableTreeNode<DataType> | null, ImmutableTree<DataType> | null] {
  const defaultTree = typeof treeOrTreeGenerator === 'function' ? null : treeOrTreeGenerator;
  const [tree, setTree] = useState<ImmutableTree<DataType> | null>(defaultTree);
  const [rootNode, setRootNode] = useState(tree ? tree.root : null);

  useEffect(() => {
    if (tree) {
      // If our tree exists in state, attach handlers
      const handleRootChange: EventListener = (ev: Event | ImmutableTreeEvent<DataType>) => {
        if ('rootNode' in ev) { // felt less expensive than a type guard function, idk
          setRootNode(ev.rootNode);
        }
      }
  
      tree.addEventListener('immutabletree.changed', handleRootChange);
  
      return () => {
        tree.removeEventListener('immutabletree.changed', handleRootChange);
      };
    } else {
      // If our tree does not exist in state, we were passed a treeGenerator. Run it at store said tree
      const tree = (treeOrTreeGenerator as () => ImmutableTree<DataType>)();
      setTree(tree);
      setRootNode(tree.root);
    }
  }, [tree]);

  return [rootNode, tree];
}