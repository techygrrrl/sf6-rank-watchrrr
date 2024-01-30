import { WebSocketServer } from "ws"
import { createServer } from 'node:http'
import process from "node:process"
import express from "express"
import bodyParser from "body-parser"
import cors from 'cors'
import { healthHandler } from "./handlers/healthHandler.js"
import { webSocketConnectionHandler } from "./handlers/webSocketConnectionHandler.js"
import { rankEmitter } from "./events.js"
import { postRankHandler } from "./handlers/postRankHandler.js"
import { RANK_DATA } from "./data.js"
import { getRankHandler } from "./handlers/getRankHandler.js"

// Crash if no port is provided
const port = process.env.PORT
if (!port) {
  throw new Error('no PORT')
}

// Set up the Express app on a custom `http` server so we can have endpoints
const app = express()

app.use(cors())
app.use(bodyParser.json())

////////////////
// Endpoints
////////////////

// Health
app.get('/health', healthHandler)

// Rank
app.get('/rank', getRankHandler({ RANK_DATA }))
app.post('/rank', postRankHandler({ rankEmitter }))

const server = createServer(app)

// Create a web socket server on the custom `http` server
const wss = new WebSocketServer({
  server,
})
wss.on('connection', webSocketConnectionHandler({ rankEmitter }))

// Start the `http` server
server.listen(port, () => {
  console.log('> Rank data', RANK_DATA)
  console.log(`⚙️ Listening at http://localhost:${port}`)
})
