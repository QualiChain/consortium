const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/66a470c1158f441cac9c502cd63d4b9b');

const account = '0xf7066c0d4f1602Bc6F5eBb1996968CAe4ecA8d82';
const privateKey = Buffer.from('275a3df52aa81a783e165c598601efa70c520800adce494e052f5836ce13c9b3', 'hex');
const consortiumContractAdd = '0xf61d21d39479d76d945709a61FCF9CD95D595283';
const contractABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"internalType":"address","name":"id","type":"address"},{"internalType":"uint256","name":"vote","type":"uint256"}],"name":"cancelHEI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"vote","type":"uint256"}],"name":"changeThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"id","type":"address"}],"name":"getHEI","outputs":[{"internalType":"address","name":"add","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPollingInfo","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"id","type":"address"},{"internalType":"address","name":"contractAddress","type":"address"}],"name":"registerFounderHEI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"id","type":"address"},{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"uint256","name":"vote","type":"uint256"}],"name":"registerHEI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const QualichainAddress ='0xf7066c0d4f1602Bc6F5eBb1996968CAe4ecA8d82'
const QualichainContractAddress ='0xf61d21d39479d76d945709a61FCF9CD95D595283'

const HEI2Address ='0xdbEB3C11a53b6Eb3d63cc29FB803155dEdEcbFCF'
const HEI2ContractAddress ='0x97C6cB62d315A619C8582C3DbE058A148137AF72'

const HEI3Address ='0x4658d9908D539505ddb320a39456263F1d0c01DE'
const HEI3ContractAddress ='0x61d03aeFe8DC842D52308eC17497201123E4fb1a'


const consortiumContract = new web3.eth.Contract(contractABI,consortiumContractAdd);

let registerQualichain = consortiumContract.methods.registerFounderHEI(QualichainAddress,QualichainContractAddress).encodeABI();
let registerHEI2 = consortiumContract.methods.registerFounderHEI(HEI2Address,HEI2ContractAddress).encodeABI();
let registerHEI3 = consortiumContract.methods.registerFounderHEI(HEI3Address,HEI3ContractAddress).encodeABI();

web3.eth.getTransactionCount(account, (err,txCount) => {
    const txObject = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(3000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
        to: consortiumContractAdd,
        data: registerQualichain
    };

    const tx = new Tx(txObject,{'chain':'ropsten'});
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const txData = '0x' + serializedTx.toString('hex');

    web3.eth.sendSignedTransaction(txData, (err,txHash) => {
        if (err)    {
            console.log('Error: ' + err)
        }
        console.log('Transaction hash: ', txHash);
    })
});



web3.eth.getTransactionCount(account, (err,txCount) => {
    const txObject = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(3000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('100','gwei')),
        to: consortiumContractAdd,
        data: registerHEI2
    };

    const tx = new Tx(txObject,{'chain':'ropsten'});
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const txData = '0x' + serializedTx.toString('hex');

    web3.eth.sendSignedTransaction(txData, (err,txHash) => {
        if (err)    {
            console.log('Error: ' + err)
        }
        console.log('Transaction hash: ', txHash);
    })
});


web3.eth.getTransactionCount(account, (err,txCount) => {
    const txObject = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(3000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('100','gwei')),
        to: consortiumContractAdd,
        data: registerHEI3
    };

    const tx = new Tx(txObject,{'chain':'ropsten'});
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const txData = '0x' + serializedTx.toString('hex');

    web3.eth.sendSignedTransaction(txData, (err,txHash) => {
        if (err)    {
            console.log('Error: ' + err)
        }
        console.log('Transaction hash: ', txHash);
    })
});

