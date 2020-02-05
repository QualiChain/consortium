pragma solidity >=0.4.22 <0.6.0;

contract IST {
    address owner;
    mapping(uint => bytes32) certificates;
    
    constructor() public{
        owner = msg.sender;
    }
    
    modifier isOwner() {
        require(owner == msg.sender);
        _;
    }
    
    function registerCertificate(uint id, bytes32 hash) isOwner public{
        certificates[id] = hash;
    }
    
    function revokeCertificate(uint id) isOwner public{
        certificates[id] = 0;
    }
    
    function verifyCertificate(uint id) public view returns (bytes32 hash) {
        if(certificates[id] != 0) {
            return certificates[id];
        }
    }
}