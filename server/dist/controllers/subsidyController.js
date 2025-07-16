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
exports.getAllSubsidies = exports.getFarmerSubsidies = exports.updateSubsidyStatus = exports.applySubsidy = void 0;
const Subsidy_1 = __importDefault(require("../models/Subsidy"));
const applySubsidy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const subsidy = new Subsidy_1.default(Object.assign(Object.assign({}, req.body), { farmerId: req.user._id }));
        yield subsidy.save();
        res.status(201).json({ message: "Subsidy applied successfully", subsidy });
    }
    catch (error) {
        console.error("Error applying subsidy:", error);
        res.status(500).json({
            message: "Error applying subsidy",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.applySubsidy = applySubsidy;
const updateSubsidyStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { status } = req.body;
        const updated = yield Subsidy_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updated) {
            res.status(404).json({ message: "Subsidy not found" });
            return;
        }
        res.json({ message: `Subsidy ${status}`, updated });
    }
    catch (error) {
        console.error("Error updating subsidy status:", error);
        res.status(500).json({
            message: "Error updating status",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateSubsidyStatus = updateSubsidyStatus;
const getFarmerSubsidies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const subsidies = yield Subsidy_1.default.find({ farmerId: req.user._id });
        res.json(subsidies);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching subsidies",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getFarmerSubsidies = getFarmerSubsidies;
const getAllSubsidies = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subsidies = yield Subsidy_1.default.find().populate("farmerId");
        res.json(subsidies);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching all subsidies",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getAllSubsidies = getAllSubsidies;
