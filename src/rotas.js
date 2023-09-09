const express = require('express');
const router = express();

const { listarContas, buscarConta, deletarConta, atualizarConta, criarConta } = require('./controladores/contas');
const { validarSenha } = require('./intermediarios');
const { depositar, sacar, transferir, buscarSaldo, buscarExtrato } = require('./controladores/acoes');

router.get('/contas', validarSenha, listarContas)
router.get('/contas/:numeroConta', validarSenha, buscarConta); // pegar uma unica conta (extra)
router.post('/contas', criarConta);
router.put('/contas/:numeroConta/usuario', atualizarConta);
router.delete('/contas/:numeroConta', deletarConta);

router.post('/transacoes/depositar', depositar);
router.post('/transacoes/sacar', sacar);
router.post('/transacoes/transferir', transferir);

router.get('/conta/saldo', buscarSaldo);
router.get('/conta/extrato', buscarExtrato);

module.exports = router;