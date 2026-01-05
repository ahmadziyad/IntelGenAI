@echo off
echo Building and deploying Ahmad Ziyad Portfolio to Vercel...
echo.

echo Step 1: Installing dependencies with legacy peer deps...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Install failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo Step 2: Building frontend...
call npm run build:frontend
if %errorlevel% neq 0 (
    echo Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo Step 3: Deploying to Vercel...
call vercel --prod
if %errorlevel% neq 0 (
    echo Deployment failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo ✅ Deployment completed successfully!
echo Your portfolio is now live on Vercel.
echo.
echo Note: Some npm warnings about deprecated packages are normal
echo and come from transitive dependencies in react-scripts.
pause