import { PORT, TICK_RATE } from "./env"
import { server } from "./net"
import { createHrtimeLoop } from "@javelin/hrtime-loop"
import { world } from "./ecs"

const loop = createHrtimeLoop((1 / TICK_RATE) * 1000, world.tick)

loop.start()
server.listen(PORT)
