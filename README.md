# LTAStatsBoard Application

## Overview

**SpeedStatsBoard** is a React-based web application designed specifically for **speedrunners hosting their own Live Time Attack events**. It provides an easy way to **manage, track, and display runner times** during live competitions — all from a browser-based interface.  

The app supports **manual time entry**, **real-time leaderboard updates**, and **OBS integration** for seamless live streaming overlays. Whether you're managing a casual race or a large-scale time attack event, this tool ensures every runner’s performance is accurately tracked and displayed.

NOTE: This Application is not for public use. You must download/clone this and deploy this JS application yourself!
---

## Installation Instructions

### Prerequisites

Before starting, make sure the following are installed:

- **Node.js** — version **22.21.0 required**
- **npm** — comes bundled with Node.js

---

### Step-by-Step Setup

#### 1. Install Node.js 22.21.0

Download and install Node.js **v22.21.0** from [nodejs.org](https://nodejs.org/).

Verify the installation:
```bash
node --version
```
Expected output:
```
v22.21.0
```

---

#### 2. Clone or Download the Project
```bash
# Using git
git clone <repository-url>
cd <project-directory>
```

---

#### 3. Install Dependencies
```bash
npm install
```
This installs all necessary packages and dependencies.

---

#### 4. Start the Development Server
```bash
npm start
```

- Runs the app in **development mode**  
- Open **http://localhost:5000** in your browser  
- The app reloads automatically when you make changes  
- Lint errors will appear in your terminal if detected

---

## Available Scripts

| Command | Description |
|----------|--------------|
| `npm install` | Installs all dependencies. Run this first. |
| `npm run build` | Builds the app for production, optimizing for best performance. |
| `npm start` | Starts the app locally at `http://localhost:5000`. |

The production build is minified, versioned, and ready for deployment.

---

## Using the Application

### Enter Runner Information
- Enter **7 runner names** in the provided text fields  
- Optionally include their **therun.gg username** for OBS stat tracking  

---

### ⏱️ Record Finish Times
- When a runner finishes, **manually enter their time** in the format:
  ```
  HH:MM:SS.MMM
  ```
  Example: `00:47:12.563`
- Ensure hours, minutes, seconds, and milliseconds are valid numeric values.

---

### Save Runner Data
- Use **Save Runner** to update an individual runner’s time or data  
- Data is **automatically persisted** whenever updates are made  

---

### OBS Integration
- Navigate to the **OBS Links** tab to access browser source URLs  
- Copy and paste these URLs directly into OBS to display:
  - Individual runner times
  - The live leaderboard  

---

### View Standings
- Use the **Leaderboard tab** to see up-to-date event standings  
- Leaderboard updates in **real time** as new times are entered  

---

## Important Notes

- All data is automatically saved when runners are updated  
- Verify time formatting to prevent validation errors  
- Leaderboard reflects real-time data updates  

---

## Troubleshooting

### 1. Verify Node.js Version
```bash
node --version
```
Must be **exactly `v22.21.0`**.

---

### 2. Clear and Reinstall Dependencies
If errors occur during setup or runtime:
```bash
rm -rf node_modules
npm install
npm audit fix --force # To fix any other vulnerabilities if needed (NOT REQUIRED)
```

---

### 3. Port Already in Use
If port `5000` is occupied, the terminal will ask if you’d like to use another port — choose **Y** to continue.

---

## Credits
- GSA and CCG for inspiration for making LTA tools such as this
- TheRun.gg API for their simple and convenient use for scraping runner information
- NodeCG's speedcontrol application for giving me inspiration for making my own dashboard similar to theirs
- Programming was all done by GhostTSR [Any Issues Contact me through Discord: @ghosttsr] 
