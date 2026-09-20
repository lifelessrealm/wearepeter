# FIATLESS

A scroll-driven, single-viewport landing page for the $FIATLESS memecoin concept.

## Launch configuration

1. Copy `.env.example` to `.env`.
2. Add the token address:

   ```env
   CONTRACT_ADDRESS=YOUR_SOLANA_CONTRACT_ADDRESS
   ```

3. Run `npm run build`.

The build writes the address into `dist/config.js` and automatically links the **Buy $FIATLESS** button to `https://pump.fun/coin/YOUR_SOLANA_CONTRACT_ADDRESS`.

`PUMPFUN_URL` is an optional override if Pump.fun gives you a different launch URL. The site stays safely in “Launching soon” mode when no address is configured.

## Preview locally

Serve the `dist` directory with any static file server. The experience responds to mouse wheel, touch swipe, arrow keys, Page Up/Down, Home, and End.

## Structure

- `dist/index.html` — content and accessible scene structure
- `dist/style.css` — responsive art direction and transitions
- `dist/app.js` — scene navigation and launch-button behavior
- `dist/config.js` — generated public launch configuration
- `dist/assets/` — Peter Schiff campaign imagery

## Important

The contract address is public blockchain information. Never place private keys, wallet seeds, or API secrets in `.env` or `dist/config.js`.
