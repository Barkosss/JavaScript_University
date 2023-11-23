const fs = require('fs');
const prompt = require('prompt-sync')();

var inputFile = process.argv[2];
var content = fs.readFileSync(inputFile, 'utf8');
var lines = content.split('\n'); // Делаю массив
for (let i in lines) if (lines[i].length > 1) lines[i] = lines[i].trim(); // Убираю лишние пробелы в строке (В начале и в конце)
lines = lines.filter((elem) => elem != '\r');
const map = {};
var indexCode = 0;


while(lines[indexCode] != 'exit') {
    var line = lines[indexCode].trim();
    var command = line.split(' ')[0];
    if (command.startsWith('!')) { // Пропускаем метки
        indexCode++; continue;
    };
    //console.log(command);
    switch(command) {
        case 'set': { // Создание переменной
            let [variable, value] = line.split(' ').slice(1);
            //let variable = line.split(' ')[1]; ^
            //let value = line.split(' ')[2];    ^
            if (isNaN(value)) { // Проверка на то, что указано не число
                map[variable] = map[value];
            } else { // Если указано число
                map[variable] = parseInt(value); // Записываем в переменную variable значение value
            }
            indexCode++;
            break;
        }

        case 'input': { // Ввод с консоли
            let variable = line.split(' ')[1]; // Переменная, куда сохраняем введное значение
            var value = parseInt(prompt(": "));
            map[variable] = value;
            indexCode++;
            break;
        }

        case 'output': { // Вывести значение на консоль
            let variable = line.split(' ')[1];
            if (isNaN(variable)) { // Если второй аргумент не число
                if (variable in map) { // Если переменная найдена
                    variable = map[variable];
                } else { // Если переменная не найдена - Ошибка
                    console.log(`Variable ${variable} is not defined.`);
                    return;
                }
            } else { // Если число
                variable = parseInt(variable);
            }

            console.log(variable);
            indexCode++;
            break;
        }

        case 'max': { // Максимальное значение из чисел
            let variable = line.split(' ')[1]; // Переменная для результата
            let variables = [];
            for(let elem of line.split(' ').slice(2)) {
                if (isNaN(elem)) { // Если не число, а переменная
                    if (elem in map) { // Если найдена
                        variables.push(map[elem]);
                    } else { // Если не найдена
                        console.log(`Variable ${value} is not defined.`);
                        return;
                    }
                } else { // Если число
                    variables.push(parseInt(elem));
                }
            }
            let maxValue = Math.max.apply(null, variables);
            map[variable] = maxValue;
            indexCode++;
            break;
        }

        case 'min': { // Минимальное значение
            let variable = line.split(' ')[1]; // Переменная для результата
            let variables = [];
            for(let elem of line.split(' ').slice(2)) {
                if (isNaN(elem)) { // Если не число, а переменная
                    if (elem in map) { // Если найдена
                        variables.push(map[elem]);
                    } else { // Если не найдена
                        console.log(`Variable ${value} is not defined.`);
                        return;
                    }
                } else { // Если число
                    variables.push(parseInt(elem));
                }
            }
            let minValue = Math.min.apply(null, variables);
            map[variable] = minValue;
            indexCode++;
            break;
        }

        case 'sum': { // Сложение
            let variable = line.split(' ')[1]; // Переменная для результата
            let oneVariable = line.split(' ')[2]; // Первый аргумент
            let twoVariable = line.split(' ')[3]; // Второй аргумент
            if (isNaN(oneVariable)) { // Если первый аргумент не является число
                if (oneVariable in map) { // Если первый аргумент найден
                    oneVariable = map[oneVariable];
                } else { // Если первый аргумент не найден - Ошибка
                    console.log(`Variable ${oneVariable} is not defined.`);
                    return;
                }
            } else { // Если первый аргумент число
                oneVariable = parseInt(oneVariable);
            }
            if (isNaN(twoVariable)) { // Если второй аргумент не число
                if (twoVariable in map) { // Если переменная найдена
                    twoVariable = map[twoVariable];
                } else { // Если переменная не найдена - Ошибка
                    console.log(`Variable ${twoVariable} is not defined.`);
                    return;
                }
            } else { // Если число
                twoVariable = parseInt(twoVariable);
            }
            map[variable] = oneVariable + twoVariable; // Сохраняем сложение
            indexCode++;
            break;
        }

        case 'minus': { // Вычитание
            let variable = line.split(' ')[1]; // Переменная для результата
            let oneVariable = line.split(' ')[2]; // Первый аргумент
            let twoVariable = line.split(' ')[3]; // Второй аргумент
            if (isNaN(oneVariable)) { // Если первый аргумент не является число
                if (oneVariable in map) { // Если первый аргумент найден
                    oneVariable = map[oneVariable];
                } else { // Если первый аргумент не найден - Ошибка
                    console.log(`Variable ${oneVariable} is not defined.`);
                    return;
                }
            } else { // Если первый аргумент число
                oneVariable = parseInt(oneVariable);
            }
            if (isNaN(twoVariable)) { // Если второй аргумент не число
                if (twoVariable in map) { // Если переменная найдена
                    twoVariable = map[twoVariable];
                } else { // Если переменная не найдена - Ошибка
                    console.log(`Variable ${twoVariable} is not defined.`);
                    return;
                }
            } else { // Если число
                twoVariable = parseInt(twoVariable);
            }
            map[variable] = oneVariable - twoVariable; // Сохраняем разность
            indexCode++;
            break;
        }

        case 'cmp': { // Сравнение
            indexCode++;
            break;
        }

        case 'if=': { // Если сравнение равно нулю
            let prevLine = lines[indexCode - 1].trim(); // Возращаемся назад на строку и берём оттуда значения для сравнени
            let oneVariable = prevLine.split(' ')[1]; // Первый аргумент
            let twoVariable = prevLine.split(' ')[2]; // Второй аргумент
            if (isNaN(oneVariable)) { // Если первый аргумент не является число
                if (oneVariable in map) { // Если первый аргумент найден
                    oneVariable = map[oneVariable];
                } else { // Если первый аргумент не найден - Ошибка
                    console.log(`Variable ${oneVariable} is not defined.`);
                    return;
                }
            } else { // Если первый аргумент число
                oneVariable = parseInt(oneVariable);
            }
            if (isNaN(twoVariable)) { // Если второй аргумент не число
                if (twoVariable in map) { // Если переменная найдена
                    twoVariable = map[twoVariable];
                } else { // Если переменная не найдена - Ошибка
                    console.log(`Variable ${twoVariable} is not defined.`);
                    return;
                }
            } else { // Если число
                twoVariable = parseInt(twoVariable);
            }

            if (oneVariable == twoVariable) { // Если оба аргумента равны
                const point = line.split(' ')[1]; // Перепрыгиваем на метку
                indexCode = lines.indexOf(point) + 1;
            } else { // Если не равны - Идём далее по строчке
                indexCode++;
            };
            break;
        }

        case 'abs': { // Модуль
            let variable = line.split(' ')[1]; // Переменная, откуда берём значение для преобразование по модулю
            map[variable] = Math.abs(map[variable]); // Записываем модуль
            indexCode++;
            break;
        }

        case 'jump': { // Прыгание по метками
            let point = line.split(' ')[1];
            indexCode = (point == 'exit') ? (lines.indexOf(point)) : (lines.indexOf(point) + 1);
            break;
        }

        default: { // Если указана не существующая команда
            console.log(`Command ${command} is'n defined.`)
            return;
        }
    }
}

console.log('The process is over');