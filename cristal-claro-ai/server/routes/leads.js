import { Router } from 'express';
import { createLead, listLeads, updateLeadStatus } from '../lib/db.js';
import { estimatePrice } from '../lib/pricing.js';

const router = Router();

/**
 * POST /lead — create lead (from guided flow)
 */
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const windows = Math.max(0, parseInt(body.windows, 10) || 0);
    const heightCategory = body.heightCategory || 'low';
    const needsPole = Boolean(body.needsPole);

    const { estimate, breakdown } = estimatePrice({
      windows,
      heightCategory,
      needsPole,
    });

    const doc = {
      name: body.name || '',
      phone: String(body.phone || '').trim(),
      email: body.email ? String(body.email).trim() : '',
      windows,
      propertyType: body.propertyType || '',
      heightCategory,
      needsPole,
      location: body.location || '',
      dateNeeded: body.dateNeeded || '',
      priceEstimate: estimate,
      priceBreakdown: breakdown,
      status: 'new',
      source: body.source || 'chat',
    };

    if (!doc.phone) {
      return res.status(400).json({ error: 'phone is required' });
    }

    const lead = await createLead(doc);
    res.status(201).json({ lead });
  } catch (err) {
    console.error('[lead]', err);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

export { router as leadRouter };

/** Mounted with admin auth in index.js */
export function adminLeadsRouter(requireAdmin) {
  const r = Router();
  r.use(requireAdmin);

  r.get('/', async (_req, res) => {
    try {
      const leads = await listLeads();
      res.json({ leads });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to list leads' });
    }
  });

  r.patch('/:id/status', async (req, res) => {
    try {
      const { status } = req.body || {};
      if (!['new', 'contacted', 'booked'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      const updated = await updateLeadStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json({ lead: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Update failed' });
    }
  });

  return r;
}
