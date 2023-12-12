function makeFunc() {
    if (!this.counter) this.counter = 0;
    this.counter++;
    return this.counter;
}

console.log(makeFunc()); // Выведет: 1
makeFunc(); // 2
makeFunc(); // 3
makeFunc(); // 4
console.log(makeFunc()); // Выведет: 5