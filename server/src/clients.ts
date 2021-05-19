import { createMessageProducer, MessageProducer } from "@javelin/net"
import { Connection } from "@web-udp/client"
import { ConnectionMetadata, ConnectionType } from "../../common/metadata"
import { MESSAGE_MAX_BYTE_LENGTH } from "./env"

export enum ClientStatus {
  Connecting,
  Connected,
  Disconnected,
}
export type Client = {
  id: string
  messageProducer: MessageProducer
  messageProducerUnreliable: MessageProducer
} & (
  | {
      status: ClientStatus.Connecting | ClientStatus.Disconnected
      connection: Connection | null
      connectionUnreliable: Connection | null
    }
  | {
      status: ClientStatus.Connected
      connection: Connection
      connectionUnreliable: Connection
    }
)

export const clients = new Map<string, Client>()

const createClient = (clientId: string) => ({
  id: clientId,
  status: ClientStatus.Connecting,
  messageProducer: createMessageProducer({
    maxByteLength: MESSAGE_MAX_BYTE_LENGTH,
  }),
  messageProducerUnreliable: createMessageProducer({
    maxByteLength: MESSAGE_MAX_BYTE_LENGTH,
  }),
  connection: null,
  connectionUnreliable: null,
})

const findOrCreateClient = (
  connection: Connection,
  { clientId, type }: ConnectionMetadata,
) => {
  let client = clients.get(clientId)
  if (client === undefined) {
    client = createClient(clientId)
    clients.set(clientId, client)
  }
  if (type === ConnectionType.Reliable) {
    if (client.connection) {
      client.connection.close()
    }
    client.connection = connection
  }
  if (type === ConnectionType.Unreliable) {
    if (client.connectionUnreliable) {
      client.connectionUnreliable.close()
    }
    client.connectionUnreliable = connection
  }
  if (client.connection && client.connectionUnreliable) {
    client.status = ClientStatus.Connected
    console.log(`client connected: ${clientId}`)
  }
  return client
}

export const registerConnection = (
  connection: Connection,
  metadata: ConnectionMetadata,
) => {
  try {
    const client = findOrCreateClient(connection, metadata)
    connection.closed.subscribe(() => {
      if (metadata.type === ConnectionType.Reliable) {
        client.connection = null
      } else {
        client.connectionUnreliable = null
      }
      if (client.status !== ClientStatus.Disconnected) {
        console.log(`client disconnected: ${metadata.clientId}`)
      }
      client.status = ClientStatus.Disconnected
    })
  } catch (error) {
    console.error(error)
    connection.send({ error: error.message })
  }
}
