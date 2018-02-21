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

function instantiateContract() {
    powerContract = contract(PowerContract);
    powerContract.setProvider(provider);
    
    // Setting prosumer address
    powerContract.deployed().then(instance => {
        console.log("here");
        instance.set_prosumer("0x4301a4689ce0bcd823c95f3f231c12b98eecd80d", 1000, {from: "0x4301a4689ce0bcd823c95f3f231c12b98eecd80d"})
    });
}

// Function to update the value via transaction
function sendMoney() {
  powerContract.deployed().then(instance => {
      instance.token_transfer("0x4301a4689ce0bcd823c95f3f231c12b98eecd80d", "0x2b4521451201790449cbab64aff6af3a7a91aa50", {from: "0x4301a4689ce0bcd823c95f3f231c12b98eecd80d"}).then((x) => {
        console.log(x);
        instance.get_energy_produced.call("0x4301a4689ce0bcd823c95f3f231c12b98eecd80d").then((result) => {
            console.log('result!', result.toString())
        })
     })
    })
}

instantiateContract();

setInterval(() => sendMoney(), 4000);


