const { contas } = require('../bancodedados');
const { checarNumeroValido, encontrarConta, checarParametros, verificarConta, encontrarPorIndice, verificarSaldo } = require('../utilitarios/utilitarios');

const listarContas = async (req, res) => {
    return res.status(200).json({ contas });
};

const buscarConta = async (req, res) => {
    const numeroValido = await checarNumeroValido(req);

    if (!numeroValido) {
        return res.status(400).json({ message: "O numero de conta informado é inválido" });
    }

    const contaEncontrada = await encontrarConta(numeroValido);

    if (!contaEncontrada) {
        return res.status(404).json({ message: "Conta não encontrada." });
    }

    return res.status(200).json(contaEncontrada);
};

let novoNumeroConta = 1;
let novoSaldo = 0;

const criarConta = async (req, res) => {
    const parametrosCompletos = await checarParametros(req);

    if (!parametrosCompletos) {
        return res.status(400).json({ message: "Todas as informações são necessárias!" })
    }

    const contaExiste = await verificarConta(req);

    if (contaExiste) {
        return res.status(403).json({ message: `Conta vinculada ao email: ${email} ou ao cpf: ${cpf} informados.` })
    }

    const novaConta = {
        numero: novoNumeroConta,
        saldo: novoSaldo,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        }
    }
    novoNumeroConta++

    contas.push(novaConta);

    return res.status(201).json();
};

const deletarConta = async (req, res) => {
    const numeroValido = await checarNumeroValido(req);

    if (!numeroValido) {
        return res.status(400).json({ message: "O numero de conta informado é inválido" });
    }

    const indiceConta = await encontrarPorIndice(numeroValido); // achar conta por indice 

    if (indiceConta < 0) { // conta encontrada pelo indice
        return res.status(404).json({ message: "Conta não encontrada." });
    }

    const saldoNulo = await verificarSaldo(indiceConta);
    if (!saldoNulo) {
        return res.status(400).json({ message: "O saldo da conta precisa ser de R$ 0,00 para prosseguir com a exclusão da conta." })
    }

    contas.splice(indiceConta, 1);

    return res.status(203).json();
};

const atualizarConta = async (req, res) => {
    const numeroValido = await checarNumeroValido(req);

    if (!numeroValido) {
        return res.status(400).json({ message: "O numero de conta informado é inválido" });
    };

    const parametrosCompletos = await checarParametros(req);

    if (!parametrosCompletos) {
        return res.status(400).json({ message: "Todas as informações são necessárias!" })
    }

    const contaExiste = await verificarConta(req);

    if (contaExiste) {
        return res.status(403).json({ message: `Conta vinculada ao email: ${email} ou ao cpf: ${cpf} informados.` });
    }

    const contaEncontrada = await encontrarConta(numeroValido);

    if (!contaEncontrada) {
        return res.status(404).json({ message: "Conta não encontrada." });
    }

    contaEncontrada.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    };

    return res.status(203).json();
};


module.exports = {
    listarContas,
    buscarConta,
    deletarConta,
    atualizarConta,
    criarConta
};