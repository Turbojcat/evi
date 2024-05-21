Ticket System Wiki
Welcome to the comprehensive wiki for the Ticket System! This document provides detailed information about all the commands, functions, and features of the Ticket System, along with examples to help you understand how everything works.

Table of Contents
Introduction
Commands
Ticket Creation
Ticket Management
Ticket Questions
Ticket Categories
Ticket Staff Roles
Ticket Transcript
Ticket Log
Ticket Statistics
Ticket Feedback
Functions
Ticket Creation Process
Ticket Closing Process
Ticket Inactivity Reminder
Examples
Creating a Ticket
Managing Ticket Questions
Managing Ticket Categories
Managing Ticket Staff Roles
Setting Up Ticket Transcript
Setting Up Ticket Log
Viewing Ticket Statistics
Providing Ticket Feedback
Conclusion
Introduction
The Ticket System is a powerful and feature-rich solution for managing user inquiries and support requests within a Discord server. It provides a streamlined process for creating, managing, and resolving tickets, ensuring efficient communication between users and staff members.

Commands
The Ticket System offers a wide range of commands to facilitate ticket management and configuration. Here are the available commands:

Ticket Creation
/ticketpanel add: Adds a ticket panel to the specified channel, allowing users to create tickets.
/ticketpanel remove: Removes the ticket panel from the specified channel.
Ticket Management
/ticketclose: Closes the current ticket and archives the conversation.
/ticketdelete: Deletes the current ticket and its associated data.
Ticket Questions
/ticketquestion add [question]: Adds a custom question to be asked when a user creates a ticket.
/ticketquestion remove [question]: Removes a custom question from the ticket creation process.
Ticket Categories
/ticketcategory add [category]: Adds a new category for organizing tickets.
/ticketcategory remove [category]: Removes a category from the ticket system.
Ticket Staff Roles
/ticketrole add [role]: Adds a staff role that has access to manage tickets.
/ticketrole remove [role]: Removes a staff role from the ticket system.
Ticket Transcript
/tickettranscript set [channel]: Sets the channel where ticket transcripts will be sent when a ticket is closed.
/tickettranscript remove: Removes the ticket transcript channel.
Ticket Log
/ticketlog set [channel]: Sets the channel where ticket logs will be sent when a ticket is closed or deleted.
/ticketlog remove: Removes the ticket log channel.
Ticket Statistics
/ticketstats: Displays statistics about the ticket system, including the total number of tickets, open tickets, and closed tickets.
Ticket Feedback
/ticketfeedback [rating] [comment]: Allows users to provide feedback and rate their experience after a ticket is closed.
Functions
The Ticket System includes several functions that automate and enhance the ticket management process:

Ticket Creation Process
When a user clicks on the "Create Ticket" button in the ticket panel, a new ticket is created. The system prompts the user with any custom questions defined by the server administrators. Once the user provides the necessary information, a new ticket channel is created, and the user is granted access to it. Staff members assigned to the ticket system are notified about the new ticket.

Ticket Closing Process
When a staff member closes a ticket using the /ticketclose command, the ticket is marked as closed, and the conversation is archived. A transcript of the ticket conversation is generated and sent to the designated ticket transcript channel. The user who created the ticket is notified that their ticket has been closed.

Ticket Inactivity Reminder
The Ticket System includes an inactivity reminder feature. If a ticket remains inactive for a specified period (e.g., 24 hours), the system sends a reminder message to the ticket channel, prompting the user or staff members to update or close the ticket. This helps ensure that tickets are actively managed and resolved in a timely manner.

Examples
Here are some examples to illustrate how the Ticket System commands and functions work:

Creating a Ticket
A user clicks on the "Create Ticket" button in the ticket panel.
The system prompts the user with any custom questions defined by the server administrators.
The user provides the necessary information and submits the ticket.
A new ticket channel is created, and the user is granted access to it.
Staff members assigned to the ticket system are notified about the new ticket.
Managing Ticket Questions
To add a custom question to the ticket creation process, a staff member uses the command: /ticketquestion add "Please provide a detailed description of your issue.".
To remove a custom question, a staff member uses the command: /ticketquestion remove "Please provide a detailed description of your issue.".
Managing Ticket Categories
To add a new ticket category, a staff member uses the command: /ticketcategory add "Technical Support".
To remove a ticket category, a staff member uses the command: /ticketcategory remove "Technical Support".
Managing Ticket Staff Roles
To add a staff role that has access to manage tickets, a staff member uses the command: /ticketrole add @SupportTeam.
To remove a staff role from the ticket system, a staff member uses the command: /ticketrole remove @SupportTeam.
Setting Up Ticket Transcript
To set the channel where ticket transcripts will be sent, a staff member uses the command: /tickettranscript set #ticket-transcripts.
To remove the ticket transcript channel, a staff member uses the command: /tickettranscript remove.
Setting Up Ticket Log
To set the channel where ticket logs will be sent, a staff member uses the command: /ticketlog set #ticket-logs.
To remove the ticket log channel, a staff member uses the command: /ticketlog remove.
Viewing Ticket Statistics
To view statistics about the ticket system, a staff member uses the command: /ticketstats.
The system displays information such as the total number of tickets, open tickets, and closed tickets.
Providing Ticket Feedback
After a ticket is closed, the user who created the ticket can provide feedback using the command: /ticketfeedback 4 "The support team was very helpful and resolved my issue quickly.".
The feedback, including the rating and comment, is recorded in the system for future reference and analysis.
Conclusion
The Ticket System provides a comprehensive solution for managing user inquiries and support requests within a Discord server. With its wide range of commands and automated functions, it streamlines the ticket management process, ensuring efficient communication and timely resolution of issues. By leveraging the features of the Ticket System, server administrators can enhance user support and improve overall user satisfaction.

For any further questions or assistance, please refer to the documentation or reach out to the support team.