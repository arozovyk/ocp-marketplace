// import NFTContractBuild from 'contracts/NFT.json';
import Web3 from "web3";
import nft_abi from "./abi/NFT.json";
import market_abi from "./abi/NFTMarket.json";
import nft_addr from "./addresses/nft.address.json";
import market_addr from "./addresses/market.address.json";

const NFT_ADDR = nft_addr.CONTRACT_ADDRESS;
const MARKET_ADDR = market_addr.CONTRACT_ADDRESS;

let selectedAccount;
// let nftContract;
let nftContract;
let marketContract;
let web3;

export const init = async () => {
  let provider = window.ethereum;

  web3 = new Web3(provider);

  nftContract = new web3.eth.Contract(nft_abi.abi, NFT_ADDR);
  marketContract = new web3.eth.Contract(market_abi.abi, MARKET_ADDR);

  if (typeof provider !== "undefined") {
    window.ethereum.on("accountsChanged", function (accounts) {
      selectedAccount = accounts[0];
      console.log(`Selected account changed to ${selectedAccount}`);
    });
    return await provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`Selected account is ${selectedAccount}`);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }
};

export const getSelectedAccount = async () => {
  return selectedAccount;
};
export const getSelectedAccountsNftBalance = async () => {
  return await nftContract.methods.balanceOf(selectedAccount).call();
};

export const mint = async (tokenURI) => {
  console.log(tokenURI);
  return await nftContract.methods
    .createToken("https://ipfs.io/ipfs/" + tokenURI)
    .send({ from: selectedAccount });
};

export const weiToEther = async (price) => {
  return await web3.utils.fromWei(price);
};

export const getTokenUri = async (tokenId) => {
  return await nftContract.methods.tokenURI(tokenId).call();
};

export const getColTokenUri = async (collAddr, tokenId) => {
  const collContract = new web3.eth.Contract(nft_abi.abi, collAddr);
  return await collContract.methods.tokenURI(tokenId).call();
};

export const getOwnerOf = async (tokenId) => {
  return await nftContract.methods.ownerOf(tokenId).call();
};

export const createMarketItem = async (tokenId, p) => {
  let price = await web3.utils.toWei(p);
  return await marketContract.methods
    .createMarketItem(NFT_ADDR, tokenId, price)
    .send({ from: selectedAccount, value: 25000000000000000 });
};

export const buyNft = async (tokenId, price) => {
  let value = await web3.utils.toWei(price);
  return await marketContract.methods
    .createMarketSale(NFT_ADDR, tokenId)
    .send({ from: selectedAccount, value });
};

export const fetchMarketItems = async () => {
  return await marketContract.methods.fetchMarketItems().call();
};
export const fetchMyNFTs = async () => {
  return await marketContract.methods.fetchItemsCreated().call();
};
