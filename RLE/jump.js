const fs = require('fs');
module.exports.run = async (action, startFileName, endFileName) => {
    switch (action) {
        case 'encode': { // Кодирование
            const readFileContent = fs.readFileSync(startFileName, 'utf8'); // Чтение файла
            var resultEncode = `Method: jump\n`;
            var count = 1;
            for (let i = 0; i < readFileContent.length; i++) {
                // Код кодирования
                if (readFileContent[i] == readFileContent[i + 1] && count < 9) {
                    count += 1
                } else {
                    resultEncode = resultEncode + '(' + count + ',' + readFileContent[i] + ')|#|';
                    count = 1;
                }
                // Код кодирования
            }

            console.log('Кодирование прошло успешно')
            fs.writeFileSync(endFileName, resultEncode.slice(0, -3));
            break;
        }
        case 'decode': { // Декодирование
            const readFileContent = fs.readFileSync(startFileName, 'utf8');
            if (!readFileContent.split('\n')[0].includes('Method: jump')) {
                console.log('Данный файл был закодирован другим методом!')
            }
            var resultDecode = '';
            for (let elem of readFileContent.split('\n')[1].split('|#|')) {
                const count = elem[1];
                const letter = elem[3];
                resultDecode = resultDecode + letter.repeat(count);
            }

            console.log('Декодирование прошло успешно');
            fs.writeFileSync(endFileName, resultDecode);
            break;
        }
    }
}