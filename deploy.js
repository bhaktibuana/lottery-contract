const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, bytecode } = require("./compile");
require("dotenv").config();

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.ENDPOINT
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const devAccount = accounts[1]; // index of account that used

  console.log("Attempting to deploy from account", devAccount);

  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
    })
    .send({
      gas: "1000000",
      from: devAccount,
    });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};

deploy();
