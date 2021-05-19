// common/metadata.ts
export enum ConnectionType {
  Reliable,
  Unreliable,
}
export type ConnectionMetadata = {
  clientId: string
  type: ConnectionType
}
export function assertIsConnectionMetadata(
  object: unknown,
): asserts object is ConnectionMetadata {
  if (
    typeof object !== "object" ||
    object === null ||
    typeof Reflect.get(object, "clientId") !== "string" ||
    typeof Reflect.get(object, "type") !== "number"
  ) {
    throw new Error("Invalid connection metadata")
  }
}
