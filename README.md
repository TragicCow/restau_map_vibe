# 🍴 Restaurant Map Vibe

A beautiful, mobile-optimized restaurant discovery app with interactive maps, reviews, and ratings. Built for two users to share their favorite dining spots.

## ✨ Features

- 🗺️ **Interactive Mapbox Map** - Beautiful map interface with custom restaurant markers
- 📍 **Add Restaurants** - Add new restaurants with automatic geocoding
- ⭐ **Star Ratings** - Rate restaurants from 1-5 stars
- 💬 **Reviews** - Write and read detailed reviews
- 📱 **Mobile-First Design** - Optimized for mobile devices
- 🎨 **Modern UI** - Smooth animations and touch-friendly interface
- 🐳 **Dockerized** - Easy deployment with Docker

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Access the app:**
   Open your browser to `http://localhost:3000`

3. **Stop the app:**
   ```bash
   docker-compose down
   ```

### Manual Docker Build

```bash
# Build the image
docker build -t restau-map-vibe .

# Run the container
docker run -d -p 3000:80 --name restau-map restau-map-vibe

# Stop the container
docker stop restau-map
docker rm restau-map
```

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Mapbox GL JS** - Interactive maps
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Docker** - Containerization
- **Nginx** - Production web server

## 📦 Project Structure

```
restau_map_vibe/
├── src/
│   ├── components/
│   │   ├── Map.jsx              # Mapbox map with markers
│   │   ├── AddRestaurant.jsx    # Form to add restaurants
│   │   ├── RestaurantDetail.jsx # Bottom sheet with details
│   │   └── ReviewForm.jsx       # Star rating and review form
│   ├── App.jsx                  # Main app component
│   ├── data.js                  # Mock restaurant data
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── Dockerfile                   # Docker build instructions
├── docker-compose.yml           # Docker Compose config
├── nginx.conf                   # Nginx configuration
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
└── package.json                # Dependencies
```

## 🎯 How to Use

1. **View the Map** - See all restaurants marked on the map
2. **Click a Marker** - View restaurant details and reviews
3. **Add Restaurant** - Click the + button to add a new restaurant
4. **Write Review** - Click "Add Review" in the detail view
5. **List View** - Click the list icon to see all restaurants

## 🔧 Configuration

### Mapbox Token

The Mapbox token is already configured in the code. If you need to change it:

1. Get a token from [Mapbox](https://www.mapbox.com/)
2. Update the token in:
   - `src/components/Map.jsx`
   - `src/components/AddRestaurant.jsx`

### Port Configuration

To change the port, edit `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:80"  # Change YOUR_PORT
```

## 📱 Mobile Optimized

- Touch-friendly buttons and controls
- Bottom sheet modals for mobile UX
- Swipe gestures support
- Viewport optimized for small screens
- No horizontal scrolling

## 🚀 Deployment

The app is containerized and ready to deploy on any platform that supports Docker:

- **AWS ECS/EKS**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**
- **Heroku**
- **Your own server with Docker**

## 📝 Notes

- **Data Persistence**: Currently stores data in memory. Refresh will reset data.
- **Future Enhancements**: 
  - Add Firebase for persistence
  - Add user authentication
  - Add photo uploads
  - Add search and filters

## 📄 License

Private project for personal use.

---

Made with ❤️ for sharing restaurant adventures
