// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import Ownable from the OpenZeppelin Contracts library
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// Make Box inherit from the Ownable contract
contract BoxV2 is OwnableUpgradeable {
    uint256 private _value;

    event ValueChanged(uint256 value);

    function initialize() public initializer {
        __Ownable_init();
    }

    //This constructor serves the purpose of leaving the implementation contract in an initialized state, which is a mitigation against certain potential attacks.
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    // The onlyOwner modifier restricts who can call the store function
    function store(uint256 value) public onlyOwner {
        _value = value;
        emit ValueChanged(value);
    }

    function retrieve() public view returns (uint256) {
        return _value;
    }

    // Increments the stored value by 1
    function increment() public onlyOwner {
        _value = _value + 1;
        emit ValueChanged(_value);
    }
}
