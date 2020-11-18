/**
 * This module contains all React-specific functionality. It's
 * separate because `react` is a dependency. It can be accessed my importing
 * `react-immutable-tree/hook`.
 * @packageDocumentation
 */
import type { ImmutableTree, ImmutableTreeNode } from './react-immutable-tree';
/**
 * A React hook. Given an `ImmutableTree`, returns its root node and triggers a
 * re-render when the tree updates.
 * @param tree Your `ImmutableTree`
 * @typeParam DataType The type of the data object associated with a given node.
 * @returns The up-to-date root node of the tree
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
 *   const rootNode = useTree(tree);
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
 */
export declare function useTree<DataType>(tree: ImmutableTree<DataType>): ImmutableTreeNode<DataType> | null;
