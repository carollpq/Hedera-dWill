require("dotenv").config({ path: "../.env" });
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: { version: "0.8.22" },
  defaultNetwork: "testnet",
  networks: {
    testnet: {
      url: "https://testnet.hashio.io/api",
      accounts: ["7693a736f38b0aef4766a6380e7fbbb3b30e5cb64233e2b980cfa9d285fb2201"],
    }
  }
};
