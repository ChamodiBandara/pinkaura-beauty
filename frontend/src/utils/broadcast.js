// frontend/src/utils/broadcast.js

// 1. Create a private radio channel named 'pink_aura_demo'
const channel = new BroadcastChannel('pink_aura_demo');

console.log('🔧 BroadcastChannel initialized:', channel);
console.log('🔧 Channel name:', channel.name);

// 2. Function for the LAPTOP to send commands
export const sendCommand = (command, data = null) => {
  console.log(`📡 [ADMIN] Sending command: ${command}`, data);
  const message = { type: command, payload: data };
  console.log(`📡 [ADMIN] Posting message to channel '${channel.name}':`, message);
  channel.postMessage(message);
  console.log(`📡 [ADMIN] ✅ Message posted successfully`);
};

// 3. Function for the TV to listen for commands
export const listenForCommands = (callback) => {
  console.log(`👂 [TV] Starting to listen for commands on channel '${channel.name}'...`);
  
  const handler = (event) => {
    console.log(`📺 [TV] ✅ Received message on channel:`, event.data);
    callback(event.data);
  };
  
  channel.addEventListener('message', handler);
  console.log(`👂 [TV] ✅ Listener registered for channel '${channel.name}'`);
  
  // Return cleanup function
  return () => {
    channel.removeEventListener('message', handler);
    console.log(`🔇 [TV] Listener removed from channel '${channel.name}'`);
  };
};