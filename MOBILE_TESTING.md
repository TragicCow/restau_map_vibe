# 📱 Mobile Testing Guide

## How to Access the App from Your Phone

### Step 1: Make sure your phone and computer are on the SAME WiFi network

### Step 2: Start the app on your computer
```powershell
.\start.ps1
```

The script will automatically display your local IP address!

### Step 3: On your phone, open the browser and go to:
```
http://YOUR_IP_ADDRESS:3000
```

For example: `http://192.168.1.100:3000`

---

## Find Your Computer's IP Address Manually

### Windows (PowerShell):
```powershell
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (usually starts with 192.168.x.x or 10.x.x.x)

### Alternative - Quick command:
```powershell
(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress
```

---

## Troubleshooting

### ❌ "Can't access from phone"

**Check Windows Firewall:**

1. Open PowerShell as Administrator and run:
```powershell
New-NetFirewallRule -DisplayName "Docker Port 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

2. Or manually:
   - Open Windows Defender Firewall
   - Click "Advanced settings"
   - Click "Inbound Rules"
   - Click "New Rule..."
   - Select "Port" → Next
   - TCP, Specific ports: 3000 → Next
   - Allow the connection → Next
   - Check all (Domain, Private, Public) → Next
   - Name: "Restaurant Map App" → Finish

### ❌ "Page not loading"

- Make sure both devices are on the **same WiFi** (not mobile data!)
- Try pinging your computer from your phone using a network tool app
- Check if Docker container is actually running: `docker ps`
- Try accessing from computer first: `http://localhost:3000`

### ❌ "Connection refused"

- Restart the Docker container:
  ```powershell
  .\stop.ps1
  .\start.ps1
  ```

- Make sure the port binding includes `0.0.0.0`:
  ```powershell
  docker ps
  ```
  Should show: `0.0.0.0:3000->80/tcp`

---

## Quick Test

### On your computer:
```powershell
# See your IP
ipconfig

# Check if port is listening
netstat -an | findstr :3000
```

### On your phone:
1. Connect to same WiFi
2. Open Safari/Chrome
3. Type: `http://YOUR_IP:3000`
4. Bookmark it for easy access!

---

## Pro Tips

### Add to Home Screen (iOS)
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Now it works like a native app! 🎉

### Add to Home Screen (Android)
1. Open the app in Chrome
2. Tap the three dots menu
3. Tap "Add to Home Screen"
4. Done!

### Use Chrome DevTools for Mobile Debugging
1. On computer, open Chrome
2. Go to `chrome://inspect`
3. Connect phone via USB
4. Enable USB debugging on phone
5. Inspect the mobile browser!

---

## Security Note

⚠️ The app is only accessible on your local network (WiFi). It's not exposed to the internet unless you set up port forwarding on your router (not recommended for this demo).

---

## Example URLs

If your computer's local IP is `192.168.1.105`:

- **On computer**: `http://localhost:3000`
- **On phone**: `http://192.168.1.105:3000`
- **On tablet**: `http://192.168.1.105:3000`
- **On other computer**: `http://192.168.1.105:3000`

All devices must be on the same WiFi network!

---

Happy mobile testing! 📱✨
