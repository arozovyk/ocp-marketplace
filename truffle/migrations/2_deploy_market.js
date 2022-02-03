const Market = artifacts.require("NFTMarket");

module.exports = function (deployer) {
  deployer.deploy(Market);
};
