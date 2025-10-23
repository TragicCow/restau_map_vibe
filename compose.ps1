# Restaurant Map Vibe - Docker Compose Quick Start

Write-Host "🍴 Restaurant Map Vibe - Docker Compose" -ForegroundColor Cyan
Write-Host ""

$action = $args[0]

if (-not $action) {
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\compose.ps1 up      # Start the app"
    Write-Host "  .\compose.ps1 down    # Stop the app"
    Write-Host "  .\compose.ps1 logs    # View logs"
    Write-Host "  .\compose.ps1 rebuild # Rebuild and restart"
    Write-Host ""
    exit
}

switch ($action) {
    "up" {
        Write-Host "🚀 Starting Restaurant Map Vibe..." -ForegroundColor Yellow
        docker-compose up -d
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ SUCCESS! App is running!" -ForegroundColor Green
            Write-Host "🌐 Open: http://localhost:3000" -ForegroundColor Cyan
            Write-Host ""
        }
    }
    "down" {
        Write-Host "🛑 Stopping Restaurant Map Vibe..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✅ Stopped!" -ForegroundColor Green
    }
    "logs" {
        Write-Host "📋 Showing logs (Ctrl+C to exit)..." -ForegroundColor Yellow
        docker-compose logs -f
    }
    "rebuild" {
        Write-Host "🔄 Rebuilding and restarting..." -ForegroundColor Yellow
        docker-compose down
        docker-compose build
        docker-compose up -d
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Rebuild complete!" -ForegroundColor Green
            Write-Host "🌐 Open: http://localhost:3000" -ForegroundColor Cyan
        }
    }
    default {
        Write-Host "❌ Unknown command: $action" -ForegroundColor Red
        Write-Host "Run .\compose.ps1 for usage" -ForegroundColor Yellow
    }
}
