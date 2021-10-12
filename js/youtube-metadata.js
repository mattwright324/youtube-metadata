/**
 * YouTube Metadata
 *
 * Grab everything publicly available from the YouTube API.
 *
 * @requires jquery
 * @author mattwright324
 */
(function () {
    'use strict';

    const elements = {};
    const controls = {};
    let exportData = {};

    const idx = (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);

    const patterns = {
        video_id: [
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/watch\?v=([\w_-]+)(?:&.*)?/i,
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/shorts\/([\w_-]+)(?:&.*)?/i,
            /(?:http[s]?:\/\/)?youtu.be\/([\w_-]+)(?:\?.*)?/i
        ],
        playlist_id: [
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/playlist\?list=([\w_-]+)(?:&.*)?/i
        ],
        channel_user: [
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/user\/([\w_-]+)(?:\?.*)?/i
        ],
        channel_id: [
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/channel\/([\w_-]+)(?:\?.*)?/i
        ],
        channel_custom: [
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/c\/([\w_-]+)(?:\?.*)?/i,
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/([\w_-]+)(?:\?.*)?/i
        ]
    };

    function determineInput(value) {
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
    }

    function getDuration(a, b) {
        if (a.isBefore(b)) {
            return moment.duration(b.diff(a));
        } else {
            return moment.duration(a.diff(b));
        }
    }

    function formatDuration(duration, includeMs, ignoreTime) {
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

        if (format.trim() == "") {
            return "0s";
        }

        return format;
    }

    function formatBCP47(translation) {
        const findings = [];

        if (translation.language) {
            findings.push(translation.language.name);
        }

        if (translation.country) {
            findings.push(translation.country.name);
        }

        return findings.join(" / ");
    }

    function sortObject(unordered, sortArrays = false) {
        if (!unordered || typeof unordered !== 'object') {
            return unordered;
        }

        if (Array.isArray(unordered)) {
            const newArr = unordered.map((item) => sortObject(item, sortArrays));
            if (sortArrays) {
                newArr.sort();
            }
            return newArr;
        }

        const ordered = {};
        Object.keys(unordered)
            .sort()
            .forEach((key) => {
                ordered[key] = sortObject(unordered[key], sortArrays);
            });
        return ordered;
    }

    function processLocalizations(partDiv, partJson) {
        const translations = [];

        for (let code in partJson) {
            translations.push("<li><span class='orange'>" + String(code).toUpperCase() + "</span> which is <span class='orange'>" + formatBCP47(bcp47.lookup(code)) + "</span></li>")
        }

        partDiv.append("<p class='mb-15'>Localizations for..." +
                "<ul>" + translations.join("") + "</ul>" +
            "</p>")
    }

    function normalize(a, b) {
        let normalizedA = a, normalizedB = b;
        let gcdValue = 0, gcdA = 0, gcdB = 0;

        if (a > 0 && b > 0) {
            function gcd(p, q) {
                if (q === 0) {
                    return p;
                }
                return gcd(q, p % q);
            }
            gcdValue = gcd(a, b);
            gcdA = gcdValue === 0 ? 0 : a / gcdValue;
            gcdB = gcdValue === 0 ? 0 : b / gcdValue;
        }

        if (gcdValue !== 0) {
            if (gcdA > gcdB) {
                normalizedA = gcdA / gcdB;
                normalizedB = 1;
            } else {
                normalizedA = 1;
                normalizedB = gcdB / gcdA;
            }
        }

        return {a: normalizedA, b: normalizedB}
    }

    const partMap = {
        /**
         * Can't access part(s): fileDetails, processingDetails, suggestions
         * Useless part(s): player, id
         * Every other part below:
         */
        video: {
            snippet: {
                title: "Snippet",
                postProcess: function (partJson, fullJson) {
                    const partDiv = $("#video-section #snippet");

                    const thumbs = partJson.thumbnails;
                    const thumbUrl = (thumbs.maxres || thumbs.high || thumbs.medium || thumbs.default || {url:"https://placehold.it/480x360"}).url;

                    partDiv.append("<a target='_blank' href='https://youtu.be/" + fullJson.id + "'><img src='" + thumbUrl + "' class='mb-15'></a>");

                    const titleHtml =
                        "<p class='mb-15' style='font-size: 1.25em'>" + partJson.title + "</p>";
                    partDiv.append(titleHtml);

                    const authorHtml =
                        "<p class='mb-15'>Published by " +
                            "<a href='https://www.youtube.com/channel/" + partJson.channelId + "' target='_blank'>" +
                                partJson.channelTitle +
                            "</a>" +
                        "</p>";
                    partDiv.append(authorHtml);

                    const published = new Date(partJson.publishedAt);
                    const dateHtml =
                        "<p class='mb-15'>Published on " +
                            "<span class='orange'>" + published.toUTCString() + "</span>" +
                            " (" + moment(published).utc().fromNow() + ")" +
                        "</p>";
                    partDiv.append(dateHtml);

                    if (partJson.tags) {
                        const tagsHtml =
                            "<p class='mb-15'>Tag(s): " +
                                "<span class='tag'>" + partJson.tags.join("</span><span class='comma'>, </span><span class='tag'>") + "</span>" +
                            "</p>";
                        partDiv.append(tagsHtml);
                    } else {
                        partDiv.append("<p class='mb-15'>There were no tags.</p>")
                    }

                    if (partJson.defaultLanguage) {
                        const code = partJson.defaultLanguage.toUpperCase();
                        const translated = bcp47.lookup(code);

                        partDiv.append("<p class='mb-15'>Default language is <span class='orange'>" + code + "</span> which means <span class='orange'>" + formatBCP47(translated) + "</span></p>")
                    }

                    if (partJson.defaultAudioLanguage) {
                        const code = partJson.defaultAudioLanguage.toUpperCase();
                        const translated = bcp47.lookup(code);

                        partDiv.append("<p class='mb-15'>Audio language is <span class='orange'>" + code + "</span> which means <span class='orange'>" + formatBCP47(translated) + "</span></p>")
                    }

                    partDiv.append("<p class='mb-15'><a style='display:flex' target='_blank' href='./bulk?submit=true&url=https://www.youtube.com/channel/" + partJson.channelId + "'>" +
                        "<img src='./img/metadata.png' style='margin-left:4px;width:20px;margin-right:5px;' alt='youtube metadata icon' >" +
                        "Inspect the metadata for the rest of this channel's videos" +
                        "</a></p>");
                }
            },
            statistics: {
                title: "Statistics",
                postProcess: function (partJson) {
                    const partDiv = $("#video-section #statistics");

                    if (partJson.hasOwnProperty("likeCount")) {
                        const normalized = normalize(partJson.likeCount, partJson.dislikeCount);

                        const html =
                            "<p class='mb-15'>" +
                                "Normalized like ratio: " +
                                "<span style='color:green'>" + Math.trunc(normalized.a) + " like(s)</span> per " +
                                "<span style='color:red'>" + Math.trunc(normalized.b) + " dislike(s)</span>" +
                            "</p>";
                        partDiv.append(html);
                    } else {
                        partDiv.append("<p class='mb-15'>This video has likes disabled.</p>")
                    }

                    if (!partJson.hasOwnProperty("viewCount")) {
                        partDiv.append("<p class='mb-15'>This video has <span class='orange'>view counts disabled.</span></p>")
                    }

                    if (!partJson.hasOwnProperty("commentCount")) {
                        partDiv.append("<p class='mb-15'>This video has <span class='orange'>comments disabled.</span></p>")
                    }

                }
            },
            recordingDetails: {
                title: "Geolocation",
                postProcess: function (partJson, fullJson) {
                    const partDiv = $("#video-section #recordingDetails");

                    const location = partJson.location;
                    if (location && location.latitude && location.longitude) {
                        const latlng = location.latitude + "," + location.longitude;
                        const staticMap = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlng + "&zoom=14&size=1000x300&key=AIzaSyCGWanOEMEgdHqsxNDaa_ZXTZ6hoYQrnAI&markers=color:red|" + latlng;

                        const link = partJson.hasOwnProperty("locationDescription") ?
                            "https://maps.google.com/maps/search/" + encodeURI(partJson.locationDescription).replace(/'/g, "%27") + "/@" + latlng + ",14z" :
                            "https://maps.google.com/maps?q=loc:"+latlng;

                        const html =
                            "<p class='mb-15'><a href='" + link + "' target='_blank'>" +
                                "<img src='"+ staticMap +"' alt='Google Maps Static Map'>" +
                                "<p>Click to open in Google Maps</p>" +
                            "</a></p>";

                        partDiv.append(html);
                    }

                    if (partJson.recordingDate && fullJson.snippet) {
                        const recordDate = moment(partJson.recordingDate).utc();

                        const dateHtml =
                            "<p class='mt-15 mb-15'>Recorded on " +
                                "<span class='orange'>" + recordDate.format("ddd, DD MMM YYYY") + "</span>" +
                                " (" + recordDate.fromNow() + "). YouTube Studio only allows creators to pick the date so there is no time on this timestamp." +
                            "</p>";
                        partDiv.append(dateHtml);

                        const published = moment(fullJson.snippet.publishedAt).utc();
                        const format = formatDuration(getDuration(recordDate, published), false, true);
                        if (format === "0s") {
                            partDiv.append("<p class='mb-15'>The video was recorded <span class='orange'>same day</span> as the publish date.</p>")
                        } else if (published.isAfter(recordDate)) {
                            partDiv.append("<p class='mb-15'>The video was recorded <span class='orange'>" + format + "</span> before the publish date.</p>")
                        } else {
                            partDiv.append("<p class='mb-15'>The video was recorded <span class='orange'>" + format + "</span> after the publish date.</p>");
                        }
                    }
                }
            },
            status: {
                title: "Status",
                postProcess: function (partJson) {
                    const partDiv = $("#video-section #status");

                    if (partJson.hasOwnProperty("privacyStatus")) {
                        if (partJson.privacyStatus !== "public") {
                            partDiv.append("<p class='mb-15'>This video has its privacy set to <span class='orange'>" + partJson.privacyStatus + "</span></p>")
                        }
                    }
                    if (partJson.hasOwnProperty("license")) {
                        if (partJson.license !== "youtube") {
                            partDiv.append("<p class='mb-15'>This video has its license set to <span class='orange'>" + partJson.license + "</span></p>")
                        }
                    }
                    if (partJson.hasOwnProperty("embeddable")) {
                        if (partJson.embeddable) {
                            partDiv.append("<p class='mb-15'>This video may be embedded on other websites</p>")
                        } else {
                            partDiv.append("<p class='mb-15'>This video may not be embedded on other websites</p>")
                        }
                    }
                    if (partJson.hasOwnProperty("madeForKids")) {
                        if (partJson.madeForKids) {
                            partDiv.append("<p class='mb-15'>This video is designated as <span class='orange'>child-directed</span></p>")
                        } else {
                            partDiv.append("<p class='mb-15'>This video is not child-directed</p>")
                        }
                    }
                    if (partJson.hasOwnProperty("selfDeclaredMadeForKids")) {
                        if (partJson.selfDeclaredMadeForKids) {
                            partDiv.append("<p class='mb-15'>The video owner designated this video as <span class='orange'>child-directed</span></p>")
                        } else {
                            partDiv.append("<p class='mb-15'>The video owner designated this video as not child-directed.</p>")
                        }
                    }
                }
            },
            liveStreamingDetails: {
                title: "Livestream Details",
                postProcess: function (partJson) {
                    const partDiv = $("#video-section #liveStreamingDetails");

                    const now = moment(new Date()).utc();
                    if (partJson.hasOwnProperty("scheduledStartTime") && !partJson.hasOwnProperty("actualStartTime")) {
                        // Stream hasn't started
                        const start = moment(partJson.scheduledStartTime).utc();
                        const format = formatDuration(getDuration(start, now));

                        if (start.isAfter(now)) {
                            partDiv.append("<p class='mb-15'>The stream hasn't started yet. It will start in <span class='orange'>" + format + "</span></p>");
                        } else {
                            partDiv.append("<p class='mb-15'>The stream is over. It was supposed to start <span class='orange'>" + format + "</span> ago</p>");
                        }
                    }
                    if (partJson.hasOwnProperty("actualStartTime") && partJson.hasOwnProperty("scheduledStartTime")) {
                        // Stream started. Time between schedule date and actual start?
                        const start = moment(partJson.actualStartTime).utc();
                        const scheduled = moment(partJson.scheduledStartTime).utc();
                        const format = formatDuration(getDuration(start, scheduled));
                        if (start.isAfter(scheduled)) {
                            partDiv.append("<p class='mb-15'>The stream was <span class='orange'>" + format + "</span> late to start</p>")
                        } else {
                            partDiv.append("<p class='mb-15'>The stream was <span class='orange'>" + format + "</span> early to start</p>");
                        }
                    }
                    if (partJson.hasOwnProperty("actualStartTime") && !partJson.hasOwnProperty("actualEndTime")) {
                        // Stream started but still going. Time between start and now?
                        const start = moment(partJson.actualStartTime).utc();
                        const format = formatDuration(getDuration(start, now));

                        partDiv.append("<p class='mb-15'>The stream is still going. It has been running for <span class='orange'>" + format + "</span></p>");
                    }
                    if (partJson.hasOwnProperty("actualStartTime") && partJson.hasOwnProperty("actualEndTime")) {
                        // Stream done. Time between start and end?
                        const start = moment(partJson.actualStartTime).utc();
                        const end = moment(partJson.actualEndTime).utc();
                        const format = formatDuration(getDuration(start, end));

                        partDiv.append("<p class='mb-15'>The stream is over. It's length was <span class='orange'>" + format + "</span></p>");
                    }
                }
            },
            localizations: {
                title: "Localizations",
                postProcess: function (partJson) {
                    const partDiv = $("#video-section #localizations");

                    processLocalizations(partDiv, partJson);
                }
            },
            contentDetails: {
                title: "Content Details",
                postProcess: function (partJson) {
                    const partDiv = $("#video-section #contentDetails");

                    const duration = moment.duration(partJson.duration);
                    const format = formatDuration(duration);

                    if (format === "0s") {
                        partDiv.append("<p class='mb-15'>A video can't be 0 seconds. This must be a livestream.</p>");
                    } else {
                        partDiv.append("<p class='mb-15'>The video length was <span style='color:orange'>" + format + "</span></p>");
                    }

                    if (partJson.hasOwnProperty('regionRestriction')) {
                        const restriction = partJson.regionRestriction;

                        // Should have only one or the other, never both
                        if (restriction.hasOwnProperty('allowed')) {
                            partDiv.append("<p class='mb-15'>This video is <span class='orange'>region-restriction allowed</span>. " +
                                "Only these " + restriction.allowed.length + " region(s) are allowed to watch the video.</p>");
                            restriction.allowed.sort();
                        } else if (restriction.hasOwnProperty('blocked')) {
                            partDiv.append("<p class='mb-15'>This video is <span class='orange'>region-restriction blocked</span>. " +
                                "These " + restriction.blocked.length + " region(s) are not allowed to watch the video.</p>");
                            restriction.blocked.sort();
                        }

                        const codes = restriction.allowed || restriction.blocked;
                        const translations = [];
                        for (let i = 0; i < codes.length; i++) {
                            const code = codes[i];
                            const result = iso3166.lookup(code);
                            const name = (result ? result.name : 'ISO-3166 Could not translate')

                            translations.push("<li><span class='orange'>" + String(code).toUpperCase() + "</span> which is <span class='orange'>" + name + "</span></li>")
                        }
                        partDiv.append("<ul>" + translations.join("") + "</ul>")
                    }

                    const contentRating = partJson.contentRating;
                    if (!$.isEmptyObject(contentRating)) {
                        const keys = Object.keys(contentRating);
                        const pairs = [];

                        for (let i = 0; i < keys.length; i++) {
                            pairs.push(keys[i] + "/" + contentRating[keys[i]]);
                        }

                        partDiv.append("<p class='mb-15'>This video has a content rating of <span class='orange'>" + pairs.join(", ") + "</span></p>")
                    }
                }
            },
            topicDetails: {
                title: "Topic Details",
                postProcess: function (partJson) {
                    const partDiv = $("#video-section #topicDetails");

                    const categories = partJson.topicCategories;
                    if (categories) {
                        for(let i = 0; i < categories.length; i++) {
                            const url = categories[i];
                            const text = url.substr(url.lastIndexOf('/')+1).replace(/_/g, " ");

                            partDiv.append("<p class='mb-15'><a target='_blank' href='" + url + "'>" + text + "</a></p>")
                        }
                    }
                }
            }
        },

        /**
         * Can't access part(s): auditDetails, contentOwnerDetails
         * Useless part(s): id
         * Every other part below:
         */
        channel: {
            snippet: {
                title: "Snippet",
                postProcess: function (partJson, fullJson) {
                    const partDiv = $("#channel-section #snippet");

                    const thumbs = partJson.thumbnails;
                    const thumbUrl = (thumbs.maxres || thumbs.high || thumbs.medium || thumbs.default || {url:"https://placehold.it/240x240"}).url;

                    partDiv.append("<a target='_blank' href='https://www.youtube.com/channel/" + fullJson.id + "'><img src='" + thumbUrl + "' class='mb-15 profile'></a>");
                    partDiv.append("<p class='mb-15' style='font-size: 1.25em'>" + partJson.title + "</p>");

                    const published = new Date(partJson.publishedAt);
                    const dateHtml =
                        "<p class='mb-15'>Channel created on " +
                            "<span class='orange'>" + published.toUTCString() + "</span>" +
                            " (" + moment(published).utc().fromNow() + ")" +
                        "</p>";
                    partDiv.append(dateHtml);

                    if (partJson.hasOwnProperty("country")) {
                        const countryCode = partJson.country;
                        const country = bcp47.lookup(countryCode).country;
                        const translated = country ? " which is <span class='orange'>" + country.name + "</span>" : "";
                        partDiv.append("<p class='mb-15'>The channel is associated with country code <span class='orange'>" + countryCode + "</span>" + translated + "</p>");
                    } else {
                        partDiv.append("<p class='mb-15'>The channel doesn't have an associated country.</p>");
                    }

                    if (partJson.hasOwnProperty("customUrl")) {
                        const customUrl = "https://www.youtube.com/c/" + partJson.customUrl;

                        partDiv.append("<p class='mb-15'>The channel has a custom url of value '<a target='_blank' href='"+customUrl+"'>" + partJson.customUrl + "</a>'</p>");
                    }
                }
            },
            statistics: {
                title: "Statistics",
                postProcess: function (partJson, fullJson) {
                    const partDiv = $("#channel-section #statistics");

                    const subLevels = {
                        graphite: {
                            min: 1,
                            max: 999,
                            qualCount: "1-1k",
                            learnMore: "https://www.youtube.com/intl/en-GB/creators/benefits/graphite/"
                        },
                        opal: {
                            min: 1000,
                            max: 9999,
                            qualCount: "1k-10k",
                            learnMore: "https://www.youtube.com/intl/en-GB/creators/benefits/opal/"
                        },
                        bronze: {
                            min: 10000,
                            max: 99999,
                            qualCount: "10k-100k",
                            learnMore: "https://www.youtube.com/intl/en-GB/creators/benefits/bronze/"
                        },
                        silver: {
                            min: 100000,
                            max: 999999,
                            qualCount: "100k-1m",
                            learnMore: "https://www.youtube.com/intl/en-GB/creators/benefits/silver/"
                        },
                        gold: {
                            min: 1000000,
                            max: 9999999,
                            qualCount: "1m-10m",
                            learnMore: "https://www.youtube.com/intl/en-GB/creators/benefits/silver/"
                        },
                        diamond: {
                            min: 10000000,
                            max: Number.MAX_SAFE_INTEGER,
                            qualCount: "10m+",
                            learnMore: "https://www.youtube.com/intl/en-GB/creators/benefits/silver/"
                        }
                    }

                    const subs = partJson.subscriberCount;
                    const learnMore = "Click <a target='_blank' href='https://www.youtube.com/intl/en-GB/creators/benefits/'>here</a> to learn more.";

                    for (let levelName in subLevels) {
                        const level = subLevels[levelName];
                        if (subs >= level.min && subs <= level.max) {
                            partDiv.append("<p class='mb-15'>This channel's subscriber count qualifies for benefit level <span class='orange'>" + levelName + " </span> (" + level.qualCount + "). " + learnMore + "</p>")
                        }
                    }

                    if (partJson.hiddenSubscriberCount) {
                        partDiv.append("<p class='mb-15'>This channel has their subscriber count <span class='orange'>hidden</span>.</p>");
                    } else if (subs <= 0) {
                        partDiv.append("<p class='mb-15'>This channel has no subscribers and does not qualify for any benefit level. " + learnMore + "</p>");
                    } else {
                        partDiv.append("<p class='mb-15'>Check out this channel on <a target='_blank' href='https://socialblade.com/youtube/channel/" + fullJson.id + "'>SocialBlade</a>.</p>");
                    }

                    if (partJson.videoCount > 0) {
                        partDiv.append("<p class='mb-15'><a style='display:flex' target='_blank' href='./bulk?submit=true&url=https://www.youtube.com/channel/" + fullJson.id + "'>" +
                            "<img src='./img/metadata.png' style='margin-left:4px;width:20px;margin-right:5px;' alt='youtube metadata icon' >" +
                            "Inspect the metadata for all of this channel's videos" +
                            "</a></p>");
                    }else {
                        partDiv.append("<p class='mb-15'>This channel has no public videos.</p>");
                    }
                }
            },
            brandingSettings: {
                title: "Branding Settings",
                postProcess: function (partJson) {
                    const partDiv = $("#channel-section #brandingSettings");

                    if (partJson.channel.hasOwnProperty("trackingAnalyticsAccountId")) {
                        partDiv.append("<p class='mb-15'>This channel is tracking and measuring traffic with Google Analytics <span class='orange'>" + partJson.channel.trackingAnalyticsAccountId + "</span></p>")
                    }

                    if (partJson.channel.hasOwnProperty("moderateComments")) {
                        if (partJson.channel.moderateComments) {
                            partDiv.append("<p class='mb-15'>Comments on the channel page are <span class='orange'>moderated</span> and require approval by the owner.</p>")
                        } else {
                            partDiv.append("<p class='mb-15'>Comments on the channel page are not moderated.</p>")
                        }
                    }

                    if (partJson.channel.keywords) {
                        const keywords = partJson.channel.keywords;
                        const parsed = [];

                        // Custom parser because regex for all languages is funky
                        // and why doesn't browser JS regex support \p{L}   !?!?!
                        // Also, why didn't google make this an array like video tags?
                        let word = "";
                        let inQuotes = false;
                        for (let i=0; i<keywords.length; i++) {
                            const char = keywords.charAt(i);

                            if (char === '"' && inQuotes === false) {
                                inQuotes = true;
                            } else if (char === '"' && inQuotes === true) {
                                inQuotes = false;
                            }

                            if (char !== '"') {
                                if (char === " " && inQuotes === false) {
                                    parsed.push(word);
                                    word = "";
                                } else if (char !== " " || inQuotes === true) {
                                    word += char;
                                }
                            }
                        }
                        if (parsed.indexOf(word) === -1) {
                            parsed.push(word);
                        }

                        const keywordsHtml =
                            "<p class='mb-15'>Channel Keyword(s): " +
                                (parsed && parsed.length ?
                                    "<span class='tag'>" +
                                        parsed.join("</span><span class='comma'>, </span><span class='tag'>") +
                                    "</span>" : "") +
                            "</p>";
                        partDiv.append(keywordsHtml);
                    } else {
                        partDiv.append("<p class='mb-15'>There were no keywords.</p>")
                    }
                }
            },
            contentDetails: {
                title: "Content Details",
                postProcess: function (partJson) {
                    const partDiv = $("#channel-section #contentDetails");

                    const related = partJson.relatedPlaylists;
                    if (related) {
                        if (related.hasOwnProperty("uploads") && related.uploads) {
                            partDiv.append("<p class='mb-15'><a target='_blank' href='https://www.youtube.com/playlist?list=" + related.uploads + "'>Uploads playlist</a></p>")
                        }
                        if (related.hasOwnProperty("favorites") && related.favorites) {
                            partDiv.append("<p class='mb-15'><a target='_blank' href='https://www.youtube.com/playlist?list=" + related.favorites + "'>Favorites playlist</a></p>")
                        }
                        if (related.hasOwnProperty("likes") && related.likes) {
                            partDiv.append("<p class='mb-15'><a target='_blank' href='https://www.youtube.com/playlist?list=" + related.likes + "'>Likes playlist</a></p>")
                        }
                    }
                }
            },
            localizations: {
                title: "Localizations",
                postProcess: function (partJson) {
                    const partDiv = $("#channel-section #localizations");

                    processLocalizations(partDiv, partJson);
                }
            },
            status: {
                title: "Status",
                postProcess: function (partJson) {
                    const partDiv = $("#channel-section #status");

                    if (partJson.hasOwnProperty("madeForKids")) {
                        if (partJson.madeForKids) {
                            partDiv.append("<p class='mb-15'>This channel is designated as <span class='orange'>child-directed</span></p>")
                        } else {
                            partDiv.append("<p class='mb-15'>This channel is not child-directed</p>")
                        }
                    }
                    if (partJson.hasOwnProperty("selfDeclaredMadeForKids")) {
                        if (partJson.selfDeclaredMadeForKids) {
                            partDiv.append("<p class='mb-15'>The channel owner designated this channel as <span class='orange'>child-directed</span></p>")
                        } else {
                            partDiv.append("<p class='mb-15'>The channel owner designated this channel as not child-directed.</p>")
                        }
                    }
                }
            },
            topicDetails: {
                title: "Topic Details",
                postProcess: function (partJson) {
                    const partDiv = $("#channel-section #topicDetails");

                    const categories = partJson.topicCategories;
                    if (categories) {
                        for(let i = 0; i < categories.length; i++) {
                            const url = categories[i];
                            const text = url.substr(url.lastIndexOf('/')+1).replace(/_/g, " ");

                            partDiv.append("<p class='mb-15'><a target='_blank' href='" + url + "'>" + text + "</a></p>")
                        }
                    }
                }
            }
        },

        /**
         * Useless part(s): id, player
         * Every other part below:
         */
        playlist: {
            snippet: {
                title: "Snippet",
                postProcess: function (partJson, fullJson) {
                    const partDiv = $("#playlist-section #snippet");

                    const thumbs = partJson.thumbnails;
                    const thumbUrl = (thumbs.maxres || thumbs.high || thumbs.medium || thumbs.default || {url:"https://placehold.it/480x360"}).url;

                    partDiv.append("<a target='_blank' href='https://www.youtube.com/playlist?list=" + fullJson.id + "'><img src='" + thumbUrl + "' class='mb-15'></a>");
                    partDiv.append("<p class='mb-15' style='font-size: 1.25em'>" + partJson.title + "</p>");

                    const authorHtml =
                        "<p class='mb-15'>Published by " +
                            "<a href='https://www.youtube.com/channel/" + partJson.channelId + "' target='_blank'>" +
                                partJson.channelTitle +
                            "</a>" +
                        "</p>";
                    partDiv.append(authorHtml);

                    const published = new Date(partJson.publishedAt);
                    const dateHtml =
                        "<p class='mb-15'>Playlist created on " +
                            "<span class='orange'>" + published.toUTCString() + "</span>" +
                            " (" + moment(published).utc().fromNow() + ")" +
                        "</p>";
                    partDiv.append(dateHtml);

                    partDiv.append("<p class='mb-15'><a style='display:flex' target='_blank' href='./bulk?submit=true&url=https://www.youtube.com/playlist%3Flist%3D" + fullJson.id + "'>" +
                        "<img src='./img/metadata.png' style='margin-left:4px;width:20px;margin-right:5px;' alt='youtube metadata icon' >" +
                        "Inspect the metadata for all of this playlist's videos" +
                        "</a></p>");
                }
            },
            status: {
                title: "Status",
                postProcess: function (partJson) {
                    const partDiv = $("#playlist-section #status");
                }
            },
            localizations: {
                title: "Localizations",
                postProcess: function (partJson) {
                    const partDiv = $("#playlist-section #localizations");

                    processLocalizations(partDiv, partJson);
                }
            },
            contentDetails: {
                title: "Content Details",
                postProcess: function (partJson) {
                    const partDiv = $("#playlist-section #contentDetails");
                }
            }
        }
    };

    function errorState(message, funcAppend) {
        $("#video,#playlist,#channel").hide();
        $("#unknown").show();

        $("#reason").html(message);

        $("#reason-append").empty();

        if (funcAppend) {
            funcAppend($("#reason-append"));
        }
    }

    function parseType(partMapType, sectionId, res, parsedInput) {
        if (res.items.length > 0) {
            const item = res.items[0];

            exportData[partMapType] = res;

            for (let part in partMap[partMapType]) {
                const section = $("#" + sectionId + " #" + part);
                const sectionHeader = $(section.find(".section-header"));

                if (item.hasOwnProperty(part) && !$.isEmptyObject(item[part])) {
                    sectionHeader.removeClass("unknown").addClass("good");
                    sectionHeader.find("i").removeClass("question").addClass("check");
                } else {
                    sectionHeader.removeClass("unknown").addClass("bad");
                    sectionHeader.find("i").removeClass("question").addClass("minus");
                }

                if (item.hasOwnProperty(part)) {
                    if (part === 'localizations') {
                        item[part] = sortObject(item[part]);
                    }

                    section.append("<pre><code class=\"prettyprint json-lang\"></code></pre>");

                    const json = section.find("code");
                    json.text(JSON.stringify(item[part], null, 4));
                    hljs.highlightBlock(json[0]);

                    partMap[partMapType][part].postProcess(item[part], item);
                }

                if (!item.hasOwnProperty(part) || $.isEmptyObject(item[part])) {
                    section.append("<p class='mb-15 bad'>The " + partMapType + " does not have " + part + ".</p>");
                }
            }
        } else {
            errorState("Your link looked like a <span class='orange'>" + partMapType + "</span> but nothing came back. It may have been deleted or made private.", function (append) {
                const options = [];

                options.push("<li><a target='_blank' href='https://www.google.com/search?q=\"" + parsedInput.value + "\"'>Google Search - \"" + parsedInput.value + "\"</a></li>");
                options.push("<li><a target='_blank' href='https://web.archive.org/web/*/" + parsedInput.original + "'>Archive.org - " + parsedInput.original + "</a></li>");

                if (partMapType === "video") {
                    options.push("<li><a target='_blank' href='https://youtuberecover.com/watch?v=" + parsedInput.value + "'>YouTubeRecover.com - " + parsedInput.value + "</a></li>");
                }

                if (parsedInput.type === "channel_user") {
                    options.push("<li><a target='_blank' href='https://socialblade.com/search/search?query=" + parsedInput.value + "'>SocialBlade.com - " + parsedInput.value + "</a></li>");
                }

                append.append("<p class='mb-15'>" +
                    "You may find more details by trying..." +
                    "<ul>" + options.join("") + "</ul>" +
                "</p>");
            });
        }
    }

    async function parseVideo(res, input, skipGetChannel) {
        const channelId = idx(["items", "0", "snippet", "channelId"], res)
        if (!skipGetChannel && channelId) {
            submit({
                type: 'channel_id',
                value: channelId,
                mayHideOthers: false
            });
        }

        parseType("video", "video-section", res, input);

        const id = input.value;
        const thumbsDiv = $("#thumbnails");

        thumbsDiv.empty();
        for (let i = 0; i < 4; i++) {
            const thumbUrl = "https://img.youtube.com/vi/" + id + "/" + i + ".jpg";
            const html =
                "<div class='mb-15 column'>" +
                "<a href='https://www.google.com/searchbyimage?image_url=" + thumbUrl + "' target='_blank'>" +
                "<img src='"+ thumbUrl +"' alt='Thumb " + i + "' style='max-width: 200px;'>" +
                "<p>Click to reverse image search</p>" +
                "</a>" +
                "</div>";

            thumbsDiv.append(html);
        }
    }

    async function parsePlaylist(res, input, skipGetChannel) {
        const channelId = idx(["items", "0", "snippet", "channelId"], res)
        if (!skipGetChannel && channelId) {
            submit({
                type: 'channel_id',
                value: channelId,
                mayHideOthers: false
            });
        }

        parseType("playlist", "playlist-section", res, input);
    }

    async function parseChannel(res, input) {
        parseType("channel", "channel-section", res, input);
    }

    /**
     * Attempt to resolve the custom URL as there is no direct API method. Unreliable and may not always work.
     */
    async function resolveCustomChannel(parsedInput, callbackResubmit, nextPageToken, page) {
        console.log("Attempting to resolve custom channel URL. Search page #" + page);

        youtube.ajax("search", {
            part: 'snippet',
            q: parsedInput.value,
            maxResults: 50,
            type: 'channel',
            order: 'relevance',
            pageToken: nextPageToken
        }).done(function (res) {
            console.log(res);

            if (res.hasOwnProperty('nextPageToken') && !$.isEmptyObject(res.nextPageToken)) {
                nextPageToken = res.nextPageToken;
            } else {
                nextPageToken = '';
            }

            const channelIds = [];
            for (let i=0; i<res.items.length; i++) {
                channelIds.push(res.items[i].id.channelId);
            }

            youtube.ajax('channels', {
                part: 'snippet',
                id: channelIds.join(","),
                maxResults: 50
            }).done(function (res) {
                console.log(res);

                let match;
                if (res.items) {
                    for (let i=0; i<res.items.length; i++) {
                        const item = res.items[i];
                        const snippet = item.snippet;
                        if (snippet.hasOwnProperty('customUrl') && parsedInput.value.toLowerCase() === snippet.customUrl.toLowerCase()) {
                            match = {
                                value: item.id,
                                type: 'channel_id',
                                original: 'https://www.youtube.com/channel/' + item.id,
                                mayHideOthers: true
                            }
                        }
                    }
                }

                if (match) {
                    callbackResubmit(match);
                } else if (page < 3 && !$.isEmptyObject(nextPageToken)) {
                    resolveCustomChannel(parsedInput, callbackResubmit, nextPageToken, page+1)
                } else {
                    errorState("Could not resolve Custom Channel URL", function (append) {
                        append.append("<p class='mb-15'>" +
                            "Custom channel URLs have no direct API method, an indirect resolving method was unable to find it. " +
                            "</p>");
                        append.append("<p class='mb-15'>" +
                            "Verify that the custom URL actually exists, if it does than you may try manually resolving it. " +
                            "</p>");
                        append.append("<p class='mb-15'>" +
                            "More detail about the issue and what you can do can be found here at " +
                            "<a target='_blank' href='https://github.com/mattwright324/youtube-metadata/issues/1'>#1 - Channel custom url unsupported</a>." +
                            "</p>");
                    })
                }
            }).fail(function (err) {
                errorState("Could not resolve Custom Channel URL", function (append) {
                    append.append("<p class='mb-15'>" +
                        "The custom channel URL resolver had an issue querying for the search channels. " +
                        "</p>");
                    append.append("<p class='mb-15'>" +
                        "More detail about the issue and what you can do can be found here at " +
                        "<a target='_blank' href='https://github.com/mattwright324/youtube-metadata/issues/1'>#1 - Channel custom url unsupported</a>." +
                        "</p>");
                })
            });
        }).fail(function (err) {
            errorState("Could not resolve Custom Channel URL", function (append) {
                append.append("<p class='mb-15'>" +
                    "The custom channel URL resolver had an issue on the search query. " +
                    "</p>");
                append.append("<p class='mb-15'>" +
                    "More detail about the issue and what you can do can be found here at " +
                    "<a target='_blank' href='https://github.com/mattwright324/youtube-metadata/issues/1'>#1 - Channel custom url unsupported</a>." +
                    "</p>");
            })
        });
    }

    async function submit(parsedInput) {
        console.log(parsedInput);

        if (parsedInput.original) {
            controls.inputValue.val(parsedInput.original);

            const baseUrl = location.origin + location.pathname;
            controls.shareLink.val(baseUrl + "?url=" + encodeURIComponent(parsedInput.original) + "&submit=true");
            controls.shareLink.attr("disabled", false);
        }

        if (parsedInput.type === 'unknown') {
            errorState("Your link did not follow an accepted format.");
        } else if (parsedInput.type === 'channel_custom') {
            resolveCustomChannel(parsedInput, submit, '', 1);
        } else if (parsedInput.type === 'video_id') {
            console.log('grabbing video');

            if (parsedInput.mayHideOthers) {
                $("#playlist").hide();
            }

            youtube.ajax('videos', {
                part: Object.keys(partMap.video).join(','),
                id: parsedInput.value
            }).done(function (res) {
                console.log(res);

                parseVideo(res, parsedInput);
            }).fail(function (err) {
                console.log(err);

                errorState("There was a problem querying for the video.");
            });
        } else if (parsedInput.type === 'channel_id') {
            console.log('grabbing channel id');

            if (parsedInput.mayHideOthers) {
                $("#video,#playlist").hide();
            }

            youtube.ajax('channels', {
                part: "id," + Object.keys(partMap.channel).join(','),
                id: parsedInput.value
            }).done(function (res) {
                console.log(res);

                parseChannel(res, parsedInput);
            }).fail(function (err) {
                console.error(err);

                errorState("There was a problem querying for the channel.");
            });
        } else if (parsedInput.type === 'channel_user') {
            console.log('grabbing channel user');

            if (parsedInput.mayHideOthers) {
                $("#video,#playlist").hide();
            }

            youtube.ajax('channels', {
                part: Object.keys(partMap.channel).join(','),
                forUsername: parsedInput.value
            }).done(function (res) {
                console.log(res);

                parseChannel(res, parsedInput);
            }).fail(function (err) {
                console.error(err);

                errorState("There was a problem querying for the channel.");
            });
        } else if (parsedInput.type === 'playlist_id') {
            console.log('grabbing playlist');

            if (parsedInput.mayHideOthers) {
                $("#video").hide();
            }

            youtube.ajax('playlists', {
                part: Object.keys(partMap.playlist).join(','),
                id: parsedInput.value
            }).done(function (res) {
                console.log(res);

                parsePlaylist(res, parsedInput);
            }).fail(function (err) {
                console.error(err);

                errorState("There was a problem querying for the playlist.");
            });
        }
    }

    const internal = {
        init: function () {
            controls.inputValue = $("#value");
            controls.btnSubmit = $("#submit");
            controls.shareLink = $("#shareLink");

            new ClipboardJS(".clipboard");

            controls.btnExport = $("#export");
            controls.btnImport = $("#import");
            controls.importFileChooser = $("#importFileChooser");

            elements.videoSection = $("#video-section");
            elements.channelSection = $("#channel-section");
            elements.playlistSection = $("#playlist-section");

            const exampleLink = "https://youtu.be/" + EXAMPLE_VIDEOS[Math.trunc(Math.random() * EXAMPLE_VIDEOS.length)];
            controls.inputValue.val(exampleLink);

            internal.buildPage(true);
        },
        buildPage: function(doSetup) {
            $(".part-section").remove();
            $("#thumbnails").empty();

            for (let part in partMap.video) {
                const partData = partMap.video[part];
                const html =
                    "<div id='" + part + "' class='part-section'>" +
                        "<div class='section-header unknown'><i class='question circle icon'></i><span>" + partData.title + "</span></div>" +
                    "</div>";
                elements.videoSection.append(html);
            }

            for (let part in partMap.channel) {
                const partData = partMap.channel[part];
                const html =
                    "<div id='" + part + "' class='part-section'>" +
                        "<div class='section-header unknown'><i class='question circle icon'></i><span>" + partData.title + "</span></div>" +
                    "</div>";
                elements.channelSection.append(html);
            }

            for (let part in partMap.playlist) {
                const partData = partMap.playlist[part];
                const html =
                    "<div id='" + part + "' class='part-section'>" +
                    "<div class='section-header unknown'><i class='question circle icon'></i><span>" + partData.title + "</span></div>" +
                    "</div>";
                elements.playlistSection.append(html);
            }

            if (doSetup) {
                internal.setupControls();
            }
        },
        setupControls: function() {
            controls.inputValue.on('keypress', function (e) {
                if (e.originalEvent.code === "Enter") {
                    controls.btnSubmit.click();
                }
            });
            controls.btnSubmit.on('click', function () {
                exportData = {};

                const value = controls.inputValue.val();

                const baseUrl = location.origin + location.pathname;
                controls.shareLink.val(baseUrl + "?url=" + encodeURIComponent(value) + "&submit=true");
                controls.shareLink.attr("disabled", false);

                const parsed = determineInput(value);

                $("#video,#playlist,#channel").show();
                $("#unknown").hide();
                internal.buildPage(false);
                submit(parsed);
            });

            controls.btnExport.on('click', async function () {
                controls.btnExport.addClass("loading").addClass("disabled");

                const zip = new JSZip();
                console.log("Creating about.txt...")
                zip.file("about.txt",
                    "Downloaded by YouTube Metadata " + new Date().toLocaleString() + "\n\n" +
                    "URL: " + window.location + "\n\n" +
                    "Input: " + controls.inputValue.val()
                );

                if (exportData.hasOwnProperty("video")) {
                    console.log("Creating video.json...")
                    zip.file("video.json", JSON.stringify(exportData.video, null, 4));
                }

                if (exportData.hasOwnProperty("playlist")) {
                    console.log("Creating playlist.json...")
                    zip.file("playlist.json", JSON.stringify(exportData.playlist, null, 4));
                }

                if (exportData.hasOwnProperty("channel")) {
                    console.log("Creating channel.json...")
                    zip.file("channel.json", JSON.stringify(exportData.channel, null, 4));
                }

                console.log("Saving as metadata.zip")
                zip.generateAsync({
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: {
                        level: 9
                    }
                }).then(function (content) {
                    saveAs(content, "metadata.zip");

                    controls.btnExport.removeClass("loading").removeClass("disabled");
                });
            });

            controls.importFileChooser.on('change', function (event) {
                console.log(event);

                let file = event.target.files[0];

                if (file) {
                    controls.inputValue.val(file.name);
                } else {
                    return;
                }

                console.log("Importing from file " + file.name);

                controls.btnImport.addClass("loading").addClass("disabled");

                $("#video,#playlist,#channel").show();
                $("#unknown").hide();
                internal.buildPage(false);

                function loadFile(fileName, parseMethod, inputType) {
                    return JSZip.loadAsync(file).then(function (content) {
                        const file = content.file(fileName);
                        return file ? file.async("string") : null;
                    }).then(function (text) {
                        if (!text) {
                            $("#" + inputType).hide();
                            return;
                        }
                        const content = JSON.parse(text);
                        console.log(content);
                        parseMethod(content, {
                            type: inputType,
                            value: idx(["items", 0, "id"], content)
                        }, true);
                    });
                }

                loadFile("video.json", parseVideo, "video").then(function () {
                    loadFile("playlist.json", parsePlaylist, "playlist").then(function () {
                        loadFile("channel.json", parseChannel, "channel").then(function () {
                            controls.btnImport.removeClass("loading").removeClass("disabled");
                        })
                    });
                });
            });

            function parseQuery(queryString) {
                var query = {};
                var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
                for (var i = 0; i < pairs.length; i++) {
                    var pair = pairs[i].split('=');
                    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
                }
                return query;
            }
            const query = parseQuery(window.location.search);
            console.log(query);
            if (query.hasOwnProperty("url")) {
                controls.inputValue.val(decodeURIComponent(query.url));
            }
            if (query.hasOwnProperty("submit") && String(query.submit).toLowerCase() === String(true)) {
                setTimeout(function () {
                    controls.btnSubmit.click();
                }, 500);
            }
        }
    };
    $(document).ready(internal.init);
}());
