import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { _id: false });

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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

export const Task = mongoose.model('Task', TaskSchema);
