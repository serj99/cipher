import alphabet from "./alphabet.js";

(function(){
	
	var ARC4 = window.ARC4 = {};
	
	function KSA(key) {
		var S = new Array();
		for (var i=0; i!=256; i++) {
			S[i] = i;
		}
		var j = 0;
		for (var i=0; i!=256; i++) {
			j = (j + S[i] + key[i % key.length].charCodeAt(0)) % 256;
			var Si = S[i];
			S[i] = S[j];
			S[j] = Si;
		}
        
        console.log("S array after KSA: " + S);
		return S;
	}

	function PRGA(S, n) {
		var i = 0;
		var j = 0;
		var K = new Array();
		for (var o=0; o!=(256+n); o++) {
			i = (i + 1) % 256;
			j = (j + S[i]) % 256;
			var Si = S[i];
			S[i] = S[j];
			S[j] = Si;
			if (o >= 256) {
				K.push((S[(S[i] + S[j]) % 256]).toString(16));
			}
		}
		return K;
	}
	
	ARC4.encrypt = function(key, msg) {
		var c = "";
		var ksm = PRGA(KSA(key), msg.length);
		for (var i=0; i!=msg.length; i++) {
			var x = (msg[i].charCodeAt(0) ^ parseInt(ksm[i], 16)).toString(16);
			if (x.length == 1) {
				x = "0" + x;
			}
			c += x;
		}
		return c;
	}
	
	ARC4.decrypt = function(key, msg) {
		var hex = "0123456789abcdef";
		for (var i=0; i!=msg.length; i++) {
			if ((hex.indexOf(msg[i].toLowerCase()) < 0) || (msg.length % 2)) {
				throw "ARC4: Invalid message";
			}
		}
		var c = "";
		var m = new Array();
		var ksm = PRGA(KSA(key), msg.length);
		for (var i=0; i!=msg.length; i+=2) {
			m.push(msg.substring(i, i+2));
		}
		for (var i=0; i!=m.length; i++) {
			var x = (parseInt(m[i], 16) ^ parseInt(ksm[i], 16));
			c += String.fromCharCode(x);
		}
		return c;
	}
	
})();

/*
Parametrii functiei encrypt sunt urmatorii:
cipher: sir de caracter ce reprezinta textul ce va fi criptat
key: numarul de rotatii al criptarii
*/

function encrypt(cipher, key) {
    let alphabetPosition
    let leap
    let newLetter
    let found 

    //pentru fiecare caracter al sirului de criptat se verifica daca face parte din alfabet
    for (let letter of cipher) {
        found = false
 
        for (let char of alphabet.chars) { 
            if (letter === char) {
                found = true
                break
            }
        }   


        //daca face parte
        if (found) {
                    
            //gaseste indexul caracterului in sir
            alphabetPosition = alphabet.chars.indexOf(letter) 
        
            //calculeaza shift-ul 
            leap = alphabetPosition + key 
            
            //de shift-ul e prea mare si depaseste lungimea alfabetului
            //se porneste iar de la inceput, din stanga
            //alfabetul este format din 78 caractere
            if (leap > 77) leap %= 78
            
            //afla caracterul criptat
            newLetter = alphabet.chars[leap] 

            //inlocuieste in alfabet
            cipher = cipher.replace(letter, newLetter) 

         }
    }
    return cipher
}

function decrypt(cipher, key) {
    // initialize the variables
    let alphabetPosition
    let leap
    let newLetter
    let found

    for (let letter of cipher) {
        found = false
        
        for (let char of alphabet.chars) { 
            if (letter === char) {
                found = true
                break
            }
        }   

        if (found) {

            //pozitia caracterului de decriptat in alfabet
            alphabetPosition = alphabet.chars.indexOf(letter) 

            //shift-ul va fi catre stanga
            leap = alphabetPosition - key 

            //daca valoarea este negativa caracterul decriptat se afla la sfarsitul
            //alfabetului
            if (leap < 0) leap += 78 

            newLetter = alphabet.chars[leap] 
            cipher = cipher.replace(letter, newLetter) 
        }
    }
    return cipher
}

const encryptMessage_cc = document.querySelector('input#encryptMessage_cc')
const encryptKey_cc = document.querySelector('input#encryptKey_cc')
const encryptButton_cc = document.querySelector('input#encryptButton_cc')
const encryptResult_cc = document.querySelector('p#encryptResult_cc')

encryptButton_cc.addEventListener('click', () => {
    const message = encryptMessage_cc.value.trim()
    const key = Number(encryptKey_cc.value)

    encryptResult_cc.innerHTML = ''
    if (message === '') {alert('Nu ai introdus text in casuta!')} else {
        encryptResult_cc.innerHTML = encrypt(message, key)
        encryptResult_cc.classList.toggle('hidden')
    }
})

const decryptMessage_cc = document.querySelector('input#decryptMessage_cc')
const decryptKey_cc = document.querySelector('input#decryptKey_cc')
const decryptButton_cc = document.querySelector('input#decryptButton_cc')
const decryptResult_cc = document.querySelector('p#decryptResult_cc')

decryptButton_cc.addEventListener('click', () => {
    const message = decryptMessage_cc.value.trim()
    const key = Number(decryptKey_cc.value)

    decryptResult_cc.innerHTML = ''
    if (message === '') {alert('Nu ai introdus text in casuta!')} else {
        decryptResult_cc.innerHTML = decrypt(message, key)
        decryptResult_cc.classList.toggle('hidden')
    }
})


const encryptMessage_rc = document.querySelector('input#encryptMessage_rc')
const encryptKey_rc = document.querySelector('input#encryptKey_rc')
const encryptButton_rc = document.querySelector('input#encryptButton_rc')
const encryptResult_rc = document.querySelector('p#encryptResult_rc')

encryptButton_rc.addEventListener('click', () => {
    const message = encryptMessage_rc.value.trim()
    const key = encryptKey_rc.value.trim()

    encryptResult_rc.innerHTML = ''
    if (message === '') {alert('Nu ai introdus text in casuta!')} else {
        encryptResult_rc.innerHTML = ARC4.encrypt(key, message)
        encryptResult_rc.classList.toggle('hidden')
    }
})

const decryptMessage_rc = document.querySelector('input#decryptMessage_rc')
const decryptKey_rc = document.querySelector('input#decryptKey_rc')
const decryptButton_rc = document.querySelector('input#decryptButton_rc')
const decryptResult_rc = document.querySelector('p#decryptResult_rc')

decryptButton_rc.addEventListener('click', () => {
    const message = decryptMessage_rc.value.trim()
    const key = decryptKey_rc.value.trim()

    decryptResult_rc.innerHTML = ''
    if (message === '') {alert('Nu ai introdus text in casuta!')} else {
        decryptResult_rc.innerHTML = ARC4.decrypt(key, message)
        decryptResult_rc.classList.toggle('hidden')
    }
})
