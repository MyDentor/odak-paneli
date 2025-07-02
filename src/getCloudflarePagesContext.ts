export function getCloudflarePagesContext(): { env: any } {
  return (globalThis as any).cloudflare || { env: {} };
}
