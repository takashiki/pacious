import { createHash } from "crypto";

let algoBitMap = new Map([
    ["sha256", 256],
]);

function wrapPassword(originPassword: string, appName: string, length = 10, alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', hashAlgo = 'sha256'): string {

    let hashBit = algoBitMap.get(hashAlgo);
    if (!hashBit) {
        return null;
    }

    let groupBit = Math.floor(hashBit / length);
    let maxAlphabetCout = Math.pow(2, groupBit);
    if (alphabet.length > maxAlphabetCout) {
        return null;
    }

    const hash = createHash(hashAlgo);
    hash.update(originPassword + appName);
    let hashHex = hash.digest("hex");
    let hashBin = hex2bin(hashHex);

    let finalPassword = '';
    for (let i = 0; i < length; i++) {
        let groupSum = hashBin.slice(i * groupBit, (i + 1) * groupBit);
        finalPassword += alphabet[parseInt(groupSum, 2) % alphabet.length];
    }

    return finalPassword;
}

function hex2bin(hex: string): string {
    if (hex.length > 12) {
        return hex2bin(hex.substr(0, hex.length - 12)) + hex2bin(hex.substr(-12));
    }

    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

export default wrapPassword;
