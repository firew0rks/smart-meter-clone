pragma solidity ^0.4.18;

contract Power {
  uint value;

  function Power() public {
    value = 2;
  }

  function getValue() public view returns (uint) {
    return value;
  }
}