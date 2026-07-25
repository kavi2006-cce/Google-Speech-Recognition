document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on dashboard
    if (!document.querySelector('.dashboard-container')) return;

    const startBtn = document.getElementById('startBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const status = document.getElementById('status');
    const resultBox = document.getElementById('result');
    const historyList = document.getElementById('historyList');
    const neuralOrb = document.getElementById('neuralOrb');

    let isListening = false;
    let recognition;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isListening = true;
            status.textContent = 'Listening... Speak now.';
            neuralOrb.classList.add('listening');
            resultBox.style.display = 'none';
        };

        recognition.onend = () => {
            isListening = false;
            status.textContent = 'Click the button below to wake assistant';
            neuralOrb.classList.remove('listening');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            processCommand(transcript);
        };

        recognition.onerror = (event) => {
            status.textContent = 'Error: ' + event.error;
            neuralOrb.classList.remove('listening');
            showResult('Could not understand. Please try again.', true);
        };
    } else {
        status.textContent = 'Speech recognition not supported in this browser';
        if (startBtn) startBtn.disabled = true;
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (recognition && !isListening) {
                recognition.start();
            } else if (isListening) {
                recognition.stop();
            }
        });
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to clear your command history?')) {
                try {
                    const response = await fetch('/clear_history', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const data = await response.json();
                    if (data.success) {
                        historyList.innerHTML = '<li class="empty-history" style="opacity:0.5; text-align:center;">History cleared</li>';
                    }
                } catch (error) {
                    console.error('Error clearing history:', error);
                }
            }
        });
    }

    async function processCommand(command) {
        showResult(`You said: "${command}"<br/>Thinking...`);
        let responseText = '';
        
        if (command.includes('youtube')) {
            responseText = 'Opening YouTube for you.';
            speak(responseText);
            window.open('https://www.youtube.com', '_blank');
        } else if (command.includes('google')) {
            responseText = 'Opening Google Search.';
            speak(responseText);
            window.open('https://www.google.com', '_blank');
        } else if (command.includes('hello') || command.includes('hi')) {
            responseText = 'Hello! How can I help you today?';
            speak(responseText);
        } else if (command.includes('time')) {
            responseText = 'The time is ' + new Date().toLocaleTimeString();
            speak(responseText);
        } else if (command.includes('date')) {
            responseText = 'Today is ' + new Date().toLocaleDateString();
            speak(responseText);
        } else if (command.startsWith('who is') || command.startsWith('what is') || command.includes('wiki')) {
            const query = command.replace('who is', '').replace('what is', '').replace('search wikipedia for', '').trim();
            if (query) {
                responseText = await fetchWikipedia(query);
            } else {
                responseText = "Please specify what you want to search on Wikipedia.";
            }
            speak(responseText);
        } else {
            responseText = "I'm not sure how to respond to that. Try asking 'who is' or 'what is' to search Wikipedia.";
            speak(responseText);
        }

        showResult(`You said: "${command}"<br/><br/><strong style="color:var(--success)">Assistant:</strong> ${responseText}`);
        saveToHistory(command, responseText);
    }

    async function fetchWikipedia(query) {
        try {
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (data.extract) {
                    return data.extract.split('. ')[0] + '.'; // Get the first sentence
                }
            }
            return `I couldn't find information about ${query} on Wikipedia.`;
        } catch (err) {
            return "There was an error reaching Wikipedia.";
        }
    }

    function showResult(htmlContent, isError = false) {
        resultBox.style.display = 'flex';
        resultBox.innerHTML = htmlContent;
        if (isError) {
            resultBox.style.borderColor = 'var(--danger)';
        } else {
            resultBox.style.borderColor = 'var(--glass-border)';
        }
    }

    function speak(text) {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel(); // Stop any previous speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            
            utterance.onstart = () => {
                neuralOrb.classList.add('speaking');
            };
            
            utterance.onend = () => {
                neuralOrb.classList.remove('speaking');
            };
            
            utterance.onerror = () => {
                neuralOrb.classList.remove('speaking');
            };

            speechSynthesis.speak(utterance);
        }
    }

    async function saveToHistory(command, response) {
        try {
            await fetch('/save_command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command, response })
            });
            addToHistory(command, response);
        } catch (error) {
            console.error('Error saving command:', error);
        }
    }

    function addToHistory(command, response) {
        const emptyMsg = historyList.querySelector('.empty-history');
        if (emptyMsg) emptyMsg.remove();
        
        const li = document.createElement('li');
        li.className = 'history-item';
        const now = new Date();
        li.innerHTML = `
            <span class="command">👤 "${command}"</span>
            <span class="response">🤖 ${response}</span>
            <span class="timestamp">${now.toLocaleString()}</span>
        `;
        historyList.insertBefore(li, historyList.firstChild);
    }

    // Load history on page load
    fetch('/history')
        .then(res => res.json())
        .then(data => {
            if (data.history && data.history.length > 0) {
                data.history.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'history-item';
                    li.innerHTML = `
                        <span class="command">👤 "${item.command}"</span>
                        <span class="response">🤖 ${item.response}</span>
                        <span class="timestamp">${item.timestamp}</span>
                    `;
                    historyList.appendChild(li);
                });
            } else {
                historyList.innerHTML = '<li class="empty-history" style="opacity:0.5; text-align:center;">No commands yet. Start speaking!</li>';
            }
        })
        .catch(err => {
            console.error('Error loading history:', err);
            historyList.innerHTML = '<li class="empty-history" style="opacity:0.5; color:var(--danger); text-align:center;">Could not load history</li>';
        });
});