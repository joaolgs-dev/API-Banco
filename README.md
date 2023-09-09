# API-Banco

### Esse projeto é um CRUD de um banco, onde você pode realizar diversas ações, como: 

- criar conta;
- listar contas;
- deletar conta;
- atualizar dados da conta;
- transferir valores entre contas;
- realizar saques;
- depositar valor em uma conta específica;


## Rotas da API 

- GET /contas (lista todas as contas bancárias cadastradas) (requer acesso especial - senha do banco)
- GET /contas/:numeroConta (lista uma conta bancárias específica cadastrada) (requer acesso especial - senha do banco)
- POST /contas (cadastra uma nova conta bancária)
- PUT /contas/:numeroConta/usuario (atualiza uma conta bancária existente)
- DELETE /contas/:numeroConta (deleta uma conta bancária existente)
- POST /transacoes/depositar (realiza um deposito em uma conta específica)
- POST /transacoes/sacar (realiza um saque em determinada conta)
- POST /transacoes/transferir (transfere valores entre duas contas)
- GET /conta/saldo (verifica o saldo de uma conta específica)
- GET /conta/extrato (verifica o extrato de uma conta específica)


### Tech Utilizadas
- Node.js: Ambiente de execução do JavaScript
- JavaScript: Linguagem de programação utilizada na confecção da API
- Insomnia: Ferramenta utilizada para teste das rotas da API
- Express: Framework usado para criação da api, permitindo criar servidores e rotas.
  
  
