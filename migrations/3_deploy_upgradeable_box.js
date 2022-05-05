const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const Box = artifacts.require('Box');

module.exports = async function (deployer) {
  await deployProxy(Box, [], { deployer, initializer: 'initialize' });
};