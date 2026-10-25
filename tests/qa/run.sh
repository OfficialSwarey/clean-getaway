#!/bin/bash
# Runs the tests you name, e.g.  bash qa/run.sh coop1 manor2   (against tests/test.html: python3 tools/make_test.py first).
# One line per test: exit code, page errors, timeouts. Details land in tests/qa/<name>.txt.
cd "$(dirname "$0")/.."
for t in "$@"; do
  to=700;case $t in coop*) to=1800;; esac  # the co-op tests run two games at once
  timeout $to node $t.js > qa/$t.txt 2>&1
  echo "$t exit=$? pageerr=$(grep -c PAGEERR qa/$t.txt) timeout=$(grep -c TimeoutError qa/$t.txt)"
done
