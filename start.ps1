# Restaurant Map Vibe - Quick Start Script

Write-Host "🍴 Restaurant Map Vibe - Building Docker Image..." -ForegroundColor Cyan
Write-Host ""

# Build the Docker image
Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
docker build -t restau-map-vibe .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker image built successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Check if container is already running
    $existing = docker ps -a --filter "name=restau-map-vibe" --format "{{.Names}}"
    
    if ($existing) {
        Write-Host "🔄 Stopping and removing existing container..." -ForegroundColor Yellow
        docker stop restau-map-vibe
        docker rm restau-map-vibe
    }
    
    # Run the container
    Write-Host "🚀 Starting container..." -ForegroundColor Yellow
    docker run -d -p 0.0.0.0:3000:80 --name restau-map-vibe restau-map-vibe
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ SUCCESS! App is running!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Access on this computer: http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        
        # Get local IP address
        $localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress
        
        if ($localIP) {
            Write-Host "📱 Access from mobile device on same WiFi:" -ForegroundColor Green
            Write-Host "   http://${localIP}:3000" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "💡 Make sure your phone is on the same WiFi network!" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "📝 Useful commands:" -ForegroundColor Yellow
        Write-Host "   View logs:     docker logs -f restau-map-vibe"
        Write-Host "   Stop app:      docker stop restau-map-vibe"
        Write-Host "   Start app:     docker start restau-map-vibe"
        Write-Host "   Remove app:    docker rm -f restau-map-vibe"
        Write-Host ""
    } else {
        Write-Host "❌ Failed to start container" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Failed to build Docker image" -ForegroundColor Red
}
