// Load dependencies
const { expect } = require('chai');
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const Box = artifacts.require('Box');
const BoxV2 = artifacts.require('BoxV2');

// Start test block
contract('Box', function ([ owner, other ]) {
  // Use large integers ('big numbers')
  const value = new BN('42');

  beforeEach(async function () {
    this.box = await deployProxy(Box, [], { initializer: 'initialize' });
  });

  it('retrieve returns a value previously stored', async function () {
    await this.box.store(value, { from: owner });

    // Use large integer comparisons
    expect(await this.box.retrieve()).to.be.bignumber.equal(value);
  });

  it('store emits an event', async function () {
    const receipt = await this.box.store(value, { from: owner });

    // Test that a ValueChanged event was emitted with the new value
    expectEvent(receipt, 'ValueChanged', { value: value });
  });

  it('non owner cannot store a value', async function () {
    // Test a transaction reverts
    await expectRevert(
      this.box.store(value, { from: other }),
      'Ownable: caller is not the owner',
    );
  });

  it('BoxV2 retrieve returns a value previously stored in Box', async function () {
    await this.box.store(value, { from: owner });

    this.boxV2 = await upgradeProxy(this.box.address, BoxV2);

    // Use large integer comparisons
    expect(await this.boxV2.retrieve()).to.be.bignumber.equal(value);
  });

  it('BoxV2 increment returns a value previously stored in Box', async function () {
    expect(await this.box.retrieve()).to.not.be.bignumber.equal(value);
    
    await this.box.store(value, { from: owner });

    this.boxV2 = await upgradeProxy(this.box.address, BoxV2);

    await this.boxV2.increment({ from: owner });

    const newValue = new BN('43');

    // Use large integer comparisons
    expect(await this.boxV2.retrieve()).to.be.bignumber.equal(newValue);
  });
});