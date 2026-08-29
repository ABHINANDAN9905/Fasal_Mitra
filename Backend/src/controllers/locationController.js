import { STATES_AND_DISTRICTS } from '../data/locationData.js';

export async function getStates(req, res, next) {
  try {
    return res.json({
      success: true,
      states: STATES_AND_DISTRICTS
    });
  } catch (error) {
    next(error);
  }
}

export async function getDistrictsForState(req, res, next) {
  try {
    const { state } = req.params;
    const stateObj = STATES_AND_DISTRICTS.find(s => s.state.toLowerCase() === state.toLowerCase());
    if (!stateObj) {
      return res.status(404).json({ success: false, message: 'State not found' });
    }
    return res.json({
      success: true,
      state: stateObj.state,
      stateCode: stateObj.stateCode,
      districts: stateObj.districts
    });
  } catch (error) {
    next(error);
  }
}
