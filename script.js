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
                "Govt Lands": "query for Govt Lands", 
                "View Records": "query to view records",
                "Records with LGD": "query to get lgd code",
                "Records with agriculture Aadharno ": "query for aadhar records", 
                "Aadhar Seeded": "query for aaadhar seeded",
                "Single/Joint Ownership": "query to view single n joint",
                "Single/Joint Count": "query to view single n joint as count",
                "Top 10 Less Plots": "query to view top 10 less plots",
                "Check Duplicate ROR": "query to check duplicate ror",
                "Properties Between Years": "query to get number of property between years",
                "Mutation Count": "Query for Mutation Count",
                "Registration Count": "Query for Registration Count",
                "Single Khasra Khatiyan": "query to get find all khatiyan that are linked to exactly one unique khasra",
                "Gender-wise Plots": "query to get genderwise plots",
                "Total Area": "Query for Total Area",
                "DCS relevant query": "query to get dec relevant data"
            },
            "Tools": {
                "Excel Ownership Formula": "excel formula single or joint",
                "Programmers WiFi": "programmers wifi password",
                "Suntaley WiFi": "suntaley wifi password", 
                "Hathway WiFi": "dilrmp_hathway wifi password",
                "Excel Number of Owners": "excel formula for number of owners",
                "Gatishakti": "gatishakti"
            },
            "Scripts": {
                "Count features of all the shapefiles": "python script to count feature",
                "Main server table to CSV": "shell script for Mainserver CSV",
                "Bhunaksha server table to CSV": "shell script for Bhunakshaserver CSV"
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

        if ((message.includes('api') || message.includes('farmer registry')) && !message.includes('query')) {
            return "🔐 API Links:\n• Farmer Registry: http://164.100.126.44/api/farmer\n• GRVMR: http://164.100.126.44/api/grvmr";
        }
        
        // ==================== DATABASE QUERIES ====================
        if (message.includes('ror') && (message.includes('count') || message.includes('number')) && !message.includes('duplicate')) {
            return "📊 **Query for Number of ROR:**\n\n```sql\nSELECT count(distinct a.KhatiyanNo), d.LocationName\nFROM lr_Khatiyan as a \nINNER JOIN lr_Khasra as b ON a.LocationCode=b.LocationCode AND a.KhatiyanNo=b.KhatiyanNo\nINNER JOIN c_lr_Location as d ON a.LocationCode=d.LocationCode\nWHERE (b.Mflag is null or b.mflag='N')\nGROUP BY d.LocationName;\n```";
        }

        // ==================== NON MUTATED PLOTS ====================
        if (message.includes('non mutated plots') || message.includes('non-mutated plots') || message.includes('non mutated')) {
            return "📊 **Non Mutated Plots Extraction Guide:**\n\n" +
                   "**Step 1: Extract Non Mutated Plot Numbers**\n" +
                   "```sql\n" +
                   "SELECT\n" +
                   "    a.OwnerName, a.FathersName, a.KhatiyanNo, b.KhasraNumber, b.TotArea\n" +
                   "FROM lr_Khatiyan a \n" +
                   "INNER JOIN lr_Khasra b \n" +
                   "    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\n" +
                   "INNER JOIN c_lr_Location d \n" +
                   "    ON a.LocationCode = d.LocationCode\n" +
                   "WHERE (b.Mflag IS NULL OR b.Mflag = 'N') \n" +
                   "    AND a.LocationCode IN ('440101', '440102') /* Replace with your block codes */\n" +
                   "    AND b.KhasraNumber NOT LIKE '%/%'\n" +
                   "    AND b.KhasraNumber NOT IN (\n" +
                   "        SELECT DISTINCT \n" +
                   "            LEFT(k.KhasraNumber, CHARINDEX('/', k.KhasraNumber) - 1)\n" +
                   "        FROM lr_Khasra k\n" +
                   "        WHERE k.LocationCode IN ('440101', '440102') /* Replace with your block codes */\n" +
                   "            AND k.KhasraNumber LIKE '%/%'\n" +
                   "    );\n" +
                   "```\n\n" +
                   "**Step 2: Extract Coordinates from Shapefile**\n" +
                   "```\n" +
                   "1. Open the shapefile for the same block in QGIS/ArcGIS\n" +
                   "2. Use the plot numbers from Step 1 as a filter\n" +
                   "3. Export the selected features with their geometry\n" +
                   "4. Extract coordinates (X,Y or Lat/Long) from the geometry\n" +
                   "```\n\n" +
                   "**Step 3: Map Plot Numbers with Coordinates**\n" +
                   "```sql\n" +
                   "-- Create a mapping table or use Excel to join:\n" +
                   "-- | KhasraNumber | OwnerName | TotArea | X_Coord | Y_Coord |\n" +
                   "-- \n" +
                   "-- For SQL Server with spatial data:\n" +
                   "SELECT \n" +
                   "    plots.KhasraNumber,\n" +
                   "    plots.OwnerName,\n" +
                   "    plots.TotArea,\n" +
                   "    shape.ShapeGeometry.STX as Longitude,\n" +
                   "    shape.ShapeGeometry.STY as Latitude\n" +
                   "FROM extracted_plots plots\n" +
                   "INNER JOIN block_shapefile shape\n" +
                   "    ON plots.KhasraNumber = shape.KhasraNumber;\n" +
                   "```\n\n" +
                   "**💡 Pro Tips:**\n" +
                   "• Replace `'440101', '440102'` with your actual block LocationCode(s)\n" +
                   "• The query excludes mutated plots (those with '/' in KhasraNumber)\n" +
                   "• Use the extracted coordinates for mapping or further analysis";
        }

        // ==================== AADHAR RECORDS QUERY ====================
        if (message.includes('aadhar records') || message.includes('aadhar query') || message.includes('query for aadhar')) {
            return "🆔 **Aadhar Linked Land Records Query**\n\n" +
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                   "**📌 QUERY 1: Full Details (All Columns + Aadhar with Name)**\n" +
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                   "```sql\n" +
                   "SELECT DISTINCT\n" +
                   "    a.*,           -- All columns from lr_Khatiyan\n" +
                   "    b.*,           -- All columns from lr_Khasra\n" +
                   "    pi.ContactNo,  -- Phone number\n" +
                   "    saa.aadhar,    -- Aadhar number from Aadhar table\n" +
                   "    saa.name       -- Name in English from Aadhar table\n" +
                   "FROM lr_Khatiyan a \n" +
                   "INNER JOIN lr_Khasra b \n" +
                   "    ON a.LocationCode = b.LocationCode \n" +
                   "    AND a.KhatiyanNo = b.KhatiyanNo\n" +
                   "LEFT JOIN pa_PlotDetails pd\n" +
                   "    ON pd.KhatiyanNo = a.KhatiyanNo\n" +
                   "LEFT JOIN pa_PropertyApplication ppa\n" +
                   "    ON ppa.PropertyApplicationNo = pd.PropertyApplicationNo\n" +
                   "LEFT JOIN pa_Party pp\n" +
                   "    ON pp.PropertyApplicationNo = ppa.PropertyApplicationNo\n" +
                   "LEFT JOIN pa_Individual pi\n" +
                   "    ON pi.PartyNo = pp.PartyNo\n" +
                   "INNER JOIN SC_Aadhar_Agri saa   -- Use INNER if you only want records with phone match\n" +
                   "    ON pi.ContactNo = saa.phno   -- Joining on phone number!\n" +
                   "WHERE (b.Mflag IS NULL OR b.Mflag = 'N');\n" +
                   "```\n\n" +
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                   "**📌 QUERY 2: Specific Columns (Aadhar Only - No Name)**\n" +
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                   "```sql\n" +
                   "SELECT DISTINCT\n" +
                   "    a.*,                        -- All columns from lr_Khatiyan\n" +
                   "    b.KhasraNumber,             -- Khasra number only\n" +
                   "    b.TotArea,                  -- Total area from lr_Khasra\n" +
                   "    -- Add any other specific columns from lr_Khasra you need:\n" +
                   "    -- b.KhasraType,\n" +
                   "    -- b.LandUse,\n" +
                   "    -- etc.\n" +
                   "    pi.ContactNo,               -- Phone number\n" +
                   "    saa.aadhar                  -- Aadhar number from Aadhar table only\n" +
                   "    -- saa.name removed as requested\n" +
                   "FROM lr_Khatiyan a \n" +
                   "INNER JOIN lr_Khasra b \n" +
                   "    ON a.LocationCode = b.LocationCode \n" +
                   "    AND a.KhatiyanNo = b.KhatiyanNo\n" +
                   "LEFT JOIN pa_PlotDetails pd\n" +
                   "    ON pd.KhatiyanNo = a.KhatiyanNo\n" +
                   "LEFT JOIN pa_PropertyApplication ppa\n" +
                   "    ON ppa.PropertyApplicationNo = pd.PropertyApplicationNo\n" +
                   "LEFT JOIN pa_Party pp\n" +
                   "    ON pp.PropertyApplicationNo = ppa.PropertyApplicationNo\n" +
                   "LEFT JOIN pa_Individual pi\n" +
                   "    ON pi.PartyNo = pp.PartyNo\n" +
                   "INNER JOIN SC_Aadhar_Agri saa\n" +
                   "    ON pi.ContactNo = saa.phno\n" +
                   "WHERE (b.Mflag IS NULL OR b.Mflag = 'N');\n" +
                   "```\n\n" +
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                   "**📋 QUERY DETAILS & DIFFERENCES**\n" +
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                   "| Feature | Query 1 | Query 2 |\n" +
                   "|---------|---------|---------|\n" +
                   "| lr_Khatiyan columns | All (a.*) | All (a.*) |\n" +
                   "| lr_Khasra columns | All (b.*) | Only KhasraNumber, TotArea |\n" +
                   "| Aadhar number | ✓ Included | ✓ Included |\n" +
                   "| Aadhar name | ✓ Included | ✗ Not included |\n" +
                   "| Contact number | ✓ Included | ✓ Included |\n\n" +
                   "**💡 NOTES:**\n" +
                   "• Both queries join land records with Aadhar data via phone number (ContactNo = phno)\n" +
                   "• Uses INNER JOIN - only returns records with matching phone numbers\n" +
                   "• Change to LEFT JOIN if you want all land records regardless of Aadhar match\n" +
                   "• DISTINCT prevents duplicate rows from multiple joins\n" +
                   "• Aadhar data comes from SC_Aadhar_Agri table\n" +
                   "• Query 2 is more efficient if you don't need all Khasra columns or Aadhar names";
        }

        // ==================== AADHAR SEEDED QUERY ====================
        if (message.includes('aadhar seeded') || message.includes('query for aadhar seeded') || message.includes('seeded aadhar')) {
            return "🆔 **Query for Aadhar Seeded Records:**\n\n```sql\nSELECT DISTINCT( d.UID ), (d.FirstName + ' ' + d.MiddleName + ' ' + d.LastName) AS name, e.KhatiyanNo, d.IndividualNo\nFROM Application AS a \nINNER JOIN pa_PropertyApplication AS b ON a.ApplicationNo = b.ApplicationNo\nINNER JOIN pa_Party AS c ON b.PropertyApplicationNo = c.PropertyApplicationNo\nINNER JOIN pa_Individual AS d ON c.PartyNo = d.PartyNo\nINNER JOIN pa_PlotDetails AS e ON b.PropertyApplicationNo = e.PropertyApplicationNo\nWHERE b.LocationCode LIKE '230%' AND uid <> ' ';\n```\n\n**📋 Query Details:**\n• Retrieves Aadhar seeded records\n• Shows UID (Aadhar number), Full Name, KhatiyanNo, and IndividualNo\n• Filters for LocationCode starting with '230%'\n• Excludes empty UID values\n• Joins Application, PropertyApplication, Party, Individual, and PlotDetails tables";
        }

        // ==================== NON MUTATED VERIFICATION ====================
        if (message.includes('non mutated verification') || message.includes('non-mutated verification') || message.includes('verify non mutated')) {
            return "🔍 **Non Mutated Verification Process:**\n\n" +
                   "**Step 1: Extract DCS Relevant Data**\n" +
                   "```sql\n" +
                   "SELECT\n" +
                   "    a.OwnerName, a.FathersName, a.KhatiyanNo, b.KhasraNumber, b.TotArea\n" +
                   "FROM lr_Khatiyan a \n" +
                   "INNER JOIN lr_Khasra b \n" +
                   "    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\n" +
                   "INNER JOIN c_lr_Location d \n" +
                   "    ON a.LocationCode = d.LocationCode\n" +
                   "WHERE (b.Mflag IS NULL OR b.Mflag = 'N') \n" +
                   "    AND a.LocationCode IN ('440101', '440102'); /* Replace with your block codes */\n" +
                   "```\n\n" +
                   "**Step 2: Filter and Extract Plot Numbers with '/'**\n" +
                   "```\n" +
                   "1. From the extracted data, filter KhasraNumber column\n" +
                   "2. Keep only records where KhasraNumber contains '/'\n" +
                   "3. Copy these plot numbers to a new column/sheet\n" +
                   "```\n\n" +
                   "**Step 3: Extract Plot Number Before '/' Using Excel Formula**\n" +
                   "```excel\n" +
                   "=LEFT(A1, FIND(\"/\", A1) - 1)\n" +
                   "```\n" +
                   "*Where A1 contains the KhasraNumber with '/' (e.g., '123/456' becomes '123')*\n\n" +
                   "**Step 4: Copy Column to Non Mutated Records**\n" +
                   "```\n" +
                   "1. Copy the extracted numbers from Step 3\n" +
                   "2. Paste them into a new column next to your non-mutated records\n" +
                   "3. Ensure both datasets are in the same worksheet for comparison\n" +
                   "```\n\n" +
                   "**Step 5: Find Common Entries Between Both Datasets**\n" +
                   "```excel\n" +
                   "=IF(COUNTIF(B:B, A2)>0, \"Common\", \"Unique\")\n" +
                   "```\n" +
                   "*Where:\n" +
                   "   - Column A contains non-mutated plot numbers\n" +
                   "   - Column B contains extracted plot numbers from Step 3\n" +
                   "   - 'Common' = Plot number exists in both datasets\n" +
                   "   - 'Unique' = Plot number only in non-mutated records*\n\n" +
                   "**Step 6: Verification Rule**\n" +
                   "```\n" +
                   "✅ ALL MUST BE UNIQUE\n" +
                   "\n" +
                   "Expected Result:\n" +
                   "• Every non-mutated plot number should show 'Unique'\n" +
                   "• If any shows 'Common', that plot has been mutated and shouldn't be in non-mutated list\n" +
                   "• This confirms your non-mutated records are correctly identified\n" +
                   "```\n\n" +
                   "**📋 Quick Excel Setup Guide:**\n" +
                   "| Column A (Non-Mutated) | Column B (From Step 3) | Column C (Verification) |\n" +
                   "|------------------------|------------------------|-------------------------|\n" +
                   "| 123 | 45 | =IF(COUNTIF(B:B, A2)>0, \"Common\", \"Unique\") |\n" +
                   "| 456 | 67 | =IF(COUNTIF(B:B, A3)>0, \"Common\", \"Unique\") |\n" +
                   "| 789 | 89 | =IF(COUNTIF(B:B, A4)>0, \"Common\", \"Unique\") |\n\n" +
                   "**⚠️ Important:**\n" +
                   "• All non-mutated plot numbers should return 'Unique'\n" +
                   "• If any return 'Common', those plots have been mutated and need to be removed from non-mutated list\n" +
                   "• This ensures data integrity between mutated and non-mutated records";
        }

        // ==================== GOVT LANDS QUERY ====================
        if (message.includes('govt lands') || message.includes('government lands') || message.includes('govt land query')) {
            return "🏛️ **Government Lands Acquisition Query:**\n\n```sql\nSELECT  \n    PO.OrganizationName AS Buyer,\n    PP.CasteCode,\n    LA.PurposeofAcquisition,\n    PPA.MutationDate,\n    LCD.ChequeAmount,\n    LCD.ChequeNumber,\n    PR.ConsiderationValue AS SaleValue\nFROM la_Land_Acquisition LA\nLEFT JOIN pa_PropertyApplication PPA\n    ON LA.PropertyApplicationNo = PPA.PropertyApplicationNo\nLEFT JOIN pr_PropertyRegistration PR\n    ON PPA.PropertyApplicationNo = PR.PropertyApplicationNo\nLEFT JOIN pa_Party PP\n    ON PPA.PropertyApplicationNo = PP.PropertyApplicationNo\nLEFT JOIN pa_Organization PO\n    ON PP.PartyNo = PO.PartyNo\nLEFT JOIN la_chequedetail LCD\n    ON LA.LandAcquisitionNo = LCD.LandAcquisitionNo\nWHERE PP.CasteCode = '1203';\n```\n\n**📋 Query Details:**\n• Filters lands acquired by Government (CasteCode '1203')\n• Shows buyer organization name\n• Displays acquisition purpose and mutation date\n• Includes payment details (cheque amount, cheque number)\n• Shows sale consideration value\n\n**💡 Note:** CasteCode '1203' represents Government lands acquisition";
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
            return "📊 **Query for Single/Joint Count:**\n\n```sql\nSELECT \n    d.LocationName,\n    SUM(CASE \n        WHEN \n            a.OwnerName LIKE '%,%' OR \n            a.OwnerName LIKE '% र %' OR \n            a.OwnerName LIKE '% अनि %' OR \n            a.OwnerName LIKE '% तथा %' OR \n            a.OwnerName LIKE '%/%' OR \n            a.OwnerName LIKE '% संग %' OR \n            a.OwnerName LIKE '% एवं %'\n        THEN 1 \n        ELSE 0 \n    END) AS JointOwners,\n    COUNT(DISTINCT a.KhatiyanNo) AS TotalOwners\nFROM lr_Khatiyan a\nINNER JOIN lr_Khasra b \n    ON a.LocationCode = b.LocationCode AND a.KhatiyanNo = b.KhatiyanNo\nINNER JOIN c_lr_Location d \n    ON a.LocationCode = d.LocationCode\nWHERE (b.Mflag IS NULL OR b.Mflag = 'N') \n  AND a.LocationCode LIKE '2%'\nGROUP BY d.LocationName\nORDER BY d.LocationName;\n```";
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

        // ==================== TOTAL AREA QUERIES ====================
        if (message.includes('total area') || (message.includes('sum') && message.includes('area'))) {
            return "📐 **Total Area Queries**\n\n" +
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                   "**📌 QUERY 1: Area of Entire State (District-wise)**\n" +
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                   "```sql\n" +
                   "SELECT \n" +
                   "    d.LocationName,\n" +
                   "    COUNT(DISTINCT b.KhasraNumber) AS TotalPlots,\n" +
                   "    SUM(b.TotArea) AS TotalArea\n" +
                   "FROM lr_Khatiyan a\n" +
                   "INNER JOIN lr_Khasra b \n" +
                   "    ON a.LocationCode = b.LocationCode \n" +
                   "    AND a.KhatiyanNo = b.KhatiyanNo\n" +
                   "INNER JOIN c_lr_Location d\n" +
                   "    ON a.LocationCode = d.LocationCode\n" +
                   "WHERE (b.Mflag IS NULL OR b.Mflag = 'N')\n" +
                   "GROUP BY d.LocationName\n" +
                   "ORDER BY d.LocationName;\n" +
                   "```\n\n" +
                   "**📊 Output:** Location-wise breakdown of total plots and total area\n\n" +
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                   "**📌 QUERY 2: Area of a Specific Village**\n" +
                   "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                   "```sql\n" +
                   "SELECT SUM(kh.TotArea) AS TotalArea\n" +
                   "FROM dbo.lr_Khasra AS kh\n" +
                   "INNER JOIN dbo.lr_Khatiyan AS kt \n" +
                   "    ON kh.KhatiyanNo = kt.KhatiyanNo\n" +
                   "    AND kh.LocationCode = kt.LocationCode\n" +
                   "WHERE kt.LocationCode LIKE '510101';\n" +
                   "```\n\n" +
                   "**📍 How to Use Village Query:**\n" +
                   "• Replace `'510101'` with your actual village LocationCode\n" +
                   "• Use `LIKE '510101'` for exact match\n" +
                   "• Use `LIKE '5101%'` for all villages under a block\n" +
                   "• Use `LIKE '51%'` for all villages under a district\n\n" +
                   "**💡 Notes:**\n" +
                   "• Both queries exclude deleted/flagged records (Mflag IS NULL OR Mflag = 'N')\n" +
                   "• Query 1 groups data by LocationName (District/Block/Village level)\n" +
                   "• Query 2 returns total area for a specific village code\n" +
                   "• Ensure LocationCode format matches your database schema";
        }

        if (message.includes('sdc')) {
            return "🔐 **SDC Server Details:**\n\n• Node Internal IP: `10.182.95.136`\n• Node External IP: `164.100.126.44`\n• Server Name: `WEB-9/SSDC`\n• Server Password: `$$web9@12345$#`";
        }

        // ==================== SCRIPTS ====================

        // ==================== PYTHON SCRIPT TO COUNT FEATURES ====================
        if (message.includes('python script to count feature') || message.includes('count features python') || message.includes('qgs feature count') || message.includes('featureCount python')) {
            return "🐍 **Python Script to Count Features in QGIS:**\n\n" +
                   "```python\n" +
                   "print(sum(l.featureCount() for l in QgsProject.instance().mapLayers().values() if l.type() == QgsMapLayer.VectorLayer))\n" +
                   "```\n\n" +
                   "**📊 Output:** Total number of features across all vector layers in your current QGIS project";
        }

        // ==================== SHELL SCRIPT FOR MAINSERVER CSV ====================
        if (message.includes('shell script for mainserver csv') || message.includes('mainserver csv') || message.includes('farmerid csv') || message.includes('bcp script')) {
            return "📁 **Shell Script for Mainserver CSV Export:**\n\n```batch\necho state_code,district_code,sub_district_code,village_code,Land_Usage_Type,Land_Ownership,State_land_unique_code,Survey_Number,khata_no,farm_land_plotid,state_land_owner_number,state_land_main_owner_number,owner_name_local,identifier_name_local,indentifier_type,mutation_date,mutation_type,area_of_parcel_Integer_Part,area_of_parcel_Decimal_Part,area_of_parcel_unit,ownership_type,Owner_Aadhaar_as_per_RoR,Government_Liabilities,Public_Liabilities,Land_Type,Owner_PAN_as_per_RoR,gataseqno,flp_owner_no > D:\\farmerid_header.csv && bcp \"SELECT state_code,district_code,sub_district_code,village_code,Land_Usage_Type,Land_Ownership,State_land_unique_code,Survey_Number,khata_no,farm_land_plotid,state_land_owner_number,state_land_main_owner_number,owner_name_local,identifier_name_local,indentifier_type,mutation_date,mutation_type,area_of_parcel_Integer_Part,area_of_parcel_Decimal_Part,area_of_parcel_unit,ownership_type,Owner_Aadhaar_as_per_RoR,Government_Liabilities,Public_Liabilities,Land_Type,Owner_PAN_as_per_RoR,gataseqno,flp_owner_no FROM ILRMS_MAIN.dbo.Farmerid\" queryout \"D:\\farmerid_data.csv\" ILRMS-DB -T -c -t, -C 65001 && copy /b D:\\farmerid_header.csv + D:\\farmerid_data.csv D:\\farmerid.csv && del D:\\farmerid_header.csv D:\\farmerid_data.csv && echo Done! CSV saved to D:\\farmerid.csv\n```\n\n**📋 Script Breakdown:**\n1. Creates header CSV with column names\n2. Exports data from Farmerid table using BCP\n3. Combines header + data into final CSV\n4. Deletes temporary files\n5. Confirms completion";
        }

        // ==================== SHELL SCRIPT FOR BHUNAKSHA SERVER CSV ====================
        if (message.includes('shell script for bhunakshaserver csv') || message.includes('bhunakshaserver csv') || message.includes('shakti csv') || message.includes('bhunaksha csv')) {
            return "📁 **PowerShell Script for Bhunaksha Server CSV Export:**\n\n```powershell\n$c=New-Object System.Data.SqlClient.SqlConnection('Server=SRC434036F71;Database=ILRMS;Integrated Security=True;TrustServerCertificate=True;');$c.Open();$cmd=$c.CreateCommand();$cmd.CommandText='SELECT state_code,district_code,sub_district_code,village_code,Land_Usage_Type,Land_Ownership,State_land_unique_code,Survey_Number,khata_no,farm_land_plotid,state_land_owner_number,state_land_main_owner_number,owner_name_local,identifier_name_local,indentifier_type,mutation_date,mutation_type,area_of_parcel_Integer_Part,area_of_parcel_Decimal_Part,area_of_parcel_unit,ownership_type,Owner_Aadhaar_as_per_RoR,Government_Liabilities,Public_Liabilities,Land_Type,Owner_PAN_as_per_RoR,gataseqno,flp_owner_no,owner_suffix FROM Shakti';$r=$cmd.ExecuteReader();$dt=New-Object System.Data.DataTable;$dt.Load($r);$c.Close();$dt | Export-Csv 'E:\\shakti.csv' -NoTypeInformation -Encoding UTF8;Write-Host 'Done! CSV exported to E:\\shakti.csv with UTF-8 (Devanagari preserved!)'\n```\n\n**📋 Script Details:**\n• Database: ILRMS on Server SRC434036F71\n• Table: Shakti\n• Output: E:\\shakti.csv\n• Encoding: UTF-8 (Preserves Devanagari/Nepali text)\n• Includes owner_suffix column\n\n**💡 How to Run:**\n1. Open PowerShell as Administrator\n2. Copy and paste the script\n3. Press Enter to execute";
        }

        // ==================== PASSWORDS ====================

        if (message.includes('ilrms credential') || message.includes('ilrms password')) {
            return "🔐 Username: dilrmp-admin \n Password: Pass@123$";
        }
        
        if (message.includes('black') && (message.includes('pc') || message.includes('computer'))) {
            return "🔐 Black PC Password: **1982**";
        }

        if (message.includes('white') && (message.includes('pc') || message.includes('computer'))) {
            return "🔐 White PC Password: **181993**";
        }

        if ((message.includes('head office') || message.includes('projector')) && (message.includes('pc') || message.includes('cpu'))) {
            return "🔐 Head Office/Projector PC Password: **281376**";
        }
        
        if (message.includes('head office') || message.includes('headoffice') || message.includes('Headoffice')) {
            return "🔐 Head Office WiFi:\n• SSID: MEETING@2025\n• Password: LRDMD2025";
        }

        if (message.includes('dilrmp facebook') || message.includes('facebook') || message.includes('Facebook')) {
            return "🔐 **DILRMP Facebook Login:**\n\n• Username: dilrmpsikkim@gmail.com\n• Password: Dilrmp@123";
        }

        if (message.includes('office laptop') || (message.includes('laptop') && message.includes('password'))) {
            return "🔐 Office Laptop Password: **chung@tshering**";
        }

        if (message.includes('dilrmp account') || (message.includes('dilrmp') && message.includes('password'))) {
            return "🔐 DILRMP Account Password: **revenueland@123**";
        }

        if (message.includes('programmers') || message.includes('programmer wifi')) {
            return "🔐 Programmers WiFi Password: **ilrms@2026**";
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

        // ==================== GOVT ID PASSWORD ====================
        if (message.includes('govt id') || message.includes('govt id password') || message.includes('government id password') || message.includes('govt email')) {
            return "🔐 **Government ID Login Credentials:**\n\n• Email: office.dilrmp@sikkim.gov.in\n• Password: 5riju@Xcom";
        }
        
        // ==================== DEFAULT RESPONSES ====================
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello there! 👋 I'm Xtron, your personal assistant. How can I help you today?";
        }
        
        if (message.includes('help') || message.includes('what can you do')) {
            return "🤖 **I can help you with:**\n\n• 🔐 Bhunaksha login credentials\n• 📊 Database queries for land records\n• 📝 Excel formulas\n• 🔑 Office passwords\n• 📧 Gatishakti/Janparichay info\n• 📋 SDC server details\n• 📈 Mutation & Registration counts\n• 📐 Total area calculations\n\n*Try using the 'Quick Prompts' dropdown for common questions!*";
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
            return "🚀 **Xtron Features:**\n\n• Quick access to database queries\n• Office credentials management\n• Excel formula generator\n• Property records information\n• Mutation & registration statistics\n• Total area calculations\n• And much more!";
        }
        
        if (message.includes('bye') || message.includes('goodbye')) {
            return "Goodbye! 👋 It was great chatting with you. Come back anytime!";
        }
        
        if (message.includes('thank')) {
            return "You're welcome! 😊 Is there anything else I can help you with?";
        }
        
        // Default response if no match found
        return "I'm not sure about that. 🤔 Try using the **Quick Prompts** dropdown or ask me about:\n\n• Database queries\n• Login credentials\n• Passwords\n• Excel formulas\n• Gatishakti/Janparichay\n• Mutation counts\n• Registration counts\n• Total area";
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
