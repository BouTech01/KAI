// Comprehensive list of time zones with cities
const timeZones = [
    // Popular Time Zones
    { city: 'London', country: 'United Kingdom', timezone: 'Europe/London', popular: true },
    { city: 'New York', country: 'USA', timezone: 'America/New_York', popular: true },
    { city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', popular: true },
    { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', popular: true },
    { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', popular: true },
    { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', popular: true },
    { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', popular: true },
    { city: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', popular: true },
    
    // Europe
    { city: 'Paris', country: 'France', timezone: 'Europe/Paris', popular: false },
    { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', popular: false },
    { city: 'Rome', country: 'Italy', timezone: 'Europe/Rome', popular: false },
    { city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', popular: false },
    { city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam', popular: false },
    { city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', popular: false },
    { city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul', popular: false },
    
    // Asia
    { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', popular: false },
    { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', popular: false },
    { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', popular: false },
    { city: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', popular: false },
    { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', popular: false },
    { city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', popular: false },
    { city: 'Taipei', country: 'Taiwan', timezone: 'Asia/Taipei', popular: false },
    { city: 'Manila', country: 'Philippines', timezone: 'Asia/Manila', popular: false },
    { city: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', popular: false },
    { city: 'Ho Chi Minh City', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', popular: false },
    
    // Americas
    { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', popular: false },
    { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', popular: false },
    { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', popular: false },
    { city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', popular: false },
    { city: 'Chicago', country: 'USA', timezone: 'America/Chicago', popular: false },
    { city: 'Denver', country: 'USA', timezone: 'America/Denver', popular: false },
    
    // Africa
    { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', popular: false },
    { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', popular: false },
    { city: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos', popular: false },
    { city: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi', popular: false },
    
    // Oceania
    { city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', popular: false },
    { city: 'Fiji', country: 'Fiji', timezone: 'Pacific/Fiji', popular: false },
];

// State Management
let allClocks = [...timeZones];
let favoriteClocks = JSON.parse(localStorage.getItem('favoriteClocks')) || [];
let currentFilter = 'all';
let currentSearch = '';

// DOM Elements
const clocksGrid = document.getElementById('clocksGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');

// Event Listeners
searchInput.addEventListener('input', handleSearch);
filterButtons.forEach(btn => {
    btn.addEventListener('click', handleFilter);
});

// Initialize
function init() {
    renderClocks();
    startClockUpdates();
}

// Render all clocks
function renderClocks() {
    clocksGrid.innerHTML = '';
    
    const filteredClocks = getFilteredClocks();
    
    if (filteredClocks.length === 0) {
        clocksGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🔍</div>
                <p>No time zones found matching your search or filter.</p>
            </div>
        `;
        return;
    }
    
    filteredClocks.forEach((tzData, index) => {
        const clockCard = createClockCard(tzData, index);
        clocksGrid.appendChild(clockCard);
    });
}

// Create individual clock card
function createClockCard(tzData, index) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    if (isFavorite(tzData)) {
        card.classList.add('favorite');
    }
    
    const isFav = isFavorite(tzData);
    
    card.innerHTML = `
        <button class="favorite-btn ${isFav ? 'favorited' : ''}" data-timezone="${tzData.timezone}" title="Add to favorites">
            ${isFav ? '⭐' : '☆'}
        </button>
        
        <div class="city-name">${tzData.city}</div>
        <div class="country">${tzData.country}</div>
        
        <!-- Analog Clock -->
        <div class="analog-clock" data-timezone="${tzData.timezone}">
            <div class="clock-center"></div>
            <div class="clock-hand hour-hand" data-type="hour"></div>
            <div class="clock-hand minute-hand" data-type="minute"></div>
            <div class="clock-hand second-hand" data-type="second"></div>
        </div>
        
        <!-- Digital Time -->
        <div class="digital-time" data-timezone="${tzData.timezone}">--:--:--</div>
        <div class="time-period" data-timezone="${tzData.timezone}">AM</div>
        
        <!-- Date and Timezone Info -->
        <div class="date-info" data-timezone="${tzData.timezone}">--</div>
        <div class="timezone-offset" data-timezone="${tzData.timezone}">UTC</div>
    `;
    
    // Add favorite button listener
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(tzData);
    });
    
    // Update clock immediately
    updateClockDisplay(card, tzData.timezone);
    
    return card;
}

// Update clock display for a specific timezone
function updateClockDisplay(card, timezone) {
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).formatToParts(now);
        
        let hours = 0, minutes = 0, seconds = 0;
        parts.forEach(part => {
            if (part.type === 'hour') hours = parseInt(part.value);
            if (part.type === 'minute') minutes = parseInt(part.value);
            if (part.type === 'second') seconds = parseInt(part.value);
        });
        
        // Update digital time
        const timeString = formatter.format(now);
        const [timeWithPeriod, dateString] = timeString.split(' ');
        const [period] = timeWithPeriod.split(' ').slice(-1);
        const [timePart] = timeWithPeriod.split(' ');
        
        const digitalDisplay = card.querySelector(`[data-timezone="${timezone}"]:nth-child(7)`);
        if (digitalDisplay) {
            digitalDisplay.textContent = timePart;
        }
        
        const periodDisplay = card.querySelector(`[data-timezone="${timezone}"]:nth-child(8)`);
        if (periodDisplay) {
            periodDisplay.textContent = period;
        }
        
        // Update date
        const dateDisplay = card.querySelector(`[data-timezone="${timezone}"]:nth-child(9)`);
        if (dateDisplay) {
            dateDisplay.textContent = dateString;
        }
        
        // Update timezone offset
        const offset = getTimezoneOffset(timezone);
        const offsetDisplay = card.querySelector(`[data-timezone="${timezone}"]:nth-child(10)`);
        if (offsetDisplay) {
            offsetDisplay.textContent = `UTC ${offset}`;
        }
        
        // Update analog clock
        updateAnalogClock(card, timezone, hours, minutes, seconds);
        
    } catch (error) {
        console.error(`Error updating clock for ${timezone}:`, error);
    }
}

// Update analog clock hands
function updateAnalogClock(card, timezone, hours, minutes, seconds) {
    const analogClock = card.querySelector(`[data-timezone="${timezone}"].analog-clock`);
    if (!analogClock) return;
    
    const hourHand = analogClock.querySelector('[data-type="hour"]');
    const minuteHand = analogClock.querySelector('[data-type="minute"]');
    const secondHand = analogClock.querySelector('[data-type="second"]');
    
    // Convert to 12-hour format for analog display
    const displayHours = hours % 12;
    
    // Calculate angles
    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = (minutes / 60) * 360 + (seconds / 60 / 60) * 360;
    const hourDegrees = (displayHours / 12) * 360 + (minutes / 60 / 12) * 360;
    
    if (hourHand) hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    if (minuteHand) minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
    if (secondHand) secondHand.style.transform = `rotate(${secondDegrees}deg)`;
}

// Get timezone offset
function getTimezoneOffset(timezone) {
    const now = new Date();
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    
    const offset = (tzDate - utcDate) / (1000 * 60 * 60);
    const sign = offset >= 0 ? '+' : '';
    return `${sign}${offset}:00`;
}

// Start updating clocks every second
function startClockUpdates() {
    setInterval(() => {
        const cards = document.querySelectorAll('.clock-card');
        cards.forEach(card => {
            const timezone = card.querySelector('[data-timezone]')?.getAttribute('data-timezone');
            if (timezone) {
                updateClockDisplay(card, timezone);
            }
        });
    }, 1000);
}

// Filter functionality
function handleFilter(e) {
    const filterValue = e.target.getAttribute('data-filter');
    currentFilter = filterValue;
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    renderClocks();
}

// Search functionality
function handleSearch(e) {
    currentSearch = e.target.value.toLowerCase().trim();
    renderClocks();
}

// Get filtered clocks based on current filter and search
function getFilteredClocks() {
    let filtered = [...allClocks];
    
    // Apply filter
    if (currentFilter === 'popular') {
        filtered = filtered.filter(tz => tz.popular);
    } else if (currentFilter === 'favorites') {
        filtered = filtered.filter(tz => isFavorite(tz));
    }
    
    // Apply search
    if (currentSearch) {
        filtered = filtered.filter(tz => 
            tz.city.toLowerCase().includes(currentSearch) ||
            tz.country.toLowerCase().includes(currentSearch) ||
            tz.timezone.toLowerCase().includes(currentSearch)
        );
    }
    
    return filtered;
}

// Favorite management
function toggleFavorite(tzData) {
    const index = favoriteClocks.findIndex(fav => fav.timezone === tzData.timezone);
    
    if (index > -1) {
        // Remove from favorites
        favoriteClocks.splice(index, 1);
    } else {
        // Add to favorites
        favoriteClocks.push(tzData);
    }
    
    // Save to localStorage
    localStorage.setItem('favoriteClocks', JSON.stringify(favoriteClocks));
    
    // Refresh display
    renderClocks();
}

function isFavorite(tzData) {
    return favoriteClocks.some(fav => fav.timezone === tzData.timezone);
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);