# Qualichain Portuguese PoC
The Qualichain Portuguese PoC tackles an interaction between a higher education organization, IST (or Técnico Lisboa) and AMA.
This prototype contains several modules, and mock data, at the ``Certificate Examples`` folder.
Transactions on the Ethereum Ropsten network can be verified here: https://ropsten.etherscan.io/
This proof of concept contains two mock accounts for the Ethereum blockchain, which can be used to perform the demo. 

**Note**: Some operations may fail when using the same blockcgain (Ethereum, Ropsten,...) account, e.g., deploying a smart contract with an account that has already been used to deploy the same smart contract.

## Requirements
* Nodejs version >= 10.0.0 and npm version >= 6.0.0 (tested with 10.16.1 and 10.19)

Software tested on:
* Ubuntu 18.04 bionic, 3 GB RAM, running as a virtual machine (VirtualBox), with nodejs v10.19.0
* Ubuntu 18.04 bionic, 8 GB RAM

## QualiChain Higher Education Module

This is the module executed by a HEI. This module adds a certificate to the blockchain when it is pasted at the ``registered_certificates`` folder. A possibility is for the academic management systems (e.g., https://fenixedu.org/) to provide certificates in PDF format that are stored in that folder. Instead, if a certificate is moved to the ``revoked_certificates`` it is revoked. This is a rare operation, but that may be needed.The Ethereum accounts used in this module are stored on the ``accounts.txt`` file.
**Note**: Each certificate name represents a graduate's civil ID number. Therefore, every name must be integer sequences, and end in ``.pdf``. Example: 123456789.pdf, 1.pdf

### Installing and running
On the ``QualiChain Higher Education Module`` directory:

1. run ``npm install`` then ``mkdir Certificates``and ``mkdir Certificates/registered_certificates``

Steps 2 and 3 are optional, as an account is already created and a smart contract deployed.

2. To create an account for a new HEI follow these steps: 
run ``node createAccount_script.js > accounts-NEW.txt``

* From ``accounts-NEW.txt`` copy the Account number and the Private Key (without the initial `0x`) respectively to lines 5 and 6 of file ``deployContract_script.js``.
* Your account has no ether, so if you are using Ropsten reclaim some for free at: https://faucet.ropsten.be/ or https://ipfs.io/ipfs/QmVAwVKys271P5EQyEfVSxm7BJDKWt42A2gHvNmxLjZMps/ (ether may take up to some minutes to arrive)

3. To deploy the HEI smart contract, with the created credentials, run ``node deployContract_script.js``
 
4. Run ``npm run start``

**Note**: In case of ``Error: Returned error: replacement transaction underpriced``, wait for the pending transactions to be confirmed, and try again.

### Testing
1. Insert file 12345678.pdf in folder ``Certificates/registered_certificates`` by running ``cp ../Certificate\ Examples/12345678.pdf Certificates/registered_certificates``

2. Access https://ropsten.etherscan.io/, insert the address of the account (e.g., the IST account in file ``accounts.txt``) and observe that a transaction was generated. 

3. The final test is to run the QualiChain Recruiting module, next:

## QualiChain Recruiting

This is the module executed by a recruiting organization, e.g., a public administration organization or a company. This component is responsible for the diploma validation. It receives a PDF file representing a diploma as an input. 
Such PDF is titled with the Issuer ID + Civil ID, which constitutes the ID of the diploma. The hash of the diploma is calculated. Then, the corresponding hash of the diploma registered at the (Ropsten) Ethereum network is obtained, through the provided ID.

In case the calculated digest of the diploma matches the digest of the provided PDF, the diploma is valid. Otherwise, it is invalid.

### Installing and running

On ``QualiChain Recruiting`` directory run:
1. npm install
2. npm run start

### Troubleshooting
In case of errors at the npm install phase, make sure you have both build-essential and libkrb5-dev utilities installed: 
* sudo apt-get install build-essential
* sudo apt-get install libkrb5-dev

### Testing
1. After following the instructions on the `` QualiChain Higher Education Module``, give as IssuerID ``did:ethr:`` + the address of the contract that uplodaded the certificate (``0x2CefB619218825C0c670D8E77f7039e0693E1dDC`` by default).
2. The CivilID should be the same as the name of the pdf (``12345678``).
3. Click on verify


## QualiChain Consortium

This module provides an interface that allows universities to vote on new members of the consortium and to change the quorum required to make such decisions. It also gives the possibiliy to vote on the removal of a current member of the consortium.

### Installing and running (Simplified)
Since the setup process for this module is quite extensive, most of it is already completed. Therefore, 3 new University Ethereum accounts were already created. One HEI contract for each University was also deployed.

All the information on the created accounts is available in the ``accounts.txt`` file.

On ``QualiChain Consortium`` directory run:
1. ``npm install``
2. Open the ``accounts.txt`` file and choose one of the 3 University accounts.
3. Copy the Account number and the Private Key (without the initial `0x`) respectively to lines 5 and 6 of the file ``consortiumScript.js``.
4. ``npm start``

### Testing (Register HEI)
1. Register a new University in the "Register HEI" form. The "HEI identifier" field corresponds to the DID of a University, and the "contract address" field correspond to the respective HEI contract. 
2. To test this functionality read the "QualiChain Higher Education Module" testing documentation, since there is the need to create a new account and deploy a new HEI contract.
3. After completing the step above, insert in the "HEI identifier" field "did:ethr:{address of the new University's account}" and the HEI contract address in the respective field. Press submit.
4. Close the Consortium Application.
5. Open the ``accounts.txt`` and choose another University account to get a different perspective on the voting system.
6. Copy the Account number and the Private Key (without the initial `0x`) respectively to lines 5 and 6 of file ``consortiumScript.js``.
7. ``npm start``
8. Notice how now you can vote on the registration of a new University. Since the threshold value is 2 by default, a positive vote will make this poll successful.

### Testing (Cancel HEI)
1. Remove a University of the Consortium in the "Cancel HEI" form. Test this functionality by opening the ``accounts.txt`` file and choosing one of the University accounts to remove from the consortium. 
2. Insert in the "HEI identifier" field the DID of that University, by typing "did:ethr:{address of the University's account}". Press submit.
3. Close the Consortium Application.
4. Open the ``accounts.txt`` and choose another University account to get a different perspective on the voting system.
5. Copy the Account number and the Private Key (without the initial `0x`) respectively to lines 5 and 6 of file ``consortiumScript.js``.
6. ``npm start``
7. Notice how now you can vote on the removal of a University. Since the threshold value is 2 by default, a positive vote will make this poll successful.

### Testing (Change Threshold)
1. Change the minimum number of votes necessary to make a decision in the consortium. Insert an integer in the "new value" field.
2. Press submit.
3. Close the Consortium Application.
4. Open the ``accounts.txt`` and choose another University account to get a different perspective on the voting system.
5. Copy the Account number and the Private Key (without the initial `0x`) respectively to lines 5 and 6 of file ``consortiumScript.js``.
6. ``npm start``
7. Notice how now you can vote on a new value for the threshold. Since the threshold value is 2 by default, a positive vote will make this poll successful.

## Fenix
https://github.com/FenixEdu/fenixedu-academic - baseline 

https://github.com/ist-dsi/fenixedu-ist - customized modules

https://github.com/ist-dsi-archive/fenix-ist - mock data

