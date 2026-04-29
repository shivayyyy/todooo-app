import mongoose from 'mongoose';

const CalendarEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: { type: String, required: true },
  type: { type: String, required: true },
  startDate: { type: String, required: true }, // Format: YYYY-MM-DD
  startTime: { type: String, required: true }, // Format: HH:mm
  endTime: { type: String, required: true },   // Format: HH:mm
  subject: { type: String, required: false },
  notes: { type: String, required: false },
  color: { type: String, required: true }
}, { timestamps: true });

// Index for fetching a month's events
CalendarEventSchema.index({ userId: 1, startDate: 1 });

export const CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema);
