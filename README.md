# Consortium and Certificate Management 
aka Qualichain Portuguese PoC

The Qualichain Portuguese PoC is about the interaction between a higher education organization, IST (or Técnico Lisboa), and a recruiting organization, AMA.

This software allows a consortium of HEIs to put a cryptographic hash of their certificates in the blockchain, for recruiting organizations to check the authenticity and integrity of these certificates, and to manage the membership of the consortium (adding HEIs, removing HEIs, define how decisions are taken). 
The certificates considered are opaque pdf files, not structured data. 

This prototype contains 3 modules, and mock certificates in the ``Certificate Examples`` folder.
It also contains a set of mock accounts for the Ropsten blockchain, which can be used to perform the demo. It can be trivially adapted to run in the Ethereum or QualiChain blockchains.

**Note**: Some operations may fail when using the same blockchain (Ethereum, Ropsten,...) account, e.g., deploying a smart contract with an account that has already been used to deploy the same smart contract.

## Requirements
* Nodejs version >= 10.0.0 and npm version >= 6.0.0 (tested with 10.16.1 and 10.19)

Software tested on:
* Ubuntu 18.04 bionic, 3 GB RAM, running as a virtual machine (VirtualBox), with nodejs v10.19.0
* Ubuntu 18.04 bionic, 8 GB RAM
* macOS Catalina 10.15.3, 8 GB RAM

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
* You need to pay to run smart contracts and your account has no Ether. If you are using Ropsten, reclaim some for free at: https://faucet.ropsten.be/ or https://teth.bitaps.com/, by inserting your account address. Not that the Ropsten Ether may take up to some minutes to arrive.
[![Captura-de-ecr-de-2020-03-24-15-08-00.png](https://i.postimg.cc/wjJ68QVB/Captura-de-ecr-de-2020-03-24-15-08-00.png)](https://postimg.cc/87p8LWx8)

3. To deploy the HEI smart contract, with the created credentials, run ``node deployContract_script.js``
 
4. Run ``npm start``

The result of the execution should be similar to the following:
[![qhei.png](https://i.postimg.cc/sgcDqqYN/qhei.png)](https://postimg.cc/9DDhqxNd)

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
2. The Civil ID should be the same as the name of the pdf file (e.g., ``12345678``), as exemplified:
[![qr.png](https://i.postimg.cc/V6HJTp88/qr.png)](https://postimg.cc/S2CQYZRT)
3. Click on verify. The result should be similar to the following figure.
[![qr2.png](https://i.postimg.cc/QCx2zN36/qr2.png)](https://postimg.cc/sQqHQr1S)


## QualiChain Consortium

The third module is an applications (consortium app) and a smart contract for governance of the QualiChain Consortium. A consortium is a set of HEIs using the QualiChain platform to provide assurances about the certificates they issue. The smart contract keeps a set of members (HEIs) of the consortium. Decisions are taken by voting. There are 3 types of operations that are voted: adding a new HEI to the consortium, removing a HEI from the consortium, and changing the number of votes necessary for a decision to become effective (the default is 2).

The application provides an interface that allows HEIs to vote on new members of the consortium and to change the quorum required to make such decisions. It also gives the possibiliy to vote on the removal of a current member of the consortium. 

### Installing and running
The setup process for running this module is somewhat long as we need to build a consortium, so some of the necessary steps have already been completed. Specifically, 3 HEI accounts have already been created and one HEI contract for each HEI has also been deployed. All the information on the created accounts is available in the ``accounts.txt`` file (see the entries for HEI 1, HEI 2 and HEI 3).

In the ``QualiChain Consortium`` directory execute the consortium app by doing the following:
1. Run ``npm install``
2. Optional as already done with the data of HEI 1: Pick the data of a HEI that is already part of the consortium (in ``accounts.txt``). Copy the Account number and the Private Key (without the initial ``0x``) respectively to lines 5 and 6 of the file ``consortiumScript.js``.
3. Run ``npm start`` that executes the consortium app.

### Testing (Register HEI)
1. Create a new HEI account and its HEI contract by following the instructions above in the "QualiChain Higher Education Module" (the optional steps). You need to access https://ropsten.etherscan.io/ to get the address of the contract, as illustrated (field ``To``):
[![Captura-de-ecr-de-2020-03-24-14-51-50.png](https://i.postimg.cc/G2mTzf1N/Captura-de-ecr-de-2020-03-24-14-51-50.png)](https://postimg.cc/jWBjSZ2Q)

2. In the consortium app, by following the instructions below you will register the new HEI using the "Register HEI" form. Notice that this operation is being done by the HEI for which you configured the consortium app ("Installing and Running" above, HEI 1 by default). In the form, the "HEI identifier" field corresponds to the DID of a HEI and the "contract address" field to the respective HEI contract. 
[![Captura-de-ecr-de-2020-03-24-15-12-46.png](https://i.postimg.cc/TPNGnN2C/Captura-de-ecr-de-2020-03-24-15-12-46.png)](https://postimg.cc/Y4FJH3WW)
* Run ``npm start`` to execute the consortium app.
* Insert in the "HEI identifier" field "did:ethr:{address of the new HEI's account}" and the HEI contract address in the respective field. 
* Press submit.
* Close the consortium app.

3. Now another HEI will vote in favor of the new HEI joining the consortium. Open the ``accounts.txt`` file and choose another HEI account to get a different voter (e.g., HEI 2).
* Copy the Account number and the Private Key (without the initial ``0x``) respectively to lines 5 and 6 of file ``consortiumScript.js``.
* Run ``npm start`` to execute the consortium app.
* The new HEI appears in the "Pending HEI registrations" form. Now you can vote on the registration of a new HEI by clicking on it. 
[![Captura-de-ecr-de-2020-03-24-15-13-53.png](https://i.postimg.cc/yxgNJ4Fm/Captura-de-ecr-de-2020-03-24-15-13-53.png)](https://postimg.cc/K3bbVWpj)
* Since the threshold value is 2 by default, a positive vote will make this poll successful. 

4. The last form of the consortium app, "HEI Contract Address" allows checking if a HEI is part of the consortium. Insert there the address of the new HEI in the format "did:ethr:{address of the new HEI's account}", press submit and check if that is true. Notice that the new HEI is registered in a smart contract in the blockchain, so it takes some time (depending on the blockchain being used). If you are too fast, the registration may not have finished yet.

### Testing (Remove HEI)
1. Remove a HEI from the consortium in the "Cancel HEI" form. Test this functionality by removing the new HEI you created from the consortium. 
* Run ``npm start`` to execute the consortium app.
* Insert in the "HEI identifier" field the DID of that HEI, by typing "did:ethr:{address of the HEI's account}". Press submit.
* Close the consortium app.

2. Now another HEI has to vote in favor of removing the new HEI from the consortium.
* Open the ``accounts.txt`` and choose another HEI account to get a second vote in favour of removing the new HEI (e.g., HEI 2).
* Copy the Account number and the Private Key (without the initial ``0x``) respectively to lines 5 and 6 of file ``consortiumScript.js``.
* Run ``npm start`` to execute the consortium app.
* Notice how now you can vote on the removal of a HEI. Since the threshold value is 2 by default, a positive vote will make this poll successful.

3. The last form of the consortium app, "HEI Contract Address" allows checking if a HEI is part of the consortium. Use it to check that the new HEI is no longer part of the consortium. As in the previous test, notice that removel requires accessing the blockchain so it takes some time.

### Testing (Change Threshold)
1. Change the minimum number of votes necessary to make a decision in the consortium. 
* Run ``npm start`` to execute the consortium app.
* Insert an integer in the "new value" field. Press submit.

* Close the consortium app.

2. Now another HEI has to vote in favor of chainging the threshold.
* Open the ``accounts.txt`` and choose another HEI account to get a second vote (e.g., HEI 2).
* Copy the Account number and the Private Key (without the initial ``0x``) respectively to lines 5 and 6 of file ``consortiumScript.js``.
* Run ``npm start`` to execute the consortium app.
* Notice how now you can vote on a new value for the threshold. Since the threshold value is 2 by default, a positive vote will make this poll successful.
[![Captura-de-ecr-de-2020-03-24-15-17-30.png](https://i.postimg.cc/QVZjHBND/Captura-de-ecr-de-2020-03-24-15-17-30.png)](https://postimg.cc/y3jMG8Sp)

## Fenix
https://github.com/FenixEdu/fenixedu-academic - baseline 

https://github.com/ist-dsi/fenixedu-ist - customized modules

https://github.com/ist-dsi-archive/fenix-ist - mock data

## Contributors

Main author: Diogo Serranito

Contributors: Rafael Belchior, Miguel Correia

Support: please contact Rafael Belchior, rafael.belchior at tecnico.ulisboa.pt 
