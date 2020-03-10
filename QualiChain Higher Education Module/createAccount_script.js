const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/66a470c1158f441cac9c502cd63d4b9b');
const result = web3.eth.accounts.create();
const pk = result.privateKey;
console.log('Address: ' + result.address);
console.log('Private Key: ' + pk);

 web3.eth.accounts.wallet.create();
web3.eth.accounts.wallet.add(pk);

var encWallet = web3.eth.accounts.wallet.encrypt("ist_qualichain");
console.log(encWallet);
fs.writeFileSync("keystore", JSON.stringify(encWallet));