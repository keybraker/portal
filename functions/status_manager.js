const games = require('../assets/status/game_list.json');
const programs = require('../assets/status/program_list.json');

module.exports = {
	status_aliases: function (current_statuses, locale) {
		new_status = [];

		current_statuses.forEach(status => {
			let found = false;
			for (l = 0; l < games.game_attributes.length; l++) {
				if (status.name == games.game_attributes[l].status) {
					if (locale === 'gr') {
						new_status.push(games.game_attributes[l].locale.gr);
						found = true;
					} else {
						new_status.push(games.game_attributes[l].locale.en);
						found = true;
					}
				}
			}

			if(!found) {
				for (l = 0; l < programs.program_attributes.length; l++) {
					if (status.name == programs.program_attributes[l].status) {
						if (locale === 'gr') {
							new_status.push(programs.program_attributes[l].locale.gr);
							found = true;
						} else {
							new_status.push(programs.program_attributes[l].locale.en);
							found = true;
						}
					}
				}
			}
			if(!found) {
				new_status.push(status.name);
			}
		});

		return new_status;
	}
	,

	get_status_list: function (voice_channel, voice_object) {
		let array_of_statuses = [];

		voice_channel.members.forEach(member => {
			if (member.presence.activities !== undefined && member.presence.activities.length > 0) {
				let status = this.status_aliases(member.presence.activities, voice_object.locale);
				if (!array_of_statuses.includes(status)) {
					array_of_statuses.push(status);
				}
			}
		});

		if (array_of_statuses.length === 0) {
			if (voice_object.locale === 'gr') {
				array_of_statuses.push("Άραγμα");
			} else {
				array_of_statuses.push("Chilling");
			}
		}
	
		return array_of_statuses;
	}
	
};