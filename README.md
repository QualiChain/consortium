# Qualichain Portuguese PoC
The Qualichain Portuguese PoC tackles an interaction between a higher education organization, IST (or Técnico Lisboa) and AMA.
This prototype contains several modules, and mock data, at the ``Certificate Examples`` folder.
Transactions on the Ethereum Ropsten network can be verified here: https://ropsten.etherscan.io/
This proof of concept contains two mock accounts for the Ethereum blockchain, which can be used to perform the demo. 

**Note**: Some operations may fail when using the same blockcgain (Ethereum, Ropsten,...) account, e.g., deploying a smart contract with an account that has already been used to deploy the same smart contract.

## Requirements
* Nodejs version >= 10.0.0 and npm version >= 6.0.0 (tested with 10.16.1 and 10.19)

Software tested on:
* Ubuntu 18.04 bionic, 3 GB RAM, running as a virtual machine (VirtualBox)
* Ubuntu 18.04 bionic, 8 GB RAM

## QualiChain Higher Education Module

This is the module executed by a HEI. This module adds a certificate to the blockchain when it is pasted at the ``registered_certificates`` folder. A possibility is for the academic management systems (e.g., https://fenixedu.org/) to provide certificates in PDF format that are stored in that folder. Instead, if a certificate is moved to the ``revoked_certificates`` it is revoked. This is a rare operation, but that may be needed.The Ethereum accounts used in this module are stored on the ``accounts.txt`` file.
**Note**: Certificate names must be integer sequences, and end in ``.pdf``. Example: 123456789.pdf, 1.pdf

### Steps
On the ``QualiChain Higher Education Module`` directory:

1. run ``npm install`` then ``mkdir Certificates``and ``mkdir Certificates/registered_certificates``

Steps 2 and 3 are optional, as an account is already created and a smart contract deployed.

2. To create an account belonging to a higher education institution, follow the next steps: 
run ``node createAccount_script.js``

* From the output copy the Private Key to line 6 of file ``deployContract_script.js``, without the initial `0x`.
* Store the Address of the account in a file.
* Your account has to ether, so if you are using Ropsten reclaim some for free at: https://faucet.ropsten.be/ or https://ipfs.io/ipfs/QmVAwVKys271P5EQyEfVSxm7BJDKWt42A2gHvNmxLjZMps/ (ether may take up to some minutes to arrive)

3. To deploy the school contract smart contract, with the created credentails, run ``node deployContract_script.js``
 
4. Run ``npm run start``

**Note**: In case of ``Error: Returned error: replacement transaction underpriced``, wait for the pending transactions to be confirmed, and try again.

### Testing
1. Create a file called 123456789.pdf and move it to folder ``Certificates/registered_certificates``
2. Access https://ropsten.etherscan.io/, insert the address of the account (e.g., the IST account in file ``accounts.txt``) and observe that a transaction was generated. 
3. The final test is to run the QualiChain Recruiting module, next:

## QualiChain Recruiting

This is the module executed by a recruiting organization, e.g., a public administration organization or a company. This component is responsible for the diploma validation. It receives a PDF file representing a diploma as an input. 
Such PDF is titled with the Issuer ID + Civil ID, which constitutes the ID of the diploma. The hash of the diploma is calculated. Then, the corresponding hash of the diploma registered at the (Ropsten) Ethereum network is obtained, through the provided ID.

In case the calculated digest of the diploma matches the digest of the provided PDF, the diploma is valid. Otherwise, it is invalid.

### Steps

On ``QualiChain Recruiting`` directory run:
1. npm install
2. npm run start

### Troubleshooting
In case of errors at the npm install phase, make sure you have both build-essential and libkrb5-dev utilities installed: 
* sudo apt-get install build-essential
* sudo apt-get install libkrb5-dev


## QualiChain Consortium
Allows universities to vote on new members of the consortium and to change the quorum required to make such decisions.

### Steps

On ``QualiChain Recruiting`` directory run:
1. npm install
2. npm run start
		
					
## Fenix
https://github.com/FenixEdu/fenixedu-academic - baseline 

https://github.com/ist-dsi/fenixedu-ist - customized modules

https://github.com/ist-dsi-archive/fenix-ist - mock data

