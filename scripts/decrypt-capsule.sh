#!/bin/bash

################################################################################
# GitHub Time Capsule - Decryption Script
# 
# 🎆 THE UNVEILING - January 1, 2035 🎆
#
# This script decrypts all sealed messages from the GitHub Time Capsule.
# It should be run on January 1, 2035, or after the decryption key is published.
#
# Prerequisites:
# - GPG installed on your system
# - Private key imported (see instructions below)
# - Passphrase available
#
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo ""
echo -e "${PURPLE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                ║${NC}"
echo -e "${PURPLE}║          🕰️  THE GITHUB TIME CAPSULE UNVEILING 🕰️              ║${NC}"
echo -e "${PURPLE}║                                                                ║${NC}"
echo -e "${PURPLE}║                  January 1, 2035                               ║${NC}"
echo -e "${PURPLE}║                                                                ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Welcome to the future. Let's reveal the messages from the past.${NC}"
echo ""

# Check if GPG is installed
if ! command -v gpg &> /dev/null; then
    echo -e "${RED}❌ Error: GPG is not installed.${NC}"
    echo ""
    echo "Please install GPG:"
    echo "  - Linux: sudo apt-get install gnupg"
    echo "  - macOS: brew install gnupg"
    echo "  - Windows: Download from https://www.gpg4win.org/"
    exit 1
fi

echo -e "${GREEN}✅ GPG is installed${NC}"

# Check if private key is imported
if ! gpg --list-secret-keys | grep -q "time-capsule-2035"; then
    echo ""
    echo -e "${YELLOW}⚠️  Private key not found in GPG keyring${NC}"
    echo ""
    echo "Please import the private key first:"
    echo ""
    echo "  gpg --import private-key.asc"
    echo ""
    echo "The private key should have been stored securely since 2025."
    echo "Check the SETUP.md file for key storage locations."
    echo ""
    read -p "Press Enter after importing the key, or Ctrl+C to exit..."
    
    # Check again
    if ! gpg --list-secret-keys | grep -q "time-capsule-2035"; then
        echo -e "${RED}❌ Private key still not found. Exiting.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Private key found${NC}"
echo ""

# Create output directory
OUTPUT_DIR="decrypted-messages"
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}📂 Output directory: $OUTPUT_DIR${NC}"
echo ""

# Count sealed messages
SEALED_DIR="sealed"
if [ ! -d "$SEALED_DIR" ]; then
    echo -e "${RED}❌ Error: Sealed directory not found!${NC}"
    echo "Make sure you're running this script from the repository root."
    exit 1
fi

TOTAL_FILES=$(ls -1 "$SEALED_DIR"/*.gpg 2>/dev/null | wc -l)

if [ "$TOTAL_FILES" -eq 0 ]; then
    echo -e "${RED}❌ No sealed messages found in $SEALED_DIR${NC}"
    exit 1
fi

echo -e "${CYAN}🔍 Found ${TOTAL_FILES} sealed messages${NC}"
echo ""
echo -e "${YELLOW}⏳ Beginning decryption process...${NC}"
echo ""

# Counters
SUCCESS_COUNT=0
FAIL_COUNT=0

# Decrypt each file
for encrypted_file in "$SEALED_DIR"/*.gpg; do
    # Get filename without path and extension
    filename=$(basename "$encrypted_file" .gpg)
    
    echo -e "${BLUE}🔓 Decrypting: $filename${NC}"
    
    # Output file path
    output_file="$OUTPUT_DIR/$filename"
    
    # Attempt decryption
    if gpg --quiet --batch --yes --decrypt --output "$output_file" "$encrypted_file" 2>/dev/null; then
        echo -e "${GREEN}   ✅ Success${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo -e "${RED}   ❌ Failed${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    
    echo ""
done

# Summary
echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}                    DECRYPTION COMPLETE                        ${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}✅ Successfully decrypted: $SUCCESS_COUNT messages${NC}"

if [ "$FAIL_COUNT" -gt 0 ]; then
    echo -e "${RED}❌ Failed to decrypt: $FAIL_COUNT messages${NC}"
fi

echo ""
echo -e "${CYAN}📁 Decrypted messages are in: $OUTPUT_DIR/${NC}"
echo ""

# Create index file
INDEX_FILE="$OUTPUT_DIR/INDEX.md"
echo "# 🕰️ GitHub Time Capsule - Decrypted Messages" > "$INDEX_FILE"
echo "" >> "$INDEX_FILE"
echo "**Sealed:** October 17, 2025 - December 31, 2034" >> "$INDEX_FILE"
echo "**Unveiled:** January 1, 2035" >> "$INDEX_FILE"
echo "" >> "$INDEX_FILE"
echo "**Total Messages:** $SUCCESS_COUNT" >> "$INDEX_FILE"
echo "" >> "$INDEX_FILE"
echo "---" >> "$INDEX_FILE"
echo "" >> "$INDEX_FILE"
echo "## Messages" >> "$INDEX_FILE"
echo "" >> "$INDEX_FILE"

# List all decrypted files
for decrypted_file in "$OUTPUT_DIR"/*.txt; do
    if [ -f "$decrypted_file" ]; then
        username=$(basename "$decrypted_file" .txt)
        echo "- [\`$username\`](./$username.txt)" >> "$INDEX_FILE"
    fi
done

echo -e "${GREEN}✅ Created index file: $INDEX_FILE${NC}"
echo ""

# Final message
echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}🎉 ${BOLD}The time capsule has been opened!${NC}"
echo ""
echo -e "${CYAN}Messages from ${SUCCESS_COUNT} developers, frozen in time since 2025,${NC}"
echo -e "${CYAN}are now revealed. Welcome to the future we hoped for.${NC}"
echo ""
echo -e "${YELLOW}Take your time reading through these messages.${NC}"
echo -e "${YELLOW}Each one is a window into who we were and what we believed.${NC}"
echo ""
echo -e "${GREEN}Thank you for being part of this journey across time.${NC}"
echo ""
echo -e "${PURPLE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Open index in default browser (optional)
read -p "Would you like to create a web viewer for the messages? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Create simple HTML viewer
    HTML_FILE="$OUTPUT_DIR/viewer.html"
    
    cat > "$HTML_FILE" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Time Capsule - The Unveiling</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            text-align: center;
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .subtitle {
            text-align: center;
            color: #666;
            font-size: 1.2em;
            margin-bottom: 40px;
        }
        .message-list {
            list-style: none;
            padding: 0;
        }
        .message-item {
            padding: 15px;
            margin: 10px 0;
            background: #f5f5f5;
            border-radius: 5px;
            border-left: 4px solid #667eea;
            cursor: pointer;
            transition: all 0.3s;
        }
        .message-item:hover {
            background: #ebebeb;
            transform: translateX(5px);
        }
        .stats {
            text-align: center;
            padding: 20px;
            background: #f0f0f0;
            border-radius: 5px;
            margin: 30px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🕰️ The GitHub Time Capsule</h1>
        <div class="subtitle">Messages from 2025, Revealed January 1, 2035</div>
        
        <div class="stats">
            <h2>📊 Statistics</h2>
            <p><strong>Total Messages:</strong> <span id="messageCount">0</span></p>
            <p><strong>Sealed:</strong> October 2025 - December 2034</p>
            <p><strong>Unveiled:</strong> January 1, 2035</p>
        </div>
        
        <h2>💌 Messages</h2>
        <ul class="message-list" id="messageList">
            <!-- Messages will be loaded here -->
        </ul>
        
        <div class="footer">
            <p>Each message is a voice from the past, speaking to the future.</p>
            <p>Thank you to all the developers who contributed their thoughts across time.</p>
        </div>
    </div>
    
    <script>
        // This would need to be populated with actual message data
        // For now, it's a template
        document.getElementById('messageCount').textContent = 'Loading...';
    </script>
</body>
</html>
EOF
    
    echo -e "${GREEN}✅ Created web viewer: $HTML_FILE${NC}"
    echo ""
    echo "Open $HTML_FILE in your browser to view messages."
fi

echo ""
echo -e "${CYAN}🌟 See you in another 10 years? 🌟${NC}"
echo ""
