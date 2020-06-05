pragma solidity >=0.4.22 <0.6.0;

contract Consortium {
    uint threshold;
    address owner;
    uint counterHEI;
    mapping(address => address) contracts;
    mapping(address => HEIVote) registerPolls;
    mapping(address => CancelVote) cancelPolls;

    address[] registerIdArray;
    address[] registerContractArray;
    address[] heiList;
    address[] cancelIdArray;

    bool votingThreshold = false;
    struct ThresholdVote {
        uint value;
        uint positiveVoteCounter;
        uint negativeVoteCounter;
        mapping(address => uint) voters;
        address[] votersId;
    }
    ThresholdVote currentThresholdVoting;

    struct HEIVote {
        address contractAddress;
        uint positiveVoteCounter;
        uint negativeVoteCounter;
        mapping(address => uint) voters;
        address[] votersId;
    }

    struct CancelVote {
        uint positiveVoteCounter;
        uint negativeVoteCounter;
        mapping(address => uint) voters;
        address[] votersId;
    }

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
        require(contracts[msg.sender] != address(0) && counterHEI > 2);
        _;
    }

    function getPollingInfo()public view returns(address[] memory, address[] memory, address[] memory, uint){
        return(registerIdArray, registerContractArray, cancelIdArray, currentThresholdVoting.value);
    }
    
    

    function getConsortiumInfo()public view returns(address[] memory, uint){
        return(heiList, counterHEI);
    }
    
    function registerHEI(address id, address contractAddress, uint vote) isAssociate public{
        if(vote != 1 && vote != 2) {
            revert("Invalid voting value!");
        }
        else if(contractAddress == contracts[id]) {
            revert("Voting already finished.");
        }
        else if(registerPolls[id].positiveVoteCounter == 0) {
            registerPolls[id].contractAddress = contractAddress;
            registerPolls[id].positiveVoteCounter = 1;
            registerPolls[id].votersId.push(msg.sender);
            registerPolls[id].voters[msg.sender] = 1;

            registerIdArray.push(id);
            registerContractArray.push(contractAddress);
        }
        else if(registerPolls[id].voters[msg.sender] != 0) {
            revert("You already voted.");
        }
        else if(contractAddress != registerPolls[id].contractAddress) {
            revert("No ongoing voting process for the defined contract address value.");
        }
        else if(vote == 1){
            registerPolls[id].positiveVoteCounter++;
            registerPolls[id].votersId.push(msg.sender);
            registerPolls[id].voters[msg.sender] = vote;
        }
        else {
            registerPolls[id].negativeVoteCounter++;
            registerPolls[id].votersId.push(msg.sender);
            registerPolls[id].voters[msg.sender] = vote;
        }

        if(registerPolls[id].positiveVoteCounter >= threshold) {
            contracts[id] = contractAddress;
            counterHEI++;
            removeRegisterVote(id);
            heiList.push(id);
        }
        else if(registerPolls[id].negativeVoteCounter >= threshold) {
            removeRegisterVote(id);
        }
    }

    function cancelHEI(address id, uint vote) isAssociate public{
        if(vote != 1 && vote != 2) {
            revert("Invalid voting value!");
        }
        else if(contracts[id] == address(0)) {
            revert("Voting already finished.");
        }
        else if(cancelPolls[id].positiveVoteCounter == 0) {
            cancelPolls[id].positiveVoteCounter = 1;
            cancelPolls[id].votersId.push(msg.sender);
            cancelPolls[id].voters[msg.sender] = 1;
            cancelIdArray.push(id);
        }
        else if(cancelPolls[id].voters[msg.sender] != 0) {
            revert("You already voted.");
        }
        else if(vote == 1){
            cancelPolls[id].positiveVoteCounter++;
            cancelPolls[id].votersId.push(msg.sender);
            cancelPolls[id].voters[msg.sender] = 1;
        }
        else {
            cancelPolls[id].negativeVoteCounter++;
            cancelPolls[id].votersId.push(msg.sender);
            cancelPolls[id].voters[msg.sender] = 2;
        }

        if(cancelPolls[id].positiveVoteCounter >= threshold) {
            delete contracts[id];
            counterHEI--;
            removeCancelVote(id);
        }
        else if(cancelPolls[id].negativeVoteCounter >= threshold) {
            removeCancelVote(id);
        }
    }

    function getHEI(address id) public view returns (address add) {
        return contracts[id];
    }

    function changeThreshold(uint value, uint vote) isAssociate public{
        if(value == threshold) {
            revert("Voting already finished.");
        }
        else if(!votingThreshold) {
            currentThresholdVoting.value = value;
            currentThresholdVoting.positiveVoteCounter = 1;
            currentThresholdVoting.votersId.push(msg.sender);
            currentThresholdVoting.voters[msg.sender] = 1;
            votingThreshold = true;
        }
        else if(currentThresholdVoting.voters[msg.sender] != 0) {
            revert("You already voted.");
        }
        else if(value != currentThresholdVoting.value) {
            revert("No ongoing voting process for that value.");
        }
        else if(vote == 1){
            currentThresholdVoting.positiveVoteCounter++;
            currentThresholdVoting.votersId.push(msg.sender);
            currentThresholdVoting.voters[msg.sender] = 1;
        }
        else {
            currentThresholdVoting.negativeVoteCounter++;
            currentThresholdVoting.votersId.push(msg.sender);
            currentThresholdVoting.voters[msg.sender] = 2;
        }

        if(currentThresholdVoting.positiveVoteCounter >= threshold) {
            threshold = value;
            votingThreshold = false;
            removeThresholdVote();
        }
        else if(currentThresholdVoting.negativeVoteCounter >= threshold) {
            votingThreshold = false;
            removeThresholdVote();
        }
    }

    function registerFounderHEI(address id, address contractAddress) isOwner public {
        if(counterHEI < 3) {
            contracts[id] = contractAddress;
            counterHEI++;
            heiList.push(contractAddress);
        }
        else {
            revert("Minimum number of Higher Education Institutions was already reached.");
        }
    }

    // AUXILIARY FUNCTIONS

    function removeRegisterVote(address id) private {
        for(uint i = 0; i<registerPolls[id].votersId.length; i++) {
            registerPolls[id].voters[registerPolls[id].votersId[i]] = 0;
        }
        delete registerPolls[id];

        for(uint i = 0; i<registerIdArray.length; i++) {
            if(registerIdArray[i] == id) {
                registerIdArray[i] = registerIdArray[registerIdArray.length-1];
                registerContractArray[i] = registerContractArray[registerContractArray.length-1];
                break;
            }
        }

        delete registerIdArray[registerIdArray.length-1];
        delete registerContractArray[registerContractArray.length-1];
        registerIdArray.length--;
        registerContractArray.length--;
    }

    function removeCancelVote(address id) private {
        for(uint i = 0; i<cancelPolls[id].votersId.length; i++) {
            cancelPolls[id].voters[cancelPolls[id].votersId[i]] = 0;
        }
        delete cancelPolls[id];

        for(uint i = 0; i<cancelIdArray.length; i++) {
            if(cancelIdArray[i] == id) {
                cancelIdArray[i] = cancelIdArray[cancelIdArray.length-1];
                break;
            }
        }

        delete cancelIdArray[cancelIdArray.length-1];
        cancelIdArray.length--;
    }

    function removeThresholdVote() private {
        for(uint i = 0; i<currentThresholdVoting.votersId.length; i++) {
            currentThresholdVoting.voters[currentThresholdVoting.votersId[i]] = 0;
        }
        delete currentThresholdVoting;
    }
}
