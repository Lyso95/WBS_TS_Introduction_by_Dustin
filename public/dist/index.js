var score = 0;
var timeLeft = 20;
var timeInterval;
var scoreDisplay = document.getElementById('score');
var timeDisplay = document.getElementById('time');
var ball = document.getElementById('ball');
var playerNameInput = document.getElementById('playerName');
var saveScore = document.getElementById('saveScore');
var btnStart = document.getElementById('startGame');
var leaderboard = document.getElementById('leaderboard');
var dialog = document.getElementById('dialog');
var gameArea = document.getElementById('gameArea');
var gameCountdown = document.getElementById('countdown');
var clickSound = new Audio('./sound/click.mp3');
var endeSound = new Audio('./sound/ende.mp3');
var startSound = new Audio('./sound/start.mp3');

ball.addEventListener('click', function () {
    if (timeLeft > 0) {
        score++;
        scoreDisplay.textContent = score.toString();
        moveBall();
        clickSound.play();
        ball.classList.add('clicked');
        setTimeout(function () {
            ball.classList.remove('clicked');
        }, 300);
    }
});
btnStart.addEventListener('click', function () {
    startSound.play();
    startCountdown();
});
saveScore.addEventListener('click', function () {
    var playerName = playerNameInput.value;
    if (playerName) {
        var newScore = {
            name: playerName,
            points: score
        };
        saveToLeaderboard(newScore);
        displayLeaderboard();
        resetGame();
        dialog.style.display = 'none';
        btnStart.style.display = 'block';
    }
});
function startGame() {
    resetGame();
    startTimer();
    moveBall();
    gameArea.style.pointerEvents = 'auto';
}
function startCountdown() {
    var countdown = 3;
    gameCountdown.textContent = countdown.toString();
    gameCountdown.style.display = 'block';
    gameArea.style.pointerEvents = 'none';
    btnStart.style.display = 'none';
    var countDownInterval = setInterval(function () {
        countdown--;
        if (countdown > 0) {
            gameCountdown.textContent = countdown.toString();
        }
        else {
            clearInterval(countDownInterval);
            gameCountdown.style.display = 'none';
            startGame();
        }
    }, 1000);
}
function moveBall() {
    var x = Math.random() * (gameArea.clientWidth - ball.clientWidth);
    var y = Math.random() * (gameArea.clientHeight - ball.clientHeight);
    ball.style.left = "".concat(x, "px");
    ball.style.top = "".concat(y, "px");
    ball.style.display = 'block';
}
function getLeaderBoard() {
    var StorageScores = localStorage.getItem('leaderboard');
    return StorageScores ? JSON.parse(StorageScores) : [];
}
function saveToLeaderboard(newScore) {
    var StorageScores = getLeaderBoard();
    StorageScores.push(newScore);
    StorageScores.sort(function (a, b) {
        return b.points - a.points;
    });
    localStorage.setItem('leaderboard', JSON.stringify(StorageScores.slice(0, 10)));
}
function displayLeaderboard() {
    var StorageScores = getLeaderBoard();
    leaderboard.innerHTML = StorageScores.map(function (score) { return "<li>".concat(score.name, ": ").concat(score.points, "</li>"); }).join('');
}
function resetGame() {
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
function startTimer() {
    btnStart.style.display = 'none';
    timeInterval = setInterval(function () {
        timeLeft--;
        timeDisplay.textContent = timeLeft.toString();
        if (timeLeft <= 0) {
            clearInterval(timeInterval);
            endGame();
        }
    }, 1000);
}
function endGame() {
    endeSound.play();
    alert("You failed with score: ".concat(score));
    dialog.style.display = 'block';
    btnStart.style.display = 'none';
}
displayLeaderboard();
resetGame();