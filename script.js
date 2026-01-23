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
                "Check Duplicate ROR": "query to check duplicate ror",
                "Properties Between Years": "query to get number of property between years",
                "Mutation Count": "query to get number of mutations",
                "Registration Count": "query to get number of registration",
                "Single Khasra Khatiyan": "query to get find all khatiyan that are linked to exactly one unique khasra",
                "Gender-wise Plots": "query to get genderwise plots",
                "Total Area": "query to get area",
                "DCS relevant query": "query to get dec relevant data"
            },
            "Tools": {
                "Excel Ownership Formula": "excel formula single or joint",
                "Programmers WiFi": "programmers wifi password",
                "Suntaley WiFi": "suntaley wifi password",
                "Hathway WiFi": "dilrmp_hathway wifi password",
                "Excel Number of Owners": "excel formula for number of owners"
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
        
        // ==================== BHUNAKSHYA LOGIN CREDENTIALS ====================
        if (message.includes('bhunaksha login for gangtok') || message.includes('gangtok login')) {
            return "🔐 Gangtok bhunaksha Login:\n• Username: rs_gtk\n• Password: rs@gtk";
        }
        
        if (message.includes('bhunaksha login for gyalshing') || message.includes('gyalshing login')) {
            return "🔐 Gyalshing bhunaksha Login:\n• Username: rs_gey\n• Password: rs@gey";
        }
        
        if (message.includes('bhunaksha login for namchi') || message.includes('namchi login')) {
            return "🔐 Namchi bhunaksha Login:\n• Username: rs_namchi\n• Password: rs@namchi";
        }
        
        if (message.includes('bhunaksha login for mangan') || message.includes('mangan login')) {
            return "🔐 Mangan bhunaksha Login:\n• Username: rs_mangan\n• Password: rs@mangan";
        }
        
        if (message.includes('bhunaksha login for pakyong') || message.includes('pakyong login')) {
            return "🔐 Pakyong bhunaksha Login:\n• Username: rs_paky\n• Password: rs@paky";
        }
        
        if (message.includes('bhunaksha login for soreng') || message.includes('soreng login')) {
            return "🔐 Soreng bhunaksha Login:\n• Username: rs_soreng\n• Password: rs@soreng";
        }

        if (message.includes('sdc server details') || message.includes('sdc')) {
            return "🔐 SDC server details:\n• Internal IP: 10.182.95.136\n• Public IP: 164.100.126.44\n• Username: WEB-9/SSDC\n• Password: $$web@12345$#";
        }

        if (message.includes('api') || message.includes('farmer registry')) {
            return "🔐 API Links:\n• Farmer Registry: http://164.100.126.44/api/farmer\n• GRVMR: http://164.100.126.44/api/grvmr";
        }
        
        // ==================== DATABASE QUERIES ====================
        if (message.includes('query for number of ror') || message.includes('ror count') || message.includes('total ror')) {
            return "📊 Query for Number of ROR:\n\nSELECT count(distinct a.KhatiyanNo), d.LocationName\nFROM lr_Khatiyan as a \nINNER JOIN lr_Khasra as b ON a.LocationCode=b.LocationCode AND a.KhatiyanNo=b.KhatiyanNo\nINNER JOIN c_lr_Location as d ON a.LocationCode=d.LocationCode\nWHERE (b.Mflag is null or b.mflag='N')\nGROUP BY d.LocationName;";
        }

        if (message.includes('dcs relevant query') || message.includes('dcs')) {
            return `📊 Query for DCS Data Extraction:

SELECT
    a.OwnerName, a.FathersName, a.KhatiyanNo, b.KhasraNumber, b.TotArea
FROM lr_Khatiyan a 
INNER JOIN lr_Khasra b 
    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo
INNER JOIN c_lr_Location d 
    ON a.LocationCode = d.LocationCode
WHERE (b.Mflag IS NULL OR b.Mflag = 'N') AND a.LocationCode IN (...);`;
        }
        
        if (message.includes('query for number of plots') || message.includes('plot count') || message.includes('total plots')) {
            return "📈 Query for Number of Plots:\n\nSELECT \n    d.LocationName,\n    COUNT(DISTINCT b.KhasraNumber) AS TotalPlots\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode \n    AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d\n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N')\nGROUP BY d.LocationName\nORDER BY d.LocationName;";
        }
        
        if (message.includes('query to view records') || message.includes('view all records') || message.includes('show records')) {
            return "👁️ Query to View Records:\n\nSELECT *\nFROM lr_Khatiyan a \nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N');\n\n*Note: Add your specific WHERE conditions at the end*";
        }
        
        if (message.includes('query to view records with lgd code') || message.includes('lgd code records')) {
            return "🏷️ Query to View Records with LGD Code:\n\nSELECT *\nFROM lr_Khatiyan a \nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nINNER JOIN SC_LGD_MASTER lgd\n    ON a.LocationCode = lgd.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N');";
        }
        
        if (message.includes('query to view single n joint') || message.includes('single and joint ownership')) {
            return "👥 Query for Single/Joint Ownership:\n\nSELECT \n    a.OwnerName,\n    CASE \n        WHEN \n            a.OwnerName LIKE '%,%' OR \n            a.OwnerName LIKE '% र %' OR \n            a.OwnerName LIKE '% अनि %' OR \n            a.OwnerName LIKE '% तथा %' OR \n            a.OwnerName LIKE '%/%' OR \n            a.OwnerName LIKE '% संग %' OR \n            a.OwnerName LIKE '% एवं %'\n        THEN 'Joint'\n        ELSE 'Single'\n    END AS OwnershipType\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N');";
        }
        
        if (message.includes('query to view single n joint as count') || message.includes('count single joint')) {
            return "📊 Query for Single/Joint Count:\n\nSELECT \n    CASE \n        WHEN \n            a.OwnerName LIKE '%,%' OR \n            a.OwnerName LIKE '% र %' OR \n            a.OwnerName LIKE '% अनि %' OR \n            a.OwnerName LIKE '% तथा %' OR \n            a.OwnerName LIKE '%/%' OR \n            a.OwnerName LIKE '% संग %' OR \n            a.OwnerName LIKE '% एवं %'\n        THEN 'Joint'\n        ELSE 'Single'\n    END AS OwnershipType,\n    COUNT(*) AS CountOfOwners\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N') AND (a.CasteCode != '1203' AND a.CasteCode NOT LIKE '40%')\nGROUP BY \n    CASE \n        WHEN \n            a.OwnerName LIKE '%,%' OR \n            a.OwnerName LIKE '% र %' OR \n            a.OwnerName LIKE '% अनि %' OR \n            a.OwnerName LIKE '% तथा %' OR \n            a.OwnerName LIKE '%/%' OR \n            a.OwnerName LIKE '% संग %' OR \n            a.OwnerName LIKE '% एवं %'\n        THEN 'Joint'\n        ELSE 'Single'\n    END;";
        }
        
        if (message.includes('query to view top 10 less plots') || message.includes('top 10 less plots')) {
            return "📉 Query for Top 10 Blocks with Least Plots:\n\nSELECT \n    a.LocationCode,\n    d.LocationName,\n    COUNT(DISTINCT b.KhasraNumber) AS KhasraCount\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N')\nGROUP BY a.LocationCode, d.LocationName\nORDER BY KhasraCount ASC\nOFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;";
        }
        
        if (message.includes('query to check duplicate ror') || message.includes('duplicate ror')) {
            return "🔍 Query to Check Duplicate ROR in Same Block:\n\nSELECT \n    a.KhatiyanNo, \n    b.KhasraNumber, \n    COUNT(*) as DuplicateCount\nFROM lr_Khatiyan a \nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N') AND a.LocationCode = '440104'\nGROUP BY a.KhatiyanNo, b.KhasraNumber\nHAVING COUNT(*) > 1;\n\n*Change LocationCode as needed*";
        }

        // ==================== EXCEL FORMULAS ====================
        if (message.includes('excel formula single or joint') || message.includes('excel ownership formula')) {
            return `📝 Excel Formula for Single/Joint:

=IF(OR(
   ISNUMBER(SEARCH("र",A2)),
   ISNUMBER(SEARCH("अनि",A2)),
   ISNUMBER(SEARCH("तथा",A2)),
   ISNUMBER(SEARCH("/",A2)),
   ISNUMBER(SEARCH("संग",A2)),
   ISNUMBER(SEARCH("एवं",A2)),
   ISNUMBER(SEARCH(",",A2))
),"Joint","Single")

*Use this formula in Excel to determine ownership type*`;
        }
        
        if (message.includes('excel formula for number of owners') || message.includes('excel number of owners')) {
            return `📊 Excel Formula for Number of Owners:

=LEN(A2)-LEN(SUBSTITUTE(A2,",",""))+1

*This counts the number of owners by counting commas and adding 1.*`;
        }

        // ==================== PROPERTY & MUTATION QUERIES ====================
        if (message.includes('query to get number of property between years') || message.includes('property between years')) {
            return "📊 Query for Properties Between Years:\n\nSELECT * FROM dbo.Application \nINNER JOIN dbo.pa_PropertyApplication ON dbo.Application.ApplicationNo=dbo.pa_PropertyApplication.ApplicationNo\nINNER JOIN dbo.pr_PropertyRegistration ON dbo.pa_PropertyApplication.PropertyApplicationNo= dbo.pr_PropertyRegistration.PropertyApplicationNo\nWHERE (YEAR(ApplicationDate) BETWEEN ('2023') AND ('2024')) AND (ApplicationStatusId='DE' OR ApplicationStatusId='RP' OR ApplicationStatusId='MA') \nAND pa_PropertyApplication.MutationTypeCode='2307';";
        }

        if (message.includes('query to get number of mutations') || message.includes('mutations count')) {
            return "🔄 Query for Mutation Count:\n\nSELECT * FROM dbo.Application \nINNER JOIN dbo.pa_PropertyApplication ON dbo.Application.ApplicationNo=dbo.pa_PropertyApplication.ApplicationNo\nINNER JOIN dbo.pr_PropertyRegistration ON dbo.pa_PropertyApplication.PropertyApplicationNo= dbo.pr_PropertyRegistration.PropertyApplicationNo\nWHERE (YEAR(ApplicationDate) BETWEEN ('2023') AND ('2024')) AND (ApplicationStatusId != 'AX') AND (MutationTypeCode='0100' OR MutationTypeCode='0800' OR MutationTypeCode='2203' OR MutationTypeCode='2307');";
        }

        if (message.includes('query to get number of registration') || message.includes('registration count')) {
            return "📝 Query for Registration Count:\n\nSELECT * FROM dbo.Application \nINNER JOIN dbo.pa_PropertyApplication ON dbo.Application.ApplicationNo=dbo.pa_PropertyApplication.ApplicationNo\nWHERE (YEAR(ApplicationDate) BETWEEN ('2023') AND ('2024')) AND (ApplicationStatusId='CA' OR ApplicationStatusId='RP') AND \n(MutationTypeCode='1038' OR MutationTypeCode='1039' OR MutationTypeCode='2104' OR MutationTypeCode='2108' OR MutationTypeCode='2112' OR MutationTypeCode='2103');";
        }

        if (message.includes('query to get find all khatiyan that are linked to exactly one unique khasra') || message.includes('single khasra khatiyan')) {
            return "🔗 Query for Khatiyan with Single Khasra:\n\nSELECT \n  COUNT(DISTINCT k.khatiyan_no) AS single_khasra_khatiyan_count\nFROM \n  lr_khatiyan k\n  JOIN (\n    SELECT \n      khatiyan_no,\n      COUNT(DISTINCT khasra_no) AS khasra_count\n    FROM \n      lr_khasra\n    GROUP BY \n      khatiyan_no\n    HAVING \n      COUNT(DISTINCT khasra_no) = 1\n  ) kh ON k.khatiyan_no = kh.khatiyan_no;";
        }

        if (message.includes('query to get genderwise plots') || message.includes('genderwise plots')) {
            return "👥 Query for Gender-wise Plots:\n\nSELECT \n    CASE \n        WHEN d.LocationCode LIKE '1%' THEN '1%'\n        WHEN d.LocationCode LIKE '2%' THEN '2%'\n        WHEN d.LocationCode LIKE '3%' THEN '3%'\n        WHEN d.LocationCode LIKE '4%' THEN '4%'\n        WHEN d.LocationCode LIKE '5%' THEN '5%'\n        WHEN d.LocationCode LIKE '6%' THEN '6%'\n        ELSE 'Other'\n    END AS location_start,\n    a.gender,\n    COUNT(DISTINCT a.KhatiyanNo) AS count\nFROM lr_Khatiyan a \nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N') \nGROUP BY \n    CASE \n        WHEN d.LocationCode LIKE '1%' THEN '1%'\n        WHEN d.LocationCode LIKE '2%' THEN '2%'\n        WHEN d.LocationCode LIKE '3%' THEN '3%'\n        WHEN d.LocationCode LIKE '4%' THEN '4%'\n        WHEN d.LocationCode LIKE '5%' THEN '5%'\n        WHEN d.LocationCode LIKE '6%' THEN '6%'\n        ELSE 'Other'\n    END,\n    a.gender\nORDER BY location_start, a.gender;";
        }

        if (message.includes('query to get area') || message.includes('total area')) {
            return "📐 Query for Total Area:\n\nSELECT SUM(TotArea) FROM dbo.lr_Khasra \nINNER JOIN dbo.lr_Khatiyan ON dbo.lr_Khasra.KhatiyanNo=dbo.lr_Khatiyan.KhatiyanNo;";
        }

        // ==================== PASSWORDS ====================
        if (message.includes('black pc password') || message.includes('black computer password')) {
            return "🔐 Black PC Password: 1982";
        }

        if (message.includes('white pc password') || message.includes('white computer password')) {
            return "🔐 White PC Password: 181993";
        }

        if (message.includes('head office pc password') || message.includes('head office cpu password')) {
            return "🔐 Projector PC Password: 281376";
        }
        
        if (message.includes('head office wifi password')) {
            return "🔐 Head Office WiFi:\n• SSID: MEETING@2025 \n• Password: LRDMD2025";
        }

        if (message.includes('office laptop password') || message.includes('laptop password')) {
            return "🔐 Office Laptop Password: chung@tshering";
        }

        if (message.includes('dilrmp account password') || message.includes('dilrmp password')) {
            return "🔐 DILRMP Account Password: revenueland@123";
        }

        if (message.includes('programmers wifi password') || message.includes('programmer wifi')) {
            return "🔐 Programmers WiFi Password: dilrmpilrms@123";
        }

        if (message.includes('suntaley wifi password') || message.includes('suntaley wifi')) {
            return "🔐 Suntaley WiFi Password: 11223344";
        }

        if (message.includes('dd mam pc password') || message.includes('dd mam password')) {
            return "🔐 DD Mam PC Password: 2022";
        }

        if (message.includes('dilrmp_hathway wifi password') || message.includes('hathway wifi')) {
            return "🔐 DILRMP Hathway WiFi Password: $0725Dilrmp";
        }
        
        // ==================== DEFAULT RESPONSES ====================
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello there! 👋 I'm Xtron, your personal assistant. How can I help you today?";
        }
        
        if (message.includes('help')) {
            return "I can help you with various tasks! Try asking me about:\n• bhunaksha login credentials\n• Database queries for land records\n• Excel formulas\n• Or use the 'Quick Prompts' dropdown for common questions!";
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
            return "Here's what I can do:\n• Provide bhunaksha login credentials\n• Share database queries for land records\n• Give Excel formulas\n• Answer general questions\n• And much more!";
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
