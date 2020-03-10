# Qualichain Portuguese PoC
The Qualichain Portuguese PoC tackles an interaction between a higher education organization, IST (or Técnico Lisboa) and AMA.
This prototype contains several modules, and mock data, at the ``Certificate Examples`` folder.
Transactions on the Ethereum Ropsten network can be verified here: https://ropsten.etherscan.io/

## QualiChain Higher Education Module
This module adds a certificate to the blockchain when it is pasted at the ``registered_certificates`` folder. If a certificate is moved to the ``revoked_certificates`` it is revoked.

 
### Steps
On the ``QualiChain Higher Education Module`` directory run:
1. npm install

Steps 2 and 3 are optional, since an account is already created, and a smart contract deployed.

2.To create an account belonging to a higher education institution, follow the next steps: 
run ``node createAccount_script``. ``

* Copy the output of the created address to line 5 of ``createAccount_script`
* Copy the output of the private key to line 6 ``createAccount_script`, without the `0x` part of the string.

3.To deploy the school contract smart contract (optional), with the created credentails, run ``node deployContract_script``
Note: you may have to Reclaim ETH for the Ropsten network: https://faucet.ropsten.be/ or https://ipfs.io/ipfs/QmVAwVKys271P5EQyEfVSxm7BJDKWt42A2gHvNmxLjZMps/ (ether may take up to some minutes to arrive)
 
4.Run ``npm run start``

## QualiChain Recruiting

This component is responsible for the diploma validation. It receives a PDF file representing a diploma as an input. 
Such PDF is titled with the Issuer ID + Civil ID, which constitutes the ID of the diploma. The hash of the diploma is calculated. Then, the corresponding hash of the diploma registered at the (Ropsten) Ethereum network is obtained, through the provided ID.

In case the calculated digest of the diploma matches the digest of the provided PDF, the diploma is valid. Otherwise, it is invalid.

### Steps

On ``QualiChain Recruiting`` directory run:
1. npm install
2. npm run start


## QualiChain Consortium
Allows universities to vote on new members of the consortium and to change the quorum required to make such decisions.

### Steps

On ``QualiChain Recruiting`` directory run:
1. npm install
2. npm run start
		
					
### Fenix
https://github.com/FenixEdu/fenixedu-academic - baseline 

https://github.com/ist-dsi/fenixedu-ist - customized modules

https://github.com/ist-dsi-archive/fenix-ist - mock data

