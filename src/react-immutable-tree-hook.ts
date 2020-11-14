import { useState, useEffect } from 'react';
import type { ImmutableTree, ImmutableTreeEvent } from './react-immutable-tree';

export function useTree<T>(tree: ImmutableTree<T>): ImmutableTree<T>['root'] {
  const [rootNode, setRootNode] = useState(tree.root);

  useEffect(() => {
    const handleRootChange: EventListener = (ev: Event | ImmutableTreeEvent<T>) => {
      if ('rootNode' in ev) { // felt less expensive than a type guard function, idk
        setRootNode(ev.rootNode);
      }
    }

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