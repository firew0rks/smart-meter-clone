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

var consumerAddress = "0x2621f5977744ecd8f08e946f67b0a04dd47d99b0";
var prosumerAddress = "0xf718d02a8b2937db3fce8e006019a6748677ae5e";

// variables for the production and consumption states and rates
var consuming;

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

function unexportOnClose() { //function to run when exiting program
  //LED.writeSync(0); // Turn LED off
  //LED.unexport(); // Unexport LED GPIO to free resources
  light.unexport(); // Unexport Button GPIO to free resources
};

// define function to run each time, checking the production/consumption_rate
// and instigating appropriate processes
function doShit() {
  // if we are consuming, instigate the buy order
  if (consuming) {
    sendMoney();
  }
}


instantiateContract();

//Watch for hardware interrupts on pushButton GPIO, specify callback function
light.watch(function (err, value) {
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  consuming = value;
  //console.log("pin value is ", value);
});

// set our interval to run and call the functions
setInterval(() => doShit(), 3000);

//function to run when user closes using ctrl+c
process.on('SIGINT', unexportOnClose);

// setInterval(() => sendMoney(), 4000);
// setInterval(() => sendPower(), 3000);
// setInterval(() => getInformation(consumerAddress), 5000);
// setInterval(() => getInformation(prosumerAddress), 5000);
