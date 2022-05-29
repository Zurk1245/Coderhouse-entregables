process.on("message", cantidad => {
    let randomNumbers = [];
    for (let i = 0; i <= cantidad.cantidad; i++) {
        const number = Math.floor((Math.random() * 1000) + 1);
        let indexNumber = randomNumbers.findIndex(randomNumber => randomNumber.numero == number);
        if (indexNumber >= 0) {
            randomNumbers[indexNumber].cantidad++;
        } else {
            randomNumbers.push({numero: number, cantidad: 1});
        }
    }
    const oderderedNumbers = randomNumbers.sort((a, b) => a.numero - b.numero)
    process.send(oderderedNumbers);
});