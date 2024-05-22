// src/utils/placeholders.js
const CustomPlaceholder = require('../database/models/CustomPlaceholder');
const PremiumUser = require('../database/models/PremiumUser');

async function replacePlaceholders(content, interaction) {
  const customPlaceholders = await CustomPlaceholder.findAll();
  const isPremiumUser = await PremiumUser.findOne({ where: { userId: interaction.user.id } });

  for (const placeholder of customPlaceholders) {
    if (!placeholder.premium || (placeholder.premium && isPremiumUser)) {
      const regex = new RegExp(`\\{${placeholder.code}\\}`, 'g');
      content = content.replace(regex, placeholder.description);
    }
  }

  // Replace built-in placeholders
  content = content.replace(/{member_roles}/g, interaction.member.roles.cache.map(role => role.name).join(', '));
  content = content.replace(/{member_id}/g, interaction.member.id);
  content = content.replace(/{member_displayName}/g, interaction.member.displayName);
  content = content.replace(/{member_joinedAt}/g, interaction.member.joinedAt.toDateString());
  content = content.replace(/{member_joinedTimestamp}/g, interaction.member.joinedTimestamp.toString());
  content = content.replace(/{member_nickname}/g, interaction.member.nickname);
  content = content.replace(/{user_joinedAt}/g, interaction.member.joinedAt.toDateString());
  content = content.replace(/{user_createdAt}/g, interaction.user.createdAt.toDateString());
  content = content.replace(/{user_avatar}/g, interaction.user.avatarURL());
  content = content.replace(/{user_id}/g, interaction.user.id);
  content = content.replace(/{user_tag}/g, interaction.user.tag);
  
  content = content.replace(/{user_permissions}/g, interaction.member.permissions.toArray().join(', '));
  content = content.replace(/{user_username}/g, interaction.user.username);
  content = content.replace(/{user}/g, interaction.user.toString());
  content = content.replace(/{server}/g, interaction.guild.name);
  content = content.replace(/{server_memberCount}/g, interaction.guild.memberCount.toString());
  content = content.replace(/{server_owner}/g, interaction.guild.owner.toString());
  content = content.replace(/{server_createdAt}/g, interaction.guild.createdAt.toDateString());
  content = content.replace(/{server_icon}/g, interaction.guild.iconURL());
  //economy
  content = content.replace(/{user_balance}/g, getUserBalance(interaction.user.id));
  content = content.replace(/{user_bank}/g, getUserBankBalance(interaction.user.id));
  
  // Premium placeholders
  if (isPremiumUser) {
    content = content.replace(/{server_joinedAt}/g, interaction.guild.joinedAt.toDateString());
    content = content.replace(/{server_boostCount}/g, interaction.guild.premiumSubscriptionCount.toString());
    content = content.replace(/{server_boostTier}/g, interaction.guild.premiumTier.toString());
    content = content.replace(/{server_owner_tag}/g, interaction.guild.owner.user.tag);
    content = content.replace(/{server_owner_id}/g, interaction.guild.ownerId);
    content = content.replace(/{server_name}/g, interaction.guild.name);
    content = content.replace(/{server_id}/g, interaction.guild.id);
    content = content.replace(/{server_ownerId}/g, interaction.guild.ownerId);
    content = content.replace(/{server_region}/g, interaction.guild.region);
    content = content.replace(/{server_verificationLevel}/g, interaction.guild.verificationLevel);
    content = content.replace(/{server_afkTimeout}/g, interaction.guild.afkTimeout.toString());
    content = content.replace(/{server_afkChannelId}/g, interaction.guild.afkChannelId);
    content = content.replace(/{server_systemChannelId}/g, interaction.guild.systemChannelId);
    content = content.replace(/{server_splash}/g, interaction.guild.splashURL());
    content = content.replace(/{server_banner}/g, interaction.guild.bannerURL());
    content = content.replace(/{server_rulesChannelId}/g, interaction.guild.rulesChannelId);
    content = content.replace(/{server_publicUpdatesChannelId}/g, interaction.guild.publicUpdatesChannelId);
    content = content.replace(/{server_preferredLocale}/g, interaction.guild.preferredLocale);
    content = content.replace(/{server_premiumTier}/g, interaction.guild.premiumTier.toString());
    content = content.replace(/{server_premiumSubscriptionCount}/g, interaction.guild.premiumSubscriptionCount.toString());
    content = content.replace(/{server_maxMembers}/g, interaction.guild.maximumMembers.toString());
    content = content.replace(/{server_maxPresences}/g, interaction.guild.maximumPresences.toString());
    content = content.replace(/{server_approximateMemberCount}/g, interaction.guild.approximateMemberCount.toString());
    content = content.replace(/{server_approximatePresenceCount}/g, interaction.guild.approximatePresenceCount.toString());
    content = content.replace(/{server_vanityURLCode}/g, interaction.guild.vanityURLCode);
    content = content.replace(/{server_description}/g, interaction.guild.description);
    content = content.replace(/{server_mfaLevel}/g, interaction.guild.mfaLevel.toString());
    content = content.replace(/{server_nsfwLevel}/g, interaction.guild.nsfwLevel);
    content = content.replace(/{server_explicitContentFilter}/g, interaction.guild.explicitContentFilter.toString());
    content = content.replace(/{server_defaultMessageNotifications}/g, interaction.guild.defaultMessageNotifications.toString());
    content = content.replace(/{server_premiumProgressBarEnabled}/g, interaction.guild.premiumProgressBarEnabled.toString());
    content = content.replace(/{server_verified}/g, interaction.guild.verified.toString());
    content = content.replace(/{server_partnered}/g, interaction.guild.partnered.toString());
    content = content.replace(/{server_available}/g, interaction.guild.available.toString());
    content = content.replace(/{server_large}/g, interaction.guild.large.toString());
    content = content.replace(/{server_shardId}/g, interaction.guild.shardId.toString());
    content = content.replace(/{server_channels_size}/g, interaction.guild.channels.cache.size.toString());
    content = content.replace(/{server_roles_size}/g, interaction.guild.roles.cache.size.toString());
    content = content.replace(/{server_emojis_size}/g, interaction.guild.emojis.cache.size.toString());
    content = content.replace(/{server_stickers_size}/g, interaction.guild.stickers.cache.size.toString());
    content = content.replace(/{server_voiceStates_size}/g, interaction.guild.voiceStates.cache.size.toString());
    content = content.replace(/{server_stagInstances_size}/g, interaction.guild.stageInstances.cache.size.toString());
    content = content.replace(/{server_invites_size}/g, interaction.guild.invites.cache.size.toString());
    content = content.replace(/{server_scheduledEvents_size}/g, interaction.guild.scheduledEvents.cache.size.toString());
    content = content.replace(/{server_bans_size}/g, interaction.guild.bans.cache.size.toString());
    content = content.replace(/{user_discriminator}/g, interaction.user.discriminator);
    content = content.replace(/{user_bot}/g, interaction.user.bot.toString());
    content = content.replace(/{user_system}/g, interaction.user.system.toString());
    content = content.replace(/{user_createdAt}/g, interaction.user.createdAt.toDateString());
    content = content.replace(/{user_createdTimestamp}/g, interaction.user.createdTimestamp.toString());
    content = content.replace(/{user_defaultAvatarURL}/g, interaction.user.defaultAvatarURL);
    content = content.replace(/{user_hexAccentColor}/g, interaction.user.hexAccentColor);
    content = content.replace(/{user_flags}/g, interaction.user.flags.toArray().join(', '));
    content = content.replace(/{user_banner}/g, interaction.user.bannerURL());
    content = content.replace(/{user_accentColor}/g, interaction.user.accentColor);
    content = content.replace(/{user_activity}/g, interaction.member.presence?.activities.map(activity => activity.name).join(', ') || 'None');
    content = content.replace(/{user_status}/g, interaction.member.presence?.status || 'offline');
    content = content.replace(/{user_premium_since}/g, interaction.member.premiumSince?.toDateString() || 'Not a Nitro Booster');
    content = content.replace(/{user_pending}/g, interaction.member.pending ? 'Yes' : 'No');
    content = content.replace(/{user_avatar_decoration}/g, interaction.user.avatarDecoration || 'None');
    content = content.replace(/{member_premiumSince}/g, interaction.member.premiumSince ? interaction.member.premiumSince.toDateString() : 'N/A');
    content = content.replace(/{member_premiumSinceTimestamp}/g, interaction.member.premiumSinceTimestamp ? interaction.member.premiumSinceTimestamp.toString() : 'N/A');
    content = content.replace(/{member_roles_size}/g, interaction.member.roles.cache.size.toString());
    content = content.replace(/{member_highestRole}/g, interaction.member.roles.highest.name);
    content = content.replace(/{member_displayColor}/g, interaction.member.displayHexColor);
    content = content.replace(/{member_permissions}/g, interaction.member.permissions.toArray().join(', '));
    content = content.replace(/{member_manageable}/g, interaction.member.manageable.toString());
    content = content.replace(/{member_kickable}/g, interaction.member.kickable.toString());
    content = content.replace(/{member_bannable}/g, interaction.member.bannable.toString());
    content = content.replace(/{member_moderatable}/g, interaction.member.moderatable.toString());
    content = content.replace(/{member_voice_channelId}/g, interaction.member.voice.channelId);
    content = content.replace(/{member_voice_channel}/g, interaction.member.voice.channel ? interaction.member.voice.channel.name : 'N/A');
    content = content.replace(/{member_voice_sessionId}/g, interaction.member.voice.sessionId);
    content = content.replace(/{member_voice_selfDeaf}/g, interaction.member.voice.selfDeaf.toString());
    content = content.replace(/{member_voice_selfMute}/g, interaction.member.voice.selfMute.toString());
    content = content.replace(/{member_voice_selfVideo}/g, interaction.member.voice.selfVideo.toString());
    content = content.replace(/{member_voice_serverDeaf}/g, interaction.member.voice.serverDeaf.toString());
    content = content.replace(/{member_voice_serverMute}/g, interaction.member.voice.serverMute.toString());
    content = content.replace(/{member_voice_suppress}/g, interaction.member.voice.suppress.toString());
    content = content.replace(/{member_voice_requestToSpeakTimestamp}/g, interaction.member.voice.requestToSpeakTimestamp ? interaction.member.voice.requestToSpeakTimestamp.toString() : 'N/A');
    content = content.replace(/{member_voice_streaming}/g, interaction.member.voice.streaming.toString());
    content = content.replace(/{channel_id}/g, interaction.channel.id);
    content = content.replace(/{channel_name}/g, interaction.channel.name);
    content = content.replace(/{channel_type}/g, interaction.channel.type);
    content = content.replace(/{channel_topic}/g, interaction.channel.topic);
    content = content.replace(/{channel_createdAt}/g, interaction.channel.createdAt.toDateString());
    content = content.replace(/{channel_createdTimestamp}/g, interaction.channel.createdTimestamp.toString());
    content = content.replace(/{channel_parentId}/g, interaction.channel.parentId);
    content = content.replace(/{channel_position}/g, interaction.channel.position.toString());
    content = content.replace(/{channel_permissionOverwrites_size}/g, interaction.channel.permissionOverwrites.cache.size.toString());
    content = content.replace(/{channel_nsfw}/g, interaction.channel.nsfw.toString());
    content = content.replace(/{channel_lastMessageId}/g, interaction.channel.lastMessageId);
    content = content.replace(/{channel_lastPinTimestamp}/g, interaction.channel.lastPinTimestamp ? interaction.channel.lastPinTimestamp.toString() : 'N/A');
    content = content.replace(/{channel_rateLimitPerUser}/g, interaction.channel.rateLimitPerUser.toString());
    content = content.replace(/{channel_threads_size}/g, interaction.channel.threads.cache.size.toString());
    content = content.replace(/{channel_memberCount}/g, interaction.channel.members.size.toString());
    content = content.replace(/{channel_messages_size}/g, interaction.channel.messages.cache.size.toString());
    content = content.replace(/{role_id}/g, interaction.guild.roles.cache.first().id);
    content = content.replace(/{role_name}/g, interaction.guild.roles.cache.first().name);
    content = content.replace(/{role_color}/g, interaction.guild.roles.cache.first().hexColor);
    content = content.replace(/{role_hoist}/g, interaction.guild.roles.cache.first().hoist.toString());
    content = content.replace(/{role_position}/g, interaction.guild.roles.cache.first().position.toString());
    content = content.replace(/{role_mentionable}/g, interaction.guild.roles.cache.first().mentionable.toString());
    content = content.replace(/{role_permissions}/g, interaction.guild.roles.cache.first().permissions.toArray().join(', '));
    content = content.replace(/{role_managed}/g, interaction.guild.roles.cache.first().managed.toString());
    content = content.replace(/{role_tags}/g, interaction.guild.roles.cache.first().tags ? JSON.stringify(interaction.guild.roles.cache.first().tags) : 'N/A');
    content = content.replace(/{role_createdAt}/g, interaction.guild.roles.cache.first().createdAt.toDateString());
    content = content.replace(/{role_createdTimestamp}/g, interaction.guild.roles.cache.first().createdTimestamp.toString());
    content = content.replace(/{role_hexColor}/g, interaction.guild.roles.cache.first().hexColor);
    content = content.replace(/{role_members_size}/g, interaction.guild.roles.cache.first().members.size.toString());
    content = content.replace(/{role_editable}/g, interaction.guild.roles.cache.first().editable.toString());
    content = content.replace(/{emoji_id}/g, interaction.guild.emojis.cache.first().id);
    content = content.replace(/{emoji_name}/g, interaction.guild.emojis.cache.first().name);
    content = content.replace(/{emoji_identifier}/g, interaction.guild.emojis.cache.first().identifier);
    content = content.replace(/{emoji_url}/g, interaction.guild.emojis.cache.first().url);
    content = content.replace(/{emoji_createdAt}/g, interaction.guild.emojis.cache.first().createdAt.toDateString());
    content = content.replace(/{emoji_createdTimestamp}/g, interaction.guild.emojis.cache.first().createdTimestamp.toString());
    content = content.replace(/{emoji_available}/g, interaction.guild.emojis.cache.first().available.toString());
    content = content.replace(/{emoji_requireColons}/g, interaction.guild.emojis.cache.first().requireColons.toString());
    content = content.replace(/{emoji_managed}/g, interaction.guild.emojis.cache.first().managed.toString());
    content = content.replace(/{emoji_animated}/g, interaction.guild.emojis.cache.first().animated.toString());
    content = content.replace(/{emoji_deletable}/g, interaction.guild.emojis.cache.first().deletable.toString());
    content = content.replace(/{sticker_id}/g, interaction.guild.stickers.cache.first().id);
    content = content.replace(/{sticker_name}/g, interaction.guild.stickers.cache.first().name);
    content = content.replace(/{sticker_description}/g, interaction.guild.stickers.cache.first().description);
    content = content.replace(/{sticker_tags}/g, interaction.guild.stickers.cache.first().tags.join(', '));
    content = content.replace(/{sticker_type}/g, interaction.guild.stickers.cache.first().type);
    content = content.replace(/{sticker_format}/g, interaction.guild.stickers.cache.first().format);
    content = content.replace(/{sticker_available}/g, interaction.guild.stickers.cache.first().available.toString());
    content = content.replace(/{sticker_guildId}/g, interaction.guild.stickers.cache.first().guildId);
    content = content.replace(/{sticker_user}/g, interaction.guild.stickers.cache.first().user ? interaction.guild.stickers.cache.first().user.tag : 'N/A');
    content = content.replace(/{sticker_createdAt}/g, interaction.guild.stickers.cache.first().createdAt.toDateString());
    content = content.replace(/{sticker_createdTimestamp}/g, interaction.guild.stickers.cache.first().createdTimestamp.toString());
    content = content.replace(/{sticker_url}/g, interaction.guild.stickers.cache.first().url);
    content = content.replace(/{invite_code}/g, interaction.guild.invites.cache.first().code);
    content = content.replace(/{invite_url}/g, interaction.guild.invites.cache.first().url);
    content = content.replace(/{invite_uses}/g, interaction.guild.invites.cache.first().uses.toString());
    content = content.replace(/{user_warns}/g, getUserWarns(interaction.user.id));
    content = content.replace(/{user_warns_count}/g, getUserWarnsCount(interaction.user.id));
    content = content.replace(/{user_warns_list}/g, getUserWarnsList(interaction.user.id));
    content = content.replace(/{user_warns_latest}/g, getUserWarnsLatest(interaction.user.id));
    content = content.replace(/{user_warns_latest_reason}/g, getUserWarnsLatestReason(interaction.user.id));
    content = content.replace(/{user_warns_latest_moderator}/g, getUserWarnsLatestModerator(interaction.user.id));
    content = content.replace(/{user_warns_latest_timestamp}/g, getUserWarnsLatestTimestamp(interaction.user.id));
    content = content.replace(/{user_mutes}/g, getUserMutes(interaction.user.id));
    content = content.replace(/{user_mutes_count}/g, getUserMutesCount(interaction.user.id));
    content = content.replace(/{user_mutes_list}/g, getUserMutesList(interaction.user.id));
    content = content.replace(/{user_mutes_latest}/g, getUserMutesLatest(interaction.user.id));
    content = content.replace(/{user_mutes_latest_reason}/g, getUserMutesLatestReason(interaction.user.id));
    content = content.replace(/{user_mutes_latest_moderator}/g, getUserMutesLatestModerator(interaction.user.id));
    content = content.replace(/{user_mutes_latest_timestamp}/g, getUserMutesLatestTimestamp(interaction.user.id));
    content = content.replace(/{user_mutes_latest_duration}/g, getUserMutesLatestDuration(interaction.user.id));
    content = content.replace(/{user_kicks}/g, getUserKicks(interaction.user.id));
    content = content.replace(/{user_kicks_count}/g, getUserKicksCount(interaction.user.id));
    content = content.replace(/{user_kicks_list}/g, getUserKicksList(interaction.user.id));
    content = content.replace(/{user_kicks_latest}/g, getUserKicksLatest(interaction.user.id));
    content = content.replace(/{user_kicks_latest_reason}/g, getUserKicksLatestReason(interaction.user.id));
    content = content.replace(/{user_kicks_latest_moderator}/g, getUserKicksLatestModerator(interaction.user.id));
    content = content.replace(/{user_kicks_latest_timestamp}/g, getUserKicksLatestTimestamp(interaction.user.id));
    content = content.replace(/{user_bans}/g, getUserBans(interaction.user.id));
    content = content.replace(/{user_bans_count}/g, getUserBansCount(interaction.user.id));
    content = content.replace(/{user_bans_list}/g, getUserBansList(interaction.user.id));
    content = content.replace(/{user_bans_latest}/g, getUserBansLatest(interaction.user.id));
    content = content.replace(/{user_bans_latest_reason}/g, getUserBansLatestReason(interaction.user.id));
    content = content.replace(/{user_bans_latest_moderator}/g, getUserBansLatestModerator(interaction.user.id));
    content = content.replace(/{user_bans_latest_timestamp}/g, getUserBansLatestTimestamp(interaction.user.id));
    content = content.replace(/{user_bans_latest_duration}/g, getUserBansLatestDuration(interaction.user.id));
    content = content.replace(/{user_timeouts}/g, getUserTimeouts(interaction.user.id));
    content = content.replace(/{user_timeouts_count}/g, getUserTimeoutsCount(interaction.user.id));
    content = content.replace(/{user_timeouts_list}/g, getUserTimeoutsList(interaction.user.id));
    content = content.replace(/{user_timeouts_latest}/g, getUserTimeoutsLatest(interaction.user.id));
    content = content.replace(/{user_timeouts_latest_reason}/g, getUserTimeoutsLatestReason(interaction.user.id));
    content = content.replace(/{user_timeouts_latest_moderator}/g, getUserTimeoutsLatestModerator(interaction.user.id));
    content = content.replace(/{user_timeouts_latest_timestamp}/g, getUserTimeoutsLatestTimestamp(interaction.user.id));
    content = content.replace(/{user_timeouts_latest_duration}/g, getUserTimeoutsLatestDuration(interaction.user.id));
    content = content.replace(/{user_warnings}/g, getUserWarnings(interaction.user.id));
  
}

  return content;
}

module.exports = {
  replacePlaceholders,
};
