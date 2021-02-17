@echo off

git diff-files --quiet
if errorlevel 1 (
  echo "YOU HAVE UNCOMMITTED CODE, PLEASE STASH CHANGES OR ADD FILES"
  exit /b %errorlevel%
)

npm run lint && npm run format:fix &&  npm run test:ci && npm run e2e:ci
if errorlevel 1 (
  echo "---MAKE SURE YOU ADDED ALL YOUR FILES BEFORE COMMITTING---"
  exit /b %errorlevel%
)
