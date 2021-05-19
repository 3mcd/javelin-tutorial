import { createWorld } from "@javelin/ecs"
import * as Systems from "./systems"

export const world = createWorld<void>({
  systems: Object.values(Systems),
})
