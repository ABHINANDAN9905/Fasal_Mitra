import api from './api';

export const getWeatherForecast = async ({ state = 'Maharashtra', district = 'Nashik', cropId = 'onion' }) => {
  try {
    const res = await api.get('/v1/weather/forecast', {
      params: { state, district, cropId }
    });
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('Weather forecast API error, fallback to default:', err.message);
  }

  return {
    location: `${district}, ${state}`,
    currentTemp: 29,
    forecast: [
      { day: 'Today', maxTemp: 31, minTemp: 19, rainProbability: 10, condition: 'Sunny & Clear' },
      { day: 'Tomorrow', maxTemp: 30, minTemp: 20, rainProbability: 15, condition: 'Clear' },
      { day: 'Wed', maxTemp: 28, minTemp: 18, rainProbability: 60, condition: 'Rain / Thunderstorm' },
      { day: 'Thu', maxTemp: 27, minTemp: 18, rainProbability: 40, condition: 'Partly Cloudy' },
      { day: 'Fri', maxTemp: 29, minTemp: 19, rainProbability: 10, condition: 'Sunny' }
    ],
    transitRiskAlert: {
      hasAlert: false,
      severity: 'Good',
      title: 'Good Transit & Selling Conditions',
      advisory: `Favorable weather conditions across ${district} for harvest transport and mandi arrival.`
    }
  };
};
