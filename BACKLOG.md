# Backlog

Ideas for Clean Getaway that are agreed but not built yet. Nothing here is in the game.
Each item says what's wanted, then what the game does today and any open questions, so it can be picked up later.

## Menus and settings

### 1. Main menu
A proper start menu with **Singleplayer**, **Co-op**, **Settings** and so on. The dev option moves into **Settings**.
- Today: one job menu with Career / Free play tabs. Co-op and dev mode sit in the job panel; on phones they're behind the "Co-op · Dev" button.

### 2. Export and import saves
Move a save between devices with a code you export on one device and import on another. The code is encrypted or signed, so typing in a random or edited string doesn't produce a valid save (no free cash).
- Today: the career lives only in the browser's localStorage under `cg-career-v1`.
- Note: the game is a single public page, so any key in the code can be read. A signature stops casual tampering, not a determined cheater. That's fine for a single-player save.

## Career economy and kit

### 3. Pistol and lockpicks become stash items
The silenced pistol and the lockpick set stop being "per job". Like the other kit, you own them and keep them in your stash.
- **Lockpicks get used up:** one is spent each time you pick a lock.
- Today: both are bought for one job ($500 and $400). Pro lockpicks (permanent gear) remove the lockpick rental.
- Open questions: does a pistol you bring come back after a clean job and get lost on a bust, like the rest of the kit? Does a window latch or a safe also use up a pick?

### 4. Bag the loot yourself
Money and gold aren't already in bags. You fill a duffel with the cash or gold on the spot, and only then can you carry it out.
- Today: loot lies in ready-made bags. In career mode, picking one up uses a duffel bag.
- Open question: is bagging a hold-E action at the pile, like bagging a body?

## Getaway

### 5. No driver: no van, and a way out on foot
Without a hired driver there's no van on the map at all. You leave by an exit of your own, on foot.
- Today: without a driver the van is still there, it only takes one bag, and leaving says "run for it".
- Every map needs an on-foot exit point.

### 6. The driver leaves when the police come
With a driver, when the police arrive he drives off with the loot already in the van. That loot is still paid. You then have to get out the on-foot way (item 5).
- Open question: is the van loot always paid, even if you're busted after the driver leaves?

## Combat and the police

### 7. Police come in waves
When the police arrive they come in waves, and they're armed and try to kill you, rather than the alarm timer simply running out.
- Today: the alarm gives you a countdown; when it ends, you're caught if you're still inside.
- Needs: police units, spawn points per map, and player health and damage.

### 8. Getting caught takes about 3 seconds
When a guard catches you, he spends about 3 seconds trying to cuff you. In that window you can fight back and knock him down.
- Today: a guard who reaches you catches you at once. The Iron grip skill frees you once per job.
- Open question: what does Iron grip become? Maybe an automatic win of this struggle, once per job.

### 9. Fight a guard from the front
You can knock a guard down from the front too, even after he has seen you.
- Today: a takedown only works from behind or the side (Quick hands widens it).
- Open questions: does it take longer or need several hits from the front? Does he get a chance to radio in or grab you first?

## Co-op

### 10. Co-op on every map
- Today: co-op works on Quiet Hours, Business Hours, Night Deposit, Lunch Rush, Last Call, Brilliant Cut and Window Shopping. Not yet on the Winter Heart, House Edge, Dead Reckoning, Glass Ceiling and Whiteout.

### 11. Co-op career
- A career for co-op with its **own save**, separate from the single-player career, and its **own export and import code** (item 2).
- Each player has their own skills, and buys their own consumables.
- The getaway driver is shared: only one player buys him.
- Open questions: is the cash shared or per player? How is the take split? Who chooses the job from the board (the host)?
