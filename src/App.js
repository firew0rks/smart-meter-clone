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
var provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");

// instantiate the contract from the JSON - create instance
var powerContract;
var web3 = new Web3();

var consumerAddress = "0x6d6ea3fea772a4ec900507a99c24c84cb37e0518";
var prosumerAddress = "0x0d42c898dc8e73842d96ecb62272a74cf1689345";

function instantiateContract() {
    powerContract = contract(PowerContract);
    powerContract.setProvider(provider);
    
    // Setting prosumer address
    powerContract.deployed().then(instance => {
        console.log("here");
        instance.set_prosumer(prosumerAddress, 1000, {from: consumerAddress})
    });
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

function getInformation(address) {
    powerContract.deployed().then(instance => {
        instance.get_user_information({from: address}).then(result => {
            console.log(address);
            console.log('Token balance: ', web3.fromWei(result[0], 'ether').toString());
            console.log('Production rate: ', result[1].toString());
            console.log('Consumption rate: ', result[2].toString());
        })
    });
}

instantiateContract();

setInterval(() => sendMoney(), 4000);
setInterval(() => sendPower(), 3000);
setInterval(() => getInformation(consumerAddress), 5000);
setInterval(() => getInformation(prosumerAddress), 5000);


