/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: 'local',
  networks: {
    local: {
      url: 'http://127.0.0.1:18806/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43112,
      accounts: ['0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027']
    },
  },
  solidity: {
    compilers: [ {version: "0.6.12"} ],
    overrides: {
      "contracts/sales/AvalaunchSale.sol": {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 180
          },
        },
      },
      "contracts/sales/SalesFactory.sol": {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 180
          },
        },
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};