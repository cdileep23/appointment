import Appointment from "../models/appointmentModel.js";
import moment from 'moment';

export const addTimeSlot = async (req, res) => {
  try {
    const { timeSlot } = req.body;

    if (!timeSlot) {
      return res.status(400).json({ message: "Time Slot is required", success: false });
    }

    const parsedTimeSlot = moment(timeSlot, 'DD/MM/YYYY hh:mm A', true);

    if (!parsedTimeSlot.isValid()) {
      return res.status(400).json({ message: "Invalid time slot format. Use 'DD/MM/YYYY hh:mm AM/PM'.", success: false });
    }

    const { role, id: professorId } = req.user;

    if (role !== 'professor') {
      return res.status(403).json({ message: 'Access denied. Only professors can add time slots.', success: false });
    }

    const newAppointment = new Appointment({
      professor: professorId,
      timeSlot: parsedTimeSlot.toDate(),
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Time slot added successfully', success: true, appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Error adding time slot', error: error.message, success: false });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { professorId } = req.params;

    const availableSlots = await Appointment.find({
      professor: professorId,
      status: 'available',
    });

    res.status(200).json({ message: 'Available slots retrieved', success: true, slots: availableSlots });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving available slots', error: error.message, success: false });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { role, id: studentId } = req.user;

    if (role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Only students can book appointments.', success: false });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found', success: false });
    }

    if (appointment.status !== 'available') {
      return res.status(400).json({ message: 'This appointment is no longer available', success: false });
    }

    appointment.student = studentId;
    appointment.status = 'booked';
    await appointment.save();

    res.status(200).json({ message: 'Appointment booked successfully', success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error: error.message, success: false });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { role, id: userId } = req.user;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found', success: false });
    }

    if (role !== 'professor') {
      return res.status(403).json({ message: 'Access denied. Only professors can cancel appointments.', success: false });
    }

    if (appointment.professor.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied. You can only cancel your own appointments.', success: false });
    }

    appointment.status = 'cancelled';
    appointment.student = null;
    await appointment.save();

    res.status(200).json({ message: 'Appointment cancelled successfully', success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message, success: false });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let appointments;

    if (role === 'professor') {
      appointments = await Appointment.find({ professor: userId })
        .populate('student', 'name email');
    } else if (role === 'student') {
      appointments = await Appointment.find({ student: userId })
        .populate('professor', 'name email');
    } else {
      return res.status(403).json({ message: 'Access denied', success: false });
    }

    res.status(200).json({ message: 'Booked appointments retrieved successfully', success: true, appointments });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error: error.message, success: false });
  }
};
