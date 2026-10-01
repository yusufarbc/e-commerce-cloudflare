// Admin panel Worker: serves the SPA and forwards /api/* to the API Worker.
//
// The panel hostname is protected by Cloudflare Access, which adds a signed
// Cf-Access-Jwt-Assertion header to every request that reaches this Worker.
// Forwarding the request unchanged through the service binding lets the API
// verify that header, so admin calls stay same-origin and never need a token
// in the browser.
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith('/api/')) {
      return env.API.fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};
