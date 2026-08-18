import Worker from '../models/Worker.model.js';
import Booking from '../models/Booking.model.js';

export const generateWorkerID = async () => {
  const year = new Date().getFullYear();
  const prefix = `WRK-${year}-`;
  const lastWorker = await Worker.findOne({ workerID: { $regex: `^${prefix}` } })
    .sort({ createdAt: -1, workerID: -1 })
    .select('workerID');

  let nextNum = 1;
  if (lastWorker && lastWorker.workerID) {
    const parts = lastWorker.workerID.split('-');
    if (parts.length === 3) {
      const parsed = parseInt(parts[2], 10);
      if (!isNaN(parsed)) {
        nextNum = parsed + 1;
      }
    }
  }

  const padded = String(nextNum).padStart(4, '0');
  return `${prefix}${padded}`;
};

export const generateBookingID = async () => {
  const year = new Date().getFullYear();
  const prefix = `BKG-${year}-`;
  const lastBooking = await Booking.findOne({ bookingID: { $regex: `^${prefix}` } })
    .sort({ createdAt: -1, bookingID: -1 })
    .select('bookingID');

  let nextNum = 1;
  if (lastBooking && lastBooking.bookingID) {
    const parts = lastBooking.bookingID.split('-');
    if (parts.length === 3) {
      const parsed = parseInt(parts[2], 10);
      if (!isNaN(parsed)) {
        nextNum = parsed + 1;
      }
    }
  }

  const padded = String(nextNum).padStart(4, '0');
  return `${prefix}${padded}`;
};

export default { generateWorkerID, generateBookingID };
