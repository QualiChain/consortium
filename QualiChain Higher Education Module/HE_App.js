const fs = require('fs');
const crypto = require('crypto');
const Tx = require('ethereumjs-tx').Transaction;
const chokidar = require('chokidar');
const IPFS = require('ipfs');
var IPFSNode = null;
const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/66a470c1158f441cac9c502cd63d4b9b');

const account = '0x2CefB619218825C0c670D8E77f7039e0693E1dDC';
const privateKey = Buffer.from('26020431000baecb5e0ae79cc2fca00a8c4ce6e299889dcaa3a12b469383f2b5', 'hex');

const certificateDirectory = 'Certificates';

const contractAddress = '0xc2C6789CbdA002E2607296e6e22a827B1C11B0F5';
const contractABI = [{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"revokeCertificate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"verifyCertificate","outputs":[{"name":"hash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"hash","type":"bytes32"}],"name":"registerCertificate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

const contract = new web3.eth.Contract(contractABI,contractAddress);

var txCount = 0;

web3.eth.getTransactionCount(account, (err,count) => {
  txCount = count;

  const registerWatcher = chokidar.watch(certificateDirectory + "/registered_certificates" , {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    awaitWriteFinish: true,
    ignorePermissionErrors: true
  });

  registerWatcher.on('add', function(path) {
    registerCertificate(path);

  });

  const revokeWatcher = chokidar.watch(certificateDirectory + "/revoked_certificates" , {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    awaitWriteFinish: true
  });

  revokeWatcher.on('add', function(path) {
    setTimeout(function() {
      console.log('Deleting a certificate');
    }, 1000);
    revokeCertificate(path);

  })
});

console.log("QualiChain Higher Education Application is running...");

function registerCertificate(path) {
  console.log("Building the transaction")
  var id = path.split('/')[2].split('.')[0];
  var fileBytes = fs.readFileSync(path);

  var hashFunction = crypto.createHash('sha256');
  hashFunction.update(fileBytes);
  var hash = hashFunction.digest();

  var numberId = parseInt(id);
  var hashBytes = '0x' + hash.toString('hex');

  var data = contract.methods.registerCertificate(numberId,hashBytes).encodeABI();  

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

  txCount++;

  web3.eth.sendSignedTransaction(txData, (err,txHash) => {
    if(err == null) {
      console.log('Transaction hash: ', txHash);

      registerIPFS(path, fileBytes);
    }
    else {
      console.log(err);
    }
  })
}


function revokeCertificate(path) {
  var id = path.split('/')[2].split('.')[0];

  var data = contract.methods.revokeCertificate(parseInt(id)).encodeABI();

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

  txCount++;

  web3.eth.sendSignedTransaction(txData, (err,txHash) => {
    console.log("Certificate deleted")
    console.log('Transaction hash: ', txHash);
  })
}


async function registerIPFS(completePath, fileBytes) {
  if(IPFSNode == null) {
    IPFSNode = await IPFS.create({silent: true});
  }

  const path = completePath.split('/')[2];

  try
  {
    console.log('Adding certificate to IPFS')
    const filesAdded = await IPFSNode.add({
      path: completePath,
      content: fileBytes
    })

    for await (const result of IPFSNode.add(fileBytes)) {
      console.log("IPFS file path: " + result.path)
      console.log("IPFS file multihash: " + JSON.stringify(result.cid.multihash))
    }
  }
  catch (error)
  {
	  console.log(error)
  }

}
