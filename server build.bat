cd server
rmdir dist /Q /S
cd ../client
rmdir .tmp /S  /Q
grunt build
pause
cd ../server/dist
pause
xcopy ..\..\client\.tmp\concat /E
pause
cd ..
firebase deploy
pause