const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const fs = require("fs");
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
      gas: "10000000",
      from: devAccount,
    });

  const data = {
    contract_address: result.options.address,
    abi: abi,
  };

  if (!fs.existsSync("./build")) {
    fs.mkdirSync("./build");
  }

  fs.writeFile("./build/contract.json", JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Contract deployed to", data.contract_address);
      console.log(fs.readFileSync("./build/contract.json", "utf8"));
    }
  });

  provider.engine.stop();
};

deploy();
