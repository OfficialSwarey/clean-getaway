# Clean Getaway

A first-person stealth heist game that runs in the browser: one HTML file, built on three.js.

Case the place, slip in and get the money to the getaway before anyone knows you were there.

## Play

- **On the web:** open the GitHub Pages address for this repository.
- **On an iPhone:** open that address in Chrome or Safari, turn the phone sideways and tap a job. Add it to the home screen (share → Add to Home Screen) and it opens like an app.
- **On a computer:** open `index.html` in a browser, or the Pages address.

## Modes

- **Career (the safehouse):** take jobs off a board of offers. Each has a twist that changes how it plays and what it pays. Money buys permanent gear; experience gives levels and skill points for three skill trees (Ghost, Technician, Enforcer). Get busted and the lawyers take 15% of your cash. The career saves in the browser.
- **Free play:** any job, no twists, skills or gear.

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
- `tests/` — headless regression tests (Playwright). `cd tests && npm install && npm test`.
- `tools/make_test.py` — builds `tests/test.html` from `index.html`.
- `tools/artifact_page.py` — writes the version of the page used for the claude.ai artifact.
- `CHANGELOG.md` — what changed in each version. Versions are tagged `v0.MINOR.PATCH` (`v0.30.0`, …).
