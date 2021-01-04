import { Client, Message } from "discord.js";
import { GuildPrtl } from "../types/classes/GuildPrtl";

module.exports = async (args: {
	client: Client, message: Message, args: string[],
	guild_list: GuildPrtl[], portal_managed_guilds_path: string
}) => {
	return new Promise((resolve) => {
		const guild_object = args.guild_list.find(g => g.id === args.message.guild?.id);
		if (!guild_object) {
			return resolve({ result: true, value: 'portal guild could not be fetched' });
		}
		args.message.channel.send('*initial*')
			.then(message_sent => {
				message_sent.edit(
					`RTT    latency:\t**${message_sent.createdTimestamp - args.message.createdTimestamp}** *ms*.\n` +
					`Portal latency:\t**${args.client.ws.ping}** *ms*`)
					// .then(msg => {
					// 	msg.delete({ timeout: 15000 });
					// });
			})
			.catch(console.error);

		resolve({ result: true, value: '*pong*' });
	});
};