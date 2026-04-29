import mongoose from 'mongoose';

const AnswerEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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

export const AnswerEntry = mongoose.model('AnswerEntry', AnswerEntrySchema);
