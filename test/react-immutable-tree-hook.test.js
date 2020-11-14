import Mocha from 'mocha';
import sinon from 'sinon';
import chai from 'chai';
const expect = chai.expect;
import reactHooks from '@testing-library/react-hooks'
const { renderHook, act } = reactHooks;

import { pojoData1, pojoData1Parser } from './testData.js';
import { ImmutableTree } from '../dist/react-immutable-tree.js';
import { useTree } from '../dist/react-immutable-tree-hook.js';

describe('useTree', () => {
  it('Should run on update node', () => {
    const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
    const { result } = renderHook(() => useTree(myTree));

    const oldRoot = result.current;

    act(() => {
      result.current.children[0].setData({ description: 'UPDATED DESCRIPTION' });
    });

    expect(result.current).to.not.equal(oldRoot);
  });

  it('Should run on create node', () => {
    const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
    const { result } = renderHook(() => useTree(myTree));

    const oldRoot = result.current;

    act(() => {
      result.current.children[0].insertChildWithData({ description: 'NEW DESCRIPTION' });
    });

    expect(result.current).to.not.equal(oldRoot);
  });

  it('Should run on move node', () => {
    const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
    const { result } = renderHook(() => useTree(myTree));

    const oldRoot = result.current;

    act(() => {
      result.current.children[0].moveTo(result.current.children[1]);
    });

    expect(result.current).to.not.equal(oldRoot);
  });

  it('Should run on remove node', () => {
    const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
    const { result } = renderHook(() => useTree(myTree));

    const oldRoot = result.current;

    act(() => {
      result.current.children[0].remove();
    });

    expect(result.current).to.not.equal(oldRoot);
  });

  it('Should add event listeners on mount and remove event listeners on unmount', () => {
    const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
    const ael = sinon.spy(myTree, 'addEventListener');
    const rel = sinon.spy(myTree, 'removeEventListener');
    const { unmount } = renderHook(() => useTree(myTree));

    expect(ael.callCount).to.equal(4);
    expect(rel.callCount).to.equal(0);

    unmount();

    expect(ael.callCount).to.equal(4);
    expect(rel.callCount).to.equal(4);
  });
});