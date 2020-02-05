pragma solidity >=0.4.22 <0.6.0;

contract Management {
    uint threshold;
    address owner;
    uint counterHEI;
    mapping(address => address) contracts;

    bool votingThreshold = false;
    struct ThresholdVote {
        uint value;
        uint voteCounter;
        mapping(address => bool) voters;
    }
    ThresholdVote currentThresholdVoting;

    bool votingHEI = false;
    struct HEIVote {
        address id;
        address contractAddress;
        uint voteCounter;
        mapping(address => bool) voters;
    }
    HEIVote currentHEIVoting;

    bool votingCancel = false;
    struct CancelVote {
        address id;
        uint voteCounter;
        mapping(address => bool) voters;
    }
    CancelVote currentCancelVoting;

    constructor() public{
        owner = msg.sender;
        threshold = 2;
        counterHEI = 0;
    }

    modifier isOwner() {
        require(owner == msg.sender);
        _;
    }

    modifier isAssociate() {
        require(contracts[msg.sender] != address(0));
        _;
    }
    
    function registerHEI(address id, address contractAddress) isAssociate public{
        if(contractAddress == contracts[id]) {
            revert("Voting already finished.");
        }
        else if(!votingHEI) {
            currentHEIVoting.id = id;
            currentHEIVoting.contractAddress = contractAddress;
            currentHEIVoting.voteCounter = 1;
            currentHEIVoting.voters[msg.sender] = true;
            votingHEI = true;
        }
        else if(currentHEIVoting.voters[msg.sender] != false) {
            revert("You already voted.");
        }
        else if(id != currentHEIVoting.id || contractAddress != currentHEIVoting.contractAddress) {
            revert("No ongoing voting process for those values.");
        }
        else {
            currentHEIVoting.voteCounter++;
            currentHEIVoting.voters[msg.sender] = true;
        }

        if(currentHEIVoting.voteCounter >= threshold) {
            contracts[id] = contractAddress;
            counterHEI++;
            votingHEI = false;
            delete currentHEIVoting;
        }
    }

    function cancelHEI(address id) isAssociate public{
        if(contracts[id] == address(0)) {
            revert("Voting already finished.");
        }
        else if(!votingCancel) {
            currentCancelVoting.id = id;
            currentCancelVoting.voteCounter = 1;
            currentCancelVoting.voters[msg.sender] = true;
            votingCancel = true;
        }
        else if(currentCancelVoting.voters[msg.sender] != false) {
            revert("You already voted.");
        }
        else if(id != currentCancelVoting.id) {
            revert("No ongoing canceling process for that identifier.");
        }
        else {
            currentCancelVoting.voteCounter++;
            currentCancelVoting.voters[msg.sender] = true;
        }

        if(currentCancelVoting.voteCounter >= threshold) {
            delete contracts[id];
            counterHEI--;
            votingCancel = false;
            delete currentCancelVoting;
        }
    }

    function getHEI(address id) public view returns (address add) {
        return contracts[id];
    }

    function changeThreshold(uint value) isAssociate public{
        if(value == threshold) {
            revert("Voting already finished.");
        }
        else if(!votingThreshold) {
            currentThresholdVoting.value = value;
            currentThresholdVoting.voteCounter = 1;
            currentThresholdVoting.voters[msg.sender] = true;
            votingThreshold = true;
        }
        else if(currentThresholdVoting.voters[msg.sender] != false) {
            revert("You already voted.");
        }
        else if(value != currentThresholdVoting.value) {
            revert("No ongoing voting process for that value.");
        }
        else {
            currentThresholdVoting.voteCounter++;
            currentThresholdVoting.voters[msg.sender] = true;
        }

        if(currentThresholdVoting.voteCounter >= threshold) {
            threshold = value;
            votingThreshold = false;
            delete currentThresholdVoting;
        }
    }

    function registerFounderHEI(address id, address contractAddress) isOwner public {
        if(counterHEI < 3) {
            contracts[id] = contractAddress;
            counterHEI++;
        }
        else {
            revert("Minimum number of Higher Education Institutions was already reached.");
        }
    }
}