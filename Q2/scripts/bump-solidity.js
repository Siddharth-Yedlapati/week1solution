const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

let pragmaRegex = /pragma solidity \^\d+\.\d+\.\d+/

let contractRegex = /contract Verifier/

content = fs.readFileSync("./contracts/Multiplier3Verifier.sol", { encoding: 'utf-8' });
bumped = content.replace(pragmaRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(contractRegex, 'contract Multiplier3Verifier');

fs.writeFileSync("./contracts/Multiplier3Verifier.sol", bumped);

pragmaRegex = /pragma solidity \>=\d+\.\d+\.\d+\ <\d+\.\d+\.\d+/
contractRegex = /contract PlonkVerifier/

content = fs.readFileSync("./contracts/_plonkMultiplier3Verifier.sol", { encoding: 'utf-8' });
bumped = content.replace(pragmaRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(contractRegex, 'contract _plonkMultiplier3Verifier');

fs.writeFileSync("./contracts/_plonkMultiplier3Verifier.sol", bumped);


