import { performance, Performance } from "perf_hooks"
;(global as unknown as { performance: Performance }).performance = performance
export * from "@dimforge/rapier2d/rapier"
