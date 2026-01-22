// ===================================
// Sample Places Data
// ===================================
let placesData = [
    {
        id: 1,
        name: "Karanji Lake",
        category: "lake",
        description: "A serene lake with a butterfly park and aviary. Perfect for nature lovers and bird watching.",
        lat: 12.2882,
        lng: 76.6458,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        highlights: ["Butterfly Park", "Bird Watching", "Boating"]
    },
    {
        id: 2,
        name: "Folklore Museum",
        category: "museum",
        description: "A hidden gem showcasing Karnataka's rich cultural heritage and folk traditions.",
        lat: 12.3051,
        lng: 76.6553,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=400",
        highlights: ["Cultural Artifacts", "Traditional Art", "Historical Exhibits"]
    },
    {
        id: 3,
        name: "Chamundi Hill Viewpoint",
        category: "viewpoint",
        description: "Breathtaking panoramic views of Mysore city, especially stunning during sunrise and sunset.",
        lat: 12.2725,
        lng: 76.6727,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        highlights: ["Sunrise Views", "City Panorama", "Photography"]
    },
    {
        id: 4,
        name: "Depth N Green Cafe",
        category: "cafe",
        description: "Cozy cafe with excellent coffee and a peaceful ambiance, away from the tourist crowds.",
        lat: 12.3116,
        lng: 76.6394,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
        highlights: ["Specialty Coffee", "Quiet Ambiance", "Local Favorite"]
    },
    {
        id: 5,
        name: "Lingambudhi Lake",
        category: "lake",
        description: "Peaceful lake ideal for morning walks and watching migratory birds.",
        lat: 12.3373,
        lng: 76.6121,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400",
        highlights: ["Morning Walks", "Bird Sanctuary", "Peaceful"]
    },
    {
        id: 6,
        name: "Regional Museum of Natural History",
        category: "museum",
        description: "Interactive museum with fascinating exhibits on biodiversity and ecology.",
        lat: 12.3156,
        lng: 76.6394,
        rating: 4.1,
        image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400",
        highlights: ["Interactive Exhibits", "Educational", "Family Friendly"]
    }
];

// ===================================
// Global Variables
// ===================================
let map;
let markers = [];
let userLocation = null;
let currentFilter = 'all';
let currentSort = 'name';

// ===================================
// Category Icons & Colors
// ===================================
const categoryConfig = {
    cafe: { icon: '☕', color: '#f59e0b' },
    lake: { icon: '🌊', color: '#06b6d4' },
    viewpoint: { icon: '🏔️', color: '#8b5cf6' },
    museum: { icon: '🏛️', color: '#ec4899' },
    park: { icon: '🌳', color: '#10b981' },
    heritage: { icon: '🏰', color: '#f97316' }
};

// ===================================
// Initialize Application
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    loadPlacesFromStorage();
    renderPlaces();
    setupEventListeners();
    checkLocationPermission();
});

// ===================================
// Load Places from localStorage
// ===================================
function loadPlacesFromStorage() {
    const storedPlaces = localStorage.getItem('mysore_places');
    if (storedPlaces) {
        placesData = JSON.parse(storedPlaces);
    } else {
        // Save sample data to localStorage
        savePlacesToStorage();
    }
}

function savePlacesToStorage() {
    localStorage.setItem('mysore_places', JSON.stringify(placesData));
}

// ===================================
// Initialize Leaflet Map
// ===================================
function initializeMap() {
    // Center on Mysore
    map = L.map('map').setView([12.2958, 76.6394], 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add markers for all places
    updateMapMarkers();
}

// ===================================
// Update Map Markers
// ===================================
function updateMapMarkers() {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Filter places based on current filter
    const filteredPlaces = getFilteredPlaces();
    
    // Add markers for filtered places
    filteredPlaces.forEach(place => {
        const config = categoryConfig[place.category];
        
        // Create custom icon
        const customIcon = L.divIcon({
            html: `<div style="background: ${config.color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">${config.icon}</div>`,
            className: 'custom-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        
        const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);
        
        // Create popup content
        const popupContent = `
            <div class="popup-content">
                <div class="popup-title">${place.name}</div>
                <div class="popup-category">${config.icon} ${capitalizeFirst(place.category)}</div>
                <div class="popup-description">${place.description}</div>
                <button class="popup-btn" onclick="getDirections(${place.lat}, ${place.lng})">Get Directions</button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
    });
    
    // Update place count
    document.getElementById('placeCount').textContent = `${filteredPlaces.length} place${filteredPlaces.length !== 1 ? 's' : ''}`;
}

// ===================================
// Render Places List
// ===================================
function renderPlaces() {
    const placesList = document.getElementById('placesList');
    const filteredPlaces = getFilteredPlaces();
    const sortedPlaces = sortPlaces(filteredPlaces);
    
    if (sortedPlaces.length === 0) {
        placesList.innerHTML = '<p style="text-align: center; color: var(--color-text-muted); padding: 2rem;">No places found in this category.</p>';
        return;
    }
    
    placesList.innerHTML = sortedPlaces.map(place => {
        const config = categoryConfig[place.category];
        const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, place.lat, place.lng) : null;
        const isNearby = distance && distance < 5; // Within 5km
        
        return `
            <div class="place-card ${isNearby ? 'nearby' : ''}" onclick="focusOnPlace(${place.lat}, ${place.lng})">
                <div class="place-header">
                    <div>
                        <div class="place-name">${place.name}</div>
                        <span class="place-category">${config.icon} ${capitalizeFirst(place.category)}</span>
                    </div>
                    <div class="place-rating">
                        ⭐ ${place.rating}
                    </div>
                </div>
                <p class="place-description">${place.description}</p>
                <div class="place-meta">
                    ${distance ? `<div class="place-meta-item">📍 ${distance.toFixed(1)} km away</div>` : ''}
                    ${place.highlights ? `<div class="place-meta-item">✨ ${place.highlights.join(', ')}</div>` : ''}
                </div>
                <div class="place-actions">
                    <button class="btn-action" onclick="event.stopPropagation(); getDirections(${place.lat}, ${place.lng})">
                        🧭 Get Directions
                    </button>
                    <button class="btn-action" onclick="event.stopPropagation(); focusOnPlace(${place.lat}, ${place.lng})">
                        🗺️ Show on Map
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ===================================
// Filter & Sort Functions
// ===================================
function getFilteredPlaces() {
    if (currentFilter === 'all') {
        return placesData;
    }
    return placesData.filter(place => place.category === currentFilter);
}

function sortPlaces(places) {
    const sorted = [...places];
    
    switch (currentSort) {
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'distance':
            if (userLocation) {
                sorted.sort((a, b) => {
                    const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
                    const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
                    return distA - distB;
                });
            }
            break;
    }
    
    return sorted;
}

// ===================================
// Event Listeners
// ===================================
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            updateMapMarkers();
            renderPlaces();
        });
    });
    
    // Sort select
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderPlaces();
    });
    
    // Location buttons
    document.getElementById('enableLocationBtn').addEventListener('click', requestLocation);
    document.getElementById('dismissLocationBtn').addEventListener('click', () => {
        document.getElementById('locationBanner').classList.remove('show');
    });
}

// ===================================
// Geolocation Functions
// ===================================
function checkLocationPermission() {
    if ('geolocation' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
            if (result.state === 'prompt') {
                document.getElementById('locationBanner').classList.add('show');
            } else if (result.state === 'granted') {
                requestLocation();
            }
        });
    }
}

function requestLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Add user location marker
                const userIcon = L.divIcon({
                    html: '<div style="background: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);"></div>',
                    className: 'user-marker',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });
                
                L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                    .addTo(map)
                    .bindPopup('You are here')
                    .openPopup();
                
                document.getElementById('locationBanner').classList.remove('show');
                renderPlaces();
            },
            (error) => {
                console.error('Error getting location:', error);
            }
        );
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// ===================================
// Map Interaction Functions
// ===================================
function focusOnPlace(lat, lng) {
    map.setView([lat, lng], 15);
    
    // Find and open the marker's popup
    markers.forEach(marker => {
        const markerLatLng = marker.getLatLng();
        if (markerLatLng.lat === lat && markerLatLng.lng === lng) {
            marker.openPopup();
        }
    });
}

function getDirections(lat, lng) {
    // Open OpenStreetMap directions in new tab
    const url = `https://www.openstreetmap.org/directions?from=&to=${lat},${lng}`;
    window.open(url, '_blank');
}

// ===================================
// Utility Functions
// ===================================
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
