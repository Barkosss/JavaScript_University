const fs = require('fs');

// Объект для дерева
function Tree(name, value, code) {
    this.name = name;
    this.value = value;
    this.code = code;
}

const inputFile = process.argv[3]; // Файл для чтения
const tableFile = process.argv[4]; // Файл дерева
const outputFile = process.argv[5]; // Файл для записи

// Проверка на наличие в директории файла для чтения
if (!fs.existsSync(inputFile)) return console.log("Input file isn\s find in directory!\nFormat: action:encode | decode; input: input txt File; table: table txt File; output: output txt File");

var content = fs.readFileSync(inputFile, 'utf8');
var lenContent = content.length; // Длина исходного текста
var codes = [];

// Кодирование
function encode() {
    let arrCountSymbol = new Array(256).fill(0); // Счётчик символов, заполненный нулями
    let tree = [];
    let result = '';
    for(let i = 0; i < lenContent; i++) arrCountSymbol[content[i].charCodeAt(0)]++;

    for(let i = 0; i < 256; i++) {
        if (!arrCountSymbol[i]) continue;
        tree.push(new Tree(String.fromCharCode(i), arrCountSymbol[i], ''));
    }

    // Сортировка идёт там образом, потому что функция sort() сортирует элементы как строки
    // Чтобы можно было это сортировать как числа, мы делаем разность
    // Если разность больше 0 (a - b > 0) - число a > b
    // Если разность равна 0 (a - b == 0) - a == b
    // Если разность меньше 0 (a - b < 0) - a < b
    tree.sort(function(a, b) { return a.value - b.value});
    let n = 0;
    while(tree[tree.length - 1].value < lenContent) {
        tree.push(new Tree(tree[n].name + tree[n + 1].name, tree[n].value + tree[n + 1].value, ''))
        tree.sort(function(a, b){ return a.value - b.value });
        tree[n].code = '1';
        tree[n + 1].code = '0';

        n += 2;
    }
    
    // Цикл для пробега по дереву
    for(let i = 0; i < tree.length; i++) {
        if (tree[i].name.length === 1) { // Если длина имени равна единице
            for(let j = i + 1; j < tree.length; j++) {
                if (tree[j].name.includes(tree[i].name)) { // Если имя в дереве по индексу j включает в себя имя в дереве по индексу i
                    tree[i].code = tree[j].code + tree[i].code; // Сохраняем в i 
                }
            }
            codes.push(tree[i]); // Добавление полученного кода в массив с кодами
        }
    }


    for(let i = 0; i < lenContent; i++) {
        for(let j = 0; j < codes.length; j++) {
            if (codes[j].name == content[i]) { // Если имя равна символу
                result += codes[j].code;
            }
        }
    }   

    return result;
}

// Декодирование
function decode() {
    let table = fs.readFileSync(tableFile, 'utf8').split(' ');
    let result = '';

    let str = '';
    for(let i = 0; i < lenContent; i++) {
        str += content[i];
        for(let n = 1; n < table.length - 1; n += 2) {
            if (table[n] === str) {
                result += table[n - 1];
                str = '';
                break;
            }
        }
    }

    return result;
}

// Выбор действия   
switch(process.argv[2]) {
    case 'encode': { // Если надо закодировать
        let result = encode(); let table = ''; 
        fs.writeFileSync(outputFile, result);
        for(let i = 0; i < codes.length; i++) table += codes[i].name + ' ' + codes[i].code + ' ';
        fs.writeFileSync(tableFile, table);
        break;
    }

    case 'decode': { // Если надо раскодировать
        let result = decode();
        fs.writeFileSync(outputFile, result);
        break;
    }

    default: { // Если указана некорректная команда
        console.log('Action isn\t find.\nFormat: action:encode | decode; input: input txt File; table: table txt File; output: output txt File')
        break;
    }
}