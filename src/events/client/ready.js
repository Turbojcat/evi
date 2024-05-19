// /home/user/projects/evi/src/events/client/ready.js
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
      console.log(`Logged in as ${client.user.tag}`);
      // Perform additional setup or tasks on startup
    },
  };
  