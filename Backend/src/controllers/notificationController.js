import { generateWhatsAppPayload } from '../services/notificationService.js';

export async function createWhatsAppShare(req, res, next) {
  try {
    const { bestResult, crop, originLocation } = req.body;
    if (!bestResult) {
      return res.status(400).json({ success: false, message: 'bestResult payload is required' });
    }
    const payload = generateWhatsAppPayload({ bestResult, crop, originLocation });
    return res.json({ success: true, payload });
  } catch (error) {
    next(error);
  }
}
