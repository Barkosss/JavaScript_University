// Проверка на корректный символ при вводе
function checkTwoNumber(event) {

    let message = document.getElementById("message").value;
    if (message.length >= 3) document.getElementById("button").disabled = false;
    else document.getElementById("button").disabled = true;

    // Если указан символ "0" или "1" - Вывести
    if (event.code.endsWith("0") || event.code.endsWith("1")) return true;
    return false; // Иначе - Не выводить    
}

// Смена темы сайта
function editTheme() {
    document.body.classList.toggle("editTheme");
    /*
    if (document.getElementById("editTheme").value == "Dark theme") {
        document.getElementById("editTheme").value = "Light theme";
    } else {
        document.getElementById("editTheme").value = "Dark theme";
    }
    */
}

// Очистить поля и значений
function reset() {
    document.getElementById("message").value = null; // Очистка начального поля
    document.getElementById("encodeMessage").value = null; // Очистка поля с закодированным кодом
    document.getElementById("resultMessage").value = null; // Очистка поля с результатом декодирования
    document.getElementById("encodeMessage").disabled = true; // Выключение поля с закодированным кодом
    document.getElementById("encodeButton").disabled = true; // Выключение кнопки для декодирования кода
    document.getElementById("button").disabled = true; // Выключение кнопки для кодирования кода
    document.getElementById("errorInputMessage").innerText = null; // 
    document.getElementById("information").innerText = null; // Очистка информации в результат
    
}

// Кодирование сообщения
function encode() {
    let message = document.getElementById("message").value;
    if (message.length != 4) {
        document.getElementById("errorInputMessage").innerText = "Ты думал, что сможешь переиграть меня? Но я переиграл твоё переигрываение";
        return;
    }
    document.getElementById("errorInputMessage").innerText = "";
    let encodeMessage = [0, 0, 0, 0, 0, 0, 0];

    // Включаю поле и кнопку в разделе кодирования
    document.getElementById("encodeMessage").disabled = false; // Поле
    document.getElementById("encodeButton").disabled = false; // Кнопка

    // Заполняем массив исходными символами
    encodeMessage[0] = parseInt(message[0]); // m1
    encodeMessage[1] = parseInt(message[1]); // m2
    encodeMessage[2] = parseInt(message[2]); // m3
    encodeMessage[3] = parseInt(message[3]); // m4
    encodeMessage[4] = (encodeMessage[0] + encodeMessage[1] + encodeMessage[3]) % 2; // p1
    encodeMessage[5] = (encodeMessage[2] + encodeMessage[1] + encodeMessage[3]) % 2; // p2
    encodeMessage[6] = (encodeMessage[0] + encodeMessage[2] + encodeMessage[3]) % 2; // p3

    document.getElementById("encodeMessage").value = encodeMessage.join('');
}

// Декодирования сообщения
function decode() {
    // result - результат (исходный или исправленный код)
    // damageFlag - количество ошибок
    let result; let damageCount = 0; var information = "Код не был повреждён";
    let encodeMessage = document.getElementById("encodeMessage").value;

    let oneCode = parseInt(encodeMessage[0]); // m1
    let twoCode = parseInt(encodeMessage[1]); // m2
    let threeCode = parseInt(encodeMessage[2]); // m3
    let fourCode = parseInt(encodeMessage[3]); // m4
    let addOneCode = parseInt(encodeMessage[4]); // p1
    let addTwoCode = parseInt(encodeMessage[5]); // p2
    let addThreeCode = parseInt(encodeMessage[6]); // p3

    if ((oneCode + fourCode + twoCode) % 2 != addOneCode) {
        damageCount++;

        if (((twoCode + fourCode + threeCode) % 2 != addTwoCode) && ((oneCode + fourCode + threeCode) % 2 == addThreeCode)) {
            twoCode = (twoCode) ? (0) : (1);
        } else if (((twoCode + fourCode + threeCode) % 2 == addTwoCode) && ((oneCode + fourCode + threeCode) % 2 != addThreeCode)) {
            oneCode = (oneCode) ? (0) : (1);
        } else if (((twoCode + fourCode + threeCode) % 2 == addTwoCode) && ((oneCode + fourCode + threeCode) % 2 == addThreeCode)) {
            addOneCode = (addOneCode) ? (0) : (1);
        } else {
            fourCode = (fourCode) ? (0) : (1);
        }
    } if (damageCount <= 1 && (twoCode + fourCode + threeCode) % 2 != addTwoCode) {
        damageCount++;

        if (((oneCode + fourCode + twoCode) % 2 != addOneCode) && ((oneCode + fourCode + threeCode) % 2 == addThreeCode)) {
            twoCode = (twoCode) ? (0) : (1);
        } else if (((twoCode + fourCode + threeCode) % 2 == addTwoCode) && ((oneCode + fourCode + threeCode) % 2 != addThreeCode)) {
            threeCode = (threeCode) ? (0) : (1);
        } else if (((twoCode + fourCode + oneCode) % 2 == addOneCode) && ((threeCode + fourCode + oneCode) % 2 == addThreeCode)) {
            addTwoCode = (addTwoCode) ? (0) : (1);
        } else {
            fourCode = (fourCode) ? (0) : (1);
        }
    } if (damageCount <= 1 && (oneCode + fourCode + threeCode) % 2 != addThreeCode) {
        damageCount++;

        if (((oneCode + fourCode + twoCode) % 2 == addOneCode) && ((twoCode + fourCode + threeCode) % 2 != addTwoCode)) {
            threeCode = (threeCode) ? (0) : (1);
        } else if (((oneCode + fourCode + twoCode) % 2 != addOneCode) && ((twoCode + fourCode + threeCode) % 2 == addTwoCode)) {
            oneCode = (oneCode) ? (0) : (1);
        } else if (((oneCode + fourCode + twoCode) % 2 == addOneCode) && ((twoCode + fourCode + threeCode) % 2 == addTwoCode)) {
            addThreeCode = (addThreeCode) ? (0) : (1);
        } else {
            fourCode = (fourCode) ? (0) : (1);
        }
    }

    if (damageCount > 1) {
        information = "Было совершено более одной ошибки. Восстановленое невозможно"
    } else if (damageCount == 1) {
        information = "Была совершена одна ошибка. Ошибка была исправлена"
    }
    
    result = [oneCode, twoCode, threeCode, fourCode, addOneCode, addTwoCode, addThreeCode].join('')
    document.getElementById("resultMessage").value = result;
    document.getElementById("information").innerText = information;
}


/* if ((encodeMessage[0] + encodeMessage[3] + encodeMessage[1]) % 2 != addOneCode) {
        damageCount++; // +1 к счётчику ошибок

        // Исправляем ошибку
        if ((encodeMessage[1] + encodeMessage[3] + encodeMessage[2]) % 2 != addTwoCode) {
            encodeMessage[1] = (encodeMessage[1]) ? (0) : (1);
        } else if ((encodeMessage[0] + encodeMessage[3] + encodeMessage[2]) % 2 != addThreeCode) {
            encodeMessage[0] = (encodeMessage[0]) ? (0) : (1);
        } else {
            encodeMessage[3] = (encodeMessage[3]) ? (0) : (1);
        }
    } else if ((encodeMessage[1] + encodeMessage[3] + encodeMessage[2]) % 2 != addTwoCode) {
        damageCount++; // +1 к счётчику ошибок

        // Исправляем ошибку
        if ((encodeMessage[0] + encodeMessage[3] + encodeMessage[1]) % 2 != addOneCode) {
            encodeMessage[1] = (encodeMessage[1]) ? (0) : (1);
        } else if ((encodeMessage[2] + encodeMessage[3] + encodeMessage[0]) % 2 != addThreeCode) {
            encodeMessage[2] = (encodeMessage[2]) ? (0) : (1);
        } else {
            encodeMessage[3] = (encodeMessage[3]) ? (0) : (1);
        }
    } else if ((encodeMessage[0] + encodeMessage[3] + encodeMessage[2]) % 2 != addThreeCode) {
        damageCount++; // +1 к счётчику ошибок

        // Исправляем ошибку
        if ((encodeMessage[0] + encodeMessage[3] + encodeMessage[2]) % 2 != addOneCode) {
            encodeMessage[0] = (encodeMessage[0]) ? (0) : (1);
        } else if ((encodeMessage[1] + encodeMessage[3] + encodeMessage[2]) % 2 != addTwoCode) {
            encodeMessage[2] = (encodeMessage[2]) ? (0) : (1);
        } else {
            encodeMessage[3] = (encodeMessage[3]) ? (0) : (1);
        }
    }
    
    if ((oneCode + fourCode + twoCode) % 2 != addOneCode) {
        damageCount++; // +1 к счётчику ошибок

        // Исправляем ошибку
        if ((twoCode + fourCode + threeCode) % 2 != addTwoCode) {
            twoCode = (twoCode) ? (0) : (1);
        } else if ((oneCode + fourCode + threeCode) % 2 != addThreeCode) {
            oneCode = (oneCode) ? (0) : (1);
        } else {
            fourCode = (fourCode) ? (0) : (1);
        }
    } else if (damageCount < 2 && (twoCode + fourCode + threeCode) % 2 != addTwoCode) {
        damageCount++; // +1 к счётчику ошибок

        // Исправляем ошибку
        if ((oneCode + fourCode + twoCode) % 2 != addOneCode) {
            twoCode = (twoCode) ? (0) : (1);
        } else if ((threeCode + fourCode + oneCode) % 2 != addThreeCode) {
            threeCode = (threeCode) ? (0) : (1);
        } else {
            fourCode = (fourCode) ? (0) : (1);
        }
    } else if (damageCount < 2 && (oneCode + fourCode + threeCode) % 2 != addThreeCode) {
        damageCount++; // +1 к счётчику ошибок

        // Исправляем ошибку
        if ((oneCode + fourCode + threeCode) % 2 != addOneCode) {
            oneCode = (oneCode) ? (0) : (1);
        } else if ((twoCode + fourCode + threeCode) % 2 != addTwoCode) {
            threeCode = (threeCode) ? (0) : (1);
        } else {
            fourCode = (fourCode) ? (0) : (1);
        }
    }
    */