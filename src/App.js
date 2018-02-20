// AC 18

// import the packages required for handling contract
// including the contract itself
// web3


//import Web3 from 'web3';
const Web3 = require("web3");
//import contract from 'truffle-contract';
const contract = require("truffle-contract");
//import PowerContract from '../build/contracts/Power.json';
const PowerContract = require("../build/contracts/Power.json");

// web3 instance using the ganache testnet as the provider


// instantiate the contract from the JSON - create instance

function instantiateContract() {
    var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
    const powerContract = contract(PowerContract);
    powerContract.setProvider(web3);

// promise the deployed contract and use its info
    powerContract.deployed().then(instance => console.log(instance)).catch(console.log("err"));
}

instantiateContract();
