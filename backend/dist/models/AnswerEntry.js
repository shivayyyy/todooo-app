"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerEntry = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AnswerEntrySchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    question: { type: String, required: true },
    source: { type: String, required: true },
    paper: { type: String, required: true },
    topic: { type: String, required: false },
    dateAttempted: { type: String, required: true }, // Format: YYYY-MM-DD
    wordCount: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    marksObtained: { type: Number, required: false },
    selfScore: { type: Number, required: true },
    mistakeTags: { type: [String], default: [] },
    notes: { type: String, required: false },
    photoUrl: { type: String, required: false }
}, { timestamps: true });
exports.AnswerEntry = mongoose_1.default.model('AnswerEntry', AnswerEntrySchema);
