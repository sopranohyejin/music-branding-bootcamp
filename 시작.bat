@echo off
chcp 65001 > nul
echo.
echo  ===================================
echo   음악인 브랜딩 부트캠프 개발 서버
echo  ===================================
echo.
echo  서버 시작 중... (약 5초 후 브라우저 자동 오픈)
echo.

:: 개발 서버를 새 창에서 시작
start "음악인 부트캠프 서버" cmd /k "cd /d "%~dp0" && npm run dev"

:: 서버가 뜰 때까지 대기
timeout /t 5 /nobreak > nul

:: 브라우저 열기
start "" "http://localhost:3000/branding-bootcamp?participantId=p001"

echo  브라우저가 열렸습니다!
echo  주소: http://localhost:3000/branding-bootcamp?participantId=p001
echo.
echo  서버를 종료하려면 "음악인 부트캠프 서버" 창을 닫으세요.
timeout /t 3 /nobreak > nul
