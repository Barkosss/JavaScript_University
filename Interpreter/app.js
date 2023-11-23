// Зачем я это делаю...
// Если что, начало не тут, оно внизу.
// Не тут, ещё ниже, на самом дне кода.

/*--------------- ВАЖНО. ОЧЕНЬ ВАЖНО ---------------------

(!!!) Для корректной работы кода, нужно смерва установить модуль - prompt-sync.

- Как установить?
Заходим в консоль, путь должен быть там же, где и сам файл. Ниже укажу, как это сделать через проводник
Далее, после открытия, пишем в командную строку эту строчку - npm install prompt-sync. Ждём окончании загрузки.

- Как открыть командную строку в нужном месте?
Заходим в проводник. Там открываем папку, в котором лежит нужным нам JS файл.
Нажимаем на путь, который указан выше. Не прямо на него, а туда, где он закачивается и чуть левее этого.
Нужно сделать так, чтобы можно было скопировать путь к папке.
После нажатия мы полностью удаляем путь, а вместо неё пишем - cmd. Далее нажимаем на Enter.
Теперь возращаемся к пункту выше.

----------------- ВАЖНО. ОЧЕНЬ ВАЖНО ---------------------*/


var prompt = require("prompt-sync")(); // 
function getFileContent() { // Функция для получения содержимого с файла
    const fs = require("fs"); // Модуль для чтения файлов
    var str = prompt("Which one? 1)fct 2)gcd \t"); // Спрашиваем у пользователя, какой код запускаем: Фибоначчи иль Нод? Ответ сохраняем в переменную str

    if (str == "1") { // Если читать код Фибоначчи
        return fs.readFileSync("fct.txt", "utf8");
    }
    else if (str == "2") { // Если читать код НОД
        return fs.readFileSync("nod.txt", "utf8");
    }
}

// Основная функция. Вызываем функцию мы ниже... Очень ниже
function justDoIT(fileContent) {
    let comms = { // Объект с командыми и их значениями в коде
        'cp0': 89, // 
        'input': 90, //
        'putt': 91, //
        'output': 92, // Вывести значение в консоль
        'jmp': 93, // Безусловный переход
        'min': 94, //
        'cp': 95, //
        'mul': 96, //
        'mod': 97, //
        'exit': 98, //
        'chk': 99, //
    }
    for (var comm in comms) { // Цикл
        let patt = comm;
        re = new RegExp(patt, 'g');
        console.log('Re: ' + re);
        fileContent = fileContent.replace(re, comms[comm])
    } // Конец цикла

    //console.log(fileContent);
    let arr = fileContent.split(/\s+/);
    //console.log(arr);
    let labels = {};
    for (let i = 0; i < arr.length; ++i)
        if (arr[i][0] == '@') {
            labels[arr[i]] = i + 1
        }
    //console.log(labels)

    console.log(arr);
    var ip = 0
    arr[100] = 1
    arr[101] = 0
    arr[102] = 171
    arr[103] = Number.MAX_SAFE_INTEGER
    arr[104] = Number.MIN_SAFE_INTEGER
    arr[105] = -1
    arr[600] = 0

    while (1) { // Бесконечный цикл
        switch (arr[ip]) { // 
            case '89':
                if (arr[arr[ip + 1]] == arr[arr[ip + 2]] && arr[arr[ip + 2]] == arr[arr[ip + 3]]) {
                    arr[arr[ip + 5]] = 1
                    let label = arr[ip + 4]
                    label = label.slice(1)
                    ip = parseInt(labels[label])
                }
                else if (arr[arr[ip + 1]] == arr[arr[ip + 3]]) {
                    arr[arr[ip + 5]] = 0
                    arr[arr[ip+7]]=arr[arr[ip+2]]
                    let label = arr[ip + 6]
                    label = label.slice(1)
                    ip = parseInt(labels[label])
                }
                else if (arr[arr[ip + 2]] == arr[arr[ip + 3]]) {
                    arr[arr[ip + 5]] = 0
                    arr[arr[ip + 7]] = arr[arr[ip + 1]]
                    let label = arr[ip + 6]
                    label = label.slice(1)
                    ip = parseInt(labels[label])
                }
                else ip += 8
                break
            case '90':
                arr[arr[ip + 1]] = prompt("Put a number: \t")
                ip += 2
                break
            case '91':
                arr[arr[ip + 2]] = arr[arr[ip + 1]]
                ip += 3
                //console.log('~',arr[arr[ip + 2]])
                break
            case '92':
                console.log('Answer: ', arr[arr[ip + 1]])
                ip += 2
                break
            case '93':
                let label;
                if (arr[arr[ip + 5]] == -1)
                    label = arr[ip + 1]
                else if (arr[arr[ip + 5]] == 0)
                    label = arr[ip + 2]
                else if (arr[arr[ip + 5]] == 1)
                    label = arr[ip + 3]
                else
                    label = arr[ip + 4]
                label = label.slice(1)
                ip = parseInt(labels[label])
                //console.log('+-',arr[arr[ip + 4]])
                //console.log(ip)
                //console.log('-+',label)
                break
            case '94':
                arr[arr[ip + 3]] = arr[arr[ip + 1]] - arr[arr[ip + 2]]
                //console.log('*min', arr[arr[ip + 1]])
                //console.log(arr[arr[ip + 2]])
                //console.log('**', arr[arr[ip + 3]])
                ip += 4
                break
            case '95':
                if (arr[arr[ip + 1]] > arr[arr[ip + 2]])
                    arr[arr[ip + 3]] = 1
                else if (arr[arr[ip + 1]] < arr[arr[ip + 2]])
                      arr[arr[ip + 3]] = -1
                else if (arr[arr[ip + 1]] == arr[arr[ip + 2]])
                    arr[arr[ip + 3]] = 0
                else arr[arr[ip + 3]] = 2
                //console.log('(cp', arr[arr[ip + 1]])
                //console.log(arr[arr[ip + 2]])
                //console.log(')', arr[arr[ip + 3]])
                ip += 4
                break
            case '96':
                arr[arr[ip + 3]] = arr[arr[ip + 1]] * arr[arr[ip + 2]]
                //console.log(arr[arr[ip + 1]])
                //console.log(arr[arr[ip + 2]])
                //console.log(arr[arr[ip + 3]])
                ip += 4
                break
            case '97':
                arr[arr[ip + 2]] = Math.abs(arr[arr[ip + 1]])
                ip += 3
                break
            case '98':
                console.log('exit code: ', arr[arr[ip + 1]], ' \nif it is 1, your input is out of range, try again :)','\n0=success')
                process.exit(arr[arr[ip + 1]])
                break
            case '99':
                if (arr[arr[ip + 1]] > arr[arr[ip + 2]] && arr[arr[ip + 1]] < arr[arr[ip + 3]]) {
                    ip += 6
                }
                else {
                    arr[arr[ip + 4]] = 1
                    let label = arr[ip + 5]
                    label = label.slice(1)
                    ip = parseInt(labels[label])
                }
                break   

            default:
                ip += 1
        }
    }
    //console.log(arr)
}


// ВОТ ТУТ НАЧАЛО
fileContent = getFileContent(); // Вызываем функцию getFileContent, и результат функции записываем в переменную
if (fileContent) { // Проверяем, не пустая ли переменная.
    justDoIT(fileContent) // Если не пустая, то вызываем функцию justDoIT
} // Если пустая, то выводит ошибку
else console.log("Try again, mb file is EMPTY or does not exist in the list");