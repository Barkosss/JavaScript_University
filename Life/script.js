
const createButtons = (parent, counterFields) => {
    for (let i = 0; i < counterFields; i++) {
        const newRow = document.createElement("div");
        newRow.classList.add("row");

        for (let j = 0; j < counterFields; j++) {
            const button = document.createElement("button");
            button.innerText = "Button " + i + " " + j;

            newRow.appendChild(button);
        }
        parent.appendChild(newRow);
    }
};


// Функция для генерации "поколения"
function Next() {
    console.log('Next');
}

// Функция для случайного заполнения поля клетками
function Random() {
    // Удаляем кнопки
    while (document.querySelector('.fields')) document.querySelector('.fields').remove()
    const gridElement = document.getElementById("buttons");
    const counterFields = Math.floor(Math.random() * 8) + 2;
    
    createButtons(gridElement, counterFields);
    console.log('Random');
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