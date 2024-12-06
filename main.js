import paragraphs from './paragraphs.js';

const textDisplay = document.getElementById('textDisplay');
const textInput = document.getElementById('textInput');
const timer = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timerLimit = document.getElementById('timerLimit');

let timeLeft = 60;
let timeElapsed = 0;
let totalErrors = 0;
let errors = 0;
let currentText = '';
let timerInterval = null;
let isTyping = false;

function getRandomParagraph() {
    return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

function updateText() {
    currentText = getRandomParagraph();
    textDisplay.textContent = currentText;
}

function startTimer() {
    timeLeft = parseInt(timerLimit.value);
    timeElapsed = 0;
    errors = 0;
    totalErrors = 0;
    isTyping = true;
    
    textInput.disabled = false;
    textInput.value = '';
    updateText();
    textInput.focus();

    timerInterval = setInterval(updateTimer, 1000);
    startBtn.style.display = 'none';
    resetBtn.style.display = 'inline';
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeElapsed++;
        timer.textContent = timeLeft;
    } else {
        finishTest();
    }
}

function finishTest() {
    clearInterval(timerInterval);
    textInput.disabled = true;
    
    // Calculate time taken in minutes using the selected time limit
    const timeTaken = Math.max(timeElapsed / 60, 0.017);
    
    // Rest of the function remains the same
    const wordsTyped = textInput.value.length / 5;
    const wpm = Math.round(wordsTyped / timeTaken);
    
    const correctCharacters = textInput.value.split('').filter((char, index) => char === currentText[index]).length;
    const accuracy = Math.min(Math.max(Math.round((correctCharacters / textInput.value.length) * 100), 0), 100);
    
    wpmDisplay.textContent = Math.min(wpm, 250);
    accuracyDisplay.textContent = accuracy || 0;
    
    startBtn.style.display = 'inline';
}

function resetTest() {
    clearInterval(timerInterval);
    timeLeft = parseInt(timerLimit.value);
    isTyping = false;
    textInput.value = '';
    textInput.disabled = false;
    timer.textContent = timeLeft;
    wpmDisplay.textContent = 0;
    accuracyDisplay.textContent = 0;
    updateText();
    startBtn.style.display = 'inline';
}

textInput.addEventListener('input', () => {
    if (!isTyping) {
        startTimer();
    }
    
    const currentInput = textInput.value;
    const currentInputArray = currentInput.split('');
    
    errors = 0;
    
    currentInputArray.forEach((char, index) => {
        if (char !== currentText[index]) {
            errors++;
            totalErrors++;
        }
    });
});

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTest);

// Initialize
updateText();
textInput.disabled = true;
resetBtn.style.display = 'none';
