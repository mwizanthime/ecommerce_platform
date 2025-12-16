import ngrok from 'ngrok';
import express from 'express';
const app = express();

// Your existing Express app setup
require('./server.js'); // or your main server file

const PORT = process.env.PORT || 5000;

async function startServerWithNgrok() {
  try {
    // Start your Express server
    app.listen(PORT, () => {
      console.log(`✅ Express server running on http://localhost:${PORT}`);
    });

    // Start ngrok
    const url = await ngrok.connect({
      addr: PORT,
      authtoken: process.env.NGROK_AUTH_TOKEN, // Your ngrok auth token
      region: 'eu' // or 'us', 'au', 'ap', 'sa', 'jp', 'in'
    });

    console.log(`
🎉 Ngrok tunnel created!
🌐 Public URL: ${url}
📱 Use this URL for PawaPay webhook configuration

💡 Webhook URL to configure in PawaPay dashboard:
${url}/api/standalone-payments/webhook

⚠️  Keep this terminal running to maintain the tunnel
    `);

    // Handle cleanup
    process.on('SIGINT', async () => {
      console.log('\n🔴 Shutting down ngrok tunnel...');
      await ngrok.disconnect();
      await ngrok.kill();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start ngrok:', error);
    process.exit(1);
  }
}

startServerWithNgrok();