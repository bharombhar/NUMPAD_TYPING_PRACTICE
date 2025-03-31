let numbers = "";
let currentIndex = 0;
let correctEntries = 0;
let totalEntries = 0;
let timer;
let timeElapsed = 0;
let started = false;
let totalTypedWords = 0;
let advancedMode = false;

document.getElementById('modeSwitch').addEventListener('change', function() {
    advancedMode = this.checked;
    restartTest();
});

function generateNumbers() {
    numbers = "";
    if (advancedMode) {
        let symbols = ['-', '+', '*', '/'];
        for (let i = 0; i < 20; i++) {
            let num1 = Math.floor(1000 + Math.random() * 9000);
            let num2 = Math.floor(1000 + Math.random() * 9000);
            let num3 = Math.floor(1000 + Math.random() * 9000);
            let symbol1 = symbols[Math.floor(Math.random() * symbols.length)];
            let symbol2 = symbols[Math.floor(Math.random() * symbols.length)];
            numbers += `${num1}${symbol1}${num2}${symbol2}${num3} `;
        }
    } else {
        for (let i = 0; i < 6; i++) {
            let tempNum = "";
            for (let j = 0; j < 5; j++) {
                tempNum += Math.floor(Math.random() * 9000000000);
            }
            for (let k = 0; k < tempNum.length; k++){
                numbers += tempNum[k];
                if((k + 1) % 20 === 0 && k !== 0){
                    numbers += " ";
                }
            }
            numbers += " ";
        }
    }
    currentIndex = 0;
    displayNumbers();
}

function displayNumbers() {
    let html = numbers.split('').map((char, index) =>
        index === currentIndex ? `<span class="highlight">${char}</span>` : char
    ).join('');
    document.getElementById('numberContainer').innerHTML = html;
}

function startTimer() {
    if (started) return; 
    started = true;
    timer = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = formatTime(timeElapsed);
        updateStats();
    }, 1000);
}

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

document.getElementById('typingInput').addEventListener('input', function (event) {
    if (!started) startTimer();

    let typedValue = this.value;
    let correctChar = numbers[currentIndex];

    if (typedValue[typedValue.length - 1] === correctChar) {
        correctEntries++;
        currentIndex++;
    } else if (event.inputType === "deleteContentBackward") {
        currentIndex = Math.max(0, currentIndex - 1);
    }
    
    totalEntries++;
    totalTypedWords++;

    if (currentIndex >= numbers.length) {
        generateNumbers();
        currentIndex = 0;
        this.value = "";
    }

    displayNumbers();
    updateStats();
});

function updateStats() {
    let elapsedMinutes = timeElapsed / 60;
    let wpm = elapsedMinutes > 0 ? (totalTypedWords / elapsedMinutes).toFixed(2) : 0;
    let accuracy = totalEntries > 0 ? ((correctEntries / totalEntries) * 100).toFixed(2) : 100;

    document.getElementById('wpm').textContent = wpm;
    document.getElementById('accuracy').textContent = accuracy;
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Tab") {
        event.preventDefault(); // Prevents default tab behavior
        restartTest(); // Restart the test
    } else if (event.key === "Escape") {
        event.preventDefault(); // Prevents form submission or new line
        stopTest(); // Stop the test
    }
});

function stopTest() {
    clearInterval(timer);
    started = false;
    let elapsedMinutes = timeElapsed / 60;
    let avgWpm = elapsedMinutes > 0 ? (totalTypedWords / elapsedMinutes).toFixed(2) : 0;
    document.getElementById('avgWpm').textContent = avgWpm;
    document.getElementById('typingInput').disabled = true;
}

function restartTest() {
    clearInterval(timer);
    started = false;
    timeElapsed = 0;
    currentIndex = 0;
    correctEntries = 0;
    totalEntries = 0;
    totalTypedWords = 0;
    document.getElementById('typingInput').disabled = false;
    document.getElementById('typingInput').value = "";
    document.getElementById('timer').textContent = "00:00";
    document.getElementById('avgWpm').textContent = "-";
    generateNumbers();
    updateStats();
    document.getElementById('typingInput').focus();
}

generateNumbers();
