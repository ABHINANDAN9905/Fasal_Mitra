import {
  getMerchantBulletins,
  updateMandiCropPrice,
  getMerchantProfile,
  getAllMerchants,
  deleteMerchantBulletin,
  authenticateMerchant
} from '../services/merchantService.js';

export async function loginMerchantHandler(req, res) {
  try {
    const { identifier, licenseNumber, merchantId, phone, password } = req.body;
    const result = await authenticateMerchant({
      identifier: identifier || licenseNumber || merchantId || phone,
      password
    });

    return res.json({
      success: true,
      message: `Welcome, ${result.merchant.name}! APMC desk connected.`,
      ...result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Merchant login failed'
    });
  }
}

export async function getBulletinsHandler(req, res) {
  try {
    const { mandiId, mandiName, cropId, cropName, state, district } = req.query;
    const bulletins = await getMerchantBulletins({
      mandiId,
      mandiName,
      cropId,
      cropName,
      state,
      district
    });

    return res.json({
      success: true,
      count: bulletins.length,
      bulletins
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch merchant bulletins'
    });
  }
}

export async function updatePriceHandler(req, res) {
  try {
    const payload = req.body;
    const bulletin = await updateMandiCropPrice(payload);

    return res.json({
      success: true,
      message: `Successfully published live ${bulletin.cropName} price for ${bulletin.mandiName}!`,
      bulletin
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update mandi price'
    });
  }
}

export async function getProfileHandler(req, res) {
  try {
    const { merchantId = 'merchant-1' } = req.query;
    const profile = await getMerchantProfile(merchantId);
    const merchants = await getAllMerchants();

    return res.json({
      success: true,
      profile,
      allMerchants: merchants
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch merchant profile'
    });
  }
}

export async function deleteBulletinHandler(req, res) {
  try {
    const { mandiId, cropId } = req.body;
    await deleteMerchantBulletin(mandiId, cropId);

    return res.json({
      success: true,
      message: 'Mandi price bulletin reset'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset bulletin'
    });
  }
}
