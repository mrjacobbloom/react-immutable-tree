import Mocha from 'mocha';
import sinon from 'sinon';
import chai from 'chai';
const expect = chai.expect;

import { pojoData1, pojoData1Parser } from './testData.js';
import { ImmutableTree } from '../dist/react-immutable-tree.js';

describe('ImmutableTree', () => {
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
  describe('#addRootWithData()', () => {
    it('Works as expected', () => {
      const myTree = new ImmutableTree();
      myTree.addRootWithData({ value: 5 });
      expect(myTree.root).to.exist;
      expect(myTree.root.data).to.deep.equal({ value: 5 });
    });
  });
  describe('#findOne()', () => {
    it('Returns matching node if exactly 1 exists', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const node = myTree.findOne(({ description }) => description === 'Put pan on stove');
      expect(node).to.exist;
      expect(node.data).to.deep.equal({ "description": "Put pan on stove", "time": { "start": 36, "end": 36 } });
    });
    it('Returns first matching node if more than 1 exist', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const node = myTree.findOne(({ description }) => description.includes('seed'));
      expect(node).to.exist;
      expect(node.data).to.deep.equal({ "description": "Buy the seeds", "time": { "start": 0.5, "end": 1.5 } });
    });
    it('Returns null if no nodes match', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const node = myTree.findOne(({ description }) => description === 'NO NODE HAS THIS DESCRIPTION');
      expect(node).to.be.null;
    });
  });
  describe('#print', () => {
    it('Works as expected', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const consoleStub = sinon.stub(console, 'log');
      myTree.print();
      consoleStub.restore();
      expect(consoleStub.callCount).to.equal(19);
      expect(consoleStub.args[0][0]).to.equal('{"time":{"start":110.2,"end":114.21},"description":"Total"}');
      expect(consoleStub.args[1][0]).to.equal('  {"time":{"start":0.5,"end":1.5},"description":"Grow The Plants"}');
    });
  });
  describe('.parse()', () => {
    it('Works as expected', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      expect(myTree.root.data).to.deep.equal({ "description": "Total", "time": { "start": 110.2, "end": 114.21 } });
      expect(myTree.root.children).to.have.length(3);
      expect(myTree.root.children[0].data.description).to.equal('Grow The Plants');
      expect(myTree.root.children[0].children).to.have.length(1);
      expect(myTree.root.children[0].children[0].children[0].children[0].children[0].children[0].children[0].data.description).to.equal('Wake up');
    });
  });
});


describe('ImmutableTreeNode', () => {
  describe('#children', () => {
    it('Getting works as expected', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      expect(myTree.root.data).to.deep.equal({ "description": "Total", "time": { "start": 110.2, "end": 114.21 } });
      expect(myTree.root.children).to.have.length(3);
      expect(myTree.root.children[0].data.description).to.equal('Grow The Plants');
      expect(myTree.root.children[0].children).to.have.length(1);
      expect(myTree.root.children[0].children[0].children[0].children[0].children[0].children[0].children[0].data.description).to.equal('Wake up');
    });
    it('Returns a frozen array', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      expect(Object.isFrozen(myTree.root.children)).to.be.true;
    });
    it('Setting throws', () => {
      expect(() => {
        const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
        myTree.root.children = 'THIS VALUE DOES NOT MATTER BECAUSE SETTING THIS PORPERTY IS ILLEGAL';
      }).to.throw();
    });
  });
  describe('#parent', () => {
    it('Getting works as expected', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      expect(myTree.root.parent).to.be.null;
      expect(myTree.root.children[0].parent).to.equal(myTree.root);
    });
    it('Setting throws', () => {
      expect(() => {
        const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
        myTree.root.parent = 'THIS VALUE DOES NOT MATTER BECAUSE SETTING THIS PORPERTY IS ILLEGAL';
      }).to.throw();
    });
  });
  describe('#data', () => {
    it('Getting works as expected', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      expect(myTree.root.data).to.deep.equal({ "description": "Total", "time": { "start": 110.2, "end": 114.21 } });
    });
    it('Setting throws', () => {
      expect(() => {
        const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
        myTree.root.data = 'THIS VALUE DOES NOT MATTER BECAUSE SETTING THIS PORPERTY IS ILLEGAL';
      }).to.throw();
    });
  });
  describe('#updateData()', () => {
    it('Works as expected', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      myTree.root.children[0].updateData((oldData) => {
        expect(oldData).to.deep.equal({ "description": "Grow The Plants", "time": { "start": 0.5, "end": 1.5 } });
        return { description: 'UPDATED DESCRIPTION' };
      });
      expect(myTree.root.children[0].data.description).to.equal('UPDATED DESCRIPTION');
    });
    it('Returns the new version of the updated node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const retVal = myTree.root.children[0].updateData(() => ({ description: 'UPDATED DESCRIPTION' }));
      expect(retVal).to.equal(myTree.root.children[0]);
    });
    it('Marks old version of node and ancestors as "dead," and throws when called on dead node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const oldRoot = myTree.root;
      const oldChild = myTree.root.children[0];
      myTree.root.children[0].updateData(() => ({ description: 'UPDATED DESCRIPTION' }));
      expect(myTree.root).to.not.equal(oldRoot);
      expect(myTree.root.children[0]).to.not.equal(oldChild);
      expect(() => {
        oldRoot.updateData(() => ({ description: 'THIS VALUE DOES NOT MATTER BECAUSE UPDATING THIS NODE IS ILLEGAL' }));
      }).to.throw('Illegal attempt to modify an old version of a node, or a node that no longer exists');
      expect(() => {
        oldChild.updateData(() => ({ description: 'THIS VALUE DOES NOT MATTER BECAUSE UPDATING THIS NODE IS ILLEGAL' }));
      }).to.throw('Illegal attempt to modify an old version of a node, or a node that no longer exists');
    });
    it('Dispatches immutabletree.updatenode event with targetNode set to updated node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.updatenode', stub);
      myTree.root.children[0].updateData(() => ({ description: 'UPDATED DESCRIPTION' }));
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].targetNode).to.equal(myTree.root.children[0]);
    });
  });
  describe('#setData()', () => {
    it('Works as expected', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      myTree.root.children[0].setData({ description: 'UPDATED DESCRIPTION' });
      expect(myTree.root.children[0].data.description).to.equal('UPDATED DESCRIPTION');
    });
    it('Returns the new version of the updated node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const retVal = myTree.root.children[0].setData({ description: 'UPDATED DESCRIPTION' });
      expect(retVal).to.equal(myTree.root.children[0]);
    });
    it('Marks old version of node and ancestors as "dead," and throws when called on dead node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const oldRoot = myTree.root;
      const oldChild = myTree.root.children[0];
      myTree.root.children[0].setData({ description: 'UPDATED DESCRIPTION' });
      expect(myTree.root).to.not.equal(oldRoot);
      expect(myTree.root.children[0]).to.not.equal(oldChild);
      expect(() => {
        oldRoot.setData(({ description: 'THIS VALUE DOES NOT MATTER BECAUSE UPDATING THIS NODE IS ILLEGAL' }));
      }).to.throw('Illegal attempt to modify an old version of a node, or a node that no longer exists');
      expect(() => {
        oldChild.setData(({ description: 'THIS VALUE DOES NOT MATTER BECAUSE UPDATING THIS NODE IS ILLEGAL' }));
      }).to.throw('Illegal attempt to modify an old version of a node, or a node that no longer exists');
    });
    it('Dispatches immutabletree.updatenode event with targetNode set to updated node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.updatenode', stub);
      myTree.root.children[0].setData({ description: 'UPDATED DESCRIPTION' });
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].targetNode).to.equal(myTree.root.children[0]);
    });
  });
  describe('#insertChildWithData()', () => {
    it('Works as expected with 1 argument', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      myTree.root.children[0].insertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(myTree.root.children[0].children[1].data.description).to.equal('NEW DESCRIPTION');
    });
    it('Works as expected with 2 arguments', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      myTree.root.children[0].insertChildWithData({ description: 'NEW DESCRIPTION' }, 0);
      expect(myTree.root.children[0].children[0].data.description).to.equal('NEW DESCRIPTION');
    });
    it('Returns the new version of the PARENT node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const retVal = myTree.root.children[0].insertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(retVal).to.equal(myTree.root.children[0]);
    });
    it('Marks old version of node and ancestors as "dead," and throws when called on dead node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const oldRoot = myTree.root;
      const oldChild = myTree.root.children[0];
      myTree.root.children[0].insertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(myTree.root).to.not.equal(oldRoot);
      expect(myTree.root.children[0]).to.not.equal(oldChild);
      expect(() => {
        oldRoot.insertChildWithData(({ description: 'THIS VALUE DOES NOT MATTER BECAUSE UPDATING THIS NODE IS ILLEGAL' }));
      }).to.throw('Illegal attempt to modify an old version of a node, or a node that no longer exists');
      expect(() => {
        oldChild.insertChildWithData(({ description: 'THIS VALUE DOES NOT MATTER BECAUSE UPDATING THIS NODE IS ILLEGAL' }));
      }).to.throw('Illegal attempt to modify an old version of a node, or a node that no longer exists');
    });
    it('Dispatches immutabletree.insertchild event with targetNode set to PARENT node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.insertchild', stub);
      myTree.root.children[0].insertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].targetNode).to.equal(myTree.root.children[0]);
    });
  });
  describe('#dangerouslyMutablyInsertChildWithData()', () => {
    it('Works as expected with 1 argument', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      myTree.root.children[0].dangerouslyMutablyInsertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(myTree.root.children[0].children[1].data.description).to.equal('NEW DESCRIPTION');
    });
    it('Works as expected with 2 arguments', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      myTree.root.children[0].dangerouslyMutablyInsertChildWithData({ description: 'NEW DESCRIPTION' }, 0);
      expect(myTree.root.children[0].children[0].data.description).to.equal('NEW DESCRIPTION');
    });
    it('Returns this (the PARENT node)', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const oldChild = myTree.root.children[0];
      const retVal = myTree.root.children[0].dangerouslyMutablyInsertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(retVal).to.equal(myTree.root.children[0]);
      expect(oldChild).to.equal(retVal);
    });
    it('Does not mark anything "dead"', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const oldRoot = myTree.root;
      const oldChild = myTree.root.children[0];
      myTree.root.children[0].dangerouslyMutablyInsertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(myTree.root).to.equal(oldRoot);
      expect(myTree.root.children[0]).to.equal(oldChild);
      expect(() => {
        oldRoot.dangerouslyMutablyInsertChildWithData(({ description: 'THIS VALUE IS NOT IMPORTANT, JUST MAKING SURE THAT THIS METHOD DOES NOT THORW' }));
      }).to.not.throw();
      expect(() => {
        oldChild.dangerouslyMutablyInsertChildWithData(({ description: 'THIS VALUE IS NOT IMPORTANT, JUST MAKING SURE THAT THIS METHOD DOES NOT THORW' }));
      }).to.not.throw();
    });
    it('Does not dispatch events', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.insertchild', stub);
      myTree.root.children[0].dangerouslyMutablyInsertChildWithData({ description: 'NEW DESCRIPTION' });
      expect(stub.callCount).to.equal(0);
    });
  });
  describe('#moveTo()', () => {
    it('Works as expected with 1 argument', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      myTree.root.children[0].moveTo(myTree.root.children[1]);
      expect(myTree.root.children).to.have.length(2);
      expect(myTree.root.children[0].data.description).to.equal('Cook the plants');
      expect(myTree.root.children[0].children).to.have.length(2);
      expect(myTree.root.children[0].children[1].data.description).to.equal('Grow The Plants');
      expect(myTree.root.children[0].children[1].children).to.have.length(1);
    });
    it('Works as expected with 2 arguments', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      myTree.root.children[0].moveTo(myTree.root.children[1], 0);
      expect(myTree.root.children).to.have.length(2);
      expect(myTree.root.children[0].data.description).to.equal('Cook the plants');
      expect(myTree.root.children[0].children).to.have.length(2);
      expect(myTree.root.children[0].children[0].data.description).to.equal('Grow The Plants');
      expect(myTree.root.children[0].children[0].children).to.have.length(1);
    });
    it('Returns this (the updated node)', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const retVal = myTree.root.children[0].moveTo(myTree.root.children[1]);
      expect(retVal).to.equal(myTree.root.children[0].children[1]);
    });
    it('Does not mark current node as dead', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const oldChild = myTree.root.children[0];
      myTree.root.children[0].moveTo(myTree.root.children[1]);
      expect(myTree.root.children[0].children[1]).to.equal(oldChild);
      expect(() => {
        myTree.root.children[0].setData({ description: 'THIS VALUE IS NOT IMPORTANT, JUST CHECKING THAT THIS FUNCTION DOES NOT THROW' });
      }).to.not.throw();
    });
    it('Marks ancestors (of old and new position) as "dead," and throws when called on dead node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const oldOldParent = myTree.root.children[0];
      const oldNewParent = myTree.root.children[1];
      myTree.root.children[0].children[0].moveTo(myTree.root.children[1]);
      expect(myTree.root.children[0]).to.not.equal(oldOldParent);
      expect(myTree.root.children[1]).to.not.equal(oldNewParent);
      expect(() => {
        oldOldParent.moveTo(myTree.root);
      }).to.throw('Illegal attempt to modify an old version of a node, or a node that no longer exists');
      expect(() => {
        oldNewParent.moveTo(myTree.root);
      }).to.throw('Illegal attempt to modify an old version of a node, or a node that no longer exists');
    });
    it('Throws for root', () => {
      expect(() => {
        const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
        myTree.root.moveTo(myTree.root.children[0]);
      }).to.throw('Attempted to move a TreeNode out of root position');
    });
    it('Throws when attempting to move a node into itself', () => {
      expect(() => {
        const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
        myTree.root.children[0].moveTo(myTree.root.children[0]);
      }).to.throw('Attempted to move a TreeNode into itself or a descendant');
    });
    it('Throws when attempting to move a node into its descendant', () => {
      expect(() => {
        const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
        myTree.root.children[0].moveTo(myTree.root.children[0].children[0]);
      }).to.throw('Attempted to move a TreeNode into itself or a descendant');
    });
    it('Dispatches immutabletree.updatenode event with targetNode set to this (the updated node)', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.movenode', stub);
      myTree.root.children[0].moveTo(myTree.root.children[1]);
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].targetNode).to.equal(myTree.root.children[0].children[1]);
    });
  });
  describe('#remove()', () => {
    it('Works as expected', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      myTree.root.children[0].remove();
      expect(myTree.root.children[0].data.description).to.equal('Cook the plants');
    });
    it('Returns the removed node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const node = myTree.root.children[0];
      const retVal = myTree.root.children[0].remove();
      expect(node).to.equal(retVal);
    });
    it('Marks node and old version of ancestors as "dead," and throws when called on dead node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const oldRoot = myTree.root;
      const oldChild = myTree.root.children[0];
      myTree.root.children[0].remove();
      expect(myTree.root).to.not.equal(oldRoot);
      expect(() => {
        oldRoot.remove();
      }).to.throw('Illegal attempt to modify an old version of a node, or a node that no longer exists');
      expect(() => {
        oldChild.remove();
      }).to.throw('Illegal attempt to modify an old version of a node, or a node that no longer exists');
    });
    it('Dispatches immutabletree.removenode event with targetNode set to removed node', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const node = myTree.root.children[0];
      const stub = sinon.stub();
      myTree.addEventListener('immutabletree.removenode', stub);
      node.remove();
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0]).to.be.an.instanceOf(Event);
      expect(stub.args[0][0].targetNode).to.equal(node);
    });
  });
  describe('#findOne()', () => {
    it('Returns matching node if exactly 1 exists', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const node = myTree.root.findOne(({ description }) => description === 'Put pan on stove');
      expect(node).to.exist;
      expect(node.data).to.deep.equal({ "description": "Put pan on stove", "time": { "start": 36, "end": 36 } });
    });
    it('Returns first matching node if more than 1 exist', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const node = myTree.root.findOne(({ description }) => description.includes('seed'));
      expect(node).to.exist;
      expect(node.data).to.deep.equal({ "description": "Buy the seeds", "time": { "start": 0.5, "end": 1.5 } });
    });
    it('Returns null if no nodes match', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const node = myTree.root.findOne(({ description }) => description === 'NO NODE HAS THIS DESCRIPTION');
      expect(node).to.be.null;
    });
  });
  describe('#print', () => {
    it('Works as expected', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const consoleStub = sinon.stub(console, 'log');
      myTree.root.print();
      consoleStub.restore();
      expect(consoleStub.callCount).to.equal(19);
      expect(consoleStub.args[0][0]).to.equal('{"time":{"start":110.2,"end":114.21},"description":"Total"}');
      expect(consoleStub.args[1][0]).to.equal('  {"time":{"start":0.5,"end":1.5},"description":"Grow The Plants"}');
    });
    it('Prints [DEAD] for dead nodes', () => {
      const myTree = ImmutableTree.parse(pojoData1(), pojoData1Parser);
      const oldRoot = myTree.root;
      oldRoot.setData({ description: 'UPDATED DESCRIPTION' });
      const consoleStub = sinon.stub(console, 'log');
      oldRoot.print();
      consoleStub.restore();
      expect(consoleStub.callCount).to.equal(19);
      expect(consoleStub.args[0][0]).to.equal('{"time":{"start":110.2,"end":114.21},"description":"Total"} [DEAD]');
    });
  });
});