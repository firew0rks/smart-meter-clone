pragma solidity ^0.4.18;

contract Power{

    //uint energy_generated = 100; //(watts) hard coded amount of electricity generated
    uint base_rate;
    uint peak_rate;
    uint current_rate;
    uint energy_threshold = 10; // energy prodcued over 10 watts/hr generated --> sell energy
    address consumer_addr;
    

    struct User{
      uint token_balance;
      uint production_rate;
      uint consumption_rate;
    }

    mapping(address => User) user_list;

    //  HARD CODED CONSUMER AND prosumerS - perhaps what we could do, is find all the people who are producing excess energy, (check if they want to sell) and exchange it with people who are not producing excess energ
    // ADD EXTRA VARIABLE FOR o GENERATED
    function Power() public {
      base_rate = 16; //cents/kwh, originally 15.86. However, Solidity does not let you have decimal points.
      peak_rate = 58; //cents/kwh, originally 58.33 " " "
      current_rate = base_rate;
      consumer_addr = msg.sender; // we are the consumer
      user_list[consumer_addr].token_balance = msg.sender.balance;
    }


    function set_rate (uint time) public {
      if((time >= 14) || (time < 20)){
        current_rate = peak_rate;
      }
      else{
        current_rate = base_rate;
      }
    }

    function get_rate() constant public returns(uint) {
        return current_rate;
    }

    // Set prosumer address
    function set_prosumer(address prosumer_addr, uint energy_generated) public{
      user_list[prosumer_addr].token_balance = prosumer_addr.balance;
      user_list[prosumer_addr].production_rate = energy_generated;
    }


    // Function: Transfers tokens from consumer to prosumer if the consumer has enough tokens. Transfer energy to prosumer.
    function token_transfer(address consumer, address prosumer_addr) public{
      uint cost = current_rate * ((user_list[prosumer_addr].production_rate)-energy_threshold);

        // checks if there's enough tokens in wallet, and checks that producer is producing enough energy
      if ((cost < consumer.balance) && (user_list[prosumer_addr].production_rate > energy_threshold)){
        prosumer_addr.transfer(cost);

        // Updating the consumption rate of the consumer and the production rate of the prosumer, assuming that the consumer consumes ALL of the energy produced
        user_list[consumer].consumption_rate += user_list[prosumer_addr].production_rate;
        user_list[prosumer_addr].production_rate = 0;
      }
    }

    // Function: Return energy production rate of prosumer
    function get_energy_produced(address prosumer_addr) public view returns(uint) {
      return user_list[prosumer_addr].production_rate;
    }


}
