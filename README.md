# Qualichain Portuguese PoC
The Qualichain Portuguese PoC is about the interaction between a higher education organization, IST (or Técnico Lisboa), and a recruiting organization, AMA.
This prototype contains several modules, and mock data, at the ``Certificate Examples`` folder.
Transactions on the Ethereum Ropsten network can be verified here: https://ropsten.etherscan.io/
This proof of concept contains a set of mock accounts for the Ropsten blockchain, which can be used to perform the demo. It can be trivially adapted to run in the Ethereum or QualiChain blockchains.

**Note**: Some operations may fail when using the same blockchain (Ethereum, Ropsten,...) account, e.g., deploying a smart contract with an account that has already been used to deploy the same smart contract.

## Requirements
* Nodejs version >= 10.0.0 and npm version >= 6.0.0 (tested with 10.16.1 and 10.19)

Software tested on:
* Ubuntu 18.04 bionic, 3 GB RAM, running as a virtual machine (VirtualBox), with nodejs v10.19.0
* Ubuntu 18.04 bionic, 8 GB RAM

## QualiChain Higher Education Module

This is the module executed by a HEI like IST. This module adds a certificate to the blockchain when it is pasted at the ``registered_certificates`` folder. A possibility is for the academic management systems (e.g., https://fenixedu.org/) to provide certificates in PDF format that are stored in that folder. Instead, if a certificate is moved to the ``revoked_certificates`` it is revoked. This is a rare operation, but that may be needed (e.g., if a certificate is issued with a typo in the student data). The Ethereum accounts used in this module are stored on the ``accounts.txt`` file.
**Note**: Each certificate name represents a graduate's civil ID number. Therefore, every name must be integer sequences, and end in ``.pdf``. Example: 123456789.pdf, 1.pdf

### Installing and running
On the ``QualiChain Higher Education Module`` directory:

1. Run the following commands:
* ``rm -r -f ~.jsipfs/repo.lock``
* ``npm install``
* ``mkdir Certificates``
* ``mkdir Certificates/registered_certificates``

Steps 2 and 3 are optional, as an account is already created and a smart contract deployed.

2. To create an account for a new HEI follow these steps:

* Run ``node createAccount_script.js > account-NEW.txt``
* From ``account-NEW.txt`` copy the account Address and the Private Key (the key without the initial `0x`) respectively to lines 5 and 6 of file ``deployContract_script.js``.
* You need to pay to run smart contracts and your account has no ether. If you are using Ropsten, reclaim some for free at: https://faucet.ropsten.be/ (ether may take up to some minutes to arrive)

3. To deploy the HEI smart contract, with the created credentials, run ``node deployContract_script.js``
 
4. Run ``npm start``

**Note**: In case of ``Error: Returned error: replacement transaction underpriced``, wait for the pending transactions to be confirmed, and try again.

### Testing
1. Insert file ``12345678.pdf`` in folder ``Certificates/registered_certificates`` by running ``cp ../Certificate\ Examples/12345678.pdf Certificates/registered_certificates``

2. Access https://ropsten.etherscan.io/, insert the address of the account (e.g., the HEI 1 account in file ``accounts.txt``) and observe that a transaction was generated. You can also use this website to get the address of the smart contract that was deployed.

3. The final test is to run the QualiChain Recruiting module, next:


## QualiChain Recruiting

This is the module executed by a recruiting organization, e.g., a public administration organization like AMA or a company. This component is responsible for the diploma validation. It receives a PDF file representing a diploma as an input. 
Such PDF is titled with the Issuer ID + Civil ID, which constitutes the ID of the diploma. The hash of the diploma is calculated. Then, the corresponding hash of the diploma registered at the (Ropsten) Ethereum network is obtained, through the provided ID.

In case the calculated digest of the diploma matches the digest of the provided PDF, the diploma is valid, i.e., it is authentic and has not been modified. Otherwise, it is invalid.

The Issuer ID identifies the HEI that issued the diploma. You don't have to provide the address of the HEI's contract because the QualiChain Recruiting module gets it from the QualiChain Consortium smart contract, explained below.

**Note**: if you created a new HEI with the QualiChain Higher Education Module (above), you first must add it to the consortium before being able to run the QualiChain Recruiting. For that, you must first run the QualiChain Consortium module to register the new HEI (below).

### Installing and running

On ``QualiChain Recruiting`` directory run:
1. npm install
2. npm start

### Troubleshooting
In case of errors at the npm install phase, make sure you have both build-essential and libkrb5-dev utilities installed: 
* ``sudo apt-get install build-essential``
* ``sudo apt-get install libkrb5-dev``

### Testing
1. After following the instructions on the QualiChain Higher Education Module, give as IssuerID ``did:ethr:`` + the address of the account used to upload the certificate ("did:ethr:0x2CefB619218825C0c670D8E77f7039e0693E1dDC" by default).
2. The Civil ID should be the same as the name of the pdf file (e.g., ``12345678``).
3. Click on verify


## QualiChain Consortium

The third module is an applications and a smart contract for managing the QualiChain Consortium, i.e., a set of HEIs using the QualiChain platform to provide assurances about the certificates they issue. The smart contract keeps a set of members (HEIs) of the consortium. For new HEIs to join the consortium they have to be supported by the current members. 

The application provides an interface that allows HEIs to vote on new members of the consortium and to change the quorum required to make such decisions. It also gives the possibiliy to vote on the removal of a current member of the consortium. 

### Installing and running
The setup process for running this module is somewhat long as we need to build a consortium, so some of the necessary steps have already been completed. Specifically, 3 HEI accounts have already been created and one HEI contract for each HEI has also been deployed. All the information on the created accounts is available in the ``accounts.txt`` file (see the entries for HEI 1, HEI 2 and HEI 3).

In the ``QualiChain Consortium`` directory execute the Consortium Application and do the following:
1. Run ``npm install``
2. Optional as already done with the data of HEI 1: Pick the data of a HEI that is already part of the consortium (in ``accounts.txt``). Copy the Account number and the Private Key (without the initial ``0x``) respectively to lines 5 and 6 of the file ``consortiumScript.js``.
3. Run ``npm start``

### Testing (Register HEI)
1. Create a new HEI account and its HEI contract by following the instructions above in the "QualiChain Higher Education Module" (the optional steps).

2. In the Consortium Application, by following the instructions below you will register the new HEI using the "Register HEI" form. Notice that this operation is being done by the HEI for which you configured the consortium application ("Installing and Running" above, HEI 1 by default). In the form, the "HEI identifier" field corresponds to the DID of a HEI and the "contract address" field to the respective HEI contract. 
* Run ``npm start``
* Insert in the "HEI identifier" field "did:ethr:{address of the new HEI's account}" and the HEI contract address in the respective field. 
* Press submit.
* Close the Consortium Application.

3. Now another HEI will vote in favor of the new HEI joining the consortium. Open the ``accounts.txt`` file and choose another HEI account to get a different voter.
* Copy the Account number and the Private Key (without the initial `0x`) respectively to lines 5 and 6 of file ``consortiumScript.js``.
* Run ``npm start``
* The new HEI appears in the "Pending HEI registrations" form. Now you can vote on the registration of a new HEI by clicking on it. 
* Since the threshold value is 2 by default, a positive vote will make this poll successful. 

4. The last form of the Consortium Application allows checking if a HEI is part of the consortium. Insert there the address of the new HEI in the format "did:ethr:{address of the new HEI's account}", hit Submit and check if that is true. Notice that the new HEI is registered in a smart contract in the blockchain, so if you are too fast this may not have happened yet.

### Testing (Cancel HEI)
1. Remove a HEI of the Consortium in the "Cancel HEI" form. Test this functionality by opening the ``accounts.txt`` file and choosing one of the HEI accounts to remove from the consortium. 
2. Insert in the "HEI identifier" field the DID of that HEI, by typing "did:ethr:{address of the HEI's account}". Press submit.
3. Close the Consortium Application.
4. Open the ``accounts.txt`` and choose another HEI account to get a different perspective on the voting system.
5. Copy the Account number and the Private Key (without the initial `0x`) respectively to lines 5 and 6 of file ``consortiumScript.js``.
6. ``npm start``
7. Notice how now you can vote on the removal of a HEI. Since the threshold value is 2 by default, a positive vote will make this poll successful.

### Testing (Change Threshold)
1. Change the minimum number of votes necessary to make a decision in the consortium. Insert an integer in the "new value" field.
2. Press submit.
3. Close the Consortium Application.
4. Open the ``accounts.txt`` and choose another HEI account to get a different perspective on the voting system.
5. Copy the Account number and the Private Key (without the initial `0x`) respectively to lines 5 and 6 of file ``consortiumScript.js``.
6. ``npm start``
7. Notice how now you can vote on a new value for the threshold. Since the threshold value is 2 by default, a positive vote will make this poll successful.

## Fenix
https://github.com/FenixEdu/fenixedu-academic - baseline 

https://github.com/ist-dsi/fenixedu-ist - customized modules

https://github.com/ist-dsi-archive/fenix-ist - mock data

