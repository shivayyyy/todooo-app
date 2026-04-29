"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarEvent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CalendarEventSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: { type: String, required: true },
    type: { type: String, required: true },
    startDate: { type: String, required: true }, // Format: YYYY-MM-DD
    startTime: { type: String, required: true }, // Format: HH:mm
    endTime: { type: String, required: true }, // Format: HH:mm
    subject: { type: String, required: false },
    notes: { type: String, required: false },
    color: { type: String, required: true }
}, { timestamps: true });
// Index for fetching a month's events
CalendarEventSchema.index({ userId: 1, startDate: 1 });
exports.CalendarEvent = mongoose_1.default.model('CalendarEvent', CalendarEventSchema);
