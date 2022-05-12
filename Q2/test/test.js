const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey"); 

        console.log('1x2 =',publicSignals[0]);	// prints to console

        const editedPublicSignals = unstringifyBigInts(publicSignals);		// used to parse public signals.
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());   // splitting and formatting calldata
    
        const a = [argv[0], argv[1]];		// assigning variables for testing
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;	// calling verifyProof function with await, Hence the function waits until verifyProof returns true or false.
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];		// assigning incorrect values so that the verifyproof is expected to return false
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {

    let Verifier;
    let verifier;
    
    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        const { proof, publicSignals } = await groth16.fullProve({"a":"2","b":"4","c":"1"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey"); 

        console.log('2x4x1 =',publicSignals[0]);	// prints to console

        const editedPublicSignals = unstringifyBigInts(publicSignals);		// used to parse public signals.
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());   // splitting and formatting calldata
    
        const a = [argv[0], argv[1]];		// assigning variables for testing
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;	// calling verifyProof function with await, Hence the function waits until verifyProof returns true or false.
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];		// assigning incorrect values so that the verifyproof is expected to return false
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("_plonkMultiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        const { proof, publicSignals } = await plonk.fullProve({"a":"2","b":"1","c":"5"}, "contracts/circuits/_plonkMultiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/_plonkMultiplier3/multiplier3.zkey"); 

        console.log('2x1x5 =',publicSignals[0]);	// prints to console

        const editedPublicSignals = unstringifyBigInts(publicSignals);		// used to parse public signals.
        const editedProof = unstringifyBigInts(proof);
        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals);
    

        
        let [ proofs, arg] = calldata.split(',');
        
        arg = arg.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());   // splitting and formatting calldata
        expect(await verifier.verifyProof(proofs, arg)).to.be.true;	// calling verifyProof function with await, Hence the function waits until verifyProof returns true or false.
    });
    it("Should return false for invalid proof", async function () {
        const [proofs, arg] = [0, [0]];
        expect(await verifier.verifyProof(proofs, arg)).to.be.false;
    });
});
