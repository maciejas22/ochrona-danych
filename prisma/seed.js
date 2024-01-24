"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var john, bob, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user.upsert({
                        where: { email: 'john@example.com' },
                        update: {},
                        create: {
                            email: 'john@example.com',
                            name: 'John',
                            surname: 'Smith',
                            password: 'b808a13bb663865451028888885d32d38c34d9fe53d5eeb251664ac3cc72d4221aa060decaaaa9a482a415bbac9f29d0', // 012345678
                            balance: 943.44,
                            partialPassword: '0$1$3$4$8.deb3ea6134c96850e6dee1eca53fc8629f2931fa03597bf1c8abfb457f34c62a92fe7757d6dbd0e6b3ea9c96a3c2033f', //01348
                            invalidPasswordCount: 0,
                            status: 'ACTIVE',
                            iv: 'e52eef17099e9da0a3244c8a5022e1eb',
                            KEKSalt: '5cf8a4f361bdf3a23892eabdca8fe413',
                            DEK: '8adbdc1b4b2b02e92d1cca7897b9d4ac41b3779a473b09fbc6a4b142e9ec861785380e81ff7a433054215eded7d15b3e933b26a28bd3d1cd76879a7f0ebd2b5cdcd7851f5ea556fc9d25e4de092b0b3e',
                            DEKReset: 'c41ff0ee1b0cc8b6487e4f3939e74123b2a942ff19f98165d1c2367f731488559d58135bbff98bf5cf82325e432be034c23aae06b05e9e65b1fb7612dc2e81c772bfe7a83a7f37043f0298eb810af3f5',
                            accountNumber: '4906456646',
                            lastLoginTimeStamp: '2024-01-24T10:46:32.317Z',
                            cards: {
                                create: [
                                    {
                                        cardNumber: '3a4246b557e9a7b43b43cda95e61dd58c58b09a07c6a323adf8a60f454e5cb32',
                                        cardHolderName: 'John Smith',
                                        expirationDate: '1/28',
                                        cvv: '8ae7bc30334dd74cddb6eeac0c63a0ca',
                                    },
                                ],
                            },
                        },
                    })];
                case 1:
                    john = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'bob@example.com' },
                            update: {},
                            create: {
                                email: 'bob@example.com',
                                name: 'Bob',
                                surname: 'Johnson',
                                password: 'a5b5c2c88e751c2048bc5ac65048ce93206b24ddc18e880e8854e1357c585c57bb22ab85744703973bdd2f4ffa1e3e70', // 012345678
                                balance: 578.21,
                                partialPassword: '0$3$5$7$8.f84e5a9d08c1e99221fe0b212626381b87bc95873a7a08d1a96b34e740c0f24f601105ceb3c44a1c8bbddd713133216b', //03578
                                invalidPasswordCount: 0,
                                status: 'ACTIVE',
                                iv: '1571d87e1904bb64b7f0ca2eacbb6970',
                                KEKSalt: '8292dea057cb9f8e8a37d8ce28fa096e',
                                DEK: '30c32f15a1730ad8e7818980c1f1fcdbea011a88fec19712aabd67c12c48623392c8c5fc4968905ea267f3a6749d52e5fb2345bfe0b6f1021e45777e62b75e4b67e51206a89a1dd17c36bb3e401c29db',
                                DEKReset: '9a781fb1c81a60f2930a8dbbb627596759037e18a87ea233ade73d6c335e57b2abb98b0288bc4e8b69e63b8e39ec4e6879beb984f9f46477b97a969f4c4b5bede82dae5111fc6aeaf14105c0f8440a33',
                                accountNumber: '1266512326',
                                lastLoginTimeStamp: '2024-01-24T10:35:21.289Z',
                                cards: {
                                    create: [
                                        {
                                            cardNumber: 'ea1617b9471fdb568a74a463df9050488ae2a4bd1c3f2e564b87d69e8bd41adc',
                                            cardHolderName: 'Bob Johnson',
                                            expirationDate: '1/28',
                                            cvv: 'c2986ad86ca8e6ed04995b24bf766fae',
                                        },
                                    ],
                                },
                            },
                        })];
                case 2:
                    bob = _a.sent();
                    return [4 /*yield*/, prisma.transaction.createMany({
                            data: [
                                {
                                    title: 'Payment 1',
                                    amount: 12.34,
                                    timestamp: '2021-01-24T10:35:21.289Z',
                                    senderId: john.id,
                                    receiverId: bob.id,
                                },
                                {
                                    title: 'Payment 2',
                                    amount: 200,
                                    timestamp: '2021-01-24T10:35:21.289Z',
                                    senderId: bob.id,
                                    receiverId: john.id,
                                },
                            ],
                            skipDuplicates: true,
                        })];
                case 3:
                    transactions = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error(e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
