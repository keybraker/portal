import { GuildMember, TextChannel } from "discord.js";
import { create_rich_embed } from "../libraries/help.library";
import { fetch_guild_announcement, remove_member } from "../libraries/mongo.library";

module.exports = async (
	args: { member: GuildMember }
): Promise<string> => {
	return new Promise((resolve, reject) => {
		if (!args.member.user.bot) {
			remove_member(args.member.id, args.member.guild.id)
				.then(r => {
					if (!r) {
						return reject(`failed to remove member ${args.member.id} to ${args.member.guild.id}`);
					}

					fetch_guild_announcement(args.member.guild.id)
						.then(announcement => {
							if (announcement) {
								const leave_message = `member: ${args.member.presence.user} ` +
									`[${args.member.guild.id}]\n\thas left ${args.member.guild}`;

								if (announcement) {
									const announcement_channel = <TextChannel>args.member.guild.channels.cache
										.find(channel => channel.id === announcement)

									if (announcement_channel) {
										announcement_channel.send(
											create_rich_embed(
												'member left',
												leave_message,
												'#FC0303',
												[],
												args.member.user.avatarURL(),
												null,
												true,
												null,
												null
											)
										);
									}
								} else {
									return reject(`could not find announcement channel, it has been deleted`);
								}
							} else {
								return reject(`could not find announcement channel in database`);
							}
						})
						.catch(e => {
							return reject(`failed to get announcement channel in database / ${e}`);
						});
				})
				.catch(e => {
					return reject(`failed to remove member ${args.member.id} to ${args.member.guild.id} / ${e}`);
				});
		} else {
			return resolve('left member is a bot, bots are not handled');
		}
	});
};
