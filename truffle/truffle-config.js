
var bid = require(  "./blockchain_id.json");

const blockchain_id = bid.BLOCKCHAIN_ID;
const HDWalletProvider = require("@truffle/hdwallet-provider");

const privateKeys2 = [
  "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027" 
  
];
const privateKeys = [
  "0x32a7403e5a991773ad7b2a60163f6274b019d98c547a4f58391666dbc1d2c25c" 
  
];

const providerOrUrlf = `http://127.0.0.1:9650/ext/bc/${blockchain_id}/rpc`
const providerOrUrl = ` https://api.avax-test.network:443/ext/bc/C/rpc`
 //chainid fuji 43113
module.exports = {
  networks: {
    development: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: privateKeys,
          providerOrUrl,
        });
      },
      network_id: "*",
      gas: 3000000,
      gasPrice: 225000000000,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
};
