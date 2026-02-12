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
                "Excel Number of Owners": "excel formula for number of owners",
                "Gatishakti": "gatishakti"
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
            
            // Check if message contains SQL query or code
            const isCodeBlock = text.includes('SELECT') || 
                               text.includes('FROM') || 
                               text.includes('WHERE') ||
                               text.includes('INSERT') ||
                               text.includes('UPDATE') ||
                               text.includes('DELETE') ||
                               text.includes('=') && text.includes('"');
            
            if (isCodeBlock) {
                messageDiv.innerHTML = `
                    <div class="message-text ${messageClass}" style="font-family: monospace; white-space: pre-wrap; background: #f0f0f0; padding: 12px; border-radius: 6px; border-left: 4px solid #4a90e2;">${this.escapeHtml(text)}</div>
                    <div class="message-time">${time}</div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="message-text ${messageClass}">${this.escapeHtml(text)}</div>
                    <div class="message-time">${time}</div>
                `;
            }
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
        if (message.includes('gangtok') && (message.includes('login') || message.includes('bhunaksha'))) {
            return "🔐 Gangtok Bhunaksha Login:\n• Username: rs_gtk\n• Password: rs@gtk";
        }
        
        if (message.includes('gyalshing') && (message.includes('login') || message.includes('bhunaksha'))) {
            return "🔐 Gyalshing Bhunaksha Login:\n• Username: rs_gey\n• Password: rs@gey";
        }
        
        if (message.includes('namchi') && (message.includes('login') || message.includes('bhunaksha'))) {
            return "🔐 Namchi Bhunaksha Login:\n• Username: rs_namchi\n• Password: rs@namchi";
        }
        
        if (message.includes('mangan') && (message.includes('login') || message.includes('bhunaksha'))) {
            return "🔐 Mangan Bhunaksha Login:\n• Username: rs_mangan\n• Password: rs@mangan";
        }
        
        if (message.includes('pakyong') && (message.includes('login') || message.includes('bhunaksha'))) {
            return "🔐 Pakyong Bhunaksha Login:\n• Username: rs_paky\n• Password: rs@paky";
        }
        
        if (message.includes('soreng') && (message.includes('login') || message.includes('bhunaksha'))) {
            return "🔐 Soreng Bhunaksha Login:\n• Username: rs_soreng\n• Password: rs@soreng";
        }

        if (message.includes('sdc') && (message.includes('server') || message.includes('details'))) {
            return "🔐 SDC Server Details:\n• Internal IP: 10.182.95.136\n• Public IP: 164.100.126.44\n• Username: WEB-9/SSDC\n• Password: $$web@12345$#";
        }

        if ((message.includes('api') || message.includes('farmer registry')) && !message.includes('query')) {
            return "🔐 API Links:\n• Farmer Registry: http://164.100.126.44/api/farmer\n• GRVMR: http://164.100.126.44/api/grvmr";
        }
        
        // ==================== DATABASE QUERIES ====================
        if (message.includes('ror') && (message.includes('count') || message.includes('number')) && !message.includes('duplicate')) {
            return "📊 **Query for Number of ROR:**\n\n```sql\nSELECT count(distinct a.KhatiyanNo), d.LocationName\nFROM lr_Khatiyan as a \nINNER JOIN lr_Khasra as b ON a.LocationCode=b.LocationCode AND a.KhatiyanNo=b.KhatiyanNo\nINNER JOIN c_lr_Location as d ON a.LocationCode=d.LocationCode\nWHERE (b.Mflag is null or b.mflag='N')\nGROUP BY d.LocationName;\n```";
        }

        if (message.includes('dcs') || (message.includes('dec') && message.includes('relevant'))) {
            return "📊 **Query for DCS Data Extraction:**\n\n```sql\nSELECT\n    a.OwnerName, a.FathersName, a.KhatiyanNo, b.KhasraNumber, b.TotArea\nFROM lr_Khatiyan a \nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N') AND a.LocationCode IN (...);\n```";
        }
        
        if (message.includes('plot') && (message.includes('count') || message.includes('number'))) {
            return "📈 **Query for Number of Plots:**\n\n```sql\nSELECT \n    d.LocationName,\n    COUNT(DISTINCT b.KhasraNumber) AS TotalPlots\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode \n    AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d\n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N')\nGROUP BY d.LocationName\nORDER BY d.LocationName;\n```";
        }
        
        if (message.includes('view records') || (message.includes('show') && message.includes('records'))) {
            return "👁️ **Query to View Records:**\n\n```sql\nSELECT *\nFROM lr_Khatiyan a \nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N');\n```\n\n*Note: Add your specific WHERE conditions at the end*";
        }
        
        if (message.includes('lgd code') || (message.includes('records') && message.includes('lgd'))) {
            return "🏷️ **Query to View Records with LGD Code:**\n\n```sql\nSELECT *\nFROM lr_Khatiyan a \nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nINNER JOIN SC_LGD_MASTER lgd\n    ON a.LocationCode = lgd.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N');\n```";
        }
        
        if (message.includes('single') && message.includes('joint') && !message.includes('count')) {
            return "👥 **Query for Single/Joint Ownership:**\n\n```sql\nSELECT \n    a.OwnerName,\n    CASE \n        WHEN \n            a.OwnerName LIKE '%,%' OR \n            a.OwnerName LIKE '% र %' OR \n            a.OwnerName LIKE '% अनि %' OR \n            a.OwnerName LIKE '% तथा %' OR \n            a.OwnerName LIKE '%/%' OR \n            a.OwnerName LIKE '% संग %' OR \n            a.OwnerName LIKE '% एवं %'\n        THEN 'Joint'\n        ELSE 'Single'\n    END AS OwnershipType\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N');\n```";
        }
        
        if (message.includes('single') && message.includes('joint') && message.includes('count')) {
            return "📊 **Query for Single/Joint Count:**\n\n```sql\nSELECT \n    CASE \n        WHEN \n            a.OwnerName LIKE '%,%' OR \n            a.OwnerName LIKE '% र %' OR \n            a.OwnerName LIKE '% अनि %' OR \n            a.OwnerName LIKE '% तथा %' OR \n            a.OwnerName LIKE '%/%' OR \n            a.OwnerName LIKE '% संग %' OR \n            a.OwnerName LIKE '% एवं %'\n        THEN 'Joint'\n        ELSE 'Single'\n    END AS OwnershipType,\n    COUNT(*) AS CountOfOwners\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N') AND (a.CasteCode != '1203' AND a.CasteCode NOT LIKE '40%')\nGROUP BY \n    CASE \n        WHEN \n            a.OwnerName LIKE '%,%' OR \n            a.OwnerName LIKE '% र %' OR \n            a.OwnerName LIKE '% अनि %' OR \n            a.OwnerName LIKE '% तथा %' OR \n            a.OwnerName LIKE '%/%' OR \n            a.OwnerName LIKE '% संग %' OR \n            a.OwnerName LIKE '% एवं %'\n        THEN 'Joint'\n        ELSE 'Single'\n    END;\n```";
        }
        
        if (message.includes('top 10') && message.includes('less plots')) {
            return "📉 **Query for Top 10 Blocks with Least Plots:**\n\n```sql\nSELECT \n    a.LocationCode,\n    d.LocationName,\n    COUNT(DISTINCT b.KhasraNumber) AS KhasraCount\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N')\nGROUP BY a.LocationCode, d.LocationName\nORDER BY KhasraCount ASC\nOFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;\n```";
        }
        
        if (message.includes('duplicate ror') || (message.includes('check') && message.includes('duplicate'))) {
            return "🔍 **Query to Check Duplicate ROR:**\n\n```sql\nSELECT \n    a.KhatiyanNo, \n    b.KhasraNumber, \n    COUNT(*) as DuplicateCount\nFROM lr_Khatiyan a \nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N') AND a.LocationCode = '440104'\nGROUP BY a.KhatiyanNo, b.KhasraNumber\nHAVING COUNT(*) > 1;\n```\n\n*Change LocationCode as needed*";
        }

        if (message.includes('gatishakti') || message.includes('janparichay') || message.includes('janparichey') || message.includes('mail')) {
            return "📧 **Gatishakti/Janparichay Login:**\n\n• Mail: mail.gov.in\n• Email Account: yash.gurung02@sikkim.gov.in\n• Email & Janparichay Password: Dilrmp@2915";
        }

        // ==================== EXCEL FORMULAS ====================
        if (message.includes('excel') && message.includes('ownership')) {
            return "📝 **Excel Formula for Single/Joint:**\n\n```excel\n=IF(OR(\n   ISNUMBER(SEARCH(\"र\",A2)),\n   ISNUMBER(SEARCH(\"अनि\",A2)),\n   ISNUMBER(SEARCH(\"तथा\",A2)),\n   ISNUMBER(SEARCH(\"/\",A2)),\n   ISNUMBER(SEARCH(\"संग\",A2)),\n   ISNUMBER(SEARCH(\"एवं\",A2)),\n   ISNUMBER(SEARCH(\",\",A2))\n),\"Joint\",\"Single\")\n```\n\n*Use this formula in Excel to determine ownership type*";
        }
        
        if (message.includes('excel') && message.includes('number of owners')) {
            return "📊 **Excel Formula for Number of Owners:**\n\n```excel\n=LEN(A2)-LEN(SUBSTITUTE(A2,\",\",\"\"))+1\n```\n\n*This counts the number of owners by counting commas and adding 1.*";
        }

        // ==================== PROPERTY & MUTATION QUERIES ====================
        if (message.includes('property') && message.includes('between years')) {
            return "📊 **Query for Properties Between Years:**\n\n```sql\nSELECT * FROM dbo.Application \nINNER JOIN dbo.pa_PropertyApplication ON dbo.Application.ApplicationNo=dbo.pa_PropertyApplication.ApplicationNo\nINNER JOIN dbo.pr_PropertyRegistration ON dbo.pa_PropertyApplication.PropertyApplicationNo= dbo.pr_PropertyRegistration.PropertyApplicationNo\nWHERE (YEAR(ApplicationDate) BETWEEN ('2023') AND ('2024')) AND (ApplicationStatusId='DE' OR ApplicationStatusId='RP' OR ApplicationStatusId='MA') \nAND pa_PropertyApplication.MutationTypeCode='2307';\n```";
        }

        if (message.includes('mutation') && message.includes('count')) {
            return "🔄 **Query for Mutation Count:**\n\n```sql\nSELECT * FROM dbo.Application \nINNER JOIN dbo.pa_PropertyApplication ON dbo.Application.ApplicationNo=dbo.pa_PropertyApplication.ApplicationNo\nINNER JOIN dbo.pr_PropertyRegistration ON dbo.pa_PropertyApplication.PropertyApplicationNo= dbo.pr_PropertyRegistration.PropertyApplicationNo\nWHERE (YEAR(ApplicationDate) BETWEEN ('2023') AND ('2024')) AND (ApplicationStatusId != 'AX') AND (MutationTypeCode='0100' OR MutationTypeCode='0800' OR MutationTypeCode='2203' OR MutationTypeCode='2307');\n```";
        }

        if (message.includes('registration') && message.includes('count')) {
            return "📝 **Query for Registration Count:**\n\n```sql\nSELECT * FROM dbo.Application \nINNER JOIN dbo.pa_PropertyApplication ON dbo.Application.ApplicationNo=dbo.pa_PropertyApplication.ApplicationNo\nWHERE (YEAR(ApplicationDate) BETWEEN ('2023') AND ('2024')) AND (ApplicationStatusId='CA' OR ApplicationStatusId='RP') AND \n(MutationTypeCode='1038' OR MutationTypeCode='1039' OR MutationTypeCode='2104' OR MutationTypeCode='2108' OR MutationTypeCode='2112' OR MutationTypeCode='2103');\n```";
        }

        if (message.includes('single khasra') || (message.includes('khatiyan') && message.includes('exactly one'))) {
            return "🔗 **Query for Khatiyan with Single Khasra:**\n\n```sql\nSELECT \n  COUNT(DISTINCT k.khatiyan_no) AS single_khasra_khatiyan_count\nFROM \n  lr_khatiyan k\n  JOIN (\n    SELECT \n      khatiyan_no,\n      COUNT(DISTINCT khasra_no) AS khasra_count\n    FROM \n      lr_khasra\n    GROUP BY \n      khatiyan_no\n    HAVING \n      COUNT(DISTINCT khasra_no) = 1\n  ) kh ON k.khatiyan_no = kh.khatiyan_no;\n```";
        }

        if (message.includes('genderwise') || (message.includes('gender') && message.includes('plots'))) {
            return "👥 **Query for Gender-wise Plots:**\n\n```sql\nSELECT \n    CASE \n        WHEN d.LocationCode LIKE '1%' THEN '1%'\n        WHEN d.LocationCode LIKE '2%' THEN '2%'\n        WHEN d.LocationCode LIKE '3%' THEN '3%'\n        WHEN d.LocationCode LIKE '4%' THEN '4%'\n        WHEN d.LocationCode LIKE '5%' THEN '5%'\n        WHEN d.LocationCode LIKE '6%' THEN '6%'\n        ELSE 'Other'\n    END AS location_start,\n    a.gender,\n    COUNT(DISTINCT a.KhatiyanNo) AS count\nFROM lr_Khatiyan a \nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N') \nGROUP BY \n    CASE \n        WHEN d.LocationCode LIKE '1%' THEN '1%'\n        WHEN d.LocationCode LIKE '2%' THEN '2%'\n        WHEN d.LocationCode LIKE '3%' THEN '3%'\n        WHEN d.LocationCode LIKE '4%' THEN '4%'\n        WHEN d.LocationCode LIKE '5%' THEN '5%'\n        WHEN d.LocationCode LIKE '6%' THEN '6%'\n        ELSE 'Other'\n    END,\n    a.gender\nORDER BY location_start, a.gender;\n```";
        }

        if (message.includes('total area') || (message.includes('sum') && message.includes('area'))) {
            return "📐 **Query for Total Area:**\n\n```sql\nSELECT SUM(TotArea) FROM dbo.lr_Khasra \nINNER JOIN dbo.lr_Khatiyan ON dbo.lr_Khasra.KhatiyanNo=dbo.lr_Khatiyan.KhatiyanNo;\n```";
        }

       if (message.includes('sdc') || (message.includes('SDC') || (message.includes('Sdc') ) {
           return "🔐 **SDC Server Details:**\n\n• Node Internal IP: `10.182.95.136`\n• Node External IP: `164.100.126.44`\n• Server Name: `WEB-9/SSDC`\n• Server Password: `$$web9@12345$#`";
        }
       
        
        // ==================== PASSWORDS ====================
        if (message.includes('black') && (message.includes('pc') || message.includes('computer'))) {
            return "🔐 Black PC Password: **1982**";
        }

        if (message.includes('white') && (message.includes('pc') || message.includes('computer'))) {
            return "🔐 White PC Password: **181993**";
        }

        if ((message.includes('head office') || message.includes('projector')) && (message.includes('pc') || message.includes('cpu'))) {
            return "🔐 Head Office/Projector PC Password: **281376**";
        }
        
        if (message.includes('head office') && message.includes('wifi')) {
            return "🔐 Head Office WiFi:\n• SSID: MEETING@2025\n• Password: LRDMD2025";
        }

        if (message.includes('office laptop') || (message.includes('laptop') && message.includes('password'))) {
            return "🔐 Office Laptop Password: **chung@tshering**";
        }

        if (message.includes('dilrmp account') || (message.includes('dilrmp') && message.includes('password'))) {
            return "🔐 DILRMP Account Password: **revenueland@123**";
        }

        if (message.includes('programmers') || message.includes('programmer wifi')) {
            return "🔐 Programmers WiFi Password: **dilrmpilrms@123**";
        }

        if (message.includes('suntaley')) {
            return "🔐 Suntaley WiFi Password: **11223344**";
        }

        if (message.includes('dd mam') || (message.includes('dd') && message.includes('pc'))) {
            return "🔐 DD Mam PC Password: **2022**";
        }

        if (message.includes('hathway') || message.includes('dilrmp_hathway')) {
            return "🔐 DILRMP Hathway WiFi Password: **$0725Dilrmp**";
        }
        
        // ==================== DEFAULT RESPONSES ====================
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello there! 👋 I'm Xtron, your personal assistant. How can I help you today?";
        }
        
        if (message.includes('help') || message.includes('what can you do')) {
            return "🤖 **I can help you with:**\n\n• 🔐 Bhunaksha login credentials\n• 📊 Database queries for land records\n• 📝 Excel formulas\n• 🔑 Office passwords\n• 📧 Gatishakti/Janparichay info\n• 📋 SDC server details\n\n*Try using the 'Quick Prompts' dropdown for common questions!*";
        }
        
        if (message.includes('how are you')) {
            return "I'm functioning perfectly! Ready to assist you with whatever you need. 😊";
        }
        
        if (message.includes('time')) {
            return `🕐 The current time is: **${new Date().toLocaleTimeString()}**`;
        }
        
        if (message.includes('date')) {
            return `📅 Today's date is: **${new Date().toLocaleDateString()}**`;
        }
        
        if (message.includes('weather')) {
            return "☁️ I'd love to give you weather information, but I'm currently operating offline. You might want to check a weather service online!";
        }
        
        if (message.includes('features') || message.includes('capabilities')) {
            return "🚀 **Xtron Features:**\n\n• Quick access to database queries\n• Office credentials management\n• Excel formula generator\n• Property records information\n• Mutation & registration statistics\n• And much more!";
        }
        
        if (message.includes('bye') || message.includes('goodbye')) {
            return "Goodbye! 👋 It was great chatting with you. Come back anytime!";
        }
        
        if (message.includes('thank')) {
            return "You're welcome! 😊 Is there anything else I can help you with?";
        }
        
        // Default response if no match found
        return "I'm not sure about that. 🤔 Try using the **Quick Prompts** dropdown or ask me about:\n\n• Database queries\n• Login credentials\n• Passwords\n• Excel formulas\n• Gatishakti/Janparichay";
    }
    
    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessage("Welcome to Xtron! 👋 I'm your personal assistant for land records and office tasks. How can I help you today?", 'bot');
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


