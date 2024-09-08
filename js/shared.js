/**
 * Shared methods for normal & bulk pages.
 */
const shared = (function () {
    'use strict';

    const patterns = {
        video_id: [
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/watch\?v=([\w_-]+)(?:[\/&].*)?/i,
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/(?:v|embed|shorts|video|watch|live)\/([\w_-]+)(?:[\/&].*)?/i,
            /(?:http[s]?:\/\/)?youtu.be\/([\w_-]+)(?:\?.*)?/i,
            /(?:http[s]?:\/\/)?filmot.com\/video\/([\w_-]+)(?:[?\/&].*)?/i,
            /(?:http[s]?:\/\/)?filmot.com\/sidebyside\/([\w_-]+)(?:[?\/&].*)?/i,
            /^([\w-]{11})$/i
        ],
        playlist_id: [
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/playlist\?list=([\w_-]+)(?:&.*)?/i,
            /^((UU|UUSH|PL|FL|SP|OLAK)[A-Za-z0-9_-]+)$/i
        ],
        channel_id: [
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/channel\/([\w_-]+)(?:\?.*)?/i,
            /(?:http[s]?:\/\/)?filmot.com\/channel\/([\w_-]+)(?:[?\/&].*)?/i,
            /^((UC|SC)[\w-]{22})$/i
        ],
        channel_user: [
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/user\/([\w_-]+)(?:\?.*)?/i
        ],
        channel_handle: [
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/@([^\/?]+)(?:\?.*)?/i,
        ],
        channel_custom: [
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/c\/([^\/?]+)(?:\?.*)?/i,
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/([^\/?]+)(?:\?.*)?/i
        ]
    };

    return {
        /**
         * Safely get nested object property or returns null
         */
        idx: (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o),

        determineInput: function (value) {
            value = decodeURIComponent(value);
            const parsed = {
                type: 'unknown',
                mayHideOthers: true,
                original: value
            };
            for (let type in patterns) {
                for (let i = 0; i < patterns[type].length; i++) {
                    const regex = patterns[type][i];
                    const result = regex.exec(value);

                    if (result) {
                        parsed.type = type;
                        parsed.value = result[1];
                        return parsed;
                    }
                }
            }
            return parsed;
        },

        // https://wiki.archiveteam.org/index.php/YouTube/Technical_details
        isValidVideoId: function (videoId) {
            return videoId !== undefined && videoId !== null &&
                String(videoId).match(/[A-Za-z0-9_-]{10}[AEIMQUYcgkosw048]/);
        },

        isValidChannelId: function (channelId) {
            return channelId !== undefined && channelId !== null &&
                String(channelId).match(/[A-Za-z0-9_-]{21}[AQgw]/);
        },

        parseQuery: function (queryString) {
            const query = {};
            const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i].split('=');
                query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
            return query;
        },

        formatDuration: function (duration, includeMs, ignoreTime) {
            const years = duration.years();
            const months = duration.months();
            const days = duration.days();
            const hours = duration.hours();
            const minutes = duration.minutes();
            const seconds = duration.seconds();
            const millis = duration.milliseconds();
            const format = [
                (years > 0 ? years + " years" : ""),
                (months > 0 ? months + " months" : ""),
                (days > 0 ? days + " days" : ""),
                (!ignoreTime && hours > 0 ? hours + "h" : ""),
                (!ignoreTime && minutes > 0 ? minutes + "m" : ""),
                (!ignoreTime && seconds > 0 ? seconds + "s" : ""),
                includeMs ? (millis > 0 ? millis + "ms" : "") : ""
            ].join(" ");

            if (format.trim() === "") {
                return "0s";
            }

            return format;
        },

        sortObject: function (unordered, sortArrays = false) {
            if (!unordered || typeof unordered !== 'object') {
                return unordered;
            }

            if (Array.isArray(unordered)) {
                const newArr = unordered.map((item) => this.sortObject(item, sortArrays));
                if (sortArrays) {
                    newArr.sort();
                }
                return newArr;
            }

            const ordered = {};
            Object.keys(unordered)
                .sort()
                .forEach((key) => {
                    ordered[key] = this.sortObject(unordered[key], sortArrays);
                });
            return ordered;
        },

        safeFileName: function (fileName) {
            return fileName.replace(/[<>:"\/\\|?*]+/g, '');
        },

        randomFromList(list) {
            return list[Math.floor(Math.random() * list.length)];
        }
    }
})();
