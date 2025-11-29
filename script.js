class XtronChat {
    constructor() {
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.quickBtns = document.querySelectorAll('.quick-btn');
        this.promptsBtn = document.getElementById('promptsBtn');
        this.promptsDropdown = document.getElementById('promptsDropdown');
        
        this.promptsList = {
           
            "Database Queries": {
                "Number of ROR": "query for number of ror",
                "Number of Plots": "query for number of plots", 
                "View Records": "query to view records",
                "Records with LGD": "query to view records with lgd code",
                "Single/Joint Ownership": "query to view single n joint",
                "Single/Joint Count": "query to view single n joint as count",
                "Top 10 Less Plots": "query to view top 10 less plots",
                "Check Duplicate ROR": "query to check duplicate ror"
            },
            "Excel & Tools": {
                "Excel Ownership Formula": "excel formula single or joint"
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupPromptsDropdown();
        this.showWelcomeMessage();
    }
    
    setupEventListeners() {
        // Send message on button click
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Quick action buttons
        this.quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.messageInput.value = message;
                this.sendMessage();
            });
        });
        
        // Prompts dropdown
        this.promptsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.promptsDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.promptsDropdown.classList.remove('show');
        });
        
        // Header buttons
        document.getElementById('expand-btn').addEventListener('click', () => {
            document.body.requestFullscreen?.().catch(console.log);
        });
        
        document.getElementById('close-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to close the chat?')) {
                window.close();
            }
        });
        
        // Auto-focus input
        this.messageInput.focus();
    }
    
    setupPromptsDropdown() {
        let dropdownHTML = '';
        
        for (const [category, prompts] of Object.entries(this.promptsList)) {
            dropdownHTML += `
                <div class="dropdown-section">
                    <h4>${category}</h4>
                    ${Object.entries(prompts).map(([name, prompt]) => `
                        <button class="prompt-item" data-prompt="${prompt}">${name}</button>
                    `).join('')}
                </div>
            `;
        }
        
        this.promptsDropdown.innerHTML = dropdownHTML;
        
        // Add event listeners to prompt items
        this.promptsDropdown.querySelectorAll('.prompt-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const prompt = e.target.getAttribute('data-prompt');
                this.messageInput.value = prompt;
                this.sendMessage();
                this.promptsDropdown.classList.remove('show');
            });
        });
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        // Simulate typing indicator
        this.showTypingIndicator();
        
        // Get bot response after delay
        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.getBotResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = this.getCurrentTime();
        
        // For bot messages, check if it's an actual response (not default)
        if (sender === 'bot') {
            const isActualResponse = this.isActualResponse(text);
            const messageClass = isActualResponse ? 'actual-response' : '';
            
            messageDiv.innerHTML = `
                <div class="message-text ${messageClass}">${this.escapeHtml(text)}</div>
                <div class="message-time">${time}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-text">${this.escapeHtml(text)}</div>
                <div class="message-time">${time}</div>
            `;
        }
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    isActualResponse(text) {
        // List of default responses that should NOT be bold
        const defaultResponses = [
            "That's interesting! Tell me more about that.",
            "I understand. How can I assist you further?",
            "Thanks for sharing that with me!",
            "I'm here to help! What would you like to know?",
            "That's a great point! Is there anything specific you'd like to discuss?",
            "I appreciate your message. How can I be of service?",
            "Fascinating! What else is on your mind?",
            "Hello there! 👋 I'm Xtron, your personal assistant. How can I help you today?",
            "I can help you with various tasks! Try asking me about:",
            "I'm functioning perfectly! Ready to assist you with whatever you need. 😊",
            "I'd love to give you weather information, but I'm currently operating offline.",
            "Here's what I can do:",
            "Goodbye! 👋 It was great chatting with you. Come back anytime!",
            "You're welcome! 😊 Is there anything else I can help you with?"
        ];
        
        // If the response is NOT in default responses, it's an actual response
        return !defaultResponses.some(defaultResponse => 
            text.includes(defaultResponse) || defaultResponse.includes(text)
        );
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message bot-message';
        typingDiv.innerHTML = `
            <div class="message-text">
                <i class="fas fa-ellipsis-h"></i> Xtron is typing...
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    getBotResponse(userMessage) {
        const message = userMessage.toLowerCase().trim();
        
        // ==================== BHUNAKSA LOGIN CREDENTIALS ====================
        if (message.includes('bhunaksa login for gangtok') || message.includes('gangtok login')) {
            return "🔐 Gangtok Bhunaksa Login:\n• Username: rs_gtk\n• Password: rs@gtk";
        }
        
        if (message.includes('bhunaksa login for gyalshing') || message.includes('gyalshing login')) {
            return "🔐 Gyalshing Bhunaksa Login:\n• Username: rs_gey\n• Password: rs@gey";
        }
        
        if (message.includes('bhunaksa login for namchi') || message.includes('namchi login')) {
            return "🔐 Namchi Bhunaksa Login:\n• Username: rs_namchi\n• Password: rs@namchi";
        }
        
        if (message.includes('bhunaksa login for mangan') || message.includes('mangan login')) {
            return "🔐 Mangan Bhunaksa Login:\n• Username: rs_mangan\n• Password: rs@mangan";
        }
        
        if (message.includes('bhunaksa login for pakyong') || message.includes('pakyong login')) {
            return "🔐 Pakyong Bhunaksa Login:\n• Username: rs_paky\n• Password: rs@paky";
        }
        
        if (message.includes('bhunaksa login for soreng') || message.includes('soreng login')) {
            return "🔐 Soreng Bhunaksa Login:\n• Username: rs_soreng\n• Password: rs@soreng";
        }
        
        // ==================== DATABASE QUERIES ====================
        if (message.includes('query for number of ror') || message.includes('ror count') || message.includes('total ror')) {
            return "📊 Query for Number of ROR:\n\nSELECT count(distinct a.KhatiyanNo), d.LocationName\nFROM lr_Khatiyan as a \nINNER JOIN lr_Khasra as b ON a.LocationCode=b.LocationCode AND a.KhatiyanNo=b.KhatiyanNo\nINNER JOIN c_lr_Location as d ON a.LocationCode=d.LocationCode\nWHERE (b.Mflag is null or b.mflag='N')\nGROUP BY d.LocationName";
        }
        
        if (message.includes('query for number of plots') || message.includes('plot count') || message.includes('total plots')) {
            return "📈 Query for Number of Plots:\n\nSELECT \n    d.LocationName,\n    COUNT(DISTINCT b.KhasraNumber) AS TotalPlots\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode \n    AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d\n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N')\nGROUP BY d.LocationName\nORDER BY d.LocationName;";
        }
        
        if (message.includes('query to view records') || message.includes('view all records') || message.includes('show records')) {
            return "👁️ Query to View Records:\n\nSELECT *\nFROM lr_Khatiyan a \nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N') AND\n\n*Note: Add your specific WHERE conditions at the end*";
        }
        
        if (message.includes('query to view records with lgd code') || message.includes('lgd code records')) {
            return "🏷️ Query to View Records with LGD Code:\n\nSELECT *\nFROM lr_Khatiyan a \nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nINNER JOIN SC_LGD_MASTER lgd\n    ON a.LocationCode = lgd.LocationCode\nWHERE b.Mflag IS NULL OR b.Mflag = 'N';";
        }
        
        if (message.includes('query to view single n joint') || message.includes('single and joint ownership')) {
            return "👥 Query for Single/Joint Ownership:\n\nSELECT \n    a.OwnerName,\n    CASE \n        WHEN \n            a.OwnerName LIKE '%,%' OR \n            a.OwnerName LIKE '% र %' OR \n            a.OwnerName LIKE '% अनि %' OR \n            a.OwnerName LIKE '% तथा %' OR \n            a.OwnerName LIKE '%/%' OR \n            a.OwnerName LIKE '% संग %' OR \n            a.OwnerName LIKE '% एवं %'\n        THEN 'Joint'\n        ELSE 'Single'\n    END AS OwnershipType\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nWHERE b.Mflag IS NULL OR b.Mflag = 'N'";
        }
        
        if (message.includes('query to view single n joint as count') || message.includes('count single joint')) {
            return "📊 Query for Single/Joint Count:\n\nSELECT \n    CASE \n        WHEN \n            a.OwnerName LIKE '%,%' OR \n            a.OwnerName LIKE '% र %' OR \n            a.OwnerName LIKE '% अनि %' OR \n            a.OwnerName LIKE '% तथा %' OR \n            a.OwnerName LIKE '%/%' OR \n            a.OwnerName LIKE '% संग %' OR \n            a.OwnerName LIKE '% एवं %'\n        THEN 'Joint'\n        ELSE 'Single'\n    END AS OwnershipType,\n    COUNT(*) AS CountOfOwners\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N') AND (a.CasteCode != '1203' AND a.CasteCode NOT LIKE '40%')\nGROUP BY \n    CASE \n        WHEN \n            a.OwnerName LIKE '%,%' OR \n            a.OwnerName LIKE '% र %' OR \n            a.OwnerName LIKE '% अनि %' OR \n            a.OwnerName LIKE '% तथा %' OR \n            a.OwnerName LIKE '%/%' OR \n            a.OwnerName LIKE '% संग %' OR \n            a.OwnerName LIKE '% एवं %'\n        THEN 'Joint'\n        ELSE 'Single'\n    END;";
        }
        
        if (message.includes('query to view top 10 less plots') || message.includes('top 10 less plots')) {
            return "📉 Query for Top 10 Blocks with Least Plots:\n\nSELECT \n    a.LocationCode,\n    d.LocationName,\n    COUNT(DISTINCT b.KhasraNumber) AS KhasraCount\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE b.Mflag IS NULL OR b.Mflag = 'N'\nGROUP BY a.LocationCode, d.LocationName\nORDER BY KhasraCount ASC\nOFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;";
        }
        
        if (message.includes('excel formula single or joint') || message.includes('excel ownership formula')) {
            return "📝 Excel Formula for Single/Joint:\n\n=IF(OR(\n   ISNUMBER(SEARCH(\"र\",A2)),\n   ISNUMBER(SEARCH(\"अनि\",A2)),\n   ISNUMBER(SEARCH(\"तथा\",A2)),\n   ISNUMBER(SEARCH(\"/\",A2)),\n   ISNUMBER(SEARCH(\"संग\",A2)),\n   ISNUMBER(SEARCH(\"एवं\",A2)),\n   ISNUMBER(SEARCH(\",\",A2))\n),\"Joint\",\"Single\")\n\nUse this formula in Excel to determine ownership type";
        }
        
        if (message.includes('query to check duplicate ror') || message.includes('duplicate ror check')) {
            return "🔍 Query to Check Duplicate ROR in Same Block:\n\nSELECT \n    a.KhatiyanNo, \n    b.KhasraNumber, \n    COUNT(*) as DuplicateCount\nFROM lr_Khatiyan a \nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N') AND a.LocationCode = '440104'\nGROUP BY a.KhatiyanNo, b.KhasraNumber\nHAVING COUNT(*) > 1;\n\nChange LocationCode as needed";
        }
        
        // ==================== DEFAULT RESPONSES ====================
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello there! 👋 I'm Xtron, your personal assistant. How can I help you today?";
        }
        
        if (message.includes('help')) {
            return "I can help you with various tasks! Try asking me about:\n• Bhunaksa login credentials\n• Database queries for land records\n• Excel formulas\n• Or use the 'Quick Prompts' dropdown for common questions!";
        }
        
        if (message.includes('how are you')) {
            return "I'm functioning perfectly! Ready to assist you with whatever you need. 😊";
        }
        
        if (message.includes('time')) {
            return `The current time is: ${new Date().toLocaleTimeString()}`;
        }
        
        if (message.includes('date')) {
            return `Today's date is: ${new Date().toLocaleDateString()}`;
        }
        
        if (message.includes('weather')) {
            return "I'd love to give you weather information, but I'm currently operating offline. You might want to check a weather service online!";
        }
        
        if (message.includes('what can you do') || message.includes('features')) {
            return "Here's what I can do:\n• Provide Bhunaksa login credentials\n• Share database queries for land records\n• Give Excel formulas\n• Answer general questions\n• And much more!";
        }
        
        if (message.includes('bye') || message.includes('goodbye')) {
            return "Goodbye! 👋 It was great chatting with you. Come back anytime!";
        }
        
        if (message.includes('thank')) {
            return "You're welcome! 😊 Is there anything else I can help you with?";
        }
        
        // Default responses
        const defaultResponses = [
            "That's interesting! Tell me more about that.",
            "I understand. How can I assist you further?",
            "Thanks for sharing that with me!",
            "I'm here to help! What would you like to know?",
            "That's a great point! Is there anything specific you'd like to discuss?",
            "I appreciate your message. How can I be of service?",
            "Fascinating! What else is on your mind?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessage("Welcome to Xtron! 👋", 'bot');
        }, 500);
    }
    
    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new XtronChat();
});