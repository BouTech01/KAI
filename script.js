// Initialize avatar
const avatar = new Avatar('avatarCanvas');
avatar.startAnimation();

// DOM elements
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const avatarStatus = document.getElementById('avatarStatus');

// Conversation history for context
let conversationHistory = [];

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;

    // Display user message
    displayMessage(message, 'user');
    userInput.value = '';
    sendBtn.disabled = true;

    // Avatar reacts
    avatar.think(1500);
    avatarStatus.textContent = 'Thinking...';

    try {
        // Get response from OpenAI
        const response = await getAIResponse(message);
        
        // Add delay for more natural feel
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Avatar talks
        avatar.talk(response.length * 50);
        avatarStatus.textContent = 'Speaking...';
        
        // Display bot message
        displayMessage(response, 'bot');
        
        // Avatar randomly walks or returns to idle
        setTimeout(() => {
            if (Math.random() > 0.5) {
                avatar.walk(1500);
                avatarStatus.textContent = 'Walking...';
            } else {
                avatar.setState('idle');
                avatarStatus.textContent = 'Ready';
            }
        }, response.length * 50);
        
    } catch (error) {
        console.error('Error:', error);
        displayMessage('Sorry, I encountered an error. Please try again.', 'bot');
        avatar.setState('idle');
        avatarStatus.textContent = 'Ready';
    }
    
    sendBtn.disabled = false;
}

function displayMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getAIResponse(userMessage) {
    // Add user message to history
    conversationHistory.push({
        role: 'user',
        content: userMessage
    });

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are KAI, a friendly and helpful AI avatar assistant. Keep responses concise and engaging (under 100 words). Be personality-driven and conversational.'
                    },
                    ...conversationHistory
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API Error');
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;
        
        // Add assistant response to history
        conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

        return assistantMessage;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Initial animation
avatar.setState('idle');
avatarStatus.textContent = 'Ready';

// Optional: Make avatar walk on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        avatar.walk(2000);
        avatarStatus.textContent = 'Walking...';
    }, 500);
});