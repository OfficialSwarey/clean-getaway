# Clean Getaway

A first-person stealth heist game that runs in the browser: one HTML file, built on three.js.

Case the place, slip in and get the money to the getaway before anyone knows you were there.

## Play

- **On the web:** https://officialswarey.github.io/clean-getaway/
- **On an iPhone:** open that address in Chrome or Safari, turn the phone sideways and tap a job. Add it to the home screen (share → Add to Home Screen) and it opens like an app.
- **On a computer:** open the link above, or `index.html` in a browser.

## Modes

- **Career (the safehouse):** take jobs off a board of offers. Each has a twist that changes how it plays and what it pays. Before a job you **plan** it: intel on the guards, cameras, locks and loot, a checklist of what it takes to clear it, and the kit you bring. You go in with your mask and whatever you buy: a getaway driver (without one you leave on foot with one bag), the pistol, lockpicks, the drill, duffel bags, body bags, zip ties, magazines, coins, jammers and bump keys. Unused kit goes back to your stash; get busted and the police keep it, and the lawyers take 15% of your cash. Short jobs pay the least and long ones the most. Money also buys permanent gear (each piece needs a career level) and five big goals to save up for. Experience gives levels and skill points for three skill trees (Ghost, Technician, Enforcer). The career saves in the browser.
- **Free play:** any job, no twists, skills or gear.
- **Crew career (co-op):** a career for two, picked on the Co-op screen. One pot of cash and the big goals belong to the crew; each player has their own level, skills, gear and stash, and plans their own kit. The host picks the job and hires the driver. The crew saves on both devices (the newer copy wins), so either player can host; on a new device you pick your name in the crew to take your place back, or load the crew's save code.
- **Difficulty (Easy, Normal, Hard):** at the top of the menu, for both modes. Easy sends a third of the patrol guards home and gives more slack for 25% less pay; Hard tightens detection, radios, police and pagers for 30% more.
- **Co-op (free play, 2 players online):** on the Co-op screen one player presses Host and reads out the code, the other types it and presses Join. The host picks the job and starts it. Works on every job. When the alarm runs out the police come in waves for both players; a player who goes down is in custody while the other plays on.

### How co-op works

The host's game runs the whole job: guards, civilians, cameras, the map and what both players do. The guest walks on their own device (so moving feels instant) and sends where they are, what they hold and what they press; the host's game runs those actions as the guest and sends back how everything moved, the guest's HUD, sounds and messages. Both games build the job from the same random seed, so every object can be named by its place in the scene. The connection is peer to peer through [PeerJS](https://peerjs.com) (its free public server only introduces the two browsers). Open the game with `?net=local` to connect two tabs on the same computer without the internet (used by the tests).

The link has two channels. Everything that is moving (guards, civilians, police, the host, anything thrown) goes 30 times a second over a *lossy* channel that never resends or waits: a late packet is simply replaced by the next one. Doors, lights and anything that has stopped moving go once over the reliable channel when they settle, so nothing ends up in the wrong place. The guest's position goes the same lossy way. A guest's shot is checked against where everyone was on the guest's screen (the host rewinds up to 0.35 s), so aiming at what you see works on a slow link.

**Own relay servers:** if two players can't connect directly (some mobile and office networks), PeerJS falls back to its shared public relays. To use your own TURN server instead, put it in `TURN_SERVERS` near the top of the transport code in `index.html`, for example `{urls:"turn:relay.example.com:3478",username:"name",credential:"secret"}` (a self-hosted coturn, or a hosted service such as Metered or Twilio).

## Jobs

| Job | Place | Length |
|---|---|---|
| Quiet Hours / Business Hours | Harbor Savings & Loan | Short |
| Spin Cycle | Suds & Spin Laundromat | Short |
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
- `tests/` — headless regression tests (Playwright). `cd tests && npm install && npm test`. The co-op tests (`coop*.js`) run a host and a guest in two tabs over `?net=local`; `coopnet.js` tests the real WebRTC connection against a local PeerJS server (`npx peerjs --port 9000`). Build `tests/test.html` with `python3 tools/make_test.py`, then `bash tests/qa/quick.sh` runs the quick check (about 15 minutes; add test names for what you changed), `bash tests/qa/run.sh name …` runs named tests, and `bash tests/qa/runall.sh` runs everything (for changes to code every job uses).
- `tools/make_test.py` — builds `tests/test.html` from `index.html`.
- `tools/artifact_page.py` — writes the version of the page used for the claude.ai artifact.
- `CHANGELOG.md` — what changed in each version. Versions are tagged `v0.MINOR.PATCH` (`v0.30.0`, …).
