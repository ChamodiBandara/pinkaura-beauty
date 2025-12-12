# 🖥️ Dual Screen Setup - Troubleshooting Guide

## How to Test the Dual-Screen Feature

### Step 1: Start the Frontend Server
```powershell
cd "D:\Rextro project\pinkaura-beauty\frontend"
npm run dev
```

You should see: `Local: http://localhost:5173/`

### Step 2: Open Two Browser Windows (SAME BROWSER!)

**IMPORTANT:** Both windows MUST be in the SAME browser (both Chrome, or both Edge, etc.)

#### Window 1 - TV Screen
1. Open Chrome/Edge
2. Go to: `http://localhost:5173/`
3. Press F12 to open Developer Console
4. Look for: `🎬 TVListener mounted and ready!`
5. Look for: `👂 [TV] Starting to listen for commands...`

#### Window 2 - Admin Dashboard
1. Open a NEW TAB in the SAME browser
2. Go to: `http://localhost:5173/admin`
3. Press F12 to open Developer Console
4. Click any button (e.g., "Enter Name")
5. Look for: `📡 [ADMIN] Sending command: NAVIGATE /enter-name`

### Step 3: Check What You See

#### ✅ If Working:
- **Admin console shows:** `📡 [ADMIN] Sending command: NAVIGATE /enter-name`
- **TV console shows:** `📺 [TV] Received command: {type: 'NAVIGATE', payload: '/enter-name'}`
- **TV window navigates** to the Enter Name page

#### ❌ If NOT Working - Common Issues:

**Problem 1: TV window doesn't show listener messages**
- **Cause:** TVListener not mounted
- **Fix:** Refresh the TV window (F5)
- **Check:** Console should show `🎬 TVListener mounted and ready!`

**Problem 2: Admin sends but TV doesn't receive**
- **Cause:** Different browsers or different origins
- **Fix:** 
  - Close both windows
  - Open BOTH in the same browser (both Chrome or both Edge)
  - Both must use `http://localhost:5173/` (same protocol, port)

**Problem 3: BroadcastChannel not supported**
- **Cause:** Old browser
- **Fix:** Use Chrome 54+, Edge 79+, Firefox 38+, or Safari 15.4+

**Problem 4: Console shows errors about BroadcastChannel**
- **Cause:** Secure context issue
- **Fix:** Use `http://localhost` (not IP address)

### Step 4: Live Debug Test

Open both consoles side-by-side and click a button. You should see:

**Admin Console:**
```
🎮 Admin button clicked: /enter-name Enter Name Entry Page
📡 [ADMIN] Sending command: NAVIGATE /enter-name
📡 [ADMIN] Message posted to channel: {type: 'NAVIGATE', payload: '/enter-name'}
```

**TV Console:**
```
📺 [TV] Received command: {type: 'NAVIGATE', payload: '/enter-name'}
🎯 TVListener received message: {type: 'NAVIGATE', payload: '/enter-name'}
🚀 Navigating to: /enter-name
```

## Alternative Solution (If BroadcastChannel Doesn't Work)

If BroadcastChannel fails, you can use **localStorage + polling**:

1. Admin writes to localStorage: `localStorage.setItem('tv_command', '/enter-name')`
2. TV polls localStorage every 100ms and navigates when it changes

Would you like me to implement this fallback solution?
