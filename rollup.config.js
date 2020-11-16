import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: './src/react-immutable-tree.ts',
    output: {
      file: './dist/react-immutable-tree.js',
      format: 'esm',
    },
    plugins: [typescript()],
  },
  {
    input: './src/react-immutable-tree-hook.ts',
    output: {
      file: './dist/react-immutable-tree-hook.js',
      format: 'esm',
    },
    plugins: [typescript()],
  },
  {
    input: './src/react-immutable-tree.ts',
    output: {
      file: './dist/react-immutable-tree.umd.js',
      format: 'umd',
      name: 'ReactImmutableTree',
    },
    plugins: [typescript()],
  },
  {
    input: './src/react-immutable-tree-hook.ts',
    output: {
      globals: {
        'react': 'React',
      },
      file: './dist/react-immutable-tree-hook.umd.js',
      format: 'umd',
      name: 'ReactImmutableTreeHook',
    },
    plugins: [typescript()],
  },
];
