pragma solidity ^0.4.18;

contract Power{

    //uint energy_generated = 100; //(watts) hard coded amount of electricity generated
    uint baserate;
    uint peakrate;
    uint energy_threshold = 10; // energy prodcued over 10 watts/hr generated --> sell energy
    address consumer_addr;
    address prosumer_addr;

    struct User{
      uint token_balance;
      uint energy_balance;
      /* uint total_useage; */
    }

    mapping (address => User) consumer_list;
    mapping (address => User) prosumer_list;

    //  HARD CODED CONSUMER AND prosumerS - perhaps what we could do, is find all the people who are producing excess energy, (check if they want to sell) and exchange it with people who are not producing excess energ
    // ADD EXTRA VARIABLE FOR ENERGY GENERATED
    function Power() public {
      baserate = 15; //15 cent on base/watt
      peakrate = 50; //50 cent on peak/watt
      energy_generated = 0;
      consumer_addr = msg.sender; // we are the consumer
      consumer_list[consumer_addr].token_balance = msg.sender.balance;
    }

    // Function: Transfers tokens from consumer to prosumer if the consumer has enough tokens. Transfer energy to prosumer.
    function token_transfer(address consumer_addr, address prosumer_addr) public returns(bool){
      uint cost = baserate * (prosumer_list[prosumer_addr].(energy_balance)-energ;

        // checks if there's enough tokens in wallet, and checks that producer is producing enough energy
      if ((cost < consumer_addr.balance) && (prosumer_list[prosumer_addr].energy_produced > energy_threshold)){
        prosumer_addr.transfer(cost);
        consumer_list[consumer_addr].energy_balance += (prosumer_list[prosumer_addr].energy_produced - energy_threshold);
        return true;
      } else {
        return false;
      }
    }

    // Function: set energy produced by the prosumer
    function set_energy_produced(address prosumer_addr, uint energy_produced) public returns(uint) {
      prosumer_list[prosumer_addr].energy_produced = energy_produced;
    }


    /* // Function: Decrease amount of energy a consumer has as they use up energy. Return amount of electricity left.
    function check_energy_left(address prosumer_addr, uint energy_used) public returns(uint) {
        prosumer_list[prosumer_addr].energy_produced -= energy_used;

        return prosumer_list[prosumer_addr].energy_produced ;
    } */

    // Set prosumer address
    function set_prosumer(address prosumer_addr, uint energy_generated) public returns (address){
      prosumer_list[prosumer_addr].token_balance = prosumer_addr.balance();
      prosumer_list[prosumer_addr].energy_balance = energy_generated;
    }
    // Set rate charged (demand dependant)


}
