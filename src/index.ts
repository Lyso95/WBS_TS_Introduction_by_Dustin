interface Score {
    name: string;
    points: number;
}

let score = 0;
let timeLeft = 20;
let timeInterval: number;

const scoreDisplay = document.getElementById('score')!;
const timeDisplay = document.getElementById('time')!;
const ball = document.getElementById('ball')!;
const playerNameInput = document.getElementById('playerName') as HTMLInputElement;
const saveScore = document.getElementById('saveScore')!;
const btnStart = document.getElementById('startGame')!;
const leaderboard = document.getElementById('leaderboard')!;
const dialog = document.getElementById('dialog')!;
const gameArea = document.getElementById('gameArea')!;
const gameCountdown = document.getElementById('countdown')!;

const clickSound = new Audio ('./sound/click.mp3');
const endeSound = new Audio ('./sound/ende.mp3');
const startSound = new Audio ('./sound/start.mp3');

ball.addEventListener('click', () => {
    if(timeLeft>0){
        score++;
        scoreDisplay.textContent = score.toString();
        moveBall();
        clickSound.play();
        ball.classList.add('clicked');
        setTimeout(() => {
            ball.classList.remove('clicked');
        }, 300);
    }
});

btnStart.addEventListener('click', () => {
    startSound.play();
    startCountdown();
});

saveScore.addEventListener('click', () => {
    const playerName = playerNameInput.value;
    if(playerName){
        const newScore: Score = {
            name: playerName,
            points: score
        }
        saveToLeaderboard(newScore);
        displayLeaderboard();
        resetGame();
        dialog.style.display = 'none';
        btnStart.style.display = 'block';
    }
});

function startGame(){
    resetGame();
    startTimer();
    moveBall();
    gameArea.style.pointerEvents = 'auto';
}

function startCountdown(){
    let countdown = 3;
    gameCountdown.textContent = countdown.toString();
    gameCountdown.style.display = 'block';
    gameArea.style.pointerEvents = 'none';
    btnStart.style.display = 'none';

    const countDownInterval = setInterval(() =>{
        countdown--;
        if(countdown > 0){
            gameCountdown.textContent = countdown.toString();  
        }
        else{
            clearInterval(countDownInterval);
            gameCountdown.style.display = 'none';
            startGame();
        }
    }, 1000);
}

function moveBall() {
    const x = Math.random()*(gameArea.clientWidth-ball.clientWidth);
    const y = Math.random()*(gameArea.clientHeight-ball.clientHeight);

    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
    ball.style.display = 'block';
}

function getLeaderBoard():Score[] {
    const StorageScores = localStorage.getItem('leaderboard');
    return StorageScores?JSON.parse(StorageScores):[];
}

function saveToLeaderboard(newScore:Score){
    const StorageScores = getLeaderBoard();
    StorageScores.push(newScore);
    StorageScores.sort((a, b) => 
        b.points - a.points
    );
    localStorage.setItem('leaderboard', JSON.stringify(StorageScores.slice(0,10)));
}

function displayLeaderboard(){
    const StorageScores = getLeaderBoard();
    leaderboard.innerHTML = StorageScores.map(
        score => `<li>${score.name}: ${score.points}</li>`
    ).join('');
}

function resetGame(){
    score = 0;
    timeLeft = 20;
    scoreDisplay.textContent = score.toString();
    timeDisplay.textContent = timeLeft.toString();
    playerNameInput.value = "";
    clearInterval(timeInterval);
    gameArea.style.pointerEvents = 'none';
    ball.style.display = 'none';
    btnStart.style.display = 'block';
}

function startTimer(){
    btnStart.style.display = 'none';
    timeInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft.toString();
        if(timeLeft<=0){
            clearInterval(timeInterval);
            endGame();
        }
    }, 1000);
}

function endGame(){
    endeSound.play();
    alert(`You failed with score: ${score}`);
    dialog.style.display = 'block';
    btnStart.style.display = 'none';
}

displayLeaderboard();
resetGame();