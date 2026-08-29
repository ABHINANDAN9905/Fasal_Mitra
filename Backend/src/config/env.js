import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT || 5000),
  apiKey: process.env.AGMARKNET_API_KEY || '',
  apiUrl: process.env.AGMARKNET_API_URL || 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
}
