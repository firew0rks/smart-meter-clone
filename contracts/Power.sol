pragma solidity ^0.4.18;

contract Power {

  uint value;

  function Power(uint val) public {
    value = val;
  }

  function getValue() public view returns (uint) {
    return value;
  }

  function setValue(uint v) public {
    value = v;
  }
}
