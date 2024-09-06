console.log("Script starting...");

function submitQuery() {
    console.log("submitQuery function called");
    const inputElement = document.getElementById('query');
    const messageArea = document.getElementById('response');
    
    if (!inputElement) {
        console.error("Input element with id 'query' not found");
        alert("Error: Input element not found. Please check the console for more details.");
        return;
    }

    if (!messageArea) {
        console.error("Message area with id 'response' not found");
        alert("Error: Message area not found. Please check the console for more details.");
        return;
    }

    const query = inputElement.value;

    if (query.trim() === '') {
        console.log("Empty query submitted");
        return;
    }

    console.log("Query submitted:", query);

    // Add user message
    addMessage('user', query);

    // Clear input
    inputElement.value = '';

    // Add loading message
    const loadingId = addMessage('assistant', 'Processing...');

    // Send query to the backend via POST request
    fetch('/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: query }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response from backend:", data);
        updateMessage(loadingId, data.response || 'No response from server');
    })
    .catch(error => {
        console.error('Error occurred during the fetch operation:', error);
        updateMessage(loadingId, 'Error processing your query.');
    });
}

function addMessage(sender, text) {
    const messageArea = document.getElementById('response');
    if (!messageArea) {
        console.error("Message area not found");
        return;
    }
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    const id = 'msg-' + Date.now();
    messageElement.id = id;

    // Create a structured layout for the message
    messageElement.innerHTML = `
        <div class="message-header">
            <span class="sender-name">${sender === 'user' ? 'You' : 'Assistant'}</span>
            <span class="timestamp">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="message-content">${formatText(text)}</div>
    `;

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
    return id;
}

function formatText(text) {
    // Split the text into paragraphs
    let paragraphs = text.split('\n\n');

    // Process each paragraph
    paragraphs = paragraphs.map(paragraph => {
        // Check if the paragraph is a numbered list
        if (/^\d+\.\s/.test(paragraph)) {
            // It's a numbered list, so we'll keep it as is
            return paragraph;
        }
        
        // Check if the paragraph is a bulleted list
        if (/^\*\s/.test(paragraph)) {
            // It's a bulleted list, so we'll keep it as is
            return paragraph;
        }

        // For other paragraphs, we'll split them into sentences
        let sentences = paragraph.split('. ');
        sentences = sentences.map(sentence => sentence.trim() + '.');
        return sentences.join('<br>');
    });

    // Join the processed paragraphs
    text = paragraphs.join('<br><br>');

    // Convert URLs to clickable links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

    // Convert markdown-style bold to HTML bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert markdown-style italic to HTML italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    return text;
}

// The rest of the JavaScript code remains the same

function updateMessage(id, text) {
    const messageElement = document.getElementById(id);
    if (messageElement) {
        const contentElement = messageElement.querySelector('.message-content');
        if (contentElement) {
            contentElement.innerHTML = formatText(text);
        } else {
            console.error(`Content element not found in message ${id}`);
        }
    } else {
        console.error(`Message element with id ${id} not found`);
    }
}

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    const inputElement = document.getElementById('query');
    const submitButton = document.querySelector('button');

    if (inputElement) {
        console.log("Input element found, attaching event listener");
        inputElement.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitQuery();
            }
        });
    } else {
        console.error("Input element with id 'query' not found for event listener");
    }

    if (submitButton) {
        console.log("Submit button found, attaching click event listener");
        submitButton.addEventListener('click', submitQuery);
    } else {
        console.error("Submit button not found");
    }
});

console.log("Script loaded");