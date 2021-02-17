#!/bin/bash

git diff-files --quiet
DIRTY_CODE=$?

if [[ $DIRTY_CODE -ne 0 ]]; then
  echo "YOU HAVE UNCOMMITTED CODE, PLEASE STASH CHANGES OR ADD FILES"
  exit 1;
fi

# npm run lint && npm run test
npm run build
CODE=$?

if [[ $CODE -ne 0 ]]; then
  echo "---MAKE SURE YOU ADDED ALL YOUR FILES BEFORE COMMITTING---"
fi

exit $CODE
