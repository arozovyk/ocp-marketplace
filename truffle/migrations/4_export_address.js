var fs = require("fs");

const MyNFT = artifacts.require("NFT");
const Market = artifacts.require("NFTMarket");
var nft_address = {};
var market_address = {};

module.exports = function (deployer) {
  nft_address.CONTRACT_ADDRESS = MyNFT.address;
  market_address.CONTRACT_ADDRESS = Market.address;
  fs.writeFileSync("../frontend/src/addresses/nft.address.json", JSON.stringify(nft_address), "utf-8");
  fs.writeFileSync("../frontend/src/addresses/market.address.json", JSON.stringify(market_address), "utf-8");
};
