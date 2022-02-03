const MyNFT = artifacts.require("NFT");
const Market = artifacts.require("NFTMarket");

module.exports = function (deployer) {
  deployer.deploy(MyNFT,Market.address);
 };
