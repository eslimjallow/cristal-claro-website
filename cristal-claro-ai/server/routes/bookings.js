import { Router } from 'express';
import { createBooking, listBookings, updateBookingStatus } from '../lib/db.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const phone = String(body.phone || '').trim();
    const date = String(body.date || '').trim();
    if (!phone || !date) {
      return res.status(400).json({ error: 'phone and date are required' });
    }
    const booking = await createBooking({
      name: body.name || '',
      phone,
      email: body.email ? String(body.email).trim() : '',
      date,
      time: body.time || '',
      notes: body.notes || '',
      status: 'requested',
    });
    res.status(201).json({ booking });
  } catch (err) {
    console.error('[booking]', err);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

export { router as bookingRouter };

export function adminBookingsRouter(requireAdmin) {
  const r = Router();
  r.use(requireAdmin);

  r.get('/', async (_req, res) => {
    try {
      const bookings = await listBookings();
      res.json({ bookings });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to list bookings' });
    }
  });

  r.patch('/:id/status', async (req, res) => {
    try {
      const { status } = req.body || {};
      if (!['requested', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      const updated = await updateBookingStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json({ booking: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Update failed' });
    }
  });

  return r;
}
