import { useState, useEffect } from 'react';
export function useTree(tree) {
    const [rootNode, setRootNode] = useState(tree.root);
    useEffect(() => {
        function handleRootChange() {
            setRootNode(tree.root);
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
