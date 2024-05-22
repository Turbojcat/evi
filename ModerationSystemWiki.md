Moderation System Wiki
Overview
The moderation system is a comprehensive set of tools and commands designed to help moderators maintain a safe and orderly environment within a Discord server. It includes features such as warning users, logging moderation actions, and automated moderation to detect and flag potential rule violations.

Moderation Commands
The following commands are available to moderators and are located in the src/commands/moderation directory:

Ban (ban.js)
Description: Bans a user from the server.
Permissions: Ban Members
Usage: /ban <user> [reason]
Functionality:
Bans the specified user from the server.
Optionally includes a reason for the ban.
Logs the ban action in the designated moderation log channel.
Kick (kick.js)
Description: Kicks a user from the server.
Permissions: Kick Members
Usage: /kick <user> [reason]
Functionality:
Kicks the specified user from the server.
Optionally includes a reason for the kick.
Logs the kick action in the designated moderation log channel.
Mute (mute.js)
Description: Mutes a user in the server.
Permissions: Manage Roles
Usage: /mute <user> [duration] [reason]
Functionality:
Mutes the specified user in the server, preventing them from sending messages.
Optionally specifies a duration for the mute (e.g., 1h, 30m).
Optionally includes a reason for the mute.
Logs the mute action in the designated moderation log channel.
Unmute (unmute.js)
Description: Unmutes a previously muted user in the server.
Permissions: Manage Roles
Usage: /unmute <user>
Functionality:
Unmutes the specified user, allowing them to send messages again.
Logs the unmute action in the designated moderation log channel.
Warn (warn.js)
Description: Warns a user for a specific reason.
Permissions: Manage Messages
Usage: /warn <user> [reason]
Functionality:
Sends a direct message to the warned user with the reason for the warning.
Stores the warning in the database for future reference.
Logs the warning action in the designated moderation log channel.
Warnings (warnings.js)
Description: Shows the warnings for a specific user.
Permissions: Manage Messages
Usage: /warnings <user>
Functionality:
Retrieves the warnings for the specified user from the database.
Displays the warnings as an embedded message, including the reason for each warning.
Remove Warning (removeWarning.js)
Description: Removes a specific warning from a user.
Permissions: Manage Messages
Usage: /removewarning <user> <index>
Functionality:
Removes the warning at the specified index from the user's warning history.
Updates the database to reflect the removal of the warning.
Set Log Channel (setLogChannel.js)
Description: Sets the channel for logging moderation actions.
Permissions: Administrator
Usage: /setlogchannel <channel>
Functionality:
Sets the specified channel as the designated moderation log channel.
Moderation actions, such as warnings and bans, will be logged in this channel.
Remove Log Channel (removeLogChannel.js)
Description: Removes the designated moderation log channel.
Permissions: Administrator
Usage: /removelogchannel
Functionality:
Removes the previously set moderation log channel.
Moderation actions will no longer be logged.
Set Alert Channel (setAlertChannel.js)
Description: Sets the channel for sending moderation alerts.
Permissions: Administrator
Usage: /setalertchannel <channel>
Functionality:
Sets the specified channel as the designated moderation alert channel.
Automated moderation alerts for potential rule violations will be sent to this channel.
Remove Alert Channel (removeAlertChannel.js)
Description: Removes the designated moderation alert channel.
Permissions: Administrator
Usage: /removealertchannel
Functionality:
Removes the previously set moderation alert channel.
Moderation alerts will no longer be sent.
View Moderation Log (viewModLog.js)
Description: Views the moderation log.
Permissions: Manage Server
Usage: /viewmodlog
Functionality:
Retrieves the most recent moderation actions from the moderation log channel.
Displays the moderation log as an embedded message.
Auto Moderation
The moderation system includes an automated moderation feature that monitors messages sent in the server for potential rule violations. The auto-moderation functionality is implemented in the src/events/messageCreate.js file.

When a message is detected as a potential violation, the following actions are taken:

The message is flagged and sent to the designated moderation alert channel.
The flagged message includes details such as the user who sent the message, the channel it was sent in, and the content of the message.
Moderators can review the flagged message and take appropriate action, such as warning the user or removing the message.
The criteria for flagging messages as potential rule violations can be customized based on the server's specific rules and requirements. This can include detecting inappropriate language, links to prohibited websites, or other defined criteria.

Database Integration
The moderation system integrates with a database to store and manage moderation data. The database models and configurations are located in the src/database directory.

The following database models are used:

ModLogChannel: Stores the designated moderation log channel for each server.
ModAlertChannel: Stores the designated moderation alert channel for each server.
Warning: Stores the warnings issued to users, including the user ID, reason, and moderator who issued the warning.
The database integration allows for persistent storage of moderation actions and enables features such as viewing a user's warning history and removing specific warnings.

Conclusion
The moderation system provides a robust set of tools and automated features to assist moderators in maintaining a well-moderated Discord server. By utilizing the available commands and configuring the auto-moderation settings, moderators can efficiently handle rule violations, issue warnings, and keep track of moderation actions.

Remember to grant the necessary permissions to moderators and administrators to ensure they have access to the appropriate moderation commands. Regular monitoring of the moderation log and alert channels is recommended to stay informed about moderation activities and address any issues promptly.