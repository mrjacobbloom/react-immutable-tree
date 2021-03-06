import Mocha from 'mocha';
import sinon from 'sinon';
import chai from 'chai';
const expect = chai.expect;
import reactHooks from '@testing-library/react-hooks'
const { renderHook, act } = reactHooks;

import { pojoData1, pojoData1Deserializer } from './testData.js';
import { ImmutableTree } from '../dist/react-immutable-tree.js';
import { useTree } from '../dist/react-immutable-tree-hook.js';

describe('useTree', () => {
  /** @type {ImmutableTree<{ description: string; time: { start: number; end: number; } }>} */let myTree;
  beforeEach(() => {
    myTree = ImmutableTree.deserialize(pojoData1(), pojoData1Deserializer);
  });

  it('Works as expected with tree generator function', () => {
    const treeGenerator = sinon.stub().returns(myTree);
    const { result, rerender } = renderHook(() => useTree(treeGenerator));

    expect(result.current).to.deep.equal([myTree.root, myTree]);
    rerender();
    expect(result.current).to.deep.equal([myTree.root, myTree]);

    expect(treeGenerator.callCount).to.equal(1);
  });

  it('Should run on update node', () => {
    const { result } = renderHook(() => useTree(myTree));

    const [oldRoot, oldTree] = result.current;

    act(() => {
      result.current[0].children[0].setData({ description: 'UPDATED DESCRIPTION' });
    });

    expect(result.current[0]).to.not.equal(oldRoot);
    expect(result.current[1]).to.equal(oldTree);
  });

  it('Should run on create node', () => {
    const { result } = renderHook(() => useTree(myTree));

    const [oldRoot, oldTree] = result.current;

    act(() => {
      result.current[0].children[0].insertChildWithData({ description: 'NEW DESCRIPTION' });
    });

    expect(result.current[0]).to.not.equal(oldRoot);
    expect(result.current[1]).to.equal(oldTree);
  });

  it('Should run on move node', () => {
    const { result } = renderHook(() => useTree(myTree));

    const [oldRoot, oldTree] = result.current;

    act(() => {
      result.current[0].children[0].moveTo(result.current[0].children[1]);
    });

    expect(result.current[0]).to.not.equal(oldRoot);
    expect(result.current[1]).to.equal(oldTree);
  });

  it('Should run on remove node', () => {
    const { result } = renderHook(() => useTree(myTree));

    const [oldRoot, oldTree] = result.current;

    act(() => {
      result.current[0].children[0].remove();
    });

    expect(result.current[0]).to.not.equal(oldRoot);
    expect(result.current[1]).to.equal(oldTree);
  });

  it('Should add event listener on mount and remove event listener on unmount', () => {
    const ael = sinon.spy(myTree, 'addEventListener');
    const rel = sinon.spy(myTree, 'removeEventListener');
    const { unmount, rerender } = renderHook(() => useTree(myTree));

    expect(ael.callCount).to.equal(1);
    expect(rel.callCount).to.equal(0);

    rerender();

    expect(ael.callCount).to.equal(1);
    expect(rel.callCount).to.equal(0);

    unmount();

    expect(ael.callCount).to.equal(1);
    expect(rel.callCount).to.equal(1);
  });
});