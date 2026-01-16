# Project Setup Instructions

It looks like **Node.js** is not installed on your system. You need Node.js to run this dashboard application.

## 1. Install Node.js
Two easy options:

### Option A: Use the Installer (Easiest)
1. Go to [nodejs.org](https://nodejs.org/).
2. Download the **LTS (Long Term Support)** version for macOS.
3. Run the installer and follow the prompts.

### Option B: Use Homebrew (For Developers)
If you want to set up a developer environment:
1. Open your Terminal application.
2. Paste and run this command to install Homebrew (if you don't have it):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Then install Node.js:
   ```bash
   brew install node
   ```

## 2. Install Project Dependencies
Once Node.js is installed:
1. Open your terminal in this project folder:
   ```bash
   cd "/Users/chandlerlewis/Desktop/AntiGravity Google/copy-of-ip-agent_v9_extdb--4-"
   ```
2. Install the required libraries:
   ```bash
   npm install
   ```

## 3. Run the Dashboard
Start the development server:
```bash
npm run dev
```
Open your browser to `http://localhost:5173` to verify the dashboard upgrades!
