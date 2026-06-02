// Configuration for KAI
const CONFIG = {
    // Add your OpenAI API key here
    // IMPORTANT: Store this in a .env file in production
    OPENAI_API_KEY: '', // Leave empty and add via .env
    
    // Avatar settings
    AVATAR: {
        size: 300,
        animationSpeed: 1
    },
    
    // Chat settings
    CHAT: {
        maxMessages: 100,
        messageTimeout: 5000
    }
};

// Load API key from environment if available
if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    // Try to load from localStorage (for development)
    const savedKey = localStorage.getItem('OPENAI_API_KEY');
    if (savedKey) {
        CONFIG.OPENAI_API_KEY = savedKey;
    }
}