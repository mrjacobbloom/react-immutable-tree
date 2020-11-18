(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReactImmutableTreeHook = {}, global.React));
}(this, (function (exports, react) { 'use strict';

  /**
   * This module contains all React-specific functionality. It's
   * separate because it has `react` is a dependency, which is not required for
   * the core module. It can be accessed by importing `react-immutable-tree/hook`.
   * @packageDocumentation
   */
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
  function useTree(tree) {
      const [rootNode, setRootNode] = react.useState(tree.root);
      react.useEffect(() => {
          const handleRootChange = (ev) => {
              if ('rootNode' in ev) { // felt less expensive than a type guard function, idk
                  setRootNode(ev.rootNode);
              }
          };
          tree.addEventListener('immutabletree.changed', handleRootChange);
          return () => {
              tree.removeEventListener('immutabletree.changed', handleRootChange);
          };
      });
      return rootNode;
  }

  exports.useTree = useTree;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
