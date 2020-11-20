import Mocha from 'mocha';
import sinon from 'sinon';
import chai from 'chai';
const expect = chai.expect;

import {
  pojoData1,
  pojoData1Deserializer,
  pojoData1Serializer,
  pojoData1BeforeUpdateModifier,
  pojoData2
} from './testData.js';
import { ImmutableTree, ImmutableTreeNode } from '../dist/react-immutable-tree.js';

describe('ImmutableTree', () => {
  /** @type {ImmutableTree<{ description: string; time: { start: number; end: number; } }>} */let myTree;
  beforeEach(() => {
    myTree = ImmutableTree.deserialize(pojoData1(), pojoData1Deserializer);
  });

  describe('#root', () => {
    it('Getting returns null before root is set', () => {
      const myTree = new ImmutableTree();
      expect(myTree.root).to.be.null;
    });
    it('Getting returns root TreeNode once set', () => {
      const myTree = new ImmutableTree();
      myTree.addRootWithData({ value: 5 });
      expect(myTree.root).to.exist;
      expect(myTree.root.data).to.deep.equal({ value: 5 });
    });
    it('Setting throws', () => {
      expect(() => {
        const myTree = new ImmutableTree();
        myTree.root = 'THIS VALUE DOES NOT MATTER BECAUSE SETTING THIS PORPERTY IS ILLEGAL';
      }).to.throw();
    });
  });
  describe('#nodeWillUpdate', () => {
    it('Initially set to null', () => {
      expect(myTree.nodeWillUpdate).to.be.null;
    });

    it('Does not generate any excess events', () => {
      const beforeUpdateModifier = sinon.stub().callsFake(pojoData1BeforeUpdateModifier);
      const handler1 = sinon.stub();
      const handler2 = sinon.stub();
      myTree.addEventListener('immutabletree.updatenode', handler1);
      myTree.addEventListener('immutabletree.insertchild', handler2);
      myTree.nodeWillUpdate = beforeUpdateModifier;
      myTree.root.children[0].children[0].insertChildWithData({ description: 'Foo', time: { start: 0, end: 25 } });
      expect(handler1.callCount).to.equal(0);
      expect(handler2.callCount).to.equal(1);
    });
    it('Works as expected with insertRootWithData', () => {
      const beforeUpdateModifier = sinon.stub().returns({ value: 'INJECTED DATA OBJECT' });
      const myTree = new ImmutableTree();
      myTree.nodeWillUpdate = beforeUpdateModifier;
      myTree.addRootWithData({ value: 'ORIGINAL DATA OBJECT' });
      expect(beforeUpdateModifier.callCount).to.equal(1);
      expect(myTree.root.data).to.deep.equal({ value: 'INJECTED DATA OBJECT' });
    });
    it('Works as expected with setData', () => {
      const beforeUpdateModifier = sinon.stub().callsFake(pojoData1BeforeUpdateModifier);
      myTree.nodeWillUpdate = beforeUpdateModifier;
      myTree.root.children[0].children[0].children[0].children[0].children[0].children[0].children[0].setData({ description: 'Foo', time: { start: 0, end: 25 } });
      expect(beforeUpdateModifier.callCount).to.equal(8);
      expect(myTree.root.data.time).to.deep.equal({ start: 109.7, end: 137.70999999999998 });
    });
    it('Works as expected with updateData', () => {
      const beforeUpdateModifier = sinon.stub().callsFake(pojoData1BeforeUpdateModifier);
      myTree.nodeWillUpdate = beforeUpdateModifier;
      myTree.root.children[0].children[0].children[0].children[0].children[0].children[0].children[0].updateData(oldData => ({ ...oldData, time: { start: 0, end: 25 } }));
      expect(beforeUpdateModifier.callCount).to.equal(8);
      expect(myTree.root.data.time).to.deep.equal({ start: 109.7, end: 137.70999999999998 });
    });
    it('Works as expected with insertChildWithData', () => {
      const beforeUpdateModifier = sinon.stub().callsFake(pojoData1BeforeUpdateModifier);
      myTree.nodeWillUpdate = beforeUpdateModifier;
      myTree.root.children[0].children[0].insertChildWithData({ description: 'Foo', time: { start: 0, end: 25 } });
      expect(beforeUpdateModifier.callCount).to.equal(4);
      expect(myTree.root.data.time).to.deep.equal({ start: 110.2, end: 139.20999999999998 });
    });
    it('Works as expected with dangerouslyMutablyInsertChildWithData', () => {
      const beforeUpdateModifier = sinon.stub().callsFake(pojoData1BeforeUpdateModifier);
      myTree.nodeWillUpdate = beforeUpdateModifier;
      myTree.root.children[0].children[0].dangerouslyMutablyInsertChildWithData({ description: 'Foo', time: { start: 0, end: 25 } });
      expect(beforeUpdateModifier.callCount).to.equal(1); // Only runs on new node since parents aren't replaced
      expect(myTree.root.data.time).to.deep.equal({ start: 110.2, end: 114.21 });
    });
    it('Works as expected with moveTo (only runs on ancestors)', () => {
      const beforeUpdateModifier = sinon.stub().callsFake(pojoData1BeforeUpdateModifier);
      myTree.nodeWillUpdate = beforeUpdateModifier;
      myTree.root.children[0].children[0].remove();
      expect(beforeUpdateModifier.callCount).to.equal(2);
      expect(myTree.root.data.time).to.deep.equal({ start: 109.7, end: 112.71 });
    });
    it('Works as expected with moveTo (only runs on ancestors)', () => {
      const beforeUpdateModifier = sinon.stub().callsFake(pojoData1BeforeUpdateModifier);
      myTree.nodeWillUpdate = beforeUpdateModifier;
      myTree.root.children[0].children[0].moveTo(myTree.root.children[1]);
      expect(beforeUpdateModifier.callCount).to.equal(4); // someday this'll change to 3
      expect(myTree.root.children[0].data.time).to.deep.equal({ start: 0, end: 0 });
      expect(myTree.root.children[1].data.time).to.deep.equal({ start: 109.7, end: 113.71 });
    });
  });
  describe('#addRootWithData()', () => {
    it('Works as expected', () => {
      const myTree = new ImmutableTree();
      myTree.addRootWithData({ value: 5 });
      expect(myTree.root).to.exist;
      expect(myTree.root.data).to.deep.equal({ value: 5 });
    });
    it('Dispatches immutabletree.insertchild and immutabletree.changed', () => {
      const myTree = new ImmutableTree();
      const stub1 = sinon.stub();
      const stub2 = sinon.stub();
      myTree.addEventListener('immutabletree.insertchild', stub1);
      myTree.addEventListener('immutabletree.changed', stub2)
      const root = myTree.addRootWithData({ value: 5 });
      expect(stub1.callCount).to.equal(1);
      expect(stub2.callCount).to.equal(1);
      expect(stub1.args[0][0].targetNode).to.be.null;
      expect(stub1.args[0][0].rootNode).to.equal(root);
      expect(stub2.args[0][0].targetNode).to.be.null;
      expect(stub2.args[0][0].rootNode).to.equal(root);
    });
  });
  describe('#dangerouslyMutablyAddRootWithData()', () => {
    it('Works as expected', () => {
      const myTree = new ImmutableTree();
      myTree.dangerouslyMutablyAddRootWithData({ value: 5 });
      expect(myTree.root).to.exist;
      expect(myTree.root.data).to.deep.equal({ value: 5 });
    });
    it('Does not dispatch any events', () => {
      const myTree = new ImmutableTree();
      const stub1 = sinon.stub();
      const stub2 = sinon.stub();
      myTree.addEventListener('immutabletree.insertchild', stub1);
      myTree.addEventListener('immutabletree.changed', stub2)
      const root = myTree.dangerouslyMutablyAddRootWithData({ value: 5 });
      expect(stub1.callCount).to.equal(0);
      expect(stub2.callCount).to.equal(0);
    });
  });
  describe('#findOne()', () => {
    it('Returns matching node if exactly 1 exists', () => {
      const node = myTree.findOne(({ description }) => description === 'Put pan on stove');
      expect(node).to.exist;
      expect(node.data).to.deep.equal({ "description": "Put pan on stove", "time": { "start": 36, "end": 36 } });
    });
    it('Returns first matching node if more than 1 exist', () => {
      const node = myTree.findOne(({ description }) => description.includes('seed'));
      expect(node).to.exist;
      expect(node.data).to.deep.equal({ "description": "Buy the seeds", "time": { "start": 0.5, "end": 1.5 } });
    });
    it('Returns null if no nodes match', () => {
      const node = myTree.findOne(({ description }) => description === 'NO NODE HAS THIS DESCRIPTION');
      expect(node).to.be.null;
    });
  });
  describe('#serialize()', () => {
    it('Works as expected without deserializer', () => {
      const myTree = ImmutableTree.deserialize(pojoData2());
      const serialized = myTree.serialize();
      expect(serialized).to.deep.equal(pojoData2());
    });
    it('Works as expected with deserializer', () => {
      const serialized = myTree.serialize(pojoData1Serializer);
      expect(serialized).to.deep.equal(pojoData1());
    });
  });
  describe('#print', () => {
    it('Works as expected', () => {
      const consoleStub = sinon.stub(console, 'log');
      myTree.print();
      consoleStub.restore();
      expect(consoleStub.callCount).to.equal(19);
      expect(consoleStub.args[0][0]).to.equal('{"time":{"start":110.2,"end":114.21},"description":"Total"}');
      expect(consoleStub.args[1][0]).to.equal('  {"time":{"start":0.5,"end":1.5},"description":"Grow The Plants"}');
    });
  });
  describe('.deserialize()', () => {
    it('Works as expected without deserializer', () => {
      const myTree = ImmutableTree.deserialize(pojoData2());
      expect(myTree.root.data).to.deep.equal({ name: 'Bob' });
      expect(myTree.root.children).to.have.length(3);
      expect(myTree.root.children[0].data).to.deep.equal({ name: 'Bob Jr.' });
    });
    it('Works as expected with deserializer', () => {
      const myTree = ImmutableTree.deserialize(pojoData1(), pojoData1Deserializer);
      expect(myTree.root.data).to.deep.equal({ "description": "Total", "time": { "start": 110.2, "end": 114.21 } });
      expect(myTree.root.children).to.have.length(3);
      expect(myTree.root.children[0].data.description).to.equal('Grow The Plants');
      expect(myTree.root.children[0].children).to.have.length(1);
      expect(myTree.root.children[0].children[0].children[0].children[0].children[0].children[0].children[0].data.description).to.equal('Wake up');
    });
  });
});

describe('ImmutableTreeNode', () => {
  /** @type {ImmutableTree<{ description: string; time: { start: number; end: number; } }>} */let myTree;
  beforeEach(() => {
    myTree = ImmutableTree.deserialize(pojoData1(), pojoData1Deserializer);
  });

  describe('constructor', () => {
    it('Throws an error', () => {
      expect(() => {
        new ImmutableTreeNode(null, myTree, null, { title: 'MY NEW NODE' }, []);
      }).to.throw('Illegal construction of ImmutableTreeNode');
    })
  });

  describe('#isStale', () => {
    it('Getting for a non-stale node returns false', () => {
      expect(myTree.root.isStale).to.be.false;
    });
    it('Getting for a non-stale node returns false', () => {
      const node = myTree.root.children[0];
      node.remove();
      expect(node.isStale).to.be.true;
    });
    it('Setting throws', () => {
      expect(() => {
        myTree.root.isStale = 'THIS VALUE DOES NOT MATTER BECAUSE SETTING THIS PORPERTY IS ILLEGAL';
      }).to.throw();
    });
  });
  describe('#children', () => {
    it('Getting on a non-stale node works as expected', () => {
      expect(myTree.root.data).to.deep.equal({ "description": "Total", "time": { "start": 110.2, "end": 114.21 } });
      expect(myTree.root.children).to.have.length(3);
      expect(myTree.root.children[0].data.description).to.equal('Grow The Plants');
      expect(myTree.root.children[0].children).to.have.length(1);
      expect(myTree.root.children[0].children[0].children[0].children[0].children[0].children[0].children[0].data.description).to.equal('Wake up');
    });
    it('Returns a frozen array', () => {
      expect(Object.isFrozen(myTree.root.children)).to.be.true;
    });
    it('Getting on stale node throws', () => {
      expect(() => {
        const node = myTree.root.children[0];
        node.remove();
        node.children;
      }).to.throw('Illegal attempt to access "children" on a stale version of a node, or a node that no longer exists');
    });
    it('Setting throws', () => {
      expect(() => {
        myTree.root.children = 'THIS VALUE DOES NOT MATTER BECAUSE SETTING THIS PORPERTY IS ILLEGAL';
      }).to.throw();
    });
  });
  describe('#parent', () => {
    it('Getting on non-stale node works as expected', () => {
      expect(myTree.root.parent).to.be.null;
      expect(myTree.root.children[0].parent).to.equal(myTree.root);
    });
    it('Getting on stale node throws', () => {
      expect(() => {
        const node = myTree.root.children[0];
        node.remove();
        node.parent;
      }).to.throw('Illegal attempt to access "parent" on a stale version of a node, or a node that no longer exists');
    });
    it('Setting throws', () => {
      expect(() => {
        myTree.root.parent = 'THIS VALUE DOES NOT MATTER BECAUSE SETTING THIS PORPERTY IS ILLEGAL';
      }).to.throw();
    });
  });
  describe('#data', () => {
    it('Getting on a non-stale node works as expected', () => {
      expect(myTree.root.data).to.deep.equal({ "description": "Total", "time": { "start": 110.2, "end": 114.21 } });
    });
    it('Getting on stale node throws', () => {
      expect(() => {
        const node = myTree.root.children[0];
        node.remove();
        node.data;
      }).to.throw('Illegal attempt to access "data" on a stale version of a node, or a node that no longer exists');
    });
    it('Setting throws', () => {
      expect(() => {
        myTree.root.data = 'THIS VALUE DOES NOT MATTER BECAUSE SETTING THIS PORPERTY IS ILLEGAL';
      }).to.throw();
    });
  });
  describe('#updateData()', () => {
    it('Works as expected', () => {
      myTree.root.children[0].updateData((oldData) => {
        expect(oldData).to.deep.equal({ "description": "Grow The Plants", "time": { "start": 0.5, "end": 1.5 } });
        return { description: 'UPDATED DESCRIPTION' };
      });
      expect(myTree.root.children[0].data.description).to.equal('UPDATED DESCRIPTION');
    });
    it('Returns the new version of the updated node', () => {
      const retVal = myTree.root.children[0].updateData(() => ({ description: 'UPDATED DESCRIPTION' }));
      expect(retVal).to.equal(myTree.root.children[0]);
    });
    it('Marks old version of node and ancestors as "stale," and throws when called on stale node', () => {
      const oldRoot = myTree.root;
      const oldChild = myTree.root.children[0];
      myTree.root.children[0].updateData(() => ({ description: 'UPDATED DESCRIPTION' }));
      expect(myTree.root).to.not.equal(oldRoot);
      expect(myTree.root.children[0]).to.not.equal(oldChild);
      expect(oldRoot.isStale).to.be.true;
      expect(oldChild.isStale).to.be.true;
      expect(() => {
        oldRoot.updateData(() => ({ description: 'THIS VALUE DOES NOT MATTER BECAUSE UPDATING THIS NODE IS ILLEGAL' }));
      }).to.throw('Illegal attempt to call "updateData" on a stale version of a node, or a node that no longer exists');
      expect(() => {
        oldChild.updateData(() => ({ description: 'THIS VALUE DOES NOT MATTER BECAUSE UPDATING THIS NODE IS ILLEGAL' }));
      }).to.throw('Illegal attempt to call "updateData" on a stale version of a node, or a node that no longer exists');
    });
    it('Dispatches immutabletree.updatenode event with targetNode set to updated node', () => {
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.updatenode', stub);
      myTree.root.children[0].updateData(() => ({ description: 'UPDATED DESCRIPTION' }));
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].targetNode).to.equal(myTree.root.children[0]);
      expect(stub.args[0][0].rootNode).to.equal(myTree.root);
    });
    it('Dispatches immutabletree.changed event', () => {
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.changed', stub);
      myTree.root.children[0].updateData(() => ({ description: 'UPDATED DESCRIPTION' }));
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].rootNode).to.equal(myTree.root);
    });
  });
  describe('#setData()', () => {
    it('Works as expected', () => {
      myTree.root.children[0].setData({ description: 'UPDATED DESCRIPTION' });
      expect(myTree.root.children[0].data.description).to.equal('UPDATED DESCRIPTION');
    });
    it('Returns the new version of the updated node', () => {
      const retVal = myTree.root.children[0].setData({ description: 'UPDATED DESCRIPTION' });
      expect(retVal).to.equal(myTree.root.children[0]);
    });
    it('Marks old version of node and ancestors as "stale," and throws when called on stale node', () => {
      const oldRoot = myTree.root;
      const oldChild = myTree.root.children[0];
      myTree.root.children[0].setData({ description: 'UPDATED DESCRIPTION' });
      expect(myTree.root).to.not.equal(oldRoot);
      expect(myTree.root.children[0]).to.not.equal(oldChild);
      expect(oldRoot.isStale).to.be.true;
      expect(oldChild.isStale).to.be.true;
      expect(() => {
        oldRoot.setData(({ description: 'THIS VALUE DOES NOT MATTER BECAUSE UPDATING THIS NODE IS ILLEGAL' }));
      }).to.throw('Illegal attempt to call "setData" on a stale version of a node, or a node that no longer exists');
      expect(() => {
        oldChild.setData(({ description: 'THIS VALUE DOES NOT MATTER BECAUSE UPDATING THIS NODE IS ILLEGAL' }));
      }).to.throw('Illegal attempt to call "setData" on a stale version of a node, or a node that no longer exists');
    });
    it('Dispatches immutabletree.updatenode event with targetNode set to updated node', () => {
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.updatenode', stub);
      myTree.root.children[0].setData({ description: 'UPDATED DESCRIPTION' });
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].targetNode).to.equal(myTree.root.children[0]);
      expect(stub.args[0][0].rootNode).to.equal(myTree.root);
    });
    it('Dispatches immutabletree.changed event', () => {
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.changed', stub);
      myTree.root.children[0].setData({ description: 'UPDATED DESCRIPTION' });
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].rootNode).to.equal(myTree.root);
    });
  });
  describe('#insertChildWithData()', () => {
    it('Works as expected with 1 argument', () => {
      myTree.root.children[0].insertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(myTree.root.children[0].children[1].data.description).to.equal('NEW DESCRIPTION');
    });
    it('Works as expected with 2 arguments', () => {
      myTree.root.children[0].insertChildWithData({ description: 'NEW DESCRIPTION' }, 0);
      expect(myTree.root.children[0].children[0].data.description).to.equal('NEW DESCRIPTION');
    });
    it('Returns the new version of the PARENT node', () => {
      const retVal = myTree.root.children[0].insertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(retVal).to.equal(myTree.root.children[0]);
    });
    it('Marks old version of node and ancestors as "stale," and throws when called on stale node', () => {
      const oldRoot = myTree.root;
      const oldChild = myTree.root.children[0];
      myTree.root.children[0].insertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(myTree.root).to.not.equal(oldRoot);
      expect(myTree.root.children[0]).to.not.equal(oldChild);
      expect(oldRoot.isStale).to.be.true;
      expect(oldChild.isStale).to.be.true;
      expect(() => {
        oldRoot.insertChildWithData(({ description: 'THIS VALUE DOES NOT MATTER BECAUSE UPDATING THIS NODE IS ILLEGAL' }));
      }).to.throw('Illegal attempt to call "insertChildWithData" on a stale version of a node, or a node that no longer exists');
      expect(() => {
        oldChild.insertChildWithData(({ description: 'THIS VALUE DOES NOT MATTER BECAUSE UPDATING THIS NODE IS ILLEGAL' }));
      }).to.throw('Illegal attempt to call "insertChildWithData" on a stale version of a node, or a node that no longer exists');
    });
    it('Dispatches immutabletree.insertchild event with targetNode set to PARENT node', () => {
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.insertchild', stub);
      myTree.root.children[0].insertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].targetNode).to.equal(myTree.root.children[0]);
      expect(stub.args[0][0].rootNode).to.equal(myTree.root);
    });
    it('Dispatches immutabletree.changed event', () => {
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.changed', stub);
      myTree.root.children[0].insertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].rootNode).to.equal(myTree.root);
    });
  });
  describe('#dangerouslyMutablyInsertChildWithData()', () => {
    it('Works as expected with 1 argument', () => {
      myTree.root.children[0].dangerouslyMutablyInsertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(myTree.root.children[0].children[1].data.description).to.equal('NEW DESCRIPTION');
    });
    it('Works as expected with 2 arguments', () => {
      myTree.root.children[0].dangerouslyMutablyInsertChildWithData({ description: 'NEW DESCRIPTION' }, 0);
      expect(myTree.root.children[0].children[0].data.description).to.equal('NEW DESCRIPTION');
    });
    it('Returns this (the PARENT node)', () => {
      const oldChild = myTree.root.children[0];
      const retVal = myTree.root.children[0].dangerouslyMutablyInsertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(retVal).to.equal(myTree.root.children[0]);
      expect(oldChild).to.equal(retVal);
    });
    it('Does not mark anything "stale"', () => {
      const oldRoot = myTree.root;
      const oldChild = myTree.root.children[0];
      myTree.root.children[0].dangerouslyMutablyInsertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(myTree.root).to.equal(oldRoot);
      expect(myTree.root.children[0]).to.equal(oldChild);
      expect(oldRoot.isStale).to.be.false;
      expect(oldChild.isStale).to.be.false;
      expect(() => {
        oldRoot.dangerouslyMutablyInsertChildWithData(({ description: 'THIS VALUE IS NOT IMPORTANT, JUST MAKING SURE THAT THIS METHOD DOES NOT THORW' }));
      }).to.not.throw();
      expect(() => {
        oldChild.dangerouslyMutablyInsertChildWithData(({ description: 'THIS VALUE IS NOT IMPORTANT, JUST MAKING SURE THAT THIS METHOD DOES NOT THORW' }));
      }).to.not.throw();
    });
    it('Does not dispatch events', () => {
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.insertchild', stub);
      myTree.addEventListener('immutabletree.changed', stub);
      myTree.root.children[0].dangerouslyMutablyInsertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(stub.callCount).to.equal(0);
    });
  });
  describe('#moveTo()', () => {
    it('Works as expected with 1 argument', () => {
      myTree.root.children[0].moveTo(myTree.root.children[1]);
      expect(myTree.root.children).to.have.length(2);
      expect(myTree.root.children[0].data.description).to.equal('Cook the plants');
      expect(myTree.root.children[0].children).to.have.length(2);
      expect(myTree.root.children[0].children[1].data.description).to.equal('Grow The Plants');
      expect(myTree.root.children[0].children[1].children).to.have.length(1);
    });
    it('Works as expected with 2 arguments', () => {
      myTree.root.children[0].moveTo(myTree.root.children[1], 0);
      expect(myTree.root.children).to.have.length(2);
      expect(myTree.root.children[0].data.description).to.equal('Cook the plants');
      expect(myTree.root.children[0].children).to.have.length(2);
      expect(myTree.root.children[0].children[0].data.description).to.equal('Grow The Plants');
      expect(myTree.root.children[0].children[0].children).to.have.length(1);
    });
    it('Returns this (the updated node)', () => {
      const retVal = myTree.root.children[0].moveTo(myTree.root.children[1]);
      expect(retVal).to.equal(myTree.root.children[0].children[1]);
    });
    it('Does not mark current node as stale', () => {
      const oldChild = myTree.root.children[0];
      myTree.root.children[0].moveTo(myTree.root.children[1]);
      expect(myTree.root.children[0].children[1]).to.equal(oldChild);
      expect(oldChild.isStale).to.be.false;
    });
    it('Marks ancestors (of old and new position) as "stale," and throws when called on stale node', () => {
      const oldOldParent = myTree.root.children[0];
      const oldNewParent = myTree.root.children[1];
      myTree.root.children[0].children[0].moveTo(myTree.root.children[1]);
      expect(myTree.root.children[0]).to.not.equal(oldOldParent);
      expect(myTree.root.children[1]).to.not.equal(oldNewParent);
      expect(oldOldParent.isStale).to.be.true;
      expect(oldNewParent.isStale).to.be.true;
      expect(() => {
        oldOldParent.moveTo(myTree.root);
      }).to.throw('Illegal attempt to call "moveTo" on a stale version of a node, or a node that no longer exists');
      expect(() => {
        oldNewParent.moveTo(myTree.root);
      }).to.throw('Illegal attempt to call "moveTo" on a stale version of a node, or a node that no longer exists');
    });
    it('Throws for root', () => {
      expect(() => {

        myTree.root.moveTo(myTree.root.children[0]);
      }).to.throw('Attempted to move a TreeNode out of root position');
    });
    it('Throws when attempting to move a node into itself', () => {
      expect(() => {

        myTree.root.children[0].moveTo(myTree.root.children[0]);
      }).to.throw('Attempted to move a TreeNode into itself or a descendant');
    });
    it('Throws when attempting to move a node into its descendant', () => {
      expect(() => {

        myTree.root.children[0].moveTo(myTree.root.children[0].children[0]);
      }).to.throw('Attempted to move a TreeNode into itself or a descendant');
    });
    it('Dispatches immutabletree.updatenode event with targetNode set to this (the updated node)', () => {
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.movenode', stub);
      myTree.root.children[0].moveTo(myTree.root.children[1]);
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].targetNode).to.equal(myTree.root.children[0].children[1]);
      expect(stub.args[0][0].rootNode).to.equal(myTree.root);
    });
    it('Dispatches immutabletree.changed event', () => {
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.changed', stub);
      myTree.root.children[0].moveTo(myTree.root.children[1]);
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].rootNode).to.equal(myTree.root);
    });
  });
  describe('#remove()', () => {
    it('Works as expected', () => {
      myTree.root.children[0].remove();
      expect(myTree.root.children[0].data.description).to.equal('Cook the plants');
    });
    it('Returns the removed node', () => {
      const node = myTree.root.children[0];
      const retVal = myTree.root.children[0].remove();
      expect(node).to.equal(retVal);
    });
    it('Marks node and old version of ancestors as "stale," and throws when called on stale node', () => {
      const oldRoot = myTree.root;
      const oldChild = myTree.root.children[0];
      myTree.root.children[0].remove();
      expect(myTree.root).to.not.equal(oldRoot);
      expect(oldRoot.isStale).to.be.true;
      expect(oldChild.isStale).to.be.true;
      expect(() => {
        oldRoot.remove();
      }).to.throw('Illegal attempt to call "remove" on a stale version of a node, or a node that no longer exists');
      expect(() => {
        oldChild.remove();
      }).to.throw('Illegal attempt to call "remove" on a stale version of a node, or a node that no longer exists');
    });
    it('Dispatches immutabletree.removenode event with targetNode set to removed node', () => {
      const node = myTree.root.children[0];
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.removenode', stub);
      node.remove();
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].targetNode).to.equal(node);
      expect(stub.args[0][0].rootNode).to.equal(myTree.root);
    });
    it('Dispatches immutabletree.changed event', () => {
      const node = myTree.root.children[0];
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.changed', stub);
      node.remove();
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].rootNode).to.equal(myTree.root);
    });
  });
  describe('#findOne()', () => {
    it('Returns matching node if exactly 1 exists', () => {
      const node = myTree.root.findOne(({ description }) => description === 'Put pan on stove');
      expect(node).to.exist;
      expect(node.data).to.deep.equal({ "description": "Put pan on stove", "time": { "start": 36, "end": 36 } });
    });
    it('Returns first matching node if more than 1 exist', () => {
      const node = myTree.root.findOne(({ description }) => description.includes('seed'));
      expect(node).to.exist;
      expect(node.data).to.deep.equal({ "description": "Buy the seeds", "time": { "start": 0.5, "end": 1.5 } });
    });
    it('Returns null if no nodes match', () => {
      const node = myTree.root.findOne(({ description }) => description === 'NO NODE HAS THIS DESCRIPTION');
      expect(node).to.be.null;
    });
  });
  describe('#serialize()', () => {
    it('Works as expected without deserializer', () => {
      const myTree = ImmutableTree.deserialize(pojoData2());
      const serialized = myTree.root.serialize();
      expect(serialized).to.deep.equal(pojoData2());
    });
    it('Works as expected with deserializer', () => {
      const serialized = myTree.root.serialize(pojoData1Serializer);
      expect(serialized).to.deep.equal(pojoData1());
    });
  });
  describe('#print', () => {
    it('Works as expected', () => {
      const consoleStub = sinon.stub(console, 'log');
      myTree.root.print();
      consoleStub.restore();
      expect(consoleStub.callCount).to.equal(19);
      expect(consoleStub.args[0][0]).to.equal('{"time":{"start":110.2,"end":114.21},"description":"Total"}');
      expect(consoleStub.args[1][0]).to.equal('  {"time":{"start":0.5,"end":1.5},"description":"Grow The Plants"}');
    });
    it('Prints [STALE] for stale nodes', () => {
      const oldRoot = myTree.root;
      oldRoot.setData({ description: 'UPDATED DESCRIPTION' });
      const consoleStub = sinon.stub(console, 'log');
      oldRoot.print();
      consoleStub.restore();
      expect(consoleStub.callCount).to.equal(19);
      expect(consoleStub.args[0][0]).to.equal('{"time":{"start":110.2,"end":114.21},"description":"Total"} [STALE]');
    });
  });
});