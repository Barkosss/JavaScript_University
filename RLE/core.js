const fs = require('fs');

/*
input.txt - Исходные данные. Строка, которую надо закодировать
output.txt - Полученный результат кодирования
result.txt - Результат декодирования из output.txt
*/
const action = process.argv[2]; // Действие: encode (Кодирование) и decode (Декодирование)
const method = process.argv[3]; // Метод, которым будем кодировать/декодировать строки
const startFileName = process.argv[4]; // Название файла, который надо прочитать
const endFileName = process.argv[5]; // Название файла, в который надо запихнуть результат

// Проверка на аргументы
if (process.argv.length != 6) {
    console.log('Вы не указали требумое количество агрументов:\n1. Действие: encode, decode\n2. Метод: escape, jump\n3. Название файла на чтение\n4. Название файла на запись результата');
    return;
}

const readFileName = fs.readFileSync(startFileName, 'utf8'); // Чтение файла
if (!readFileName) {
    console.log('Указанный файл пустой: ' + startFileName);
    return;
}

switch (method) {
    case 'escape': { // Метод: Escape
        switch(action) {
            case 'encode': { // Кодирование
                const content = fs.readFileSync(inputFile, 'utf-8'); // Содержимое исходного файла
                var encodeContent = ''; var count = 1;
                for(let index = 0; index < content.length; index++) {

                    if (content[index] == '\x00') { // Если встретился escape-символ -> Кодируем
                        encodeContent += '\x00' + 1;
                        continue;
                    }

                    if (content[index] == content[index + 1]) { // Если есть повторени
                        count++;
                    } else { // Если попалось не повторение

                        if (count < 4 && content[index] != '\x00') { // Если количество меньше 4
                            encodeContent += content[index].repeat(count);
                        }

                        else if (count > 255) { // Если количество повторений больше 255

                            while(count > 255) { // Делаем, пока кол-во повторений больше 255
                                encodeContent += '\x00' + String.fromCharCode(count - 255) + content[index]; // Добавление кодирования
                                count -= 225;
                            }

                        } else { // Если количество повторений меньше или равна 255
                            encodeContent += '\x00' + String.fromCharCode(count) + content[index];
                        }
                        count = 1;
                    }
                }

                console.log("Escape encoding was successful!");
                fs.writeFileSync(outputFile, `Method: escape\n${encodeContent}`); // Запись в файл
                break;
            }

            case 'decode': { // Декодирование
                const contentFile = fs.readFileSync(inputFile, 'utf8');
                const methodEncode = contentFile.split('\n')[0]; // Method: ...
                const contentEncode = contentFile.split('\n')[1]; // Content: ...
                if (!methodEncode.toLowerCase().endsWith('escape')) { // Если кодировка не Escape
                    console.log("A different coding method was used. Not \"Escape\"");
                    return;
                }

                var decodeContent = '';
                for(let index = 0; index < contentEncode; i++) {
                    if (contentEncode[index] == '\x00') {
                        decodeContent += contentEncode[index + 2].repeat(contentEncode[index + 1].charCodeAt());
                        i += 2
                    } else {
                        decodeContent += contentEncode[index];
                    }
                }

                console.log("Escape decoding was successful!");
                fs.writeFileSync(outputFile, `Method: escape\nContent: ${decodeContent}`); // Запись в файл
                break;
            }

            default: {
                console.log('Указанное действие не найдено:', action);
                break;
            }
        }
        break;
    }

    case 'jump': { // Метод: Jump
        switch(action) {
            case 'encode': { // Кодирование
                const content = fs.readFileSync(inputFile, 'utf-8'); // Содержимое исходного файла
                var encodeContent = '';
                for(let index = 0; index < content.length; index++) {
                    var countRepeat = 1; var countDifferent = 1; var differentLetters = '';
                    if (content[index] == content[index + 1] && content[index] == content[index + 2]) {
                        while((content[index] == content[index + 1]) && countRepeat < 128) {
                            countRepeat++;
                            index++;
                        }
                        encodeContent += String.fromCharCode(countRepeat) + content[index];
                    }
                    else {
                        while(!((content[index] == content[index + 1]) && (content[index] == content[index + 2])) && countDifferent < 127) {
                            countDifferent++;
                            differentLetters += content[index];
                            index++;
                        }
                        encodeContent += String.fromCharCode(128 + countDifferent) + differentLetters;
                        index--;
                    }
                }

                console.log("Jump encoding was successful!");
                fs.writeFileSync(outputFile, `Method: jump\n${encodeContent}`); // Запись в файл
                break;
            }

            case 'decode': { // Декодирование
                const contentFile = fs.readFileSync(inputFile, 'utf8');
                const methodDecode = contentFile.split('\n')[0]; // Method: ...
                const contentDecode = contentFile.split('\n')[1]; // Content: ...
                if (!methodDecode.toLowerCase().endsWith('jump')) { // Если кодировка не Escape
                    console.log("A different coding method was used. Not \"Jump\"");
                    return;
                }
                var decodeContent = '';
                for(let index = 0; index < contentDecode.length; index++) { // Тут проблема!!!!!!!!!!!!!!!!!!!!!
                    if (contentDecode[index].charCodeAt() < 128) { // Если повторяемые символы
                        decodeContent += contentDecode[index + 1].repeat(contentDecode[index].charCodeAt());
                        index += contentDecode[index].charCodeAt() + 1;
                    } else {
                        while (contentDecode[index].charCodeAt() > 127) {
                            decodeContent += contentDecode[index + 1];
                            contentDecode[index].charCodeAt()--;
                            index++;
                        }
                    }
                }

                console.log("Jump decoding was successful!");
                fs.writeFileSync(outputFile, `Method: jump\nContent: ${decodeContent}`); // Запись в файл
                break;
            }

            default: {
                console.log('Указанное действие не найдено:', action);
                break;
            }
        }
        break;
    }

    default: { // Если указанный метод не найден
        console.log('Указанный метод не найден: ' + method);
        break;
    }
}