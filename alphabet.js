function alphabet() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ=+-*/.,:;?!<>()[]{}#@$%^&_'
    let alphabetArray = []
    let counter = 0
    for (let letter of alphabet) {
        alphabetArray[counter] = letter
        counter++
    }
    return alphabetArray
}

class Alphabet {
    constructor(chars) {
        this.chars = chars
    }
}

const chars = alphabet()

export default new Alphabet(chars);
