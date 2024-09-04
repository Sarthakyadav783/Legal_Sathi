// script.js
async function submitQuery() {
    const inputElement = document.getElementById('input-message');
    const messageArea = document.getElementById('message-area');

    if (!inputElement) {
        console.error("Input element not found");
        return;
    }

    if (!messageArea) {
        console.error("Message area not found");
        return;
    }

    const query = inputElement.value;

    if (query.trim() === '') return;

    // Add user message
    addMessage('user', query);

    // Clear input
    inputElement.value = '';

    // Add loading message
    const loadingId = addMessage('assistant', 'Processing...');

    try {
        console.log('Sending query:', query);
        const result = await fetch('/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: query })
        });
        console.log('Received response from server');
        const data = await result.json();
        console.log('Parsed response:', data);
        
        // Replace loading message with actual response
        updateMessage(loadingId, data.response);
    } catch (error) {
        console.error('Error:', error);
        // Replace loading message with error
        updateMessage(loadingId, 'Error: ' + error.message);
    }
}

function addMessage(sender, text) {
    const messageArea = document.getElementById('message-area');
    if (!messageArea) {
        console.error("Message area not found");
        return;
    }
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    messageElement.textContent = text;
    const id = 'msg-' + Date.now();
    messageElement.id = id;
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
    return id;
}

function updateMessage(id, text) {
    const messageElement = document.getElementById(id);
    if (messageElement) {
        messageElement.textContent = text;
    } else {
        console.error(`Message element with id ${id} not found`);
    }
}

// Add event listener for Enter key
document.addEventListener('DOMContentLoaded', (event) => {
    const inputElement = document.getElementById('input-message');
    if (inputElement) {
        inputElement.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitQuery();
            }
        });
    } else {
        console.error("Input element not found for event listener");
    }
});

console.log("Script loaded");
