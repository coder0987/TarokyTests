if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Deployment successful!
    echo.
    echo Checking deployment status...
    kubectl get all -n taroky-namespace
) else (
    echo.
    echo ❌ Deployment failed with error code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

pauseREM ===============================================================
REM deploy.bat - Enhanced deployment script with environment variables
REM ===============================================================
@echo off
setlocal enabledelayedexpansion

echo Deploying Room application to Kubernetes...
cd /d "%~dp0"

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo Please copy .env.example to .env and configure your variables
    pause
    exit /b 1
)

echo Loading environment variables from .env file...

REM Load environment variables from .env file
for /f "usebackq tokens=1,2 delims==" %%i in (.env) do (
    REM Skip lines that start with # (comments) or are empty
    echo %%i | findstr /r "^#" >nul
    if errorlevel 1 (
        if not "%%i"=="" (
            set %%i=%%j
            echo   Loaded: %%i
        )
    )
)

echo.
echo Applying Kubernetes manifests with environment substitution...

REM Apply files that don't need templating first
kubectl apply -f namespace.yaml
kubectl apply -f rbac.yaml

REM Apply deployment files with environment variable substitution using PowerShell
powershell -Command "& { $ErrorActionPreference='Stop'; try { (Get-Content 'nginx-deployment.yaml' -Raw) -replace 'jamesqm1/nginx:latest', $env:NGINX_IMAGE | kubectl apply -f - } catch { Write-Host 'Error processing nginx-deployment.yaml'; exit 1 } }"

powershell -Command "& { $ErrorActionPreference='Stop'; try { (Get-Content 'server-deployment.yaml' -Raw) -replace 'your-server-image:latest', $env:SERVER_IMAGE | kubectl apply -f - } catch { Write-Host 'Error processing server-deployment.yaml'; exit 1 } }"

powershell -Command "& { $ErrorActionPreference='Stop'; try { (Get-Content 'manager-deployment.yaml' -Raw) -replace 'your-manager-image:latest', $env:MANAGER_IMAGE | kubectl apply -f - } catch { Write-Host 'Error processing manager-deployment.yaml'; exit 1 } }"

powershell -Command "& { $ErrorActionPreference='Stop'; try { (Get-Content 'redis-deployment.yaml' -Raw) -replace 'redis:latest', $env:REDIS_IMAGE | kubectl apply -f - } catch { Write-Host 'Error processing redis-deployment.yaml'; exit 1 } }"

REM Apply service files (these typically don't need environment variables)
kubectl apply -f nginx-service.yaml
kubectl apply -f server-service.yaml
kubectl apply -f redis-service.yaml