cd server\dist
xcopy ..\..\client\.tmp\concat /E
cd ..
firebase deploy
pause