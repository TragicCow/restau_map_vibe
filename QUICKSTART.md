# 🚀 QUICK START GUIDE

## Step 1: Open PowerShell in this folder

## Step 2: Run ONE command:

```powershell
.\start.ps1
```

## Step 3: Open your browser to:
```
http://localhost:3000
```

## That's it! 🎉

---

## Alternative: Using Docker Compose

```powershell
.\compose.ps1 up
```

---

## Useful Commands

### Start the app:
```powershell
.\start.ps1
# or
.\compose.ps1 up
```

### Stop the app:
```powershell
.\stop.ps1
# or
.\compose.ps1 down
```

### View logs:
```powershell
docker logs -f restau-map-vibe
# or
.\compose.ps1 logs
```

### Rebuild after code changes:
```powershell
.\compose.ps1 rebuild
```

---

## First Time Using the App?

1. **Look at the map** - You'll see 2 sample restaurants
2. **Click a red marker** - Opens restaurant details
3. **Click the blue + button** - Add a new restaurant
4. **Click "Add Review"** - Rate and review a restaurant
5. **Click the list icon** - See all restaurants

---

## Troubleshooting

**"Docker is not running"**
- Open Docker Desktop first

**"Port 3000 already in use"**
- Edit `docker-compose.yml` and change `3000:80` to `8080:80`
- Then use `http://localhost:8080`

**"Map not loading"**
- Check your internet connection (map needs to load tiles)

---

## Demo Data

The app comes with 2 sample restaurants in NYC:
- **Bella Napoli** (Italian) - Times Square
- **Sushi Palace** (Japanese) - Park Ave

Feel free to add more or delete these!

---

Built with ❤️
