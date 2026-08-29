import { getWeatherAndAgroAdvisory } from '../services/weatherService.js';

export async function getWeatherForecast(req, res, next) {
  try {
    const { state = 'Maharashtra', district = 'Nashik', cropId = 'onion' } = req.query;
    const weatherData = await getWeatherAndAgroAdvisory({ state, district, cropId });
    return res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    next(error);
  }
}
