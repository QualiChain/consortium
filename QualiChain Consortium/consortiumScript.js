const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/66a470c1158f441cac9c502cd63d4b9b');

const account = '0x2CefB619218825C0c670D8E77f7039e0693E1dDC';
const privateKey = Buffer.from('26020431000baecb5e0ae79cc2fca00a8c4ce6e299889dcaa3a12b469383f2b5', 'hex');

const consortiumContractAdd = '0x776563F3292972c4f827a58b1B0e701572698cd2';
const contractABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"internalType":"address","name":"id","type":"address"},{"internalType":"uint256","name":"vote","type":"uint256"}],"name":"cancelHEI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"vote","type":"uint256"}],"name":"changeThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"id","type":"address"}],"name":"getHEI","outputs":[{"internalType":"address","name":"add","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPollingInfo","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"id","type":"address"},{"internalType":"address","name":"contractAddress","type":"address"}],"name":"registerFounderHEI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"id","type":"address"},{"internalType":"address","name":"contractAddress","type":"address"},{"internalType":"uint256","name":"vote","type":"uint256"}],"name":"registerHEI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const consortiumContract = new web3.eth.Contract(contractABI,consortiumContractAdd);


consortiumContract.methods.getPollingInfo().call((consortiumErr,data) => {
	if(consortiumErr == null) {
		if(data[0].length != 0) {
			for(var i = 0; i < data[0].length; i++) {
				var node = document.querySelector("div[data-type='template']").cloneNode(true);
				node.querySelector("strong").textContent = "did:ethr:" + data[0][i];
				node.querySelector("span").textContent = "Contract Address -> " + data[1][i];
				node.querySelectorAll("button")[0].addEventListener("click", function() {
					registerVote(this,true);
				});
				node.querySelectorAll("button")[1].addEventListener("click", function() {
					registerVote(this,false);
				});
				node.style.display = "block";
				document.getElementById("registerSection").appendChild(node);
			}
			
		}

		if(data[2].length != 0) {
			for(var i = 0; i < data[2].length; i++) {
				var node = document.querySelector("div[data-type='template']").cloneNode(true);
				node.querySelector("strong").textContent = "did:ethr:" + data[2][i];
				node.querySelector("span").textContent = "";
				node.querySelectorAll("button")[0].addEventListener("click", function() {
					cancelVote(this,true);
				});
				node.querySelectorAll("button")[1].addEventListener("click", function() {
					cancelVote(this,false);
				});;
				node.style.display = "block";
				document.getElementById("cancelSection").appendChild(node);
			}
		}
		
		if(data[3] != 0) {
			var node = document.querySelector("div[data-type='template']").cloneNode(true);
			node.querySelector("strong").textContent = "Threshold Value -> " + data[3];
			node.querySelector("span").textContent = "";
			node.querySelectorAll("button")[0].addEventListener("click", function() {
					thresholdVote(this,true);
				});
			node.querySelectorAll("button")[1].addEventListener("click", function() {
					thresholdVote(this,false);
				});;
			node.style.display = "block";
			document.getElementById("thresholdSection").appendChild(node);
		}
	}
})


function registerHEI() {
	var input1 = document.getElementById("registerInput1").value.split(':')[2];
	var data = consortiumContract.methods.registerHEI(input1,document.getElementById("registerInput2").value,1).encodeABI();

	web3.eth.getTransactionCount(account, (err,txCount) => {
		const txObject = {
	    nonce: web3.utils.toHex(txCount),
	    gasLimit: web3.utils.toHex(3000000),
	    gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
	    to: consortiumContractAdd,
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
}


function registerVote(node, positive) {  
    var HEI_identifier = node.parentNode.parentNode.querySelector("strong").textContent.replace('did:ethr:','');
    var contractAdd = node.parentNode.parentNode.parentNode.querySelector("span").textContent.replace('Contract Address -> ','');

    var root = node.parentNode.parentNode.parentNode.parentNode;
    root.parentNode.removeChild(root);

    if(positive) {
    	var data = consortiumContract.methods.registerHEI(HEI_identifier,contractAdd,1).encodeABI();
    }

    else{
    	var data = consortiumContract.methods.registerHEI(HEI_identifier,contractAdd,2).encodeABI();
    }
	
	web3.eth.getTransactionCount(account, (err,txCount) => {
		const txObject = {
	    nonce: web3.utils.toHex(txCount),
	    gasLimit: web3.utils.toHex(3000000),
	    gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
	    to: consortiumContractAdd,
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
}


function cancelHEI() {
	var input1 = document.getElementById("cancelInput1").value.split(':')[2];
	var data = consortiumContract.methods.cancelHEI(input1,1).encodeABI();

	web3.eth.getTransactionCount(account, (err,txCount) => {
		const txObject = {
	    nonce: web3.utils.toHex(txCount),
	    gasLimit: web3.utils.toHex(3000000),
	    gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
	    to: consortiumContractAdd,
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
}

function cancelVote(node, positive) {   
    var HEI_identifier = node.parentNode.parentNode.querySelector("strong").textContent.replace('did:ethr:','');

    var root = node.parentNode.parentNode.parentNode.parentNode;
    root.parentNode.removeChild(root);

    if(positive) {
    	var data = consortiumContract.methods.cancelHEI(HEI_identifier,1).encodeABI();
    }

    else{
    	var data = consortiumContract.methods.cancelHEI(HEI_identifier,2).encodeABI();
    }
	
	web3.eth.getTransactionCount(account, (err,txCount) => {
		const txObject = {
	    nonce: web3.utils.toHex(txCount),
	    gasLimit: web3.utils.toHex(3000000),
	    gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
	    to: consortiumContractAdd,
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
}

function changeThreshold() {
	var data = consortiumContract.methods.changeThreshold(document.getElementById("thresholdInput1").value,1).encodeABI();

	web3.eth.getTransactionCount(account, (err,txCount) => {
		const txObject = {
	    nonce: web3.utils.toHex(txCount),
	    gasLimit: web3.utils.toHex(3000000),
	    gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
	    to: consortiumContractAdd,
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
}

function thresholdVote(node, positive) {   
    var value = node.parentNode.parentNode.querySelector("strong").textContent.replace('Threshold Value -> ','');

    var root = node.parentNode.parentNode.parentNode.parentNode;
    root.parentNode.removeChild(root);

    if(positive) {
    	var data = consortiumContract.methods.changeThreshold(value,1).encodeABI();
    }

    else{
    	var data = consortiumContract.methods.changeThreshold(value,2).encodeABI();
    }
	
	web3.eth.getTransactionCount(account, (err,txCount) => {
		const txObject = {
	    nonce: web3.utils.toHex(txCount),
	    gasLimit: web3.utils.toHex(3000000),
	    gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
	    to: consortiumContractAdd,
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
}





