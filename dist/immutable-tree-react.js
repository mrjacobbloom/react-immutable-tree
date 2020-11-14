import { useState, useEffect } from 'react';
export function useTree(tree) {
    const [rootNode, setRootNode] = useState(tree.root);
    useEffect(() => {
        function handleRootChange() {
            setRootNode(tree.root);
        }
        tree.addEventListener('immutabletree.updatenode', handleRootChange);
        tree.addEventListener('immutabletree.createnode', handleRootChange);
        tree.addEventListener('immutabletree.deletenode', handleRootChange);
        return () => {
            tree.removeEventListener('immutabletree.updatenode', handleRootChange);
            tree.removeEventListener('immutabletree.createnode', handleRootChange);
            tree.removeEventListener('immutabletree.deletenode', handleRootChange);
        };
    });
    return rootNode;
}
