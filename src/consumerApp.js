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
//include onoff to interact with the GPIO
var Gpio = require('onoff').Gpio;

//use GPIO pin 17 as input, and 'both' button presses, and releases should be handled
var light = new Gpio(17, 'in', 'both');

// web3 instance using the ganache testnet as the provider
var provider = new Web3.providers.HttpProvider("http://54.206.58.77:8545");

// instantiate the contract from the JSON - create instance
var powerContract;
var web3 = new Web3();

// local ganache
// var consumerAddress = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";
// var prosumerAddress = "0xf17f52151EbEF6C7334FAD080c5704D77216b732";
// AWS ganache
var consumerAddress = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
var prosumerAddress = "0xffcf8fdee72ac11b5c542428b35eef5769c409f0";

// variables for the production and consumption states and rates
var consuming = 0;

// Always called
function instantiateContract() {
    powerContract = contract(PowerContract);
    powerContract.setProvider(provider);
}

// Called by consumer
function sendMoney(rate, isRate) {
  powerContract.deployed().then(instance => {
      console.log('Sending money');
      if(isRate) {
        instance.token_transfer(consumerAddress, prosumerAddress, rate, {from: consumerAddress, gas: 900000});
      } else {
        instance.change_rate({from: consumerAddress});
      }
      
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
            console.log('Current Usage:  ', result[3].toString());
            console.log('Amount spent this month: ', result[4].toString());
            console.log('Amount saved this month: ', result[5].toString());
        })
    });
}

function unexportOnClose() { //function to run when exiting program
  //LED.writeSync(0); // Turn LED off
  //LED.unexport(); // Unexport LED GPIO to free resources
  light.unexport(); // Unexport Button GPIO to free resources
};

// define function to run each time, checking the production/consumption_rate
// and instigating appropriate processes
function doShit() {
  // if we are consuming, instigate the buy order
  consuming = light.readSync();
  console.log('LETTER', consuming)
  if (consuming) {
    sendMoney(1800, true);
  } else {
    sendMoney(0, false)
  }
}

instantiateContract();

// set our interval to run and call the functions
setInterval(() => doShit(), 3000);
setInterval(() => getInformation(), 3000);

//function to run when user closes using ctrl+c
process.on('SIGINT', unexportOnClose);

// setInterval(() => sendMoney(), 4000);
// setInterval(() => sendPower(), 3000);
// setInterval(() => getInformation(consumerAddress), 5000);
// setInterval(() => getInformation(prosumerAddress), 5000);
