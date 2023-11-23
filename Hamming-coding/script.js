// Проверка на вводимые числа
function checkTwoNumber(event) {
    let message = document.getElementById("message").value;
    if (message.length >= 3) document.getElementById("button").disabled = false;
    else document.getElementById("button").disabled = true;

    // Если указан символ "0" или "1" - вывести
    if (event.code.endsWith('0') || event.code.endsWith('1')) return true;
    return false; // Иначе - не выводить
}

// Смена темы сайта
function editTheme() {
    document.body.classList.toggle("editTheme");
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

// Кодирование
function encode() {
    let message = document.getElementById("message").value;
    if (message.length != 4) {
        document.getElementById("errorInputMessage").innerText = "Ты думал, что сможешь переиграть меня? Но я переиграл твоё переигрываение";
        return;
    }
    document.getElementById("errorInputMessage").innerText = "";

    // Включаю поле и кнопку в разделе кодирования
    document.getElementById("encodeMessage").disabled = false; // Поле
    document.getElementById("encodeButton").disabled = false; // Кнопка

    let encodeMessage = [0, 0, parseInt(message[0]), 0, parseInt(message[1]), parseInt(message[2]), parseInt(message[3])];
    encodeMessage[0] = (parseInt(message[0]) + parseInt(message[1]) + parseInt(message[3])) % 2;
    encodeMessage[1] = (parseInt(message[0]) + parseInt(message[2]) + parseInt(message[3])) % 2;
    encodeMessage[3] = (parseInt(message[1]) + parseInt(message[2]) + parseInt(message[3])) % 2;
    
    document.getElementById("encodeMessage").value = encodeMessage.join('');
}

// Декодирование
function decode() {
    let result; let information;
    let encodeMessage = document.getElementById("encodeMessage").value;
    if (encodeMessage.length != 7) {
        document.getElementById("errorEncodeMessage").innerText = "Длина закодированного сообщения должен быть 7 символов";
        return;
    }
    let message = encodeMessage[2] + encodeMessage[4] + encodeMessage[5] + encodeMessage[6];
    encodeMessage = [parseInt(encodeMessage[0]), parseInt(encodeMessage[1]), parseInt(message[0]), parseInt(encodeMessage[3]), parseInt(message[1]), parseInt(message[2]), parseInt(message[3])];

    let decodeMessage = [parseInt(encodeMessage[0]), parseInt(encodeMessage[1]), parseInt(message[0]), parseInt(encodeMessage[3]), parseInt(message[1]), parseInt(message[2]), parseInt(message[3])];
    decodeMessage[0] = (parseInt(message[0]) + parseInt(message[1]) + parseInt(message[3])) % 2;
    decodeMessage[1] = (parseInt(message[0]) + parseInt(message[2]) + parseInt(message[3])) % 2;
    decodeMessage[3] = (parseInt(message[1]) + parseInt(message[2]) + parseInt(message[3])) % 2;

    let sumAddBit = 0;
    let sumBits = (encodeMessage[0] != decodeMessage[0]) + (encodeMessage[1] != decodeMessage[1]) + (encodeMessage[3] != decodeMessage[3]);
    if (sumBits) { // Одна ошибка
        information = "Была совершена одна ошибка или более. Ошибка была исправлена";
        if (encodeMessage[0] != decodeMessage[0]) sumAddBit += 1;
        if (encodeMessage[1] != decodeMessage[1]) sumAddBit += 2;
        if (encodeMessage[3] != decodeMessage[3]) sumAddBit += 4;
        sumAddBit--;
        encodeMessage[sumAddBit] = (encodeMessage[sumAddBit]) ? (0) : (1);
    } else { // Нуль ошибок
        information = "Ошибок не было найдено"
    }

    result = [encodeMessage[2], encodeMessage[4], encodeMessage[5], encodeMessage[6]];
    document.getElementById("resultMessage").value = result.join('');
    document.getElementById("information").innerText = information;
}