import { diagnoseCropDisease, parseVoiceQuery } from '../services/geminiAiService.js';

export async function diagnoseDiseaseHandler(req, res, next) {
  try {
    const { cropName = 'crop', language = 'en' } = req.body;
    const imageBuffer = req.file ? req.file.buffer : null;
    const mimeType = req.file ? req.file.mimetype : 'image/jpeg';

    const result = await diagnoseCropDisease({
      imageBuffer,
      mimeType,
      cropName,
      language
    });

    return res.json({
      success: true,
      cropName,
      diagnosis: result
    });
  } catch (error) {
    next(error);
  }
}

export async function parseVoiceQueryHandler(req, res, next) {
  try {
    const { voiceText, language = 'en' } = req.body;
    if (!voiceText) {
      return res.status(400).json({ success: false, message: 'voiceText transcript is required' });
    }

    const result = await parseVoiceQuery(voiceText, language);
    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}
