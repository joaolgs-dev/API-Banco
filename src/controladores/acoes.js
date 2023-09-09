const { contas, saques, transferencias, depositos } = require('../bancodedados');
const { verificarParametrosDeposito, encontrarConta, checarNumeroValido, atualizarSaldo, verificarParametrosComSenha, verificarSenhaUsuario, verificarSaldoSuficiente, atualizarSaldoDeposito, verificarParametrosTransferencia, checarNumerosValidos, encontrarContaOrigem, encontrarContaDestino, verificarParametrosSaldo, verificarSenhaUsuarioQuery } = require('../utilitarios/utilitarios');
const { format } = require('date-fns');

const depositar = async (req, res) => {
    const { valor } = req.body;
    const parametrosValidos = await verificarParametrosDeposito(req);

    if (!parametrosValidos) {
        res.status(400).json({ message: "Dados inválidos! \n Favor inserir numero da conta e valor acima de R$ 0,00." });
    }

    const numeroValido = await checarNumeroValido(req);

    if (!numeroValido) {
        return res.status(400).json({ message: "O numero de conta informado é inválido" });
    }

    const contaEncontrada = await encontrarConta(numeroValido)

    if (!contaEncontrada) {
        return res.status(404).json({ message: "Conta não encontrada" });
    }

    atualizarSaldo(req, contaEncontrada);

    depositos.push({
        date: format(new Date(), "yyyy,MM,dd HH:mm:ss"),
        numeroConta: numeroValido,
        valor
    })

    return res.status(204).json();
};

const sacar = async (req, res) => {
    const { valor } = req.body;
    const numeroValido = await checarNumeroValido(req);

    if (!numeroValido) {
        return res.status(400).json({ message: "O numero de conta informado é inválido" });
    }

    const parametrosValidos = await verificarParametrosComSenha(req);

    if (!parametrosValidos) {
        res.status(400).json({ message: "Dados inválidos! \n Favor inserir numero da conta e valor acima de R$ 0,00. \n Não se esqueça da senha!!!" });
    }

    const contaEncontrada = await encontrarConta(numeroValido);
    if (!contaEncontrada) {
        return res.status(404).json({ message: "Conta não encontrada." });
    }

    const senhaCorreta = await verificarSenhaUsuario(req, contaEncontrada)

    if (!senhaCorreta) {
        return res.status(403).json({ message: "Senha informada está incorreta!" });
    }

    const saldoSuficiente = await verificarSaldoSuficiente(req, contaEncontrada);

    if (!saldoSuficiente) {
        return res.status(400).json({ message: "Saldo insuficiente para completar ação!" });
    }

    atualizarSaldoDeposito(req, contaEncontrada);

    saques.push({
        date: format(new Date(), "yyyy,MM,dd HH:mm:ss"),
        numeroConta: numeroValido,
        valor,
    })

    return res.status(204).json();
};

const transferir = async (req, res) => {
    const { valor } = req.body;
    const parametrosValidos = await verificarParametrosTransferencia(req);

    if (!parametrosValidos) {
        return res.status(400).json({ message: "Dados inválidos! \n Favor inserir numero da conta de origem e destino, assim como o valor da transferência \n Não se esqueça da senha!! " })
    }

    const numerosValidos = await checarNumerosValidos(req);

    if (!numerosValidos) {
        return res.status(400).json({ message: "Numero de conta de origem ou destino inválido(s)!" })
    }

    const contaOrigem = await encontrarContaOrigem(req);

    if (!contaOrigem) {
        return res.status(404).json({
            message: "Conta de origem não encontrada."
        });
    }

    const contaDestino = await encontrarContaDestino(req);

    if (!contaDestino) {
        return res.status(404).json({
            message: "Conta de destino não encontrada."
        });
    }

    const contaEncontrada = contaOrigem;
    const senhaCorreta = await verificarSenhaUsuario(req, contaEncontrada);

    if (!senhaCorreta) {
        return res.status(403).json({ message: "Senha informada está incorreta!" });
    }

    const saldoSuficiente = await verificarSaldoSuficiente(req, contaEncontrada);

    if (!saldoSuficiente) {
        return res.status(400).json({ message: "Saldo insuficiente para completar ação!" });
    }

    atualizarSaldosTransferencia(req, contaOrigem, contaDestino);

    transferencias.push({
        date: format(new Date(), "yyyy,MM,dd HH:mm:ss"),
        numero_conta_origem: contaOrigem.numero,
        numero_conta_destino: contaDestino.numero,
        valor
    })
    return res.status(204).json();

};

const buscarSaldo = async (req, res) => {

    const numeroValido = await checarNumeroValido(req);
    if (!numeroValido) {
        return res.status(400).json({ message: "O numero de conta informado é inválido" });
    }

    const parametrosValidos = await verificarParametrosSaldo(req);

    if (!parametrosValidos) {
        return res.status(400).json({ message: "Numero da conta e senha são obrigatórios!" });
    }

    const contaEncontrada = await encontrarConta(req, numeroValido);

    if (!contaEncontrada) {
        return res.status(404).json({ message: "Conta não encontrada!" });
    }


    const senhaCorreta = verificarSenhaUsuarioQuery(req, contaEncontrada);

    if (!senhaCorreta) {
        return res.status(403).json({ message: "Senha informada está incorreta!" });
    }

    return res.status(200).json(contaEncontrada.saldo);
};

const buscarExtrato = async (req, res) => {
    const numeroValido = await checarNumeroValido(req);
    if (!numeroValido) {
        return res.status(400).json({ message: "O numero de conta informado é inválido" });
    }

    const parametrosValidos = await verificarParametrosSaldo(req);

    if (!parametrosValidos) {
        return res.status(400).json({ message: "Numero da conta e senha são obrigatórios!" });
    }

    const contaEncontrada = await encontrarConta(req, numeroValido);

    if (!contaEncontrada) {
        return res.status(404).json({ message: "Conta não encontrada!" });
    }


    const senhaCorreta = verificarSenhaUsuarioQuery(req, contaEncontrada);

    if (!senhaCorreta) {
        return res.status(403).json({ message: "Senha informada está incorreta!" });
    }

    const extrato = await buscarExtrato(numeroValido);

    res.status(200).json(extrato);
};


module.exports = {
    depositar,
    sacar,
    transferir,
    buscarSaldo,
    buscarExtrato
};