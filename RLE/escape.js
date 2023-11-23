const fs = require('fs');
//const decodeChar = String.fromCharCode(21);
const decodeChar = '#'
module.exports.run = async(action, startFileName, endFileName) => {
    switch(action) {
        case 'encode': { // Кодирование
            const readFileContent = fs.readFileSync(startFileName, 'utf8'); // Чтение файла
            var resultEncode = `Method: escape\n`;
            var count = 1;
            for(let i = 0; i < readFileContent.length; i++) {
                // Код кодирования
                if (readFileContent[i] == readFileContent[i + 1] && count < 9) {
                    count += 1
                } else {
                    if (count >= 4) {
                        resultEncode = resultEncode + decodeChar + count + ((readFileContent[i] != decodeChar) ? (readFileContent[i]) : ('\#'));
                    } else {
                        resultEncode = resultEncode + decodeChar + ((readFileContent[i] != decodeChar) ? (readFileContent[i]) : (decodeChar)).repeat(count);
                    }
                    count = 1;
                }
                // Код кодирования
            }

            console.log('Кодирование прошло успешно')
            fs.writeFileSync(endFileName, resultEncode);
            break;
        }
        case 'decode': { // Декодирование
            const readFileContent = fs.readFileSync(startFileName, 'utf8');
            if (!readFileContent.split('\n')[0].includes('Method: escape')) {
                console.log('Данный файл был закодирован другим методом!')
            }
            var resultDecode = '';
            for(let elem of readFileContent.split('\n')[1].split(decodeChar)) {
                if (elem.length == 2 && elem[0] > 0) {
                    var count = elem[0];
                    var letter = elem[1];
                    resultDecode = resultDecode + letter.repeat(count);
                } else {
                    resultDecode = resultDecode + elem;
                }
            }

            console.log('Декодирование прошло успешно');
            fs.writeFileSync(endFileName, resultDecode);
            break;
        }
    }
}