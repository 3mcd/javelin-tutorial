import "./index.css"
import { world } from "./ecs"
import { connect } from "./net"

async function main() {
  await connect()
  setInterval(() => {
    world.tick()
  }, (1 / 60) * 1000)
}

main()
