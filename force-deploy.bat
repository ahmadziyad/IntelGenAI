@echo off
echo Force deploying Ahmad Ziyad Portfolio to Vercel (fresh build)...
echo.

echo Step 1: Cleaning all caches and builds...
cd packages\frontend
if exist build rmdir /s /q build
if exist node_modules\.cache rmdir /s /q node_modules\.cache
cd ..\..

echo.
echo Step 2: Installing dependencies fresh...
call npm install --force
if %errorlevel% neq 0 (
    echo Install failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo Step 3: Building frontend fresh...
call npm run build:frontend
if %errorlevel% neq 0 (
    echo Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo Step 4: Force deploying to Vercel (ignoring cache)...
call vercel --prod --force
if %errorlevel% neq 0 (
    echo Deployment failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo ✅ Force deployment completed successfully!
echo Your portfolio should now be updated with the latest changes.
echo.
echo If you still see the error, it might be:
echo 1. Browser cache - try hard refresh (Ctrl+F5)
echo 2. Vercel edge cache - wait 5-10 minutes for propagation
echo 3. Different branch deployed - check Vercel dashboard
pause