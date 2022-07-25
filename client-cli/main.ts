import * as bs58 from "bs58";

import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { serialize, deserialize } from "borsh";
import { Buffer } from "buffer";

//creation of a connection object to interact
const connection = new Connection("http://127.0.0.1:8899");

//Creation of a signer user wallet
const wallet = Keypair.generate(); //creation of the wallet
const walletPubKey = new PublicKey(wallet.publicKey); //recuperation of public key and wrapping, to convert uint8 array to BN

//Airdrop SOL to fund newly created wallet to pay transactions
const airDropSol = async () => {
  try {
    const fromAirdropSignature = await connection.requestAirdrop(
      walletPubKey,
      LAMPORTS_PER_SOL
    );
    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromAirdropSignature,
    });

    const walletBalance = await connection.getBalance(walletPubKey);

    console.log(`user wallet balance is ${walletBalance} Lamports`);
  } catch (err) {
    console.error(err);
  }
};

//instructions variables
const progId = new PublicKey("77vFkDQiy1dWmDLphcCo5gcFwVPtsVr73fXTR47yQqLQ");
const account = Keypair.generate(); //keypair for the new account to store message

//creation of a max 100 bytes/char text message to send
const utf8Encode = new TextEncoder();
let textmsg = utf8Encode.encode("hello Solana");
let msg = new Uint8Array(100);
msg.set(textmsg, 0);
console.log(msg);

// Flexible class that takes properties and imbues them
// to the object instance
class Assignable {
  constructor(properties) {
    Object.keys(properties).map((key) => {
      return (this[key] = properties[key]);
    });
  }
}

class Payload extends Assignable {}

// Borsh needs schemas describing the payloads
const WrtPayloadSchema = new Map([
  [
    Payload,
    {
      kind: "struct",
      fields: [
        ["id", "u8"],
//        ["message", [msg.byteLength]],
        ["message", [100]],
      ],
    },
  ],
]);

const DltPayloadSchema = new Map([
  [
    Payload,
    {
      kind: "struct",
      fields: [["id", "u8"]],
    },
  ],
]);

// Instruction variant indexes
enum InstructionVariant {
  Write = 0,
  Delete,
}

//write a message

const writeMessageTransaction = async (
  connection: Connection, //Solana RPC connection
  progId: PublicKey, //Program public key
  account: Keypair, //Target program owned account for storing message
  wallet: Keypair, //Wallet for signing and payment
  msg: Uint8Array //The text message being stored
) => {
  console.log("writing message on Solana");
  // Construct the payload (instruction data block)
  const write = new Payload({
    id: InstructionVariant.Write,
    message: msg, // 'sentence to write'
  });

  //serialize the payload
  const writeSerBuf = Buffer.from(serialize(WrtPayloadSchema, write));
  console.log(writeSerBuf);
  //to debug
  let writePayloadCopy = deserialize(WrtPayloadSchema, Payload, writeSerBuf);
  console.log(writePayloadCopy);

  //create the instruction
  const instruction = new TransactionInstruction({
    data: writeSerBuf,
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
      { pubkey: account.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: progId,
  });
  console.log(instruction);

  // Send transaction
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [wallet, account]
  );
  console.log("Signature = ", transactionSignature);
  return transactionSignature;
};

// delete message created above

const DeleteMessageTransaction = async () => {
  console.log("deleting message on Solana");

  //Find account to close pubkey
  const wallet_address = walletPubKey.toBase58();
  const message_accounts = await connection.getParsedProgramAccounts(progId, {
    filters: [
      {
        //filter by author
        memcmp: {
          offset: 0, // starting position in number of bytes, author is first field
          bytes: wallet_address, // base58 encoded string
        },
      },
    ],
  });

  let accounts: PublicKey[] = [];
  message_accounts.forEach((account) => {
    accounts.push(account.pubkey);
  });
  const message_account = accounts[0];
  console.log(`account to delete is ${message_account}`);

  // Construct the payload
  const dlt = new Payload({
    id: InstructionVariant.Delete,
  });

  //serialize the payload
  const deleteSerBuf = Buffer.from(serialize(DltPayloadSchema, dlt));
  console.log(deleteSerBuf);

  //create the instruction
  const instruction = new TransactionInstruction({
    data: deleteSerBuf,
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
      { pubkey: message_account, isSigner: false, isWritable: true },
    ],
    programId: progId,
  });

  // Send transaction
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [wallet]
  );
  console.log("Signature = ", transactionSignature);
  return transactionSignature;
};

//get all accounts owned by progam
const getProgramAccounts = async () => {
  const accounts = await connection.getProgramAccounts(progId);
  console.log(`Accounts for program ${progId}: `);
  console.log(accounts);
};
// get only program account in which author field = wallet address
const getParsedProgramAccounts = async () => {
  const wallet_address = walletPubKey.toBase58();
  console.log(wallet_address);
  //const b58msg= bs58.encode(msg);

  const message_account = await connection.getParsedProgramAccounts(progId, {
    filters: [
      {
        //filter by author
        memcmp: {
          offset: 0, // starting position in number of bytes, author is first field
          bytes: wallet_address, // base58 encoded string
        },

        /* or filter by message content:
        memcmp: {
          offset: 32, // starting position in number of bytes, message is second field
          bytes: b58msg, // base58 encoded string
        },
  */
      },
    ],
  });
  console.log(`Parsed Accounts for program ${progId}: `);
  console.log(message_account);
};

const main = async () => {
  await airDropSol();
  await writeMessageTransaction(connection, progId, account, wallet, msg);
  await getProgramAccounts(); //to check write transaction
  await DeleteMessageTransaction();
  await getParsedProgramAccounts(); //to check delete transaction
};

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
