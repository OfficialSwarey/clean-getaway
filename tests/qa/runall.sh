#!/bin/bash
# Runs every regression test against tests/test.html (build it first: python3 tools/make_test.py).
# One line per test: exit code, page errors, timeouts. Details land in tests/qa/<name>.txt.
cd "$(dirname "$0")/.."
for t in logic logic2 logic3 logic4 logic5 logic6 logic7 logic8 logic9 logic10 logic11 casino1 casino2 club1 club2 club3 eng1 jw2 jw4 jwd manor1 manor2 manor3 manor4 money1 money2 money3 port3 soak tw2 tw3 tw4 tw5 tw6 uiqa win2 win3 wo2 doorwalk car2 coin1 pad1 mob2 mob3 sk1; do
  timeout 700 node $t.js > qa/$t.txt 2>&1
  echo "$t exit=$? pageerr=$(grep -c PAGEERR qa/$t.txt) timeout=$(grep -c TimeoutError qa/$t.txt)"
done
