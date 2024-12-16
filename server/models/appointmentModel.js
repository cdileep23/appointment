import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  timeSlot: { type: Date, required: true },
  status: { type: String, enum: ['available', 'booked', 'cancelled'], default: 'available' },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment
