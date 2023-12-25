
// Функция для генерации "поколения"
function Next() {
    console.log('Next');
}

// Функция для случайного заполнения поля клетками
function Random() {
    // Удаляем кнопки
    var buttonsContainer = document.getElementById('buttons');
    while(buttonsContainer.firstChild) {
        buttonsContainer.removeChild(buttonsContainer.lastChild);
    }
    const counterFields = Math.floor(Math.random() * 8) + 2;

    var matrix = [];

    for(var i = 0; i < counterFields; i++) {
        var row = [];
        for(var j = 0; j < counterFields; j++) {
            var button = document.createElement('buttons');
            button.innerText = 'Button ' + i + ' ' + j;
            row.push(button);
        }
        matrix.push(row);
    }

    var body = document.getElementsByTagName('div')[1];
    for(let row of matrix) {
        var tr = document.createElement('button');
        for(let cell of row) {
            tr.appendChild(cell);
        }
        body.appendChild(tr);
    }
}

// Функция для работы смены "поколений"
function Start() {
    CreateField(5, 5);
    console.log('Start');
}

// Функция остановки смены "поколений"
function Stop() {
    console.log('Stop');
}

// Функция для смены темы сайта
function ChangeTheme() {
    console.log('ChangeTheme');
}

// Функция для создания поля
function Create() {
    console.log('Create');
}

// Функция для создания рандомного поля
function CreateRandom() {
    console.log('CreateRandom');
}