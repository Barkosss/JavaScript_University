const fs = require('fs');

// Модуль для кодирования
module.exports.encode = async(inputFile, outputFile) => {
    const content = fs.readFileSync(inputFile, 'utf-8'); // Содержимое исходного файла
    var encodeContent = ''; var count = 1;
    for(let index = 0; index < content.length; index++) {
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
};

/* Заметки
parseInt(String.fromCharCode(51)); - Для декодирования ASCII символа
*/

// Модель для декодирования
module.exports.decode = async(inputFile, outputFile) => {
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
};