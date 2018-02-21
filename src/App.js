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
var web3 = new Web3();

var consumerAddress = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";
var prosumerAddress = "0xf17f52151EbEF6C7334FAD080c5704D77216b732";

// Always called
function instantiateContract() {
    powerContract = contract(PowerContract);
    powerContract.setProvider(provider);
}

// Called by consumer
function sendMoney() {
  powerContract.deployed().then(instance => {
      console.log('Sending money');
      instance.token_transfer(consumerAddress, prosumerAddress, {from: consumerAddress, gas: 900000})
    })
}

// Called by prosumer
function sendPower() {
    powerContract.deployed().then(instance => {
        console.log('sending Power');
        instance.set_prosumer(prosumerAddress, 1000, {from: consumerAddress}).then((x) => {
            instance.get_energy_produced.call(prosumerAddress).then((result) => {
                console.log('result!', result.toString())
            })
         })
    })
}

// Debug only
function getInformation(address) {
    powerContract.deployed().then(instance => {
        instance.get_user_information({from: address}).then(result => {
            console.log(address);
            console.log('Token balance: ', result[0].toString());
            console.log('Production rate: ', result[1].toString());
            console.log('Consumption rate: ', result[2].toString());
        })
    });
}

instantiateContract();

setInterval(() => sendMoney(), 3000);
setInterval(() => sendPower(), 3000);
setInterval(() => getInformation(consumerAddress), 3000);
setInterval(() => getInformation(prosumerAddress), 3000);
