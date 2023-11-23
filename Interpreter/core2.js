const fs = require('fs');
const prompt = require('prompt-sync')();
const inputFile = process.argv[2];
if (!fs.existsSync(inputFile)) return console.log(`File ${inputFile} is not denied!`);
const content = fs.readFileSync(inputFile, 'utf-8');
var split = content.split('\n'); var data = [];
for (let i in split) if (split[i] != '\r' && split[i].length > 0) data.push(split[i].trim());
const lendata = data.length;
var indexCode = 0; // Номер строки
var section = data[0].trim(); // Секция кода.
(async() => {
    while(data[indexCode] != 'end') {
        if (!data[indexCode].trim() || data[indexCode].trim().startsWith('//')) { indexCode++; continue; };
        var line = data[indexCode].trim();
        if (line[0] == ':') { indexCode++; continue };
        if (['.data', '.code'].indexOf(line) != -1) { section = line; indexCode++; continue; }
        //console.log(section);
        switch(section) {

            case '.data': { // Секция кода - Данные
                let [cell, arg] = line.split(' ');
                if (cell.startsWith('#')) { // Если начинается на # - Ячейка памяти
                    cell = parseInt(cell.slice(1)); // Убираем '#' из номера ячейки памяти
                    if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                    data[lendata + cell + 1] = parseInt(arg); // Номер ячейка = Номер ячейки + длина кода + 1 (+1 делается для небольшого разделения между блоком кода и данных)
                } else { // Не ячейка памяти - Ошибка
                    console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`)
                    return;
                }
                indexCode++;
                break;
            }

            case '.code': { // Секция кода - Кода
                const command = line.split(' ')[0];
                //console.log('command:', command);
                switch(command) {

                    case 'mov': { // Перемещения значения
                        let [cell, arg] = line.split(' ').slice(1);
                        if (cell.startsWith('#')) { // Если первым аргументом указана ячейка
                            cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                            if (isNaN(arg)) { // Если второй аргумент является ячейкой памяти
                                arg = parseInt(arg.slice(1)) // Берём именно номер ячейки памяти
                                if (arg < 0 || isNaN(arg)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                                data[lendata + cell + 1] = data[lendata + arg + 1]; // В ячейку с номером cell записываем значение из ячейки с номером arg;
                            } else { // Если второй аргумент значение
                                data[lendata + cell + 1] = parseInt(arg); // В ячейку с номером cell записываем значение arg;
                            }
                        } else { // Если первым аргументом указана не ячейка - Ошибка
                            console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`)
                            return;
                        }
                        indexCode++;
                        break;
                    }

                    case 'and': { // Логическое И
                        let [cell, arg] = line.split(' ').slice(1);
                        if (cell.startsWith('#')) { // Если первым аргументом указана ячейка памяти
                            cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                            if (isNaN(arg)) { // Если вторым аргументом указана ячейка памяти
                                arg = parseInt(arg.slice(1)); // Берём именно номер ячейки памяти
                                if (arg < 0 || isNaN(arg)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                                data[lendata + cell + 1] = data[lendata + cell + 1] * data[lendata + arg + 1];
                            } else { // Если вторым аргументом указано значение
                                data[lendata + cell + 1] = data[lendata + cell + 1] * arg;
                            }
                        } else { // Если указана первый аргументом не ячейка памяти
                            console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                            return;
                        }
                        indexCode++;
                        break;
                    }
                    
                    case 'max': { // Максимальный элемент
                        let [cell, ...argv] = line.split(' ').slice(1);
                        if (cell.startsWith('#')) { // Если первым аргументо указана ячейка памяти
                            cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                            let max = -Infinity; // Макисмальный элемент - Минус Бесконечность
                            for(let elem of argv) { // Поиск максимального элемента
                                if (isNaN(elem)) { // Если элемент массива является ячейкой памяти
                                    elem = parseInt(elem.slice(1)); // Берём именно номер ячейки памяти
                                    if (elem < 0 || isNaN(elem)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                                    max = Math.max(max, data[lendata + elem + 1]);
                                } else { // Если элементь массива является значение
                                    max = Math.max(max, elem);
                                }
                            }
                            data[lendata + cell + 1] = max; // Сохранение в ячейку памяти с номером cell максимальный элемент массива - max
                        } else { // Если первым аргументом указана не ячейка памяти
                            console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                            return;
                        }
                        indexCode++;
                        break;
                    }

                    case 'min': { // Минимальный элемент
                        let [cell, ...argv] = line.split(' ').slice(1);
                        if (cell.startsWith('#')) { // Если первым аргументо указана ячейка памяти
                            cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                            let min = +Infinity; // Макисмальный элемент - Плюс Бесконечность
                            for (let elem of argv) { // Поиск минимального элемента
                                if (isNaN(elem)) { // Если элемент массива является ячейкой памяти
                                    elem = parseInt(elem.slice(1)); // Берём именно номер ячейки памяти
                                    if (elem < 0 || isNaN(elem)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                                    min = Math.min(min, data[lendata + elem + 1]);
                                } else { // Если элементь массива является значение
                                    min = Math.min(min, elem);
                                }
                            }
                            data[lendata + cell + 1] = min; // Сохранение в ячейку памяти с номером cell минимальный элемент массива - min
                        } else { // Если первым аргументом указана не ячейка памяти
                            console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                            return;
                        }
                        indexCode++;
                        break;
                    }

                    case 'abs': { // Модуль значения
                        let [cell, arg] = line.split(' ').slice(1);
                        if (cell.startsWith('#')) { // Если первым аргументом указана ячейка памяти
                            if (isNaN(arg)) { // Если вторым аргументом указана ячейка памяти
                                arg = parseInt(arg.slice(1)); // Берём именно номер ячейки памяти
                                if (arg < 0 || isNaN(arg)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                                data[lendata + cell + 1] = Math.abs(data[lendata + arg + 1]);
                            } else { // Если вторым аргументом указано значение
                                data[lendata + cell + 1] = Math.abs(arg);
                            }
                        } else { // Если первым аргументом указана не ячейка памяти
                            console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                            return;
                        }
                        indexCode++;
                        break;
                    }

                    case 'add': { // Сложение аргументов
                        let [cell, ...argv] = line.split(' ').slice(1);
                        if (argv.length < 2) return console.log(`Less then two arguments (line: ${indexCode + 1})`);
                        if (cell.startsWith('#')) { // Если первым аргументом указана ячейка памяти
                            cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                            let sum = 0; // Результат сложения - 0
                            for (let elem of argv) { // вычисление
                                if (isNaN(elem)) { // Если элемент массива является ячейкой памяти
                                    elem = parseInt(elem.slice(1)); // Берём именно номер ячейки памяти
                                    if (elem < 0 || isNaN(elem)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                                    sum += parseInt(data[lendata + elem + 1]);
                                } else { // Если элементь массива является значение
                                    sum += parseInt(elem);
                                }
                            }
                            data[lendata + cell + 1] = sum; // Сохранение в ячейку памяти с номером cell результат сложения - sum
                        } else { // Если первым аргументом указана не ячейка памяти
                            console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                            return;
                        }
                        indexCode++;
                        break;
                    }

                    case 'diff': { // Разность аргументов
                        let [cell, ...argv] = line.split(' ').slice(1);
                        if (cell.startsWith('#')) { // Если первым аргументом указана ячейка памяти
                            cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                            let diff = 0; // Результат вычитания - 0
                            for (let elem of argv) { // вычисление
                                if (isNaN(elem)) { // Если элемент массива является ячейкой памяти
                                    elem = parseInt(elem.slice(1)); // Берём именно номер ячейки памяти
                                    if (elem < 0 || isNaN(elem)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                                    diff -= data[lendata + elem + 1];
                                } else { // Если элементь массива является значение
                                    diff -= elem;
                                }
                            }
                            data[lendata + cell + 1] = diff; // Сохранение в ячейку памяти с номером cell результат вычитания - diff
                        } else { // Если первым аргументом указана не ячейка памяти
                            console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                            return;
                        }
                        indexCode++;
                        break;
                    }

                    case 'input': { // Ввод с консоли
                        let type = line.split(' ')[1].toLowerCase(); // Тип данных
                        let cell = line.split(' ')[2]; // Ячейка памяти
                        if (cell.startsWith('#')) { // Если аргумент является ячейка памяти
                            cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                            let input = prompt(': ');
                            data[lendata + cell + 1] = ((type == 'int') ? (parseInt(input)) : (input));
                        } else { // Если аргумент не является ячейкой памяти
                            console.log(`The first argument must be a memory cell. (line: ${indexCode + 1})`);
                            return;
                        }
                        indexCode++;
                        break;
                    }

                    case 'output': { // Вывод на консоль
                        let cell = line.split(' ')[1];
                        if (cell.startsWith('#')) { // Если аргументом указана ячейка памяти
                            cell = parseInt(cell.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`);
                            console.log(data[lendata + cell + 1]);
                        } else { // Если аргументом указана не ячейка памяти
                            console.log(cell);
                        }
                        indexCode++;
                        break;
                    }

                    case 'cmp': { // Команда для сравнения
                        let [...argv] = line.split(' ').slice(1);
                        if (argv.length != 2) return console.log(`The ${command} command must have two arguments. (line: ${indexCode + 1})`);
                        indexCode++;
                        break;
                    }

                    case 'je': { // Переход, если два аргумента РАВНЫ
                        let [arg1, arg2] = data[indexCode - 1].split(' ').slice(1);
                        if (arg1.startsWith('#')) { // Если первый аргумент - Ячейка памяти
                            cell = parseInt(arg1.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                            arg1 = data[lendata + cell + 1];
                        } else {
                            arg1 = parseInt(arg1);
                        }
                        /*
                        } else if (parseInt(arg1)) { // Если первый аргумент - Целое число
                            arg1 = parseInt(arg1);
                        } else { // Если первый аргумент не число, и не ячейка
                            console.log(`The first argument is not a memory cell and an integer. (line: ${indexCode + 1})`);
                            return;
                        }
                        */
                        if (arg2.startsWith('#')) { // Если второй аргумент - Ячейка памяти
                            cell = parseInt(arg2.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                            arg2 = data[lendata + cell + 1];
                        } else {
                            arg2 = parseInt(arg2);
                        }
                        /*
                        } else if (parseInt(arg2)) { // Если второй аргумент - Целое число
                            arg2 = parseInt(arg2);
                        } else { // Если второй аргумент не число, и не ячейка
                            console.log(`The second argument is not a memory cell and an integer. (line: ${indexCode + 1})`);
                            return;
                        }*/

                        if (arg1 == arg2) {
                            let point = line.split(' ')[1];
                            if (data.indexOf(point) != -1) indexCode = data.indexOf(point); // Если метка найдена
                            else return console.log(`The specified tag "${point}" was not found. (line: ${indexCode + 1})`); // Если метка не найдена
                        } else { // Если аргументы равны
                            indexCode++;
                        }
                        break;
                    }

                    case 'jge': { // Переход, если первый аргумент больше или равно второму аргументу
                        let [arg1, arg2] = data[indexCode - 1].split(' ').slice(1);
                        if (arg1.startsWith('#')) { // Если первый аргумент - Ячейка памяти
                            cell = parseInt(arg1.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                            arg1 = data[lendata + cell + 1];
                        } else if (Number.isInteger(arg1)) { // Если первый аргумент - Целое число
                            arg1 = parseInt(arg1);
                        } else { // Если первый аргумент не число, и не ячейка
                            console.log(`The first argument is not a memory cell and an integer. (line: ${indexCode + 1})`);
                            return;
                        }
                        if (arg2.startsWith('#')) { // Если второй аргумент - Ячейка памяти
                            cell = parseInt(arg2.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                            arg2 = data[lendata + cell + 1];
                        } else if (Number.isInteger(arg2)) { // Если второй аргумент - Целое число
                            arg2 = parseInt(arg2);
                        } else { // Если второй аргумент не число, и не ячейка
                            console.log(`The second argument is not a memory cell and an integer. (line: ${indexCode + 1})`);
                            return;
                        }

                        if (arg1 >= arg2) {
                            let point = line.split(' ')[1];
                            if (data.indexOf(point) != -1) indexCode = data.indexOf(point); // Если метка найдена
                            else return console.log(`The specified tag "${point}" was not found. (line: ${indexCode + 1})`); // Если метка не найдена
                        } else { // Если аргументы равны
                            indexCode++;
                        }
                        break;
                    }

                    case 'jne': { // Переход, если два аргумента не равны
                        let [arg1, arg2] = data[indexCode - 1].split(' ').slice(1);
                        if (arg1.startsWith('#')) { // Если первый аргумент - Ячейка памяти
                            cell = parseInt(arg1.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                            arg1 = data[lendata + cell + 1];
                        } else if (Number.isInteger(arg1)) { // Если первый аргумент - Целое число
                            arg1 = parseInt(arg1);
                        } else { // Если первый аргумент не число, и не ячейка
                            console.log(`The first argument is not a memory cell and an integer. (line: ${indexCode + 1})`);
                            return;
                        }
                        if (arg2.startsWith('#')) { // Если второй аргумент - Ячейка памяти
                            cell = parseInt(arg2.slice(1)); // Берём именно номер ячейки памяти
                            if (cell < 0 || isNaN(cell)) return console.log(`The wrong memory location is specified. (line: ${indexCode + 1})`); // Если указана неправильная ячейка памяти
                            arg2 = data[lendata + cell + 1];
                        } else if (Number.isInteger(arg2)) { // Если второй аргумент - Целое число
                            arg2 = parseInt(arg2);
                        } else { // Если второй аргумент не число, и не ячейка
                            console.log(`The second argument is not a memory cell and an integer. (line: ${indexCode + 1})`);
                            return;
                        }

                        if (arg1 != arg2) {
                            let point = line.split(' ')[1];
                            if (data.indexOf(point) != -1) indexCode = data.indexOf(point); // Если метка найдена
                            else return console.log(`The specified tag "${point}" was not found. (line: ${indexCode + 1})`); // Если метка не найдена
                        } else { // Если аргументы равны
                            indexCode++;
                        }
                        break;
                    }

                    case 'jmp': { // Переход
                        let point = line.split(' ')[1];
                        if (data.indexOf(point) != -1) indexCode = data.indexOf(point); // Если метка найдена
                        else return console.log(`The specified tag "${point}" was not found. (line: ${indexCode + 1})`); // Если метка не найдена
                        break;
                    }

                    default: { // Ошибка
                        console.log(`Command ${command} is not defined. (line: ${indexCode + 1})`);
                        return;
                    }
                }
                break;
            }

            default: { // Ошибка
                console.log(`Section ${section} is not defined. (line: ${indexCode + 1})`);
                return;
            }
        }
    }
})();