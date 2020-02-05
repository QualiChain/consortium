Falta 
O IPFS serve para providenciar PDF às entidades que o requerem - não é usado no projeto
----------
QualiChain Recruiting
Issuer ID - id da universidade
Civil ID


Issuer ID + Civil ID -> id do certificado que vai para Ethereum 

----------
QualiChain Higher Education Module
registered_certificates e revoked_certificates são diretorias em que se põem certificados, usado por scripts
recruitingScript -> pega em hash de certificado e civil ID e chama management smart contract:
					o contrato tem did de universidade associado ao endereço de smart contract da mesma
					depois interage com o smart contract de uma determinada universidade, onde verifica se a hash de determinado ficheiro está na blockchain	
					
faltam script para correr managementcontract
					
					
