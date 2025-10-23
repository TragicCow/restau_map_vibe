# Restaurant Map Vibe - Stop Script

Write-Host "🛑 Stopping Restaurant Map Vibe..." -ForegroundColor Yellow

docker stop restau-map-vibe

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Container stopped successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Container may not be running" -ForegroundColor Yellow
}
