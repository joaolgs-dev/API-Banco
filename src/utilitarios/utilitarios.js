const { contas, saques, transferencias, depositos } = require('../bancodedados');

const checarNumeroValido = async (req) => {
    let numeroValido = true;
    const { numeroConta } = req.params;
    const numero_conta = Number(numeroConta);

    if (isNaN(numero_conta)) {
        return numeroValido = false;
    }

    return numeroValido, numero_conta;
}

const encontrarConta = async (numeroValido) => {

    const contaEncontrada = contas.find((conta) => {
        return conta.numero === numeroValido
    });

    return contaEncontrada;
}

const checarParametros = async (req) => {
    let parametrosCompletos = true;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) { // verificar parâmetros 
        return parametrosCompletos = false;
    }

    return parametrosCompletos;
}

const verificarConta = async (req) => {
    const { cpf, email } = req.body;
    const contaExiste = contas.find((conta) => {
        return conta.usuario.cpf === cpf || conta.usuario.email === email;
    });

    return contaExiste;
}

const encontrarPorIndice = async (numeroValido) => {
    const indiceConta = contas.findIndex(conta => conta.numero === numeroValido);
    return indiceConta;
}

const verificarSaldo = async (indiceConta) => {
    let saldoNulo = true;
    if (contas[indiceConta].saldo !== 0) {
        saldoNulo = false;
    };
    return saldoNulo;
}

const verificarParametrosDeposito = async (req) => {
    let parametrosValidos = true;
    const { numeroConta, valor } = req.body

    if (!numeroConta || !valor || valor <= 0) {
        parametrosValidos = false;
    }

    return parametrosValidos;
}

const atualizarSaldo = async (req, contaEncontrada) => {
    const { valor } = req.body;
    return contaEncontrada.saldo += valor;
}

const verificarParametrosComSenha = async (req) => {
    let parametrosValidos = true;
    const { numeroConta, valor, senha } = req.body

    if (!numeroConta || !valor || valor <= 0 || !senha) {
        parametrosValidos = false;
    }

    return parametrosValidos;
}

const verificarSenhaUsuario = async (req, contaEncontrada) => {
    const { senha } = req.body;
    let senhaConfere = true;
    if (contaEncontrada.senha !== senha) {
        senhaConfere = false;
    }
    return senhaConfere;
}

const verificarSaldoSuficiente = async (req, contaEncontrada) => {
    const { valor } = req.body;
    let saldoSuficiente = true;

    if (contaEncontrada.saldo < valor) {
        saldoSuficiente = false;
    }
    return saldoSuficiente;
}

const atualizarSaldoDeposito = async (req, contaEncontrada) => {
    const { valor } = req.body;
    return contaEncontrada.saldo -= valor;
}

const verificarParametrosTransferencia = async (req) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    let parametrosValidos = true;
    if (!numero_conta_destino || !numero_conta_origem || !valor || !senha) {
        parametrosValidos = false;
    }
    return parametrosValidos
}

const checarNumerosValidos = async (req) => {
    let numerosValidos = true;
    const { numero_conta_origem, numero_conta_destino } = req.params;
    const numeroOrigem = Number(numero_conta_origem);
    const numeroDestino = Number(numero_conta_destino);

    if (isNaN(numeroDestino || numeroOrigem)) {
        numerosValidos = false
    }
    return numerosValidos;
}

const encontrarContaOrigem = async (req) => {
    const { numero_conta_origem } = req.body;
    const contaOrigem = contas.find((conta) => {
        conta.numero === numero_conta_origem;
    })
    return contaOrigem;
}

const encontrarContaDestino = async (req) => {
    const { numero_conta_destino } = req.body;
    const contaDestino = contas.find((conta) => {
        conta.numero === numero_conta_destino;
    })
    return contaDestino;
}

const verificarParametrosSaldo = async (req) => {
    const { numero_conta, senha } = req.query;
    let parametrosCompletos = true;

    if (!numero_conta || !senha) {
        parametrosCompletos = false;
    }
    return parametrosCompletos;
}

const verificarSenhaUsuarioQuery = async (req, contaEncontrada) => {
    const { senha } = req.query;
    let senhaConfere = true;
    if (contaEncontrada.senha !== senha) {
        senhaConfere = false;
    }
    return senhaConfere;
}

const buscarExtrato = async (numeroValido) => {
    const saque = saques.filter((transacao) => {
        return transacao.numeroConta === numeroValido
    });
    const deposito = depositos.filter((transacao) => {
        return transacao.numeroConta === numeroValido
    });
    const transferencia = transferencias.filter((transacao) => {
        return transacao.numero_conta_origem === numeroValido
    });
    const extrato = [deposito, saque, transferencia];
    return extrato;
}

module.exports = {
    checarNumeroValido,
    encontrarConta,
    checarParametros,
    verificarConta,
    encontrarPorIndice,
    verificarSaldo,
    verificarParametrosDeposito,
    atualizarSaldo,
    verificarParametrosComSenha,
    verificarSenhaUsuario,
    verificarSaldoSuficiente,
    atualizarSaldoDeposito,
    verificarParametrosTransferencia,
    checarNumerosValidos,
    encontrarContaOrigem,
    encontrarContaDestino,
    verificarParametrosSaldo,
    verificarSenhaUsuarioQuery,
    buscarExtrato
}