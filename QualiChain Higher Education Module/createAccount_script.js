const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/66a470c1158f441cac9c502cd63d4b9b');

console.log(web3.eth.accounts.create());


/* web3.eth.accounts.wallet.create();
web3.eth.accounts.wallet.add('0x26020431000baecb5e0ae79cc2fca00a8c4ce6e299889dcaa3a12b469383f2b5');

var encWallet = web3.eth.accounts.wallet.encrypt("ist_qualichain");
console.log(encWallet);
fs.writeFileSync("keystore", JSON.stringify(encWallet)); */