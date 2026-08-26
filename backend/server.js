import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'kraviona-api' })
})

async function startServer() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
  } else {
    console.log('MONGODB_URI not set; starting without database connection')
  }

  app.listen(port, () => console.log(`API listening on http://localhost:${port}`))
}

startServer().catch((error) => {
  console.error('Unable to start API', error)
  process.exitCode = 1
})