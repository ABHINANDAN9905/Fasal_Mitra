import { CROPS, CROP_CATEGORIES } from '../data/cropsData.js';

export async function getCrops(req, res, next) {
  try {
    const { category, search } = req.query;
    let filtered = [...CROPS];

    if (category && category !== 'All') {
      filtered = filtered.filter(c => c.category?.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) ||
        (c.hindiName && c.hindiName.toLowerCase().includes(q)) ||
        (c.marathiName && c.marathiName.toLowerCase().includes(q)) ||
        c.variety?.some(v => v.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      count: filtered.length,
      categories: CROP_CATEGORIES,
      crops: filtered
    });
  } catch (error) {
    next(error);
  }
}

export async function getCropById(req, res, next) {
  try {
    const { id } = req.params;
    const crop = CROPS.find(c => c.id === id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }
    return res.json({ success: true, crop });
  } catch (error) {
    next(error);
  }
}
