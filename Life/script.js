const celldSize = 20;
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let fieldSize = 40;
let field = new Array(fieldSize);
let nextField = new Array(fieldSize);
let intervalId;

function initializeField() {
    for (let i = 0; i < fieldSize; i++) {
        field[i] = new Array(fieldSize);
        nextField[i] = new Array(fieldSize);
    }

    for (let i = 0; i < fieldSize; i++)
        for (let j = 0; j < fieldSize; j++)
            field[i][j] = 0;
}

function drawField() {
    for (let i = 0; i < fieldSize; i++)
        for (let j = 0; j < fieldSize; j++) {
            ctx.fillStyle = field[i][j] === 1 ? "#000" : "#FFF";
            ctx.fillRect(i * celldSize, j * celldSize, celldSize, celldSize);
        }

    ctx.strokeStyle = "#888";
    for (let i = 0; i <= fieldSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * celldSize, 0);
        ctx.lineTo(i * celldSize, fieldSize * celldSize);
        ctx.stroke();
    }
    for (let j = 0; j <= fieldSize; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * celldSize);
        ctx.lineTo(fieldSize * celldSize, j * celldSize);
        ctx.stroke();
    }
}

function neighborCount(r, c) {
    let count = -field[r][c];
    for (let i = -1; i <= 1; i++)
        for (let j = -1; j <= 1; j++)
            count += field[(r + i + fieldSize) % fieldSize][(c + j + fieldSize) % fieldSize];
    return count;
}

function nextGen() {
    for (let i = 0; i < fieldSize; i++)
        for (let j = 0; j < fieldSize; j++) {
            nextField[i][j] = field[i][j];
            if ((field[i][j] == 0) && (neighborCount(i, j) == 3))
                { nextField[i][j] = 1; }
            else if ((field[i][j] == 1) &&
                ((neighborCount(i, j) < 2) || (neighborCount(i, j) > 3)))
                { nextField[i][j] = 0; }
        }
}

function doStep() {
    nextGen();
    for (let i = 0; i < fieldSize; i++)
        for (let j = 0; j < fieldSize; j++)
            field[i][j] = nextField[i][j];
    drawField();
}

function newWorld() {
    stopLife();
    const width = parseInt(document.getElementById("width").value);
    const height = parseInt(document.getElementById("height").value);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        alert("Please enter valid values for width and height.");
        return;
    }

    
    fieldSize = width;
    initializeField();
    drawField();
    stopLife();
}

function startLife() {
    const intervalTime = parseInt(document.getElementById("interval").value);

    if (isNaN(intervalTime) || intervalTime <= 0) {
        alert("Please enter a valid value for the interval.");
        return;
    }

    intervalId = setInterval(doStep, intervalTime);
}

function stopLife() {
    clearInterval(intervalId);
}

function toggleCell(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const i = Math.floor(x / celldSize);
    const j = Math.floor(y / celldSize);

    field[i][j] = 1 - field[i][j];
    drawField();
}

function randomize() {
    for (let i = 0; i < fieldSize; i++)
        for (let j = 0; j < fieldSize; j++)
            field[i][j] = (Math.random() > 0.9)*1;

    drawField();
}

function nextGeneration() {
    doStep();
}