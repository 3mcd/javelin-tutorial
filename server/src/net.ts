// server/src/net.ts
import { Connection } from "@web-udp/client"
import { Server } from "@web-udp/server"
import { createServer } from "http"
import {
  assertIsConnectionMetadata,
  ConnectionMetadata,
  ConnectionType,
} from "../../common/metadata"

export const server = createServer()
const udp = new Server({ server })
const registerConnection = (
  connection: Connection,
  metadata: ConnectionMetadata,
) => {
  console.log(
    `${metadata.clientId} connected: ${
      metadata.type === ConnectionType.Reliable ? "reliable" : "unreliable"
    }`,
  )
  // TODO: handle incoming connection
}

udp.connections.subscribe(connection => {
  try {
    const { metadata } = connection
    assertIsConnectionMetadata(metadata)
    registerConnection(connection, metadata)
  } catch (error) {
    console.error(error)
    connection.send({ error: error.message })
    connection.close()
  }
})
