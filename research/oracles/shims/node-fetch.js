// node-fetch stand-in: delegates to globalThis.fetch so tests stub one function.
export default function fetch(...args) {
  return globalThis.fetch(...args);
}
