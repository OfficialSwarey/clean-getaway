# Changelog

Versions follow `0.MINOR.PATCH` while the game is in development: a new
feature round bumps MINOR, a bug-fix-only update bumps PATCH, and 1.0.0 is
the first "finished" release. Up to 0.30.0, MINOR is the version number the
claude.ai artifact had. Releases are tagged `v0.30.0` and so on.

## 0.33.0 — career economy
Career only: free play and co-op are unchanged. Old careers keep their cash, levels, skills and gear.
- **Pay by job size:** your cut is now the job's score measured against what that job is worth. A full, clean take on Normal with a ×1.00 contract pays $7,000 (Quiet Hours), $8,000 (Business Hours), $14,000–18,000 (medium jobs) and $30,000–42,000 (long jobs). Twists, stealth, difficulty and partial takes still count. Offers show what the whole job pays.
- **Plan the job:** "Plan the job" opens intel (guards, cameras, civilians, locked doors, keycards, loot), a checklist of what it takes to clear it, and your kit. Fill to plan, adjust, and start.
- **Nothing is free:** you go in with your mask and nothing else. Hire a getaway driver ($1,000 / $2,000 / $4,000 by job size; on foot you can only get one bag out), and bring a pistol ($500), a lockpick set ($400), a drill ($800, bank jobs), duffel bags ($200, one per loot bag or gold bar), body bags ($150), zip ties ($100), spare magazines ($150), coins ($100 for 3), jammers ($500) and bump keys ($1,200).
- **Stash:** whatever you don't use goes back to your stash for the next job. Get busted and the police keep everything you brought.
- **Hands only:** without a pistol, take guards down from behind with F, ACTION on a touch screen, or Y on a controller. The fire button does the same.
- **Gear** now costs $3,000 to $60,000 and needs a career level: extended magazine, soft-soled shoes, own drill rig (no more rental), pro lockpicks (no more rental), fake staff badge, signal booster (new: jammers run 50% longer) and a better silencer. Spare jammer, zip-tie bandolier, roll of coins and thermal bit are gone; old saves get them as stash stock or the drill rig.
- **Big goals:** Workshop ($75,000: kit half price), Veteran wheelman ($120,000: driver half price, police 20% slower), Inside man ($200,000: +15% pay), Offshore account ($300,000: a bust costs 5%) and the Penthouse ($750,000).
- **Skills:** Signal tech makes jammers half price (and they still run 7 s longer). Zip-tie stash makes zip ties and body bags half price.
- New offers cost $500, a skill reset $8,000.

## 0.32.1 — dev mode on phones
- Phones and tablets: dev mode is back. Tap **Co-op · Dev** next to Start in the job menu (the button used to say "More") and tick Dev mode.
- In a job, a **GHOST** button under the pause and OBJ buttons turns noclip on and off. JUMP flies up, CROUCH flies down, and pushing the stick all the way goes faster.
- Controllers: BACK turns noclip on and off; A flies up, B down, click the stick to go faster.

## 0.32.0 — difficulty
- Three difficulties, picked at the top of the job menu (it applies to career and free play, and in co-op the host's choice counts):
  - **Easy:** a third of the patrol guards stay home (never the camera operator or anyone the job needs), guards and cameras are slower to spot you, radios and police take longer, one extra pager excuse. Pay −25%.
  - **Normal:** as before.
  - **Hard:** guards and cameras spot you faster and further, radios are quicker, the police come sooner, one pager excuse less. Pay +30%.
- The job panel shows the real guard count for the chosen difficulty; the job report shows the difficulty bonus or cut.

## 0.31.2 — job menu
- Phones and small windows: compact job tiles, and the chosen job with its Start button stays pinned to the bottom of the screen, so you can start without scrolling. Co-op opens from a button next to Start.
- Career on phones: the level and cash bar shares a row with the Jobs / Shop / Skills tabs, and the contract cards are tighter, so "Take the job" is on the first screen.
- Computer: the job panel no longer spills out past the edge of the menu.
- Dev mode is hidden on touch screens (noclip needs a keyboard).

## 0.31.1
- Elevator and gondola: walk around while they move. They're now moving floors you stand on instead of a fixed ride that held you still.
- Phones: the floor numbers sit just above the crosshair, clear of the buttons, and long prompts wrap before they reach the buttons.

## 0.31.0 — co-op
- Online co-op for two players in free play: one hosts and shares a five-letter code, the other joins. The host picks the job and starts it; both of you play it on your own device (computer, phone or controller).
- Guards, civilians and cameras notice both of you. The detection meter, the alarm, the bags and the take are shared; the HUD shows where your partner is and what they're doing.
- If a guard catches one of you, that player watches from their partner's shoulder while the other finishes the job. The getaway waits until you're both there.
- Works on the bank, club and jeweller's jobs (seven of twelve). The tower, manor, casino, port and observatory stay solo for now.
- The connection is peer to peer (PeerJS). `?net=local` connects two tabs on one computer.

## 0.30.2 — phone HUD
- The objective, detection meter, status chips and clock no longer overlap on a phone: objective top left, detection meter and status top centre, clock top right, radio and pager subtitles bottom left.
- OBJ button under pause folds the objective away. A new objective still pops up for a few seconds, and urgent warnings always show.
- Prompts and tips name the touch buttons (USE, MASK, DROP, JUMP…) on a phone and the controller buttons on a controller, instead of keyboard keys.
- Coin and jammer counts are on their buttons; the jammer button no longer overlaps JUMP.

## 0.30.1
- iPhone: the touch controls now show up. A tap on an iPhone also sends a fake mouse click, which switched the game to mouse and keyboard; the game now goes by pointer type instead.
- Phones no longer get the old "needs a keyboard and mouse" note on the menu.

## 0.30.0 — phones and controllers
- Touch controls on phones and tablets: floating joystick, drag to look, context buttons, tappable keypads, a floor picker in elevators, pause button, landscape prompt.
- Controller support in game and in the menus (d-pad focus, A/B, LB/RB tabs), keypads with a d-pad cursor.
- Aim assist for touch and controller only (gentle pull while aiming, slower look on a target).
- A lighter graphics level on phones (no shadows, fewer lights, lower resolution).
- Home-screen install (icon, landscape, full screen).

## 0.29.0 — career mode
- The safehouse: a job board with twists, money, experience, levels, three skill trees, a gear shop, busts cost 15% of your cash.
- Throwable coins (T): a guard who hears one walks over to look.

## 0.28.0 — Whiteout
- New job: Halden Peak Observatory in a snowstorm. Footprints in fresh snow that guards follow, gusts that blind and fill the prints in, timed laser lanes, a radio relay you can pull, a star-catalogue puzzle, cable car or snowcat getaway.
- QA: manor service door blocked by shelving, floating trees and gold bags, menu overflow at 1024 px, compact HUD on short screens, long messages wrap.

## 0.27.0
- Casino vault stairwell walled off; wider corridor outside Vane's office; paintings moved off doors and windows; gondola entry gate, deck markings and roof chain; placing a jammer restarts every countdown.

## 0.26.0
- Brilliant Cut: the cellar hatch now reads as a hole (lit cellar, steel lining, crates below); the drilled party wall is a rough hole with rubble.

## 0.25.0
- Full QA pass: unreachable cash, blocked doors, objective lists, end-screen text, menu stats wrapping.

## 0.18–0.24
- Halcyon Tower (0.18), Brilliant Cut (0.19), surroundings for every map (0.20), Window Shopping (0.21), English throughout (0.22), bagging as a tip (0.23), tips and warnings, signs, the job menu (0.24).

## 0.1–0.17
- The original jobs and systems: stealth, masks, guards, cameras, pagers, jammers, civilians, bags, the van.
