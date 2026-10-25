#!/bin/bash
# The quick check for every update (about 15-20 minutes): the core rules, one test per kind of job, the menus,
# the career and its economy, phone controls, police, and co-op. Add the tests for whatever you changed:
#   bash qa/quick.sh manor2 tw3
# The full suite (runall.sh) is for changes to code every job uses, and every few releases.
cd "$(dirname "$0")"
bash run.sh logic logic5 money1 econ1 menu1 hands1 police1 mob2 spin1 coopdet coop1 "$@"
