"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SubtaskSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
}, { _id: false });
const TaskSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: { type: String, required: true },
    priority: { type: String, required: true, enum: ['Critical', 'High', 'Medium', 'Low'] },
    status: { type: String, required: true, enum: ['To Do', 'In Progress', 'Done', 'Deferred'] },
    dueDate: { type: String, required: true }, // Format: YYYY-MM-DD
    subject: { type: String, required: false },
    topic: { type: String, required: false },
    notes: { type: String, required: false },
    subtasks: { type: [SubtaskSchema], default: [] }
}, { timestamps: true });
exports.Task = mongoose_1.default.model('Task', TaskSchema);
