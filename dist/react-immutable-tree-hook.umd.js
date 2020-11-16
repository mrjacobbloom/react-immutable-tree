(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReactImmutableTreeHook = {}, global.React));
}(this, (function (exports, react) { 'use strict';

  function useTree(tree) {
      const [rootNode, setRootNode] = react.useState(tree.root);
      react.useEffect(() => {
          const handleRootChange = (ev) => {
              if ('rootNode' in ev) { // felt less expensive than a type guard function, idk
                  setRootNode(ev.rootNode);
              }
          };
          tree.addEventListener('immutabletree.updatenode', handleRootChange);
          tree.addEventListener('immutabletree.insertchild', handleRootChange);
          tree.addEventListener('immutabletree.movenode', handleRootChange);
          tree.addEventListener('immutabletree.removenode', handleRootChange);
          return () => {
              tree.removeEventListener('immutabletree.updatenode', handleRootChange);
              tree.removeEventListener('immutabletree.insertchild', handleRootChange);
              tree.removeEventListener('immutabletree.movenode', handleRootChange);
              tree.removeEventListener('immutabletree.removenode', handleRootChange);
          };
      });
      return rootNode;
  }

  exports.useTree = useTree;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
