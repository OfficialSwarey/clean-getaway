# Changelog

Versions follow `0.MINOR.PATCH` while the game is in development: a new
feature round bumps MINOR, a bug-fix-only update bumps PATCH, and 1.0.0 is
the first "finished" release. Up to 0.30.0, MINOR is the version number the
claude.ai artifact had. Releases are tagged `v0.30.0` and so on.

## 0.38.0 — co-op on every job
- **Co-op works on every job now:** The Winter Heart, House Edge, Dead Reckoning, Glass Ceiling and Whiteout join the others.
- What each of you does counts on your own: either of you can walk into the manor's laser grid or the observatory's laser lanes, set off the casino's or the jeweller's motion sensors, or leave footprints in the snow (both of you see them, and guards follow them).
- **The casino uniform is yours alone:** pick a locker and you're in uniform; your partner still needs their own.
- **Riding together:** in Glass Ceiling the elevator and the gondola carry whoever is aboard, and the shaft doors open for either of you. Vane's voice records for whoever stands close enough.
- Holding E on something (a locker, a fuse box, a pickpocket) is your own progress; your partner holding E somewhere else doesn't reset it.
- The guest sees what the host's world does: the storm and the fog on the summit, the crane's and the gondola's cables, the hatch opening in the ship's deck.
- Tutorial tips (sensors, lasers, footprints) show once for each player.

## 0.37.0 — police in co-op, faster co-op netcode
- **The police come in co-op too:** when the alarm timer runs out, armed police arrive in waves for both players, follow the trail of whoever they're after and shoot at whoever they can see. Each player has their own health (the guest sees their own health and the red edges when hit). A player who goes down is in custody, and the other can still finish the job and get out. The guest can knock officers out, shoot them, and break free when grabbed.
- **The driver leaves in co-op too:** when the police arrive he drives off with what's in the van (paid even if you're both busted), and you leave on foot the way you came in.
- **Smoother co-op over the internet:** moving things are sent 30 times a second (was 20) over a fast channel that never waits for lost packets, so one dropped packet no longer holds up the rest. Doors and things that stopped moving are still sent reliably, so they always end up right.
- **Fair shots for the guest:** the host checks a guest's shot against where everyone was on the guest's screen, so you hit what you aimed at even with some lag.
- **Own relay servers:** `TURN_SERVERS` in the game's code takes your own TURN relay for players who can't connect directly (see the README).
- Tests: a quick check (`tests/qa/quick.sh`) and a runner for named tests (`tests/qa/run.sh`).

## 0.36.0 — Spin Cycle
- **New short job, Spin Cycle:** Suds & Spin, a 24-hour laundromat a loan shark washes his money through. It's open all night: walk in with the night customers; the drying room and the office in the back are staff only.
  - Two of the five big dryers in the drying room are stuffed with cash. A pick-up ticket pinned up somewhere (a new spot every run) says which two. Open an empty one and its door buzzer goes off: guards nearby come to look.
  - The third bag is in the office safe; the code is on a note somewhere.
  - Ways in: the staff door from the front room, the locked back door from the alley, the locked office door, or the office window on the side street. The man on the monitors sits with his back to the window.
  - 3 guards, 3 civilians, 2 cameras, 3 bags. Works in career (a full, clean take pays $7,500), free play and co-op.

## 0.35.0 — main menu, bag the loot, no driver no van, police waves
- **Main menu:** the game opens on a start screen with Singleplayer (career and free play), Co-op, Settings, and Controls and tips. Each screen has a back button; Escape and B on a controller go back too.
- **Co-op has its own screen:** host or join at the top, then the host picks a job. Leaving the co-op screen leaves co-op. The "Co-op · Dev" button on phones is gone.
- **Settings:** sound, folding the objective away on touch screens, and dev mode (moved here from the job panel).
- **Bag the loot yourself:** cash and gold lie in piles. Hold E at a pile to stuff it into a duffel (about 1.6 s for cash, 2.2 s for gold), then you're carrying it. In career that uses up one of your duffel bags; free play has as many as you want.
- **No driver, no van (career):** without a driver the van isn't there at all. Carry a bag out the way you came in (the orange ring) and hold E to slip away with it and whatever's in your pockets. Helicopters, boats and the snowcat need the driver too. The plan shows what one bag on foot is worth.
- **The driver takes a cut:** 10% of your cut on top of his fee (5% with the Veteran wheelman). The job report shows it.
- **The police come in waves (single player):** when the alarm timer runs out the job isn't over any more. Armed police arrive (2 officers, then 3, then 4, a new wave about every 35 seconds, up to 6 at once), follow the trail you left and shoot when they see you. Crouching, moving, distance and cover make them miss more. They take three body hits (two with a headshot), and you can knock them out like guards.
- **Health:** you have 100. It comes back slowly once nobody has hit you for about five seconds. At 0 you go down and you're busted.
- **The driver leaves when the police come:** he drives off with whatever is already in the van, and that money is yours even if you're busted afterwards. Then you get out on foot the way you came in, with the bag in your hands. The job report shows the waves and officers you dropped.
- Co-op keeps the old rule for now: when the police arrive, the job is over.
- Controls and tips updated for bagging, throwing, front fights and breaking free.

## 0.34.0 — save codes, owned kit, fighting back, throwing bags
- **Save codes:** in the safehouse, *Save code* gives you a code to copy (or share on a phone), and *Load code* on another device shows what's in it before it replaces that career. The code holds your career and your best scores, sealed so a random or edited code doesn't open.
- **Name your career:** type a name in the safehouse. It shows at the top and in save codes.
- **The pistol, lockpicks and the drill are yours:** you buy them into your stash instead of renting them for one job. The pistol ($1,500) and the drill ($3,000) come home after a clean job; the police keep them, like the rest of your kit, if you're busted.
  - **Lockpicks** cost $100 each, and one is used up on every lock you pick: doors, window latches and safes. With pro lockpicks only every other lock uses one up.
  - **The drill** starts in a bag next to you. Carry it to the vault yourself and set it up. You can bring as many as the job has drill vaults.
  - Old saves with the drill rig get a drill in their stash; the rig is now a tune-up that makes the drill 25% faster.
- **Fight from the front:** hitting a guard who faces you rocks him for about 1.5 seconds (no walking, no radio). Hit him again before he recovers and he's out. Fights are noisier than a quiet takedown from behind. Quick hands still knocks a guard out in one hit, from any side.
- **Break free:** when a guard grabs you during an alarm, you have 3 seconds to break free. Mash F, BREAK FREE on a touch screen or Y on a controller six times and you floor him. A second guard arriving cuffs you straight away. Iron grip still wins once per job by itself.
- **Throw bags:** T (THROW on a touch screen, RB on a controller) throws what you're carrying. Cash bags fly furthest, the drill about half as far, gold and bodies only a short heave. A bag that lands next to the van is loaded; a heavy one lands with a thud guards nearby come to check.
- New careers start with $8,000.

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
- Harbor Savings & Loan (Quiet Hours and Business Hours, career and free play): a second way into the security room, a locked staff door from the back alley that opens behind the guard's chair.

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
