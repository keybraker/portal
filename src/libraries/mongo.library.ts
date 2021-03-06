/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Client, TextChannel, VoiceChannel } from 'discord.js';
import { Document } from 'mongoose';
import { VideoSearchResult } from 'yt-search';
import config from '../config.json';
import { PortalChannelTypes } from '../data/enums/PortalChannel.enum';
import { ProfanityLevelEnum } from '../data/enums/ProfanityLevel.enum';
import { RankSpeedEnum } from '../data/enums/RankSpeed.enum';
import { GiveRolePrtl } from '../types/classes/GiveRolePrtl.class';
import { GuildPrtl, IGuildPrtl, MusicData } from '../types/classes/GuildPrtl.class';
import { MemberPrtl } from '../types/classes/MemberPrtl.class';
import { PollPrtl } from '../types/classes/PollPrtl.class';
import { PortalChannelPrtl } from '../types/classes/PortalChannelPrtl.class';
import { MongoPromise, Rank } from '../types/classes/TypesPrtl.interface';
import { VoiceChannelPrtl } from '../types/classes/VoiceChannelPrtl.class';
import GuildPrtlMdl from '../types/models/GuildPrtl.model';

// fetch guilds
export async function fetch_guild_list(
): Promise<GuildPrtl[] | undefined> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .find({})
            .then((guilds: IGuildPrtl[]) => {
                if (guilds) {
                    return resolve(<GuildPrtl[]>guilds);
                } else {
                    return resolve(undefined);
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function fetch_guild(
    guild_id: string
): Promise<GuildPrtl | undefined> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .findOne(
                {
                    id: guild_id
                }
            )
            .then((guild: IGuildPrtl | null) => {
                if (guild) {
                    return resolve(<GuildPrtl>guild);
                } else {
                    return resolve(undefined);
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function fetch_guild_channel_delete(
    guild_id: string
): Promise<GuildPrtl | undefined> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .findOne(
                {
                    id: guild_id
                },
                {
                    id: 1,
                    portal_list: 1,
                    announcement: 1,
                    music_data: 1,
                    url_list: 1,
                    ignore_list: 1
                })
            .then((r: any) => {
                if (r) {
                    return resolve(<GuildPrtl>{
                        id: r.id,
                        portal_list: r.portal_list,
                        announcement: r.announcement,
                        music_data: r.music_data,
                        url_list: r.url_list,
                        ignore_list: r.ignore_lis
                    });
                } else {
                    return resolve(undefined);
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function fetch_guild_announcement(
    guild_id: string
): Promise<GuildPrtl | undefined> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .findOne(
                {
                    id: guild_id
                },
                {
                    announcement: 1,
                    initial_role: 1
                })
            .then((r: any) => {
                if (r) {
                    return resolve(<GuildPrtl>{
                        announcement: r.announcement,
                        initial_role: r.initial_role
                    });
                } else {
                    return resolve(undefined);
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function fetch_guild_reaction_data(
    guild_id: string, member_id: string
): Promise<GuildPrtl | undefined> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .findOne(
                {
                    id: guild_id
                },
                {
                    id: 1,
                    member_list: {
                        $elemMatch: {
                            id: member_id
                        }
                    },
                    role_list: 1,
                    poll_list: 1,
                    music_data: 1,
                    music_queue: 1
                })
            .then((r: any) => {
                if (r) {
                    return resolve(<GuildPrtl>{
                        id: r.id,
                        member_list: r.member_list,
                        role_list: r.role_list,
                        poll_list: r.poll_list,
                        music_data: r.music_data,
                        music_queue: r.music_queue
                    });
                } else {
                    return resolve(undefined);
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function fetch_guild_members(
    guild_id: string
): Promise<MemberPrtl[] | undefined> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .findOne(
                {
                    id: guild_id
                },
                {
                    member_list: 1
                })
            .then((r: any) => {
                if (r) {
                    return resolve(<MemberPrtl[]>r.member_list);
                } else {
                    return resolve(undefined);
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function fetch_guild_music_queue(
    guild_id: string
): Promise<{ queue: VideoSearchResult[], data: MusicData } | undefined> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .findOne(
                {
                    id: guild_id
                },
                {
                    music_data: 1,
                    music_queue: 1
                })
            .then((r: any) => {
                if (r) {
                    return resolve(<{ queue: VideoSearchResult[], data: MusicData }>{
                        data: r.music_data,
                        queue: r.music_queue
                    });
                } else {
                    return resolve(undefined);
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function fetch_guild_predata(
    guild_id: string, member_id: string
): Promise<GuildPrtl | undefined> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .findOne(
                {
                    id: guild_id
                },
                {
                    id: 1,
                    prefix: 1,
                    portal_list: 1,
                    member_list: {
                        $elemMatch: {
                            id: member_id
                        }
                    },
                    ignore_list: 1,
                    url_list: 1,
                    mute_role: 1,
                    music_data: 1,
                    music_queue: 1,
                    initial_role: 1,
                    rank_speed: 1,
                    profanity_level: 1,
                    kick_after: 1,
                    ban_after: 1
                })
            .then((r: any) => {
                if (r) {
                    return resolve(<GuildPrtl>{
                        id: r.id,
                        prefix: r.prefix,
                        portal_list: r.portal_list,
                        member_list: r.member_list,
                        ignore_list: r.ignore_list,
                        url_list: r.url_list,
                        mute_role: r.mute_role,
                        music_data: r.music_data,
                        music_queue: r.music_queue,
                        initial_role: r.initial_role,
                        rank_speed: r.rank_speed,
                        profanity_level: r.profanity_level,
                        kick_after: r.kick_after,
                        ban_after: r.ban_after
                    });
                } else {
                    return resolve(undefined);
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function fetch_guild_rest(
    guild_id: string
): Promise<GuildPrtl | undefined> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .findOne(
                {
                    id: guild_id
                },
                {
                    id: 0,
                    prefix: 0,
                    portal_list: 0,
                    ignore_list: 0,
                    url_list: 0,
                    music_data: 0,
                    rank_speed: 0,
                    profanity_level: 0
                })
            .then((r: any) => {
                if (r) {
                    return resolve(<GuildPrtl>{
                        id: r.id,
                        member_list: r.member_list,
                        poll_list: r.poll_list,
                        ranks: r.ranks,
                        music_queue: r.music_queue,
                        announcement: r.announcement,
                        locale: r.locale,
                        announce: r.announce,
                        premium: r.premium
                    });
                } else {
                    return resolve(undefined);
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function guild_exists(
    guild_id: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .countDocuments(
                {
                    id: guild_id
                }
            )
            .then((count: number) => {
                return resolve(count > 0);
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function member_exists(
    guild_id: string, member_id: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .countDocuments(
                {
                    id: guild_id,
                    member_list: {
                        $elemMatch: {
                            id: member_id
                        }
                    }
                }
            )
            .then((count: number) => {
                return resolve(count > 0);
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function update_guild(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    guild_id: string, key: string, value: any
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const placeholder: any = {}
        placeholder[key] = value;
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $set: placeholder
                },
                {
                    'new': true
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

// CRUD guilds

function create_member_list(guild_id: string, client: Client): MemberPrtl[] {
    const member_list: MemberPrtl[] = [];

    const guild = client.guilds.cache.find(guild => guild.id === guild_id);
    if (!guild) {
        return member_list;
    }

    // const member_array = guild.members.cache.array();
    // for(let i = 0; i < member_array.length; i++) {
    //     if (!member_array[i].user.bot) {
    //         if (client.user && member_array[i].id !== client.user.id) {
    //             member_list.push(
    //                 new MemberPrtl(
    //                     member_array[i].id,
    //                     1,
    //                     0,
    //                     1,
    //                     0,
    //                     new Date('1 January, 1970, 00:00:00 UTC'),
    //                     'null'
    //                 )
    //             );
    //         }
    //     }
    // }

    guild.members.cache.forEach(member => {
        if (!member.user.bot) {
            if (client.user && member.id !== client.user.id) {
                member_list.push(
                    new MemberPrtl(
                        member.id,
                        1,
                        0,
                        1,
                        0,
                        0,
                        new Date('1 January, 1970, 00:00:00 UTC'),
                        'null'
                    )
                );
            }
        }
    });

    return member_list;
}

export async function insert_guild(
    guild_id: string, client: Client
): Promise<boolean> {
    const id: string = guild_id;
    const portal_list: PortalChannelPrtl[] = [];
    const member_list: MemberPrtl[] = create_member_list(guild_id, client);
    const url_list: string[] = [];
    const role_list: GiveRolePrtl[] = [];
    const poll_list: string[] = [];
    const ranks: Rank[] = [];
    const initial_role: string | null = 'null';
    const music_data: MusicData = {
        channel_id: 'null',
        message_id: 'null',
        message_lyrics_id: 'null',
        votes: [],
        pinned: false
    }
    const music_queue: VideoSearchResult[] = [];
    const announcement: string | null = 'null';
    const mute_role: string | null = 'null';
    const locale = 1;
    const announce = true;
    const rank_speed: number = RankSpeedEnum.default;
    const profanity_level: number = ProfanityLevelEnum.default;
    const kick_after = 0;
    const ban_after = 0;
    const premium = true; // as it is not a paid service anymore
    const prefix: string = config.prefix;

    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .create({
                id: id,
                portal_list: portal_list,
                member_list: member_list,
                url_list: url_list,
                role_list: role_list,
                poll_list: poll_list,
                initial_role: initial_role,
                ranks: ranks,
                music_data: music_data,
                music_queue: music_queue,
                announcement: announcement,
                mute_role: mute_role,
                locale: locale,
                announce: announce,
                rank_speed: rank_speed,
                profanity_level: profanity_level,
                kick_after: kick_after,
                ban_after: ban_after,
                premium: premium,
                prefix: prefix
            })
            .then((r: Document<any>) => {
                return resolve(!!r);
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function remove_guild(
    guild_id: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .deleteOne({
                id: guild_id
            })
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

//

export async function update_member(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    guild_id: string, member_id: string, key: string, value: any
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const placeholder: any = {}
        placeholder['member_list.$[m].' + key] = value;

        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $set: placeholder
                },
                {
                    'new': true,
                    'arrayFilters': [
                        {
                            'm.id': member_id
                        }
                    ]
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function update_entire_member(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    guild_id: string, member_id: string, member: MemberPrtl
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const placeholder: any = {}
        placeholder['member_list.$[m]'] = member;

        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $set: placeholder
                },
                {
                    'new': true,
                    'arrayFilters': [
                        {
                            'm.id': member_id
                        }
                    ]
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function insert_member(
    guild_id: string, member_id: string
): Promise<boolean> {
    const new_member_portal = new MemberPrtl(
        member_id,
        1,
        0,
        1,
        0,
        0,
        null,
        'null'
    );
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                { id: guild_id },
                {
                    $push: {
                        member_list: new_member_portal
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function remove_member(
    member_id: string, guild_id: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $pull: {
                        member_list: {
                            id: member_id
                        }
                    }
                })
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

//

export async function update_portal(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    guild_id: string, portal_id: string, key: string, value: any
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const placeholder: any = {}
        placeholder['portal_list.$[p].' + key] = value;

        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $set: placeholder
                },
                {
                    'new': true,
                    'arrayFilters': [
                        { 'p.id': portal_id }
                    ]
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function insert_portal(
    guild_id: string, new_portal: PortalChannelPrtl
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $push: {
                        portal_list: new_portal
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function remove_portal(
    guild_id: string, portal_id: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $pull: {
                        portal_list: {
                            id: portal_id
                        }
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

//

export async function update_voice(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    guild_id: string, portal_id: string, voice_id: string, key: string, value: any
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const placeholder: any = {}
        placeholder['portal_list.$[p].voice_list.$[v].' + key] = value;

        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $set: placeholder
                },
                {
                    'new': true,
                    'arrayFilters': [
                        { 'p.id': portal_id },
                        { 'v.id': voice_id }
                    ]
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function insert_voice(
    guild_id: string, portal_id: string, new_voice: VoiceChannelPrtl
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $push: {
                        'portal_list.$[p].voice_list': new_voice
                    }
                },
                {
                    'new': true,
                    'arrayFilters': [
                        { 'p.id': portal_id }
                    ]
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                reject(e);
            });
    });
}

export async function remove_voice(
    guild_id: string, portal_id: string, voice_id: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $pull: {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        'portal_list.$[p].voice_list': {
                            id: voice_id
                        }
                    }
                },
                {
                    'new': true,
                    'arrayFilters': [
                        {
                            'p.id': portal_id
                        }
                    ]
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                reject(e);
            });
    });
}

//

export async function insert_url(
    guild_id: string, new_url: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $push: {
                        url_list: new_url
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function remove_url(
    guild_id: string, remove_url: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $pull: {
                        url_list: remove_url
                    }
                })
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

//

export async function insert_ignore( // channel
    guild_id: string, new_ignore: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $push: {
                        ignore_list: new_ignore
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function remove_ignore( // channel
    guild_id: string, remove_ignore: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $pull: {
                        ignore_list: remove_ignore
                    }
                })
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

//

export async function set_ranks(
    guild_id: string, new_ranks: Rank[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    ranks: new_ranks
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

//

export async function insert_poll(
    guild_id: string, poll: PollPrtl
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $push: {
                        poll_list: poll
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function remove_poll(
    guild_id: string, message_id: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $pull: {
                        poll_list: {
                            message_id: message_id
                        }
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

//

export async function insert_vendor(
    guild_id: string, new_vendor: GiveRolePrtl
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $push: {
                        role_list: new_vendor
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function remove_vendor(
    guild_id: string, message_id: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $pull: {
                        role_list: {
                            message_id: message_id
                        }
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

//

export async function insert_music_video(
    guild_id: string, video: VideoSearchResult
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $push: {
                        music_queue: video
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function clear_music_vote(
    guild_id: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $set: {
                        'music_data.votes': []
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function insert_music_vote(
    guild_id: string, user_id: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $push: {
                        'music_data.votes': user_id
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

export async function set_music_data(
    guild_id: string, new_music_data: MusicData
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GuildPrtlMdl
            .updateOne(
                {
                    id: guild_id
                },
                {
                    $set: {
                        music_data: new_music_data
                    }
                }
            )
            .then((r: MongoPromise) => {
                if ((!!r.ok && !!r.n) && (r.ok > 0 && r.n > 0)) {
                    return resolve(true);
                } else {
                    return reject('did not execute database transaction');
                }
            })
            .catch((e: any) => {
                return reject(e);
            });
    });
}

//

export async function deleted_channel_sync(
    channel_to_remove: VoiceChannel | TextChannel
): Promise<number> {
    return new Promise((resolve) => {
        fetch_guild_channel_delete(channel_to_remove.guild.id)
            .then(guild_object => {
                if (guild_object) {
                    // check if it is a portal or portal-voice channel
                    if (!channel_to_remove.isText()) {
                        const current_voice = channel_to_remove;
                        guild_object.portal_list.some(p => {
                            if (p.id === current_voice.id) {
                                remove_portal(current_voice.guild.id, p.id)
                                    .then(r => {
                                        return r
                                            ? resolve(PortalChannelTypes.portal)
                                            : resolve(PortalChannelTypes.unknown)
                                    })
                                    .catch(() => {
                                        return resolve(PortalChannelTypes.unknown)
                                    });

                                return true;
                            }

                            p.voice_list.some(v => {
                                if (v.id === current_voice.id) {
                                    remove_voice(current_voice.guild.id, p.id, v.id)
                                        .then(r => {
                                            return r
                                                ? resolve(PortalChannelTypes.voice)
                                                : resolve(PortalChannelTypes.unknown)
                                        })
                                        .catch(() => {
                                            return resolve(PortalChannelTypes.unknown)
                                        });

                                    return true;
                                }
                            });
                        });
                    } else {
                        const current_text = channel_to_remove;

                        if (guild_object.announcement === current_text.id) {
                            update_guild(current_text.guild.id, 'announcement', 'null')
                                .then(r => {
                                    return r
                                        ? resolve(PortalChannelTypes.announcement)
                                        : resolve(PortalChannelTypes.unknown);
                                })
                                .catch(() => {
                                    return resolve(PortalChannelTypes.unknown);
                                });
                        } else if (guild_object.music_data.channel_id === current_text.id) {
                            const music_data = new MusicData('null', 'null', 'null', [], false);
                            set_music_data(guild_object.id, music_data)
                                .then(r => {
                                    return r
                                        ? resolve(PortalChannelTypes.music)
                                        : resolve(PortalChannelTypes.unknown)
                                })
                                .catch(() => {
                                    return resolve(PortalChannelTypes.unknown);
                                });
                        } else {
                            for (let i = 0; i < guild_object.url_list.length; i++) {
                                if (guild_object.url_list[i] === current_text.id) {
                                    remove_url(current_text.guild.id, current_text.id)
                                        .then(r => {
                                            return r
                                                ? resolve(PortalChannelTypes.url)
                                                : resolve(PortalChannelTypes.unknown);
                                        })
                                        .catch(() => {
                                            return resolve(PortalChannelTypes.unknown);
                                        });
                                    break;
                                }
                            }

                            for (let i = 0; i < guild_object.ignore_list.length; i++) {
                                if (guild_object.ignore_list[i] === current_text.id) {
                                    remove_ignore(current_text.guild.id, current_text.id)
                                        .then(r => {
                                            return r
                                                ? resolve(PortalChannelTypes.url)
                                                : resolve(PortalChannelTypes.unknown);
                                        })
                                        .catch(() => {
                                            return resolve(PortalChannelTypes.unknown);
                                        });
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    return resolve(PortalChannelTypes.unknown);
                }
            })
            .catch(() => {
                return resolve(PortalChannelTypes.unknown);
            });
    });
}