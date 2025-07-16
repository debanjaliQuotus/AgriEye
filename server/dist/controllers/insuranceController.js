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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInsuranceStatus = exports.getAllInsurances = exports.getMyInsurance = exports.applyInsurance = void 0;
const Insurance_1 = require("../models/Insurance");
const applyInsurance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const insurance = new Insurance_1.Insurance(Object.assign(Object.assign({}, req.body), { farmerId: req.user._id }));
        yield insurance.save();
        res.status(201).json(insurance);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error applying insurance',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.applyInsurance = applyInsurance;
const getMyInsurance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const myInsurances = yield Insurance_1.Insurance.find({ farmerId: req.user._id });
        res.json(myInsurances);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching insurance',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getMyInsurance = getMyInsurance;
const getAllInsurances = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const insurances = yield Insurance_1.Insurance.find().populate('farmerId', 'name');
        res.json(insurances);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching insurances',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getAllInsurances = getAllInsurances;
const updateInsuranceStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { id } = req.params;
        const { status } = req.body;
        const updated = yield Insurance_1.Insurance.findByIdAndUpdate(id, { status }, { new: true });
        if (!updated) {
            res.status(404).json({ message: 'Insurance not found' });
            return;
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateInsuranceStatus = updateInsuranceStatus;
