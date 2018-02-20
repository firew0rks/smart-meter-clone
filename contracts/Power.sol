pragma solidity ^0.4.18;

contract Power{

    uint energy_generated = 100; //(watts) hard coded amount of electricity generated
    uint baserate;
    uint peakrate;
    uint energy_threshold = 10; // energy prodcued over 10 watts/hr generated --> sell energy
    address consumer_addr;
    address prosumer_addr;

    struct Consumer{
      uint token_balance;
      uint energy_balance;
    }

    struct Prosumer{
      uint token_balance;
      uint energy_produced;
    }

//
    mapping (address => Consumer) consumer_list;
    mapping (address => Prosumer) prosumer_list;

    //  HARD CODED CONSUMER AND prosumerS - perhaps what we could do, is find all the people who are producing excess energy, (check if they want to sell) and exchange it with people who are not producing excess energ
    // ADD EXTRA VARIABLE FOR ENERGY GENERATED
    function Power() public {
      baserate = 15; //15 cent on base/watt
      peakrate = 50; //50 cent on peak/watt
      consumer_addr = msg.sender; // we are the consumer
      prosumer_addr = 0xf17f52151EbEF6C7334FAD080c5704D77216b732;
      consumer_list[consumer_addr].token_balance = msg.sender.balance;
      prosumer_list[prosumer_addr].energy_produced = energy_generated;
      consumer_list[consumer_addr].energy_balance = prosumer_list[prosumer_addr].energy_produced;     // THis should be defined AFTER they buy energy
      prosumer_list[prosumer_addr].token_balance = prosumer_addr.balance;
    }

    // Function: Transfers tokens from consumer to prosumer if the consumer has enough tokens. Transfer energy to prosumer.
    function token_transfer(address consumer_addr, address prosumer_addr) public returns(bool){
      uint cost = baserate * prosumer_list[prosumer_addr].energy_produced;

        // checks if there's enough tokens in wallet, and checks that producer is producing enough energy
      if ((cost < consumer_addr.balance) && (prosumer_list[prosumer_addr].energy_produced > energy_threshold)){
        prosumer_addr.transfer(cost);
        consumer_list[consumer_addr].energy_balance += prosumer_list[prosumer_addr].energy_produced;
      } else {
        return false;
      }
    }

    // Function: Decrease amount of energy a consumer has as they use up energy. Return amount of electricity left.
    function check_energy_left(address prosumer_addr, uint energy_used) public returns(uint) {
        prosumer_list[prosumer_addr].energy_produced -= energy_used;

        return prosumer_list[prosumer_addr].energy_produced ;
    }


    // Add received energy - how much the person has received by transferring the emoney

}
