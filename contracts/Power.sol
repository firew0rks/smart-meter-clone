pragma solidity ^0.4.18;

contract Power{
    // Define variables
    // list of people taking part
    // struct for each person containing their address, how much money they have left, how much money they are generating, history of transactions
    // Surge charge
    address[] members;
    bool transfer_success = false;
    uint energy_received = 100; //watts
    //bool isEqual = (1 == 1 seconds);
    //bool isEqual = (1 minutes == 60 seconds);
    //bool isEqual = (1 hours == 60 minutes);
    //bool isEqual = (1 days == 24 hours);
    //bool isEqual = (1 years = 365 days);

    struct Person{
      address user_address;
      uint tokens_left;
      uint energy_received; //(Come back after backend completed)
    }

    uint baserate;
    uint peakrate;

    function Power() public {
      baserate = 15; //15 cent on base/watt
      peakrate = 50; //50 cent on peak/watt
    }

    // Function: amount of tokens left
    function Balance(address user_address) constant returns (uint){
      return user_address.balance;
    }

    // Function: To check if consumer has enough tokens to buy energy
    function CheckBalanceEnough(address consumer_address, address prosumer_address) public returns(bool){
      uint cost = baserate * energy_received;
      /* prosumer_cost = cost;
      consumer_cost = -cost;  */
      if (cost > Balance(consumer_address)){
          return false;
      } else {
        prosumer_address.send(cost);
      }
    }

    function ReceiveEnergy(address prosumer_address, uint energy_amount) returns(uint) {
      uint energy = energy_received;
      return energy;
    }



    /* function transfer_energy(address consumer_address, address prosumer_addres, uint energy_amount) {

    } */





    /* // Function: Set amount of tokens to pay
    function SetToken(address user_address, uint offset) returns (uint){
      offset = cost;
      if
    } */

    // Function: Check if the token has been paid
    /* function CheckPayment(address user_address, uint tokenamount) public returns(bool){
      Person consumer = Person(user_address, user_address.balance);
      if(consumer.send(tokenamount)){
        transfer_success = true;
      }
      else {
        transfer_success = false;
      }
      return transfer_success;
    } */




  // Function: escrow - once receipt is received for token payment, transfer energy


  // Function: view historical data

  // Function: automate the report of stats after 3 years

}
