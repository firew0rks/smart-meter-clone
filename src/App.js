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
var provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");

// instantiate the contract from the JSON - create instance
var powerContract;

function instantiateContract() {
    const powerContract = contract(PowerContract);
    powerContract.setProvider(provider);

// promise the deployed contract and use its info
    powerContract.deployed().then(instance => {
        instance.Balance.call("0xf17f52151EbEF6C7334FAD080c5704D77216b732").then(value => {
          console.log(value.toString());
          //console.log(web3.toWei(value))
        })
    }).catch(err => {
      console.log(err);
    })
}

function setValue(value) {
  powerContract.deployed().then(instance => {
    instance.setValue(value, {from: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"}).then(result => {
      console.log("Value was set to ", result);
    })
  }).catch(console.log("setValue err"));
}

// instance.setValue(5).then(function(result) {
//   // result object contains import information about the transaction
//   console.log("Value was set to", result.logs[0].args.val);
// });

instantiateContract();
setValue(5);
