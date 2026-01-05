@echo off
echo Building and deploying Ahmad Ziyad Portfolio to Vercel...
echo.

echo Step 1: Building frontend...
call npm run build:frontend
if %errorlevel% neq 0 (
    echo Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo Step 2: Deploying to Vercel...
call vercel --prod
if %errorlevel% neq 0 (
    echo Deployment failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo ✅ Deployment completed successfully!
echo Your portfolio is now live on Vercel.
pause