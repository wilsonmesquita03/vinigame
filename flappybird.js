const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configurações iniciais
const gravity = 0.6;
const bird = {
    x: 65,
    y: 195,
    width: 60,
    height: 60,
    jump: -13,
    velocity: 0
};
const pipes = [];
const pipeWidth = 140;
const pipeGap = 350;
let score = 0;
let gameOver = false;
const highScores = []; // Lista para armazenar as melhores pontuações

// Carregar a imagem de fundo do jogo
const backgroundImage = new Image();
backgroundImage.src = 'background.png'; // Caminho do arquivo de imagem

// Substituir as cores pelos elementos gráficos
const birdImage = new Image();
birdImage.src = 'bird.png'; // Caminho da imagem do passarinho

const pipeImage = new Image();
pipeImage.src = 'pipe.png'; // Caminho da imagem do cano

// Carregar o som de salto
const jumpSound = new Audio('jump.mp3'); // Caminho do arquivo de som
let jumpSoundLoaded = false;

// Carregar a duração do som
jumpSound.addEventListener('loadedmetadata', function() {
    jumpSound.currentTime = jumpSound.duration / 3;
    jumpSoundLoaded = true;
});

// Função para desenhar o fundo do jogo
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Função para desenhar o passarinho
function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

// Função para desenhar os canos
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImage, pipe.x, pipe.y, pipeWidth, pipe.height);
        ctx.drawImage(pipeImage, pipe.x, pipe.y + pipe.height + pipeGap, pipeWidth, canvas.height - (pipe.height + pipeGap));
    });
}

// Função para atualizar a posição do passarinho
function updateBird() {
    bird.velocity += gravity;
    bird.y += bird.velocity;
}

// Função para atualizar os canos
function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 195) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 60)) + 30;
        pipes.push({ x: canvas.width, y: 0, height: pipeHeight, passed: false });
    }
    pipes.forEach(pipe => {
        pipe.x -= 2.6; // Ajuste proporcional
        // Incrementar os ViniPoints
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            pipe.passed = true;
            score++;
        }
    });
}

// Função para verificar colisão
function checkCollision() {
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver = true;
    }
    pipes.forEach(pipe => {
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.height || bird.y + bird.height > pipe.height + pipeGap)
        ) {
            gameOver = true;
        }
    });
}

// Função para desenhar os ViniPoints
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('ViniPoints: ' + score, 10, 20);
}

// Função para atualizar a tabela de classificação
function updateRankingTable() {
    const tbody = document.querySelector("#rankingTable tbody");
    tbody.innerHTML = "";
    highScores.slice(0, 10).forEach((entry, index) => {
        const row = document.createElement("tr");
        const rankCell = document.createElement("td");
        rankCell.textContent = index + 1;
        const nameCell = document.createElement("td");
        nameCell.textContent = entry.name;
        const scoreCell = document.createElement("td");
        scoreCell.textContent = entry.score;
        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        tbody.appendChild(row);
    });
}

// Função principal do jogo
function gameLoop() {
    if (gameOver) {
        if (score % 5 === 0 && score > 0) {
            const playerName = prompt('Parabéns! Você atingiu ' + score + ' ViniPoints. Insira seu nome:');
            if (playerName) {
                highScores.push({ name: playerName, score: score });
                highScores.sort((a, b) => b.score - a.score);
                updateRankingTable();
            }
        }
        alert('Game Over! ViniPoints: ' + score);
        document.location.reload();
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    updateBird();
    updatePipes();
    drawBird();
    drawPipes();
    checkCollision();
    drawScore();

    requestAnimationFrame(gameLoop);
}

// Controle de salto
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        bird.velocity = bird.jump;
        if (jumpSoundLoaded) {
            jumpSound.currentTime = jumpSound.duration / 3; // Define o tempo para um terço do som
            jumpSound.play(); // Reproduz o som
        }
    }
});

// Inicia o jogo quando a imagem de fundo do jogo estiver carregada
backgroundImage.onload = function() {
    gameLoop();
};
