# Inbox Contract

## Description

Lottery Contract is a blockchain smart contract on the Ethereum network. This smart contract is about blockchain lottery application that I have built using the Solidity language. Disclaimer! This contracts was created for learning purposes and deployed on the Rinkeby Ethereum test network.

## Libary that used in this project

- web3.js
- truffle
- ganache-cli
- solc
- mocha

## Installation

- with npm: `npm install`
- with yarn: `yarn install`

## Test the contract

- with npm: `npm run test`
- with yarn: `yarn test`

## Deploy the contract

This contract deployed to Rinkeby Ethereum test netwrok. Before do a deployment, make sure you have installed Metamask and connect to Rinkeby test network and also make sure your wallet has rinkebyETH balance.
The deployment process is explained as follows:

- at the project directory create new `.env` file.
- the `.env` file contains two variables named MNEMONIC and ENDPOINT.
- for MNEMONIC variable, assign with your mnemonic of your Metamask account.
- for ENDPOINT variable, assign with Rinkeby network endpoint. To get the network endpoint you can register your account at [infura.io](infura.io).
- run `npm run deploy` or `yarn deploy`. And it will return the address that used for deployment and the address of the contract.
- you can check your contract at [https://rinkeby.etherscan.io](https://rinkeby.etherscan.io).

I hope you guys like this project :grin: