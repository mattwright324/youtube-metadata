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

    const patterns = {
        video_id: [
            /http[s]?:\/\/(?:www|m).youtube.com\/watch\?v=([\w_-]+)(?:&.*)?/i,
            /http[s]?:\/\/youtu.be\/([\w_-]+)(?:\?.*)?/i
        ],
        playlist_id: [
            /http[s]?:\/\/(?:www|m).youtube.com\/playlist\?list=([\w_-]+)(?:&.*)?/i
        ],
        channel_user: [
            /http[s]?:\/\/(?:www|m).youtube.com\/user\/([\w_-]+)(?:\?.*)?/i
        ],
        channel_id: [
            /http[s]?:\/\/(?:www|m).youtube.com\/channel\/([\w_-]+)(?:\?.*)?/i
        ],
        channel_custom: [
            /http[s]?:\/\/(?:www|m).youtube.com\/c\/([\w_-]+)(?:\?.*)?/i
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
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        const millis = duration.milliseconds();
        const format = [
            (years > 0 ? years + "y" : ""),
            (days > 0 ? days + "d" : ""),
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

    function processLocalizations(partDiv, partJson) {
        const translations = [];

        for (let code in partJson) {
            translations.push("<li><span class='orange'>" + String(code).toUpperCase() + "</span> which is <span class='orange'>" + formatBCP47(bcp47.lookup(code)) + "</span></li>")
        }

        partDiv.append("<p class='mb-15'><strong>Localizations for...</strong>" +
                "<ul>" + translations.join("") + "</ul>" +
            "</p>")
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
                    submit({
                        type: 'channel_id',
                        value: partJson.channelId,
                        mayHideOthers: false
                    });

                    const partDiv = $("#video-section #snippet");

                    partDiv.append("<a target='_blank' href='https://youtu.be/" + fullJson.id + "'><img src='" + partJson.thumbnails.medium.url + "' class='mb-15'></a>");

                    const titleHtml =
                        "<p class='mb-15' style='font-size: 1.25em'>" + partJson.title + "</p>";
                    partDiv.append(titleHtml);

                    const authorHtml =
                        "<p class='mb-15'><strong>Published by</strong> " +
                            "<a href='https://www.youtube.com/channel/" + partJson.channelId + "' target='_blank'>" +
                                partJson.channelTitle +
                            "</a>" +
                        "</p>";
                    partDiv.append(authorHtml);

                    const published = new Date(partJson.publishedAt);
                    const dateHtml =
                        "<p class='mb-15'><strong>Published on</strong> " +
                            "<span class='orange'>" + published.toUTCString() + "</span>" +
                            " (" + moment(published).fromNow() + ")" +
                        "</p>";
                    partDiv.append(dateHtml);

                    if (partJson.tags) {
                        const tagsHtml =
                            "<p class='mb-15'><strong>Tag(s): </strong>" +
                                "<span class='tag'>" + partJson.tags.join(" </span><span class='tag'>") + "</span>" +
                            "</p>";
                        partDiv.append(tagsHtml);
                    } else {
                        partDiv.append("<p class='mb-15'>There were no tags.</p>")
                    }

                    if (partJson.defaultLanguage) {
                        const code = partJson.defaultLanguage.toUpperCase();
                        const translated = bcp47.lookup(code);

                        partDiv.append("<p class='mb-15'><strong>Default language is</strong> <span class='orange'>" + code + "</span> which means <span class='orange'>" + formatBCP47(translated) + "</span></p>")
                    }

                    if (partJson.defaultAudioLanguage) {
                        const code = partJson.defaultAudioLanguage.toUpperCase();
                        const translated = bcp47.lookup(code);

                        partDiv.append("<p class='mb-15'><strong>Audio language is</strong> <span class='orange'>" + code + "</span> which means <span class='orange'>" + formatBCP47(translated) + "</span></p>")
                    }
                }
            },
            statistics: {
                title: "Statistics",
                postProcess: function (partJson) {
                    const partDiv = $("#video-section #statistics");

                    if (partJson.hasOwnProperty("likeCount")) {
                        const likes = partJson.likeCount;
                        const dislikes = partJson.dislikeCount;

                        let normalizedLikes = likes, normalizedDislikes = dislikes;
                        let gcdValue = 0, gcdLikes = 0, gcdDislikes = 0;

                        if (likes > 0 && dislikes > 0) {
                            function gcd(p, q) {
                                if (q === 0) {
                                    return p;
                                }
                                return gcd(q, p % q);
                            }
                            gcdValue = gcd(partJson.likeCount, partJson.dislikeCount);
                            gcdLikes = gcdValue === 0 ? 0 : partJson.likeCount / gcdValue;
                            gcdDislikes = gcdValue === 0 ? 0 : partJson.dislikeCount / gcdValue;
                        }

                        if (gcdValue !== 0) {
                            if (gcdLikes > gcdDislikes) {
                                normalizedLikes = gcdLikes / gcdDislikes;
                                normalizedDislikes = 1;
                            } else {
                                normalizedLikes = 1;
                                normalizedDislikes = gcdDislikes / gcdLikes;
                            }
                        }

                        const html =
                            "<p class='mb-15'>" +
                                "<strong>Normalized like ratio:</strong> " +
                                "<span style='color:green'>" + Math.trunc(normalizedLikes) + " like(s)</span> per " +
                                "<span style='color:red'>" + Math.trunc(normalizedDislikes) + " dislike(s)</span>" +
                            "</p>";
                        partDiv.append(html);
                    } else {
                        partDiv.append("<p class='mb-15'>This video has <strong>likes disabled.</strong></p>")
                    }

                    if (!partJson.hasOwnProperty("viewCount")) {
                        partDiv.append("<p class='mb-15'>This video has <strong>view counts disabled.</strong></p>")
                    }

                    if (!partJson.hasOwnProperty("commentCount")) {
                        partDiv.append("<p class='mb-15'>This video has <strong>comments disabled.</strong></p>")
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
                        const staticMap = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlng + "&zoom=13&size=1000x300&key=AIzaSyCGWanOEMEgdHqsxNDaa_ZXTZ6hoYQrnAI&markers=color:red|" + latlng;

                        const html =
                            "<a href='https://maps.google.com/maps?q=loc:"+latlng+"' target='_blank'>" +
                                "<img class='mb-15' src='"+ staticMap +"' alt='Google Maps Static Map'>" +
                                "<p>Click to open in Google Maps</p>" +
                            "</a>";

                        partDiv.append(html);
                    }

                    if (partJson.recordingDate && fullJson.snippet) {
                        const recordDate = new Date(partJson.recordingDate);
                        const recordMoment = moment(recordDate);

                        const dateHtml =
                            "<p class='mt-15 mb-15'><strong>Recorded on</strong> " +
                                "<span class='orange'>" + recordDate.toUTCString() + "</span>" +
                                " (" + recordMoment.fromNow() + "). YouTube appears to strip the time, it is always zero'd out." +
                            "</p>";
                        partDiv.append(dateHtml);

                        const published = moment(fullJson.snippet.publishedAt);
                        const format = formatDuration(getDuration(recordMoment, published), false, true);
                        if (format === "0s") {
                            partDiv.append("<p class='mb-15'>The video was recorded <span class='orange'>same day</span> as the publish date.</p>")
                        } else if (published.isAfter(recordMoment)) {
                            partDiv.append("<p class='mb-15'>The video was recorded <span class='orange'>" + format + "</span> before the publish date.</p>")
                        } else {
                            partDiv.append("<p class='mb-15'>The video was recorded <span class='orange'>" + format + "</span> after the publish date. This shouldn't be possible?</p>");
                        }
                    }
                }
            },
            status: {
                title: "Status",
                postProcess: function (partJson) {
                    const partDiv = $("#video-section #status");

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

                    const now = moment(new Date());
                    if (partJson.hasOwnProperty("scheduledStartTime") && !partJson.hasOwnProperty("actualStartTime")) {
                        // Stream hasn't started
                        const start = moment(partJson.scheduledStartTime);
                        const format = formatDuration(getDuration(start, now));

                        if (start.isAfter(now)) {
                            partDiv.append("<p class='mb-15'>The stream hasn't started yet. It will start in <span class='orange'>" + format + "</span></p>");
                        } else {
                            partDiv.append("<p class='mb-15'>The stream is over. It was supposed to start <span class='orange'>" + format + "</span> ago</p>");
                        }
                    }
                    if (partJson.hasOwnProperty("actualStartTime") && partJson.hasOwnProperty("scheduledStartTime")) {
                        // Stream started. Time between schedule date and actual start?
                        const start = moment(partJson.actualStartTime);
                        const scheduled = moment(partJson.scheduledStartTime);
                        const format = formatDuration(getDuration(start, scheduled));
                        if (start.isAfter(scheduled)) {
                            partDiv.append("<p class='mb-15'>The stream was <span class='orange'>" + format + "</span> late to start</p>")
                        } else {
                            partDiv.append("<p class='mb-15'>The stream was <span class='orange'>" + format + "</span> early to start</p>");
                        }
                    }
                    if (partJson.hasOwnProperty("actualStartTime") && !partJson.hasOwnProperty("actualEndTime")) {
                        // Stream started but still going. Time between start and now?
                        const start = moment(partJson.actualStartTime);
                        const format = formatDuration(getDuration(start, now));

                        partDiv.append("<p class='mb-15'>The stream is still going. It has been running for <span class='orange'>" + format + "</span></p>");
                    }
                    if (partJson.hasOwnProperty("actualStartTime") && partJson.hasOwnProperty("actualEndTime")) {
                        // Stream done. Time between start and end?
                        const start = moment(partJson.actualStartTime);
                        const end = moment(partJson.actualEndTime);
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
                        partDiv.append("<p class='mb-15'>Livestream? A video shouldn't be 0 seconds.</p>");
                    } else {
                        partDiv.append("<p class='mb-15'>The video length was <span style='color:orange'>" + format + "</span></p>");
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
         * Can't access part(s): auditDetails
         * Useless part(s): id
         * Every other part below:
         */
        channel: {
            snippet: {
                title: "Snippet",
                postProcess: function (partJson, fullJson) {
                    const partDiv = $("#channel-section #snippet");

                    partDiv.append("<a target='_blank' href='https://www.youtube.com/channel/" + fullJson.id + "'><img src='" + partJson.thumbnails.medium.url + "' class='mb-15 profile'></a>");
                    partDiv.append("<p class='mb-15' style='font-size: 1.25em'>" + partJson.title + "</p>");

                    const published = new Date(partJson.publishedAt);
                    const dateHtml =
                        "<p class='mb-15'><strong>Channel created on </strong> " +
                            "<span class='orange'>" + published.toUTCString() + "</span>" +
                            " (" + moment(published).fromNow() + ")" +
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
                }
            },
            statistics: {
                title: "Statistics",
                postProcess: function (partJson) {
                    const partDiv = $("#channel-section #statistics");

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
                            "<p class='mb-15'><strong>Channel Keyword(s): </strong>" +
                                (parsed && parsed.length ?
                                    "<span class='tag'>" +
                                        parsed.join(" </span><span class='tag'>") +
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
                        if (related.hasOwnProperty("uploads")) {
                            partDiv.append("<p class='mb-15'><a target='_blank' href='https://www.youtube.com/playlist?list=" + related.uploads + "'>Uploads playlist</a></p>")
                        }
                        if (related.hasOwnProperty("favorites")) {
                            partDiv.append("<p class='mb-15'><a target='_blank' href='https://www.youtube.com/playlist?list=" + related.favorites + "'>Favorites playlist</a></p>")
                        }
                        if (related.hasOwnProperty("likes")) {
                            partDiv.append("<p class='mb-15'><a target='_blank' href='https://www.youtube.com/playlist?list=" + related.likes + "'>Likes playlist</a></p>")
                        }
                    }
                }
            },
            contentOwnerDetails: {
                title: "Content Owner Details",
                postProcess: function (partJson) {
                    const partDiv = $("#channel-section #contentOwnerDetails");
                }
            },
            invideoPromotion: {
                title: "In-Video Promotion",
                postProcess: function (partJson) {
                    const partDiv = $("#channel-section #invideoPromotion");
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

                    const longUploads = partJson.longUploadsStatus;
                    if (longUploads === "allowed") {
                        partDiv.append("<p class='mb-15'>This channel may upload videos <span class='orange'>longer than 15 minutes</span></p>")
                    } else if (longUploads === "disallowed") {
                        partDiv.append("<p class='mb-15'>This channel may <strong>not</strong> upload videos <span class='orange'>longer than 15 minutes</span></p>")
                    } else if (longUploads === "eligible") {
                        partDiv.append("<p class='mb-15'>This channel is eligible to upload videos <span class='orange'>longer than 15 minutes</span> but they have not enabled it yet.</p>")
                    } else {
                        partDiv.append("<p class='mb-15'>It's unspecified whether this channel may upload videos longer than 15 minutes.</p>")
                    }

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
            /*topicDetails: {
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
            }*/
        },

        /**
         * Useless part(s): id, player
         * Every other part below:
         */
        playlist: {
            snippet: {
                title: "Snippet",
                postProcess: function (partJson, fullJson) {
                    submit({
                        type: 'channel_id',
                        value: partJson.channelId,
                        mayHideOthers: false
                    });

                    const partDiv = $("#playlist-section #snippet");

                    partDiv.append("<a target='_blank' href='https://www.youtube.com/playlist?list=" + fullJson.id + "'><img src='" + partJson.thumbnails.medium.url + "' class='mb-15'></a>");
                    partDiv.append("<p class='mb-15' style='font-size: 1.25em'>" + partJson.title + "</p>");

                    const authorHtml =
                        "<p class='mb-15'><strong>Published by</strong> " +
                            "<a href='https://www.youtube.com/channel/" + partJson.channelId + "' target='_blank'>" +
                                partJson.channelTitle +
                            "</a>" +
                        "</p>";
                    partDiv.append(authorHtml);

                    const published = new Date(partJson.publishedAt);
                    const dateHtml =
                        "<p class='mb-15'><strong>Playlist created on </strong> " +
                            "<span class='orange'>" + published.toUTCString() + "</span>" +
                            " (" + moment(published).fromNow() + ")" +
                        "</p>";
                    partDiv.append(dateHtml);
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

            for (let part in partMap[partMapType]) {
                const section = $("#" + sectionId + " #" + part);
                const sectionHeader = $(section.find(".section-header"));

                if (item.hasOwnProperty(part)) {
                    sectionHeader.removeClass("unknown").addClass("good");
                    sectionHeader.find("i").removeClass("question").addClass("check");

                    section.append("<pre><code class=\"prettyprint json-lang\"></code></pre>");

                    const json = section.find("code");
                    json.text(JSON.stringify(item[part], null, 4));
                    hljs.highlightBlock(json[0]);

                    partMap[partMapType][part].postProcess(item[part], item);
                } else {
                    sectionHeader.removeClass("unknown").addClass("bad");
                    sectionHeader.find("i").removeClass("question").addClass("minus");

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

    async function parseVideo(res, input) {
        parseType("video", "video-section", res, input);
    }

    async function parsePlaylist(res, input) {
        parseType("playlist", "playlist-section", res, input);
    }

    async function parseChannel(res, input) {
        parseType("channel", "channel-section", res, input);
    }

    async function submit(parsedInput) {
        console.log(parsedInput);

        if (parsedInput.type === 'unknown') {
            errorState("Your link did not follow an accepted format.");
        } else if (parsedInput.type === 'channel_custom') {
            errorState("Custom channel URLs are not supported.", function (append) {
                append.append("<p class='mb-15'>" +
                        "More detail about the issue and what you can do can be found here at " +
                        "<a target='_blank' href='https://github.com/mattwright324/youtube-metadata/issues/1'>#1 - Channel custom url unsupported</a>." +
                    "</p>");
            });
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

                const id = parsedInput.value;
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

            elements.videoSection = $("#video-section");
            elements.channelSection = $("#channel-section");
            elements.playlistSection = $("#playlist-section");

            // 150 top-viewed geolocated videos in europe
            const examples = [
                "S6rZtIipew8","yG07WSu7Q9w","jy5UDtRmbEA","dkmjCAjAQug","PvxIjey1waE",
                "4N--MJIfyB0","zPX7o9qzC8U","inRKcDcNccI","iquQBqD2Gs4","3WySwhj2SwE",
                "FoJQAyrUHhA","R5bg7mdnGAU","u41ujNodvnM","jh1WiKtZHwE","Emv0KcrZRlI",
                "VkTO16HjVEc","bQzIQa5YKvw","-mA8JzVeC1g","rYA11kuJOP0","t9OdC-YTsoA",
                "aqpmbTJHiis","3xl_ECxlOnU","JD9j-Xka6sA","i9x7wPTKY_Q","Cn_bXKxkluY",
                "OC_CpnwZPYM","H4v7wddN-Wg","rQW6yD0JeKE","M77iURs9pGU","8gQkeNzf7_c",
                "-7lqGbIE3aM","wzc_VNh42HM","_CnA-_0eKUQ","pazXnYq4-SU","Xfi59Nzj1VE",
                "dIsGkpQGq5o","ptfmAY6M6aA","GhBXx-2PadM","bTLgMqjG-TQ","-R00v5pcSNk",
                "EY7EIZl4raY","5v5NV-nJrrE","LOTbOmvaOJo","JvEMQalsHWs","W40-ABmPXME",
                "wQdxqyEMD1c","B4UYaumLy90","3AkFpbOjMSo","-ZL1IzZYzl0","Lp9XoiFbZcI",
                "pY6S2TzytVY","9gKlEL3Uem4","y_0ybTKt8Hc","rVao0TtDBvk","TepwaPCpR7k",
                "RjqD7VegwRw","qtuvP8En0vU","3XOKmaElzqw","rtk2SWaB_H0","0K4SovgGWvg",
                "AcswBOX60hI","2w6ZYnBaq8k","VxtdCeg7VPE","Xn5THTi6Zbg","7Y_FM35XR5o",
                "iz7-t3cj0CQ","e4ohG2I0NA8","jrR5aARaqkw","x3hoYr2dZfY","i6MV_LHWUSs",
                "rYnO2wuIiBg","x959zhL3F6s","4ijEJgmjt5w","qGulU83N6Gc","IUadU9GK4nI",
                "c3Ywo8Tsyys","jyvYrH0KxAI","KuhA0ASQEGA","2N9I5DQJnF0","8NKDsDRiGZo",
                "uVAHJYrLldg","Y_1x25k7QEs","fDqZ8Q-QAsM","PfYYraMgiBA","sp7Bi_udKnc",
                "gLrzMzD_yvw","7EyisikW1t4","ySGUPSpCFmo","27ngBYn6Y-E","YUBaSdBzLaE",
                "juSvznijg3g","yceT2CVqLyY","TfPKMurs-OY","1wLBXIIDzf0","F4KNqDpIrHg",
                "WKa4Ml860Ag","YwTXhNYG4gw","uF9rso7AMAs","xGxY-nC3E3M","oDOi6Kn1JA8",
                "1aw_FL24I7A","-ERdvPuEwUA","l_Ip6A9xASo","VgAYi-rKT8Q","wO1cEUsQcJ8",
                "Pusi-FqI1UY","-PE-fWJZhCU","CkonLJ2bUQk","YQevuFBV0w4","diX8IyrGQJY",
                "nk2QFHdlER8","OkoLw0S4ujc","jutYLDL08TQ","sE9iJPEuYHE","_Jijy3OCbdg",
                "skLvBleOdp4","fDyKGEDsxuw","Xlo7tk-1Kio","bNZHWr83jZk","6l5NYAUOd8c",
                "J6C8K1CKYF0","knIUBsf95uY","TvzXBRLGixQ","ZduygjtPn_c","UOgBUeYlrPM",
                "FTLPHCu53o0","K6lkg-NzoVU","4NbSeKMCWtg","5yvoIjW6J5I","GjKULFuUxWM",
                "DtMC1SsKhIU","BWaZgnRRrX8","ivq9ji9FUtU","CJyfvWivOto","L88dPk6QWeE",
                "muLAzfQDS3M","AS4kaxRJYqU","mobH5YN-VKg","agP0YIsASO8","G6Irb_GIBXw",
                "2QW7d-m2Axk","EqbSY4a17qc","w3sxnD5JBKI","fXbMh96rtM8","Dke8Umlh9R8",
                "X4gt7jL0rP0","C8Lg35s0aYg","-Ga3CrmYKto","J6jesg5MYOs","sLzUHMv9h0U"];
            const exampleLink = "https://youtu.be/" + examples[Math.trunc(Math.random() * examples.length)];
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
