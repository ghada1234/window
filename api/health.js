// Health check endpoint
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'Find Your Inner Peace Email API',
    timestamp: new Date().toISOString()
  })
}

