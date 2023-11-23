const prompt = require('prompt-sync')();

// Код на решение задачи "Фибоначчи"
if (process.argv[2] == 'fib') {
    var number = parseInt(prompt("Number: "));
    var fn = 0
    var f1 = 0
    var f2 = 1
    for (let i = 2; i <= number; i++) {
        var ebx = f1;
        f1 += f2;
        fn = f1;
        f2 = ebx;
        //array[i] = array[i - 2] + array[i - 1];
    }
    //console.log('Array: ' + array);
    console.log('Asnwer: ' + f1);

    /* ЧТО НАДО ДЛЯ РЕАЛИЗАЦИИ?
    
    1. Ввод числа с косноли
    2. Массив
    3. Цикл
    4. Работа с массивами
    5. Вывод в консоль

    // Assembler

    */
}

// Код на решение задачи "НОД"
else {
    var n1 = parseInt(prompt("One number: "));
    var n2 = parseInt(prompt("Two number: "));
    var ebx = Math.max(n1, n2); // В ebx сохраняем максимальный элемент из n1 и n2
    var emx = Math.min(n1, n2); // В emx сохраняем минимальный элемент из n1 и n2
    for(;;) {
        var eax = ebx;
        var ebx = Math.max(eax, emx); // В ebx сохраняем максимальный элемент из n1 и n2
        var emx = Math.min(eax, emx); // В emx сохраняем минимальный элемент из n1 и n2
        var ecx = ebx - emx;
        if (ecx == 0) {
            break;
        } else {
            ecx = Math.abs(ecx);
            ebx = ecx;
        }
    }

    console.log('Answer: ' + ebx);
    /*
    var oneNumber = parseInt(prompt("One number: "));
    var twoNumber = parseInt(prompt("Two number: "));
    var maxDiv = 0;
    for(let i = 1; i < Math.min(oneNumber, twoNumber); i++)
        if (oneNumber % i == 0 && twoNumber % i == 0)
            maxDiv = i;

    console.log('Answer: ' + maxDiv);*/


    /* ЧТО НУЖНО ДЛЯ РЕАЛИЗАЦИИ?
    
    1. Ввод чисел с консоли
    2. Объявление переменной
    3. Цикл
    4. Математические операции
    5. Максимальное число

    // Assembler
    
    .data
    maxDiv qword 1

    .data?
    n1 qword ?
    n2 qword ?
    minNum qword ?

    .code
    main proc
        input n1
        input n2
        mov eax, 1

    for_start:
        
        add eax, 1
        jmp for_start
    for_end:

        ret
    main endp
    end

    */
}