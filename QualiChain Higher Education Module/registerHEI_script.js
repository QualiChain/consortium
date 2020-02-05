const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/66a470c1158f441cac9c502cd63d4b9b');

const account = '0xfCDf7D4df540764c8f7dC775892FfD6E9CB046C3';
const privateKey = Buffer.from('3fde1335504923630673da70f990f78caa40c79b4412a3e1cf8eb3f7055982dd', 'hex');

const contractAddress = '0x411bC3D2C4179e05ff0Fd864F25449f66eb48F11';
const contractABI = [{"constant":true,"inputs":[{"name":"id","type":"address"}],"name":"getContract","outputs":[{"name":"add","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"address"}],"name":"cancelContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"address"},{"name":"add","type":"address"}],"name":"registerContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

const contract = new web3.eth.Contract(contractABI,contractAddress);


const id = '0x2CefB619218825C0c670D8E77f7039e0693E1dDC';
const add = '0xc2C6789CbdA002E2607296e6e22a827B1C11B0F5';


var data = contract.methods.registerContract(id,add).encodeABI();

web3.eth.getTransactionCount(account, (err,txCount) => {
	const txObject = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(3000000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
    to: contractAddress,
    data: data
  };  

  const tx = new Tx(txObject,{'chain':'ropsten'});
  tx.sign(privateKey);
  const serializedTx = tx.serialize();

  const txData = '0x' + serializedTx.toString('hex');

  web3.eth.sendSignedTransaction(txData, (err,txHash) => {
    console.log('Err: ' + err + ' Transaction hash: ', txHash);
  })
});