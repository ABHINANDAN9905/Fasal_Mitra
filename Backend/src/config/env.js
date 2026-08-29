import 'dotenv/config';

const resourceId = process.env.DATA_GOV_RESOURCE_ID || process.env.AGMARKNET_RESOURCE_ID || '9ef84268-d588-465a-a308-a864a43d0070';
const apiUrl = process.env.AGMARKNET_API_URL || `https://api.data.gov.in/resource/${resourceId}`;

export const env = {
  port: Number(process.env.PORT || 5000),
  apiKey: (process.env.DATA_GOV_API_KEY || process.env.AGMARKNET_API_KEY || '').trim(),
  resourceId,
  apiUrl,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};
