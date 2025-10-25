import concurrently from "concurrently"

function main() {
  concurrently(["npm:dev:api", "npm:dev:ui"])
}

main()
