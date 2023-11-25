function MD5(string) {
    var sizeString = 0;
    var A = 0x67452301; var B = 0xefcdab89; var C = 0x98badcfe; var D = 0x10325476;
    var T = new Array(64);
    function appendBits(string) {
        for(let i = 0; i < string.length; i++) input[i] = string[i];
        input[string.length] = 0x80;
        for(let i = string.length + 1; i < sizeString - 8; i++) input[i] = 0x00;
        for(let i = 0; i < 8; i++) input[sizeString - 8 + i] = (string.length * 8) >> i * 8;
    }

    function init() {
        for(let i = 0; i < 64; i++) T[i] = 2**32 * Math.abs(Math.sin(i + 1));
    }

    var arrayIndex = []; // Массив индексов
    var lenString = string.length;
    if (lenString % 64 < 54) sizeString = lenString - (lenString % 64) + 56 + 8;
    else sizeString = lenString + 64 - (lenString % 64) + 56 + 8;
    appendBits(string);
    init();

    return result;
}