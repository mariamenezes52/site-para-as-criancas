// ==========================================
// BANCO DE PERGUNTAS (6º ANO - TEMA ESPACIAL)
// ==========================================
const perguntas = [
    {
        pergunta: "A nave de exploração viaja a 15 mil km por minuto. Quantos km ela viajará em 8 minutos?",
        opcoes: ["100 mil", "115 mil", "120 mil", "125 mil"],
        correta: 2 // 15 * 8 = 120
    },
    {
        pergunta: "Temos 72 amostras de minerais alienígenas para distribuir igualmente em 9 caixas de contenção. Quantas amostras por caixa?",
        opcoes: ["6", "7", "8", "9"],
        correta: 2 // 72 / 9 = 8
    },
    {
        pergunta: "O tanque de oxigênio da base está com 3/4 de sua capacidade. Se a capacidade total é de 80 litros, quantos litros temos?",
        opcoes: ["20 litros", "40 litros", "60 litros", "80 litros"],
        correta: 2 // 80 / 4 = 20 * 3 = 60
    },
    {
        pergunta: "Se 3 litros de combustível levam a nave a 12 mil km, quantos km ela fará com 7 litros?",
        opcoes: ["24 mil", "28 mil", "32 mil", "36 mil"],
        correta: 1 // 12/3 = 4 por litro. 4 * 7 = 28
    },
    {
        pergunta: "Uma tripulação de 4 astronautas consome 8 pacotes de comida por dia. Quantos pacotes 6 astronautas consumiriam no mesmo período?",
        opcoes: ["10", "12", "14", "16"],
        correta: 1 // 8/4 = 2 por astronauta. 2 * 6 = 12
    },
    {
        pergunta: "Um asteroide viaja a 240 km/s. Se ele precisa percorrer 1.200 km para atingir um planeta, quanto tempo levará?",
        opcoes: ["3 segundos", "4 segundos", "5 segundos", "6 segundos"],
        correta: 2 // 1200 / 240 = 5
    }
];

// ==========================================
// VARIÁVEIS DE ESTADO DO JOGO
// ==========================================
let indicePerguntaAtual = 0;
let pontuacao = 0;
let vidas = 3;

// ==========================================
// ELEMENTOS DO DOM
// ==========================================
const telaInicio = document.getElementById('tela-inicio');
const telaQuiz = document.getElementById('tela-quiz');
const telaFim = document.getElementById('tela-fim');
const btnIniciar = document.getElementById('btn-iniciar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const textoPergunta = document.getElementById('texto-pergunta');
const opcoesContainer = document.getElementById('opcoes-resposta');
const displayPontuacao = document.getElementById('pontuacao');
const displayVidas = document.getElementById('vidas');
const tituloFim = document.getElementById('titulo-fim');
const mensagemFim = document.getElementById('mensagem-fim');
const iconeFim = document.getElementById('icone-fim');
const barraProgresso = document.getElementById('progresso');

// ==========================================
// FUNÇÕES PRINCIPAIS
// ==========================================

function mudarTela(telaAtiva) {
    [telaInicio, telaQuiz, telaFim].forEach(tela => tela.classList.add('escondida'));
    telaAtiva.classList.remove('escondida');
}

function iniciarJogo() {
    indicePerguntaAtual = 0;
    pontuacao = 0;
    vidas = 3;
    atualizarPlacar();
    atualizarProgresso();
    mudarTela(telaQuiz);
    carregarPergunta();
}

function atualizarPlacar() {
    displayPontuacao.textContent = pontuacao;
    let coracoes = "❤️".repeat(vidas);
    if (vidas === 0) coracoes = "💔";
    displayVidas.textContent = coracoes;
}

function atualizarProgresso() {
    if(barraProgresso) {
        const porcentagem = (indicePerguntaAtual / perguntas.length) * 100;
        barraProgresso.style.width = `${porcentagem}%`;
    }
}

function carregarPergunta() {
    if (indicePerguntaAtual >= perguntas.length) {
        finalizarJogo(true);
        return;
    }

    const perguntaAtual = perguntas[indicePerguntaAtual];
    textoPergunta.textContent = perguntaAtual.pergunta;
    opcoesContainer.innerHTML = ''; 

    perguntaAtual.opcoes.forEach((opcao, index) => {
        const botao = document.createElement('button');
        botao.textContent = opcao;
        botao.classList.add('btn-opcao');
        botao.addEventListener('click', () => verificarResposta(index, botao));
        opcoesContainer.appendChild(botao);
    });
}

function verificarResposta(indiceSelecionado, botaoClicado) {
    const perguntaAtual = perguntas[indicePerguntaAtual];
    
    const botoes = opcoesContainer.querySelectorAll('.btn-opcao');
    botoes.forEach(btn => btn.disabled = true);

    if (indiceSelecionado === perguntaAtual.correta) {
        botaoClicado.classList.add('correto');
        pontuacao += 10;
        tocarSom('acerto');
    } else {
        botaoClicado.classList.add('errado');
        botoes[perguntaAtual.correta].classList.add('correto');
        vidas--;
        tocarSom('erro');
        shakeTela();
    }

    atualizarPlacar();

    setTimeout(() => {
        if (vidas <= 0) {
            finalizarJogo(false);
        } else {
            indicePerguntaAtual++;
            atualizarProgresso();
            carregarPergunta();
        }
    }, 1500);
}

function finalizarJogo(vitoria) {
    mudarTela(telaFim);
    if (vitoria) {
        tituloFim.textContent = "MISSÃO CUMPRIDA!";
        mensagemFim.textContent = `Você fez ${pontuacao} pontos! A galáxia está a salvo.`;
        iconeFim.textContent = "🏆"; // Troféu
        tocarSom('vitoria');
    } else {
        tituloFim.textContent = "MISSÃO FALHOU";
        mensagemFim.textContent = `Você fez ${pontuacao} pontos. A nave ficou sem combustível...`;
        iconeFim.textContent = "💀"; // Caveira
        tocarSom('derrota');
    }
}

// ==========================================
// EFEITOS SONOROS E ANIMAÇÕES
// ==========================================
function tocarSom(tipo) {
    // Caminhos relativos para a pasta 'audio'
    let audioUrl = '';
    if (tipo === 'acerto') audioUrl = 'audio/acerto.mp3';
    if (tipo === 'erro') audioUrl = 'audio/erro.mp3';
    if (tipo === 'vitoria') audioUrl = 'audio/vitoria.mp3';
    if (tipo === 'derrota') audioUrl = 'audio/derrota.mp3';

    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.volume = 0.6;
        audio.play().catch(e => console.log("Áudio não encontrado: " + audioUrl));
    }
}

function shakeTela() {
    const main = document.querySelector('main');
    main.classList.add('shake');
    setTimeout(() => {
        main.classList.remove('shake');
    }, 500);
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
btnIniciar.addEventListener('click', iniciarJogo);
btnReiniciar.addEventListener('click', iniciarJogo);

mudarTela(telaInicio);