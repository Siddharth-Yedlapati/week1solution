#!/bin/bash

# [assignment] create your own bash script to compile Multipler3.circom modeling after compile-HelloWorld.sh below

cd contracts/circuits

mkdir _plonkMultiplier3

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling Multiplier3.circom..."

circom Multiplier3.circom --r1cs --wasm --sym -o _plonkMultiplier3
snarkjs r1cs info _plonkMultiplier3/Multiplier3.r1cs

snarkjs plonk setup _plonkMultiplier3/Multiplier3.r1cs powersOfTau28_hez_final_10.ptau _plonkMultiplier3/multiplier3.zkey
#snarkjs zkey contribute Multiplier3/multiplier3.zkey Multiplier3/circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
snarkjs zkey export verificationkey _plonkMultiplier3/multiplier3.zkey _plonkMultiplier3/verification_key.json

snarkjs zkey export solidityverifier _plonkMultiplier3/multiplier3.zkey ../_plonkMultiplier3Verifier.sol

cd ../..
