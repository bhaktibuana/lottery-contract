const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");
const { abi, bytecode } = require("../compile");

let lottery, accounts;
const address = {};

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  address.manager = accounts[0];
  address.player1 = accounts[1];
  address.player2 = accounts[2];
  address.player3 = accounts[3];

  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
    })
    .send({
      from: address.manager,
      gas: "10000000",
    });
});

describe("Lottery Contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows multiple accounts to enter", async () => {
    await lottery.methods.enter().send({
      from: address.player1,
      value: web3.utils.toWei("0.01", "ether"),
    });

    await lottery.methods.enter().send({
      from: address.player2,
      value: web3.utils.toWei("0.01", "ether"),
    });

    await lottery.methods.enter().send({
      from: address.player3,
      value: web3.utils.toWei("0.01", "ether"),
    });

    const players = await lottery.methods.getPlayers().call({
      from: address.manager,
    });

    assert.equal(players[0], address.player1);
    assert.equal(players[1], address.player2);
    assert.equal(players[2], address.player3);
    assert.equal(players.length, 3);
  });

  it("manager can not enter the lottery", async () => {
    try {
      await lottery.methods.enter().send({
        from: address.manager,
        value: web3.utils.toWei("0.02", "ether"),
      });
    } catch (error) {
      assert.ok(error);
    }
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: address.player1,
        value: web3.utils.toWei("0.0099", "ether"),
      });
      assert(false);
    } catch (error) {
      assert.ok(error);
    }
  });

  it("only manager can call pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: address.player1,
      });
      assert(false);
    } catch (error) {
      assert.ok(error);
    }
  });

  it("sends money to the winner and resets the players array", async () => {
    await lottery.methods.enter().send({
      from: address.player1,
      value: web3.utils.toWei("0.01", "ether"),
    });

    const initialBalance = await web3.eth.getBalance(address.player1);

    await lottery.methods.pickWinner().send({
      from: address.manager,
    });

    const finalBalance = await web3.eth.getBalance(address.player1);

    const players = await lottery.methods.getPlayers().call({
      from: address.manager,
    });

    assert(finalBalance > initialBalance);
    assert.equal(players.length, 0);
  });
});
