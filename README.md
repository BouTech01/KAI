# KAI - AI Chatbot Avatar

An interactive web-based chatbot with an animated 2D avatar that walks, talks, and thinks on your screen. KAI is powered by OpenAI's GPT-3.5 Turbo and provides engaging, conversational responses.

## Features

✨ **Animated Avatar**
- Multiple animation states: idle, walking, talking, thinking
- Smooth canvas-based animations
- Responsive avatar that reacts to interactions

💬 **Conversational AI**
- Powered by OpenAI's GPT-3.5 Turbo
- Maintains conversation context
- Personality-driven responses

🎨 **Beautiful UI**
- Modern, gradient design
- Responsive layout (desktop, tablet, mobile)
- Real-time message display
- Smooth animations and transitions

## Setup Instructions

### 1. Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- An OpenAI API key (get one at https://platform.openai.com/api-keys)

### 2. Clone the Repository
```bash
git clone https://github.com/BouTech01/KAI.git
cd KAI
```

### 3. Configure Your API Key

**Option A: Using `.env` file (Recommended for production)**
1. Create a `.env` file in the project root
2. Copy the contents of `.env.example`
3. Replace `sk-proj-your-api-key-here` with your actual OpenAI API key
4. Never commit `.env` to version control

**Option B: Using Browser Storage (For development)**
1. Open `index.html` in your browser
2. Open Developer Console (F12)
3. Paste this code:
   ```javascript
   localStorage.setItem('OPENAI_API_KEY', 'sk-proj-your-api-key-here')
   ```
4. Refresh the page

### 4. Run the Application

**Using a local server (recommended):**
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js
npx http-server

# Or using VS Code Live Server extension
# Right-click index.html > Open with Live Server
```

Then visit: `http://localhost:8000`

**Or simply:**
Open `index.html` directly in your browser (limited functionality without a local server)

## How to Use

1. **Type a message** in the chat input box
2. **Press Enter or click Send**
3. **Watch KAI respond** with animations and text
4. **Enjoy the conversation!**

## Avatar States

- **Idle**: Avatar bobs gently, waiting for input
- **Thinking**: Avatar tilts head and shows thinking bubbles
- **Talking**: Avatar's mouth moves and arms gesture
- **Walking**: Avatar moves energetically with swinging arms

## File Structure

```
KAI/
├── index.html          # Main HTML structure
├── style.css           # Styling and layout
├── script.js           # Chat logic and OpenAI integration
├── avatar.js           # Avatar animation class
├── config.js           # Configuration settings
├── .env.example        # Environment variables template
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## API Keys & Security

⚠️ **IMPORTANT**: Never commit your API key to version control!

1. Add `.env` to your `.gitignore` file
2. Never paste your API key directly in code
3. Use environment variables or secure configuration management
4. Rotate your API key if it's exposed

## Customization

### Change Avatar Appearance
Edit the `drawIdle()`, `drawWalking()`, `drawTalking()`, and `drawThinking()` methods in `avatar.js` to customize the avatar's look.

### Adjust AI Personality
Modify the `system` message in `script.js` (the `getAIResponse` function) to change KAI's personality and behavior.

### Modify Animation Speed
Edit `animationFrame` increments in `avatar.js` to speed up or slow down animations.

## Troubleshooting

### "API Key Error"
- Verify your API key is correct
- Check you have API credits available at https://platform.openai.com/account/billing/overview
- Ensure the key is properly loaded

### Avatar Not Animating
- Check browser console for errors (F12)
- Ensure JavaScript is enabled
- Try a different browser

### Chat Not Working
- Check your internet connection
- Verify API key configuration
- Check browser console for specific error messages

### CORS Errors
- This is expected when opening `index.html` directly
- Use a local server instead (see "Run the Application" section)

## Future Enhancements

- [ ] Voice input/output
- [ ] Multiple avatar skins
- [ ] Avatar movement around the screen
- [ ] Emoji reactions
- [ ] Conversation history saving
- [ ] Custom avatar builder
- [ ] Mobile app version
- [ ] Multiple language support

## Dependencies

- **OpenAI API**: For GPT-3.5 Turbo responses
- **HTML5 Canvas**: For avatar rendering
- No external npm packages required!

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Contributing

Want to improve KAI? Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

Have questions or issues? 
- Check the Troubleshooting section
- Review the code comments
- Open an issue on GitHub

---

**Made with ❤️ by BouTech01**

Enjoy chatting with KAI! 🤖✨