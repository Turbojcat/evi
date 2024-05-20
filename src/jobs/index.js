const cron = require('node-cron');
async function scheduleJobs(client) {
// Schedule your recurring jobs or tasks here using a library like node-cron
// Example: Send a daily summary message to a specific channel
cron.schedule('0 0 * * *', async () => {
const channel = client.channels.cache.get('CHANNEL_ID');
await channel.send('Daily summary: ...');
});
}

module.exports = {
scheduleJobs,
};