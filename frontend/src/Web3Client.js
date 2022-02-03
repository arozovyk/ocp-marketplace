// import NFTContractBuild from 'contracts/NFT.json';
import Web3 from "web3";
import nft_abi from "./abi/NFT.json";
import nft_addr from "./addresses/nft.address.json";

const NFT_ADDR = nft_addr.CONTRACT_ADDRESS;

let selectedAccount;
// let nftContract;
let nftContract;

 
export const init = async () => {
  let provider = window.ethereum;

  const web3 = new Web3(provider);

  nftContract = new web3.eth.Contract(nft_abi.abi, NFT_ADDR);

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
    .createToken( "https://ipfs.io/ipfs/" + tokenURI)
    .send({ from: selectedAccount });
};

export const getTokenUri = async (tokenId) => {
  return await nftContract.methods.tokenURI(tokenId).call();
};
export const getOwnerOf = async (tokenId) => {
  return await nftContract.methods.ownerOf(tokenId).call();
};
