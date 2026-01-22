// ===================================
// Admin Authentication
// ===================================
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

let isLoggedIn = false;
let currentEditingId = null;
let deleteTargetId = null;

// ===================================
// Initialize Admin Panel
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupLoginForm();
    setupAdminEventListeners();
});

// ===================================
// Authentication Functions
// ===================================
function checkAuthStatus() {
    const authToken = sessionStorage.getItem('admin_auth');
    if (authToken === 'authenticated') {
        isLoggedIn = true;
        showDashboard();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadDashboardData();
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            sessionStorage.setItem('admin_auth', 'authenticated');
            isLoggedIn = true;
            errorDiv.classList.remove('show');
            showDashboard();
        } else {
            errorDiv.textContent = '❌ Invalid username or password';
            errorDiv.classList.add('show');
        }
    });
}

function logout() {
    sessionStorage.removeItem('admin_auth');
    isLoggedIn = false;
    showLoginScreen();
    document.getElementById('loginForm').reset();
}

// ===================================
// Dashboard Data Loading
// ===================================
function loadDashboardData() {
    const places = getPlacesData();

    // Update statistics
    document.getElementById('totalPlaces').textContent = places.length;
    document.getElementById('totalCafes').textContent = places.filter(p => p.category === 'cafe').length;
    document.getElementById('totalLakes').textContent = places.filter(p => p.category === 'lake').length;
    document.getElementById('totalMuseums').textContent = places.filter(p => p.category === 'museum').length;

    // Render places table
    renderPlacesTable(places);
}

function getPlacesData() {
    const storedPlaces = localStorage.getItem('mysore_places');
    return storedPlaces ? JSON.parse(storedPlaces) : [];
}

function savePlacesData(places) {
    localStorage.setItem('mysore_places', JSON.stringify(places));
}

// ===================================
// Places Table Rendering
// ===================================
function renderPlacesTable(places = null) {
    const placesData = places || getPlacesData();
    const tbody = document.getElementById('placesTableBody');

    if (placesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--color-text-muted);">No places added yet. Click "Add New Place" to get started.</td></tr>';
        return;
    }

    tbody.innerHTML = placesData.map(place => `
        <tr>
            <td>
                <strong style="color: var(--color-text-primary);">${place.name}</strong>
            </td>
            <td>
                <span class="category-badge">
                    ${getCategoryIcon(place.category)} ${capitalizeFirst(place.category)}
                </span>
            </td>
            <td>
                <span class="rating-badge">⭐ ${place.rating}</span>
            </td>
            <td>
                <span class="location-text">${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="editPlace(${place.id})" title="Edit">
                        ✏️ Edit
                    </button>
                    <button class="btn-icon delete" onclick="confirmDelete(${place.id}, '${place.name.replace(/'/g, "\\'")}')" title="Delete">
                        🗑️ Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===================================
// Search Functionality
// ===================================
function setupSearchFilter() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const places = getPlacesData();

        const filtered = places.filter(place =>
            place.name.toLowerCase().includes(searchTerm) ||
            place.category.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm)
        );

        renderPlacesTable(filtered);
    });
}

// ===================================
// Add/Edit Place Functions
// ===================================
function openAddPlaceModal() {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Place';
    document.getElementById('placeForm').reset();
    document.getElementById('placeId').value = '';
    document.getElementById('placeModal').classList.add('show');
}

function editPlace(id) {
    const places = getPlacesData();
    const place = places.find(p => p.id === id);

    if (!place) return;

    currentEditingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Place';
    document.getElementById('placeId').value = place.id;
    document.getElementById('placeName').value = place.name;
    document.getElementById('placeCategory').value = place.category;
    document.getElementById('placeDescription').value = place.description;
    document.getElementById('placeLat').value = place.lat;
    document.getElementById('placeLng').value = place.lng;
    document.getElementById('placeRating').value = place.rating;
    document.getElementById('placeImage').value = place.image || '';
    document.getElementById('placeHighlights').value = place.highlights ? place.highlights.join(', ') : '';

    document.getElementById('placeModal').classList.add('show');
}

function closeModal() {
    document.getElementById('placeModal').classList.remove('show');
    currentEditingId = null;
}

function savePlaceForm(e) {
    e.preventDefault();

    const places = getPlacesData();
    const formData = {
        name: document.getElementById('placeName').value,
        category: document.getElementById('placeCategory').value,
        description: document.getElementById('placeDescription').value,
        lat: parseFloat(document.getElementById('placeLat').value),
        lng: parseFloat(document.getElementById('placeLng').value),
        rating: parseFloat(document.getElementById('placeRating').value),
        image: document.getElementById('placeImage').value || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        highlights: document.getElementById('placeHighlights').value
            .split(',')
            .map(h => h.trim())
            .filter(h => h.length > 0)
    };

    if (currentEditingId) {
        // Update existing place
        const index = places.findIndex(p => p.id === currentEditingId);
        if (index !== -1) {
            places[index] = { ...places[index], ...formData };
        }
    } else {
        // Add new place
        const newId = places.length > 0 ? Math.max(...places.map(p => p.id)) + 1 : 1;
        places.push({ id: newId, ...formData });
    }

    savePlacesData(places);
    loadDashboardData();
    closeModal();
}

// ===================================
// Delete Functions
// ===================================
function confirmDelete(id, name) {
    deleteTargetId = id;
    document.getElementById('deletePlaceName').textContent = name;
    document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    deleteTargetId = null;
}

function executeDelete() {
    if (!deleteTargetId) return;

    const places = getPlacesData();
    const filtered = places.filter(p => p.id !== deleteTargetId);

    savePlacesData(filtered);
    loadDashboardData();
    closeDeleteModal();
}

// ===================================
// Event Listeners Setup
// ===================================
function setupAdminEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Add place button
    document.getElementById('addPlaceBtn').addEventListener('click', openAddPlaceModal);

    // Modal close buttons
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);

    // Delete modal buttons
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', executeDelete);

    // Place form submit
    document.getElementById('placeForm').addEventListener('submit', savePlaceForm);

    // Search filter
    setupSearchFilter();

    // Close modals on outside click
    document.getElementById('placeModal').addEventListener('click', (e) => {
        if (e.target.id === 'placeModal') {
            closeModal();
        }
    });

    document.getElementById('deleteModal').addEventListener('click', (e) => {
        if (e.target.id === 'deleteModal') {
            closeDeleteModal();
        }
    });
}

// ===================================
// Utility Functions
// ===================================
function getCategoryIcon(category) {
    const icons = {
        cafe: '☕',
        lake: '🌊',
        viewpoint: '🏔️',
        museum: '🏛️',
        park: '🌳',
        heritage: '🏰'
    };
    return icons[category] || '📍';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
