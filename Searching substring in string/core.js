const fs = require('fs');

// Методы
const bruteForce = require('./brute force.js');
const hashes = require('./hashes.js');
const auto = require('./auto.js');
// Методы

const lenArgs = process.argv.length;
const keys = process.argv.slice(2, lenArgs - 3);
const method = process.argv[lenArgs - 3];
const stringFile = process.argv[lenArgs - 2];
const substringFile = process.argv[lenArgs - 1];

if (!fs.existsSync(stringFile) || !fs.existsSync(substringFile)) {
    return console.log('String file and/or substring file is not found');
}

switch(method.toLowerCase()) {

    // Метод Brute Force
    case 'brute-force': {}
    case 'bruteforce': {}
    case 'b': {
        bruteForce.run(stringFile, substringFile);
        break;
    }

    // Метод Hashes: Сумма кодов
    case 'hashes-sum': {}
    case 'hashessum': {}
    case 'h1': {
        hashes.sum(keys, stringFile, substringFile);
        break;
    }

    // Метод Hashes: Сумма квадратов кодов
    case 'hashes-sum-square': {}
    case 'hashessumsquare': {}
    case 'h2': {
        hashes.sumSquare(keys, stringFile, substringFile);
        break;
    }

    // Метод Hashes: Рабина-Карпа
    case 'hashes-rabina-karp': {}
    case 'hashesrabinakarp': {}
    case 'h3': {
        hashes.rabinaKarp(keys, stringFile, substringFile);
        break;
    }

    // Метод Автомат
    case 'automatic': {}
    case 'automat': {}
    case 'auto': {
        auto.run(stringFile, substringFile);
        break;
    }
}