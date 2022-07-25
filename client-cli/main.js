"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var web3_js_1 = require("@solana/web3.js");
var borsh_1 = require("borsh");
var buffer_1 = require("buffer");
//creation of a connection object to interact
var connection = new web3_js_1.Connection("http://127.0.0.1:8899");
//Creation of a signer user wallet
var wallet = web3_js_1.Keypair.generate(); //creation of the wallet
var walletPubKey = new web3_js_1.PublicKey(wallet.publicKey); //recuperation of public key and wrapping, to convert uint8 array to BN
//Airdrop SOL to fund newly created wallet to pay transactions
var airDropSol = function () { return __awaiter(void 0, void 0, void 0, function () {
    var fromAirdropSignature, latestBlockHash, walletBalance, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, connection.requestAirdrop(walletPubKey, web3_js_1.LAMPORTS_PER_SOL)];
            case 1:
                fromAirdropSignature = _a.sent();
                return [4 /*yield*/, connection.getLatestBlockhash()];
            case 2:
                latestBlockHash = _a.sent();
                return [4 /*yield*/, connection.confirmTransaction({
                        blockhash: latestBlockHash.blockhash,
                        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                        signature: fromAirdropSignature
                    })];
            case 3:
                _a.sent();
                return [4 /*yield*/, connection.getBalance(walletPubKey)];
            case 4:
                walletBalance = _a.sent();
                console.log("user wallet balance is ".concat(walletBalance, " Lamports"));
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
//instructions variables
var progId = new web3_js_1.PublicKey("77vFkDQiy1dWmDLphcCo5gcFwVPtsVr73fXTR47yQqLQ");
var account = web3_js_1.Keypair.generate(); //keypair for the new account to store message
//creation of a max 100 bytes/char text message to send
var utf8Encode = new TextEncoder();
var textmsg = utf8Encode.encode("hello Solana");
var msg = new Uint8Array(100);
msg.set(textmsg, 0);
console.log(msg);
// Flexible class that takes properties and imbues them
// to the object instance
var Assignable = /** @class */ (function () {
    function Assignable(properties) {
        var _this = this;
        Object.keys(properties).map(function (key) {
            return (_this[key] = properties[key]);
        });
    }
    return Assignable;
}());
var Payload = /** @class */ (function (_super) {
    __extends(Payload, _super);
    function Payload() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Payload;
}(Assignable));
// Borsh needs schemas describing the payloads
var WrtPayloadSchema = new Map([
    [
        Payload,
        {
            kind: "struct",
            fields: [
                ["id", "u8"],
                //        ["message", [msg.byteLength]],
                ["message", [100]],
            ]
        },
    ],
]);
var DltPayloadSchema = new Map([
    [
        Payload,
        {
            kind: "struct",
            fields: [["id", "u8"]]
        },
    ],
]);
// Instruction variant indexes
var InstructionVariant;
(function (InstructionVariant) {
    InstructionVariant[InstructionVariant["Write"] = 0] = "Write";
    InstructionVariant[InstructionVariant["Delete"] = 1] = "Delete";
})(InstructionVariant || (InstructionVariant = {}));
//write a message
var writeMessageTransaction = function (connection, //Solana RPC connection
progId, //Program public key
account, //Target program owned account for storing message
wallet, //Wallet for signing and payment
msg //The text message being stored
) { return __awaiter(void 0, void 0, void 0, function () {
    var write, writeSerBuf, writePayloadCopy, instruction, transactionSignature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("writing message on Solana");
                write = new Payload({
                    id: InstructionVariant.Write,
                    message: msg
                });
                writeSerBuf = buffer_1.Buffer.from((0, borsh_1.serialize)(WrtPayloadSchema, write));
                console.log(writeSerBuf);
                writePayloadCopy = (0, borsh_1.deserialize)(WrtPayloadSchema, Payload, writeSerBuf);
                console.log(writePayloadCopy);
                instruction = new web3_js_1.TransactionInstruction({
                    data: writeSerBuf,
                    keys: [
                        { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
                        { pubkey: account.publicKey, isSigner: true, isWritable: true },
                        { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
                    ],
                    programId: progId
                });
                console.log(instruction);
                return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, new web3_js_1.Transaction().add(instruction), [wallet, account])];
            case 1:
                transactionSignature = _a.sent();
                console.log("Signature = ", transactionSignature);
                return [2 /*return*/, transactionSignature];
        }
    });
}); };
// delete message created above
var DeleteMessageTransaction = function () { return __awaiter(void 0, void 0, void 0, function () {
    var wallet_address, message_accounts, accounts, message_account, dlt, deleteSerBuf, instruction, transactionSignature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("deleting message on Solana");
                wallet_address = walletPubKey.toBase58();
                return [4 /*yield*/, connection.getParsedProgramAccounts(progId, {
                        filters: [
                            {
                                //filter by author
                                memcmp: {
                                    offset: 0,
                                    bytes: wallet_address
                                }
                            },
                        ]
                    })];
            case 1:
                message_accounts = _a.sent();
                accounts = [];
                message_accounts.forEach(function (account) {
                    accounts.push(account.pubkey);
                });
                message_account = accounts[0];
                console.log("account to delete is ".concat(message_account));
                dlt = new Payload({
                    id: InstructionVariant.Delete
                });
                deleteSerBuf = buffer_1.Buffer.from((0, borsh_1.serialize)(DltPayloadSchema, dlt));
                console.log(deleteSerBuf);
                instruction = new web3_js_1.TransactionInstruction({
                    data: deleteSerBuf,
                    keys: [
                        { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
                        { pubkey: message_account, isSigner: false, isWritable: true },
                    ],
                    programId: progId
                });
                return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, new web3_js_1.Transaction().add(instruction), [wallet])];
            case 2:
                transactionSignature = _a.sent();
                console.log("Signature = ", transactionSignature);
                return [2 /*return*/, transactionSignature];
        }
    });
}); };
//get all accounts owned by progam
var getProgramAccounts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var accounts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connection.getProgramAccounts(progId)];
            case 1:
                accounts = _a.sent();
                console.log("Accounts for program ".concat(progId, ": "));
                console.log(accounts);
                return [2 /*return*/];
        }
    });
}); };
// get only program account in which author field = wallet address
var getParsedProgramAccounts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var wallet_address, message_account;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wallet_address = walletPubKey.toBase58();
                console.log(wallet_address);
                return [4 /*yield*/, connection.getParsedProgramAccounts(progId, {
                        filters: [
                            {
                                //filter by author
                                memcmp: {
                                    offset: 0,
                                    bytes: wallet_address
                                }
                            },
                        ]
                    })];
            case 1:
                message_account = _a.sent();
                console.log("Parsed Accounts for program ".concat(progId, ": "));
                console.log(message_account);
                return [2 /*return*/];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, airDropSol()];
            case 1:
                _a.sent();
                return [4 /*yield*/, writeMessageTransaction(connection, progId, account, wallet, msg)];
            case 2:
                _a.sent();
                return [4 /*yield*/, getProgramAccounts()];
            case 3:
                _a.sent(); //to check write transaction
                return [4 /*yield*/, DeleteMessageTransaction()];
            case 4:
                _a.sent();
                return [4 /*yield*/, getParsedProgramAccounts()];
            case 5:
                _a.sent(); //to check delete transaction
                return [2 /*return*/];
        }
    });
}); };
main().then(function () { return process.exit(); }, function (err) {
    console.error(err);
    process.exit(-1);
});
