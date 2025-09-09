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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createDefaultAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const defaultEmail = 'admin@naturopura.com';
    const defaultPassword = 'Admin@123';
    const existingAdmin = yield User_1.default.findOne({ email: defaultEmail });
    if (existingAdmin)
        return;
    const hashedPassword = yield bcryptjs_1.default.hash(defaultPassword, 10);
    yield User_1.default.create({
        name: 'Tusar Mohapatra',
        email: defaultEmail,
        password: hashedPassword,
        role: 'admin',
        isDefaultAdmin: true
    });
    console.log('✅ Default admin created');
});
exports.default = createDefaultAdmin;
