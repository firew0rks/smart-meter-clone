var Power = artifacts.require("./Power.sol");

module.exports = function(deployer) {
  deployer.deploy(Power, "0xf17f52151EbEF6C7334FAD080c5704D77216b732");
};
