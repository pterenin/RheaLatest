@echo off

git diff-files --quiet
if errorlevel 1 (
  echo "YOU HAVE UNCOMMITTED CODE, PLEASE STASH CHANGES OR ADD FILES"
  exit /b %errorlevel%
)

npm run build
if errorlevel 1 (
  echo "---MAKE SURE YOU ADDED ALL YOUR FILES BEFORE COMMITTING---"
  exit /b %errorlevel%
)
