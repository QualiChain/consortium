const fs = require('fs');
const crypto = require('crypto');
const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/66a470c1158f441cac9c502cd63d4b9b');

const managementAddress = '0x411bC3D2C4179e05ff0Fd864F25449f66eb48F11';
const managementABI = [{"constant":true,"inputs":[{"name":"id","type":"address"}],"name":"getContract","outputs":[{"name":"add","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"address"}],"name":"cancelContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"address"},{"name":"add","type":"address"}],"name":"registerContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
const managementContract = new web3.eth.Contract(managementABI,managementAddress);

const issuerContractABI = [{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"revokeCertificate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"verifyCertificate","outputs":[{"name":"hash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"hash","type":"bytes32"}],"name":"registerCertificate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

document.getElementById("mybutton").innerHTML = "Verify";

function verifyCertificate() {
	var button = document.getElementById("mybutton");

	if(button.textContent == "Verify") {

		if(document.getElementById('upload-file').files[0] != null) {
			var issuerId = checkIssuerId(document.getElementById("HEId").value);
			if(issuerId == null) {
				return;
			}

			var id = checkCivilId(document.getElementById("civilId").value);
			if(id == null) {
				return;
			}

			document.getElementById("resultText").style.color = "black";

			managementContract.methods.getContract(issuerId).call((managementErr,issuerContractAddress) => {

				if(managementErr == null && issuerContractAddress != '0x0') {
					const issuerContract = new web3.eth.Contract(issuerContractABI,issuerContractAddress);

					issuerContract.methods.verifyCertificate(id).call((err,certificateHash) => {
						if(err == null) {
							var fileBytes = fs.readFileSync(document.getElementById('upload-file').files[0].path);

							var hashFunction = crypto.createHash('sha256');
			    			hashFunction.update(fileBytes);
			    			var bytes = hashFunction.digest();
			    			var hashBytes = '0x' + bytes.toString('hex');

			    			console.log(certificateHash);

			    			if(hashBytes == certificateHash) {
			    				document.getElementById("inputBoxHE").style.display = "none";

			    				document.getElementById("inputBox").style.display = "none";

								document.getElementById("result").style.display = "block";

								document.getElementById("resultText").innerHTML = "Successful certificate verification";

								button.innerHTML = "Back";
			    			}
			    			else {
			    				document.getElementById("inputBoxHE").style.display = "none";

			    				document.getElementById("inputBox").style.display = "none";

								document.getElementById("result").style.display = "block";

								document.getElementById("resultText").innerHTML = "Certificate rejected";

								button.innerHTML = "Back";
			    			}
						}
						else {
			    			document.getElementById("inputBoxHE").style.display = "none";

							document.getElementById("inputBox").style.display = "none";

							document.getElementById("result").style.display = "block";

							document.getElementById("resultText").innerHTML = "Verification failure. Try again";

							button.innerHTML = "Back";
						}
					})
				}
				else if(issuerContractAddress == '0x0') {
					document.getElementById("inputBoxHE").style.display = "none";

					document.getElementById("inputBox").style.display = "none";

					document.getElementById("result").style.display = "block";

					document.getElementById("resultText").innerHTML = "Issuer ID does not match any contract";

					button.innerHTML = "Back";
				}
				else {
					document.getElementById("inputBoxHE").style.display = "none";

					document.getElementById("inputBox").style.display = "none";

					document.getElementById("result").style.display = "block";

					document.getElementById("resultText").innerHTML = "Verification failure. Try again";

					button.innerHTML = "Back";
				}
				button.type = "reset";
			})
		}
		else {
			document.getElementById("result").style.display = "block";
			document.getElementById("resultText").innerHTML = "Select a file to verify";
			document.getElementById("resultText").style.color = "red";
		}
	}
	else {
		document.getElementById("result").style.display = "none";

		document.getElementById("inputBoxHE").style.display = "block";

		document.getElementById("inputBox").style.display = "block";

		document.getElementById("upload-file").value = "";

		button.innerHTML = "Verify";

	}
}

function checkIssuerId(strId) {
	if(strId == null || strId == '') {
		document.getElementById("result").style.display = "block";
		document.getElementById("resultText").innerHTML = "Insert a valid Issuer ID";
		document.getElementById("resultText").style.color = "red";
		return null;
	}
	var idArray = strId.split(':');
	if(idArray.length != 3 || idArray[0] != 'did' || idArray[1] != 'ethr'){
		document.getElementById("result").style.display = "block";
		document.getElementById("resultText").innerHTML = "Insert a valid Issuer ID";
		document.getElementById("resultText").style.color = "red";
		return null;
	}
	else if(idArray[2].length != 42 || idArray[2].slice(0,2) != '0x') {
		document.getElementById("result").style.display = "block";
		document.getElementById("resultText").innerHTML = "Insert a valid Issuer ID";
		document.getElementById("resultText").style.color = "red";
		return null;
	}
	else if(!web3.utils.isAddress(idArray[2])) {
		document.getElementById("result").style.display = "block";
		document.getElementById("resultText").innerHTML = "Insert a valid Issuer ID";
		document.getElementById("resultText").style.color = "red";
		return null;
	}
	else {
		return idArray[2];
	}
}

function checkCivilId(strId) {
	if(strId == null || strId == '') {
		document.getElementById("result").style.display = "block";
		document.getElementById("resultText").innerHTML = "Insert a valid Civil ID";
		document.getElementById("resultText").style.color = "red";
		return null;
	}
	else if(isNaN(strId)){
		document.getElementById("result").style.display = "block";
		document.getElementById("resultText").innerHTML = "Insert a valid Civil ID";
		document.getElementById("resultText").style.color = "red";
		return null;
	}
	else {
		return parseInt(strId);
	}
}
