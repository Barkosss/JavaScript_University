const fs = require('fs');
const inputFile = process.argv[2];
if (!inputFile) return console.log(`Specify the name of the txt file`);
if (!fs.existsSync(inputFile)) return console.log(`File "${inputFile}" not found`);
const content = fs.readFileSync(inputFile, 'utf-8');
const argv = content.split(/[ ,]+/);
if (!content.length) return console.log(`Less than one or more than three arguments are specified`);

const translate = require('./translate.js');
const expression = require('./expression.js');

switch(argv.length) {

    case 1: { // Если указан один аргумент - Перевести
        translate.run(argv[0])
        break;
    }

    case 3: { // Если указано три аргумента - Сложение/Вычитание
        expression.run(argv)
        break;
    }

    default: { // Ошибка
        console.log(`Less than one or more than three arguments are specified`);
        break;
    }
}