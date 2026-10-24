# Clean Getaway

A first-person stealth heist game that runs in the browser: one HTML file, built on three.js.

Case the place, slip in and get the money to the getaway before anyone knows you were there.

## Play

- **On the web:** https://officialswarey.github.io/clean-getaway/
- **On an iPhone:** open that address in Chrome or Safari, turn the phone sideways and tap a job. Add it to the home screen (share → Add to Home Screen) and it opens like an app.
- **On a computer:** open the link above, or `index.html` in a browser.

## Modes

- **Career (the safehouse):** take jobs off a board of offers. Each has a twist that changes how it plays and what it pays. Money buys permanent gear; experience gives levels and skill points for three skill trees (Ghost, Technician, Enforcer). Get busted and the lawyers take 15% of your cash. The career saves in the browser.
- **Free play:** any job, no twists, skills or gear.
- **Co-op (free play, 2 players online):** one player presses Host under the job details and reads out the code, the other types it and presses Join. The host picks the job and starts it. Works on the bank, club and jeweller's jobs so far.

### How co-op works

The host's game runs the whole job: guards, civilians, cameras, the map and what both players do. The guest walks on their own device (so moving feels instant) and sends where they are, what they hold and what they press; the host's game runs those actions as the guest and sends back how everything moved, the guest's HUD, sounds and messages. Both games build the job from the same random seed, so every object can be named by its place in the scene. The connection is peer to peer through [PeerJS](https://peerjs.com) (its free public server only introduces the two browsers). Open the game with `?net=local` to connect two tabs on the same computer without the internet (used by the tests).

## Jobs

| Job | Place | Length |
|---|---|---|
| Quiet Hours / Business Hours | Harbor Savings & Loan | Short |
| Night Deposit / Lunch Rush | Meridian Trust | Medium |
| Last Call | Club Halo | Medium |
| Brilliant Cut / Window Shopping | Lindqvist & Daughters | Medium |
| The Winter Heart | Blackwood Manor | Long |
| House Edge | The Golden Lotus casino | Long |
| Dead Reckoning | Port Halvard · MV Kestrel | Long |
| Glass Ceiling | Halcyon Tower | Long |
| Whiteout | Halden Peak Observatory | Long |

## Controls

Keyboard and mouse, a controller (standard Xbox/PlayStation layout) and touch screens are all supported; the full list is under **Controls and tips** in the game's menu. Aim assist helps on a controller and on touch, never with a mouse.

## Repository

- `index.html` — the whole game (the page GitHub Pages serves).
- `manifest.webmanifest`, `icons/` — home-screen install.
- `tests/` — headless regression tests (Playwright). `cd tests && npm install && npm test`. The co-op tests (`coop*.js`) run a host and a guest in two tabs over `?net=local`; `coopnet.js` tests the real WebRTC connection against a local PeerJS server (`npx peerjs --port 9000`).
- `tools/make_test.py` — builds `tests/test.html` from `index.html`.
- `tools/artifact_page.py` — writes the version of the page used for the claude.ai artifact.
- `CHANGELOG.md` — what changed in each version. Versions are tagged `v0.MINOR.PATCH` (`v0.30.0`, …).
