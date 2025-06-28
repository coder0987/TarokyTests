
REM ===============================================================
REM deploy.bat - Simple deployment script
REM ===============================================================
@echo off
echo Deploying Room application to Kubernetes...

cd /d "%~dp0"
kubectl apply -f ./ --recursive

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Deployment successful!
    echo.
    echo Checking deployment status...
    kubectl get all -n room
) else (
    echo.
    echo ❌ Deployment failed with error code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

pause