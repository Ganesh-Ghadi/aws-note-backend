module.exports = {
  apps: [
    {
      name: "notes-backend",
      script: "./src/server.js", // Points to your Node.js code
      instances: 1, // Number of instances to run (1 is fine for now, can be 'max' for cluster mode)
      autorestart: true, // Automatically restart if the app crashes
      watch: false, // Don't watch for file changes in production
      max_memory_restart: "500M", // Restart if it uses more than 500MB of RAM (prevents memory leaks)
    }
  ]
};
