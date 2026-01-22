# Underrated Mysore 🏛️

A premium web application showcasing hidden gems and underrated locations in Mysore, India. Features an interactive map, category filters, and a stunning 3D Earth visualization.

## ✨ Features

### Current Version (Main Branch - V4)
- **Photorealistic 3D Earth Globe** with NASA satellite textures
- Interactive Leaflet map with location markers
- Category-based filtering system
- Responsive premium dark theme with glassmorphism
- Admin panel for content management
- Geolocation support

## 🎨 Available Versions

This repository contains 4 different frontend versions, each in its own branch:

### 🌍 Version 4: Realistic Earth Globe (main)
**Branch:** `main`
- Photorealistic rotating Earth with NASA textures
- Bump mapping for terrain relief
- Specular mapping for ocean shine
- Shader-based atmosphere glow
- 2000+ realistic stars

### 📍 Version 3: Location-Themed 3D (v3-location-themed)
**Branch:** `v3-location-themed`
- 6 floating location pins (pink/gold)
- 100 particle stars representing places
- Pulsing central sphere for Mysore city
- Symbolic exploration theme

### 🔷 Version 2: Premium Dark + Torus Knot (v2-torus-knot)
**Branch:** `v2-torus-knot`
- Abstract rotating torus knot
- Pink/gold gradient lighting
- Modern geometric aesthetic
- First 3D implementation

### 📌 Version 1: Original Functional Site (v1-original)
**Branch:** `v1-original`
- Pure functionality focus
- Blue/purple color scheme
- No 3D elements
- Classic design

## 🚀 Getting Started

### Prerequisites
- Modern web browser with WebGL support
- Local web server (optional, for testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jxvz01/underrated-mysore.git
cd underrated-mysore
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

3. Visit `http://localhost:8000`

### Switching Between Versions

To try different versions, switch branches:

```bash
# Version 4 (Realistic Earth)
git checkout main

# Version 3 (Location Pins)
git checkout v3-location-themed

# Version 2 (Torus Knot)
git checkout v2-torus-knot

# Version 1 (Original)
git checkout v1-original
```

## 📁 Project Structure

```
underrated-mysore/
├── index.html          # Main application page
├── styles.css          # Premium dark theme styles
├── script.js           # Map & interaction logic
├── admin.html          # Admin panel
├── admin-styles.css    # Admin panel styles
├── admin.js            # Admin functionality
├── places.json         # Places data
└── .gitignore          # Git ignore rules
```

## 🎯 Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics:** Three.js
- **Maps:** Leaflet.js
- **Fonts:** Google Fonts (Poppins, Inter, Outfit)
- **Textures:** NASA Earth Observatory

## 🎨 Design Features

- **Color Scheme:** Premium dark (#000000) with pink (#dd2476) and gold (#ffcc33) accents
- **UI Style:** Glassmorphism with backdrop blur
- **Animations:** Smooth CSS transitions and 3D WebGL rendering
- **Responsive:** Mobile-first design approach

## 🛠️ Admin Panel

Access the admin panel at `admin.html` to:
- Add new locations
- Edit existing places
- Update categories
- Manage content dynamically

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created by Shubha

## 🌟 Acknowledgments

- NASA Earth Observatory for satellite textures
- Three.js community for 3D graphics support
- Leaflet.js for interactive maps

