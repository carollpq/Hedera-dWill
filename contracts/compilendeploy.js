console.clear();
require("dotenv").config({ path: "../.env" });
const {
    AccountId,
    PrivateKey,
    Client,
    FileCreateTransaction,
    ContractCreateTransaction,
    ContractFunctionParameters,
    ContractExecuteTransaction,
    ContractCallQuery,
    Hbar,
} = require("@hashgraph/sdk")

const fs = require("fs");

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);


console.log(`Operator ID: ${operatorId}`);
console.log(`Operator Key: ${operatorKey}`);


const client = Client.forTestnet().setOperator(operatorId, operatorKey);    
// const client = Client.forNetwork({
//     "testnet.hedera.com:50211": new AccountId(3),
// }).setMirrorNetwork("https://testnet.mirrornode.hedera.com")
//   .setOperator(operatorId, operatorKey);


async function main() {
    // import the compiled contract bytecode
    const contractBytecode = fs.readFileSync("dms_sol_DeadManSwitch.bin");
    // create a file on hedera and store the bytecode
    const fileCreateTx = new FileCreateTransaction()
        .setKeys([operatorKey])
        .setContents(contractBytecode)
        .setMaxTransactionFee(new Hbar(0.75))
        .freezeWith(client);
    const fileCreateSign = await fileCreateTx.sign(operatorKey);
    const fileCreateSubmit = await fileCreateSign.execute(client);
    const fileCreateRx = await fileCreateSubmit.getReceipt(client);
    const bytecodeFileId = fileCreateRx.fileId;
    console.log(`Bytecode file ID:, ${bytecodeFileId})`);
    // instantiate the contract
    //query and call functions from the contract, use this as reference

}
main();