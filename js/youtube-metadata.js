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
        ]
    };

    function determineInput(value) {
        const parsed = {
            type: 'unknown',
            mayHideOthers: true
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

    function formatDuration(duration, includeMs) {
        const years = duration.years();
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        const millis = duration.milliseconds();
        const format = [
            (years > 0 ? years + "y" : ""),
            (days > 0 ? days + "d" : ""),
            (hours > 0 ? hours + "h" : ""),
            (minutes > 0 ? minutes + "m" : ""),
            (seconds > 0 ? seconds + "s" : ""),
            includeMs ? (millis > 0 ? millis + "ms" : "") : ""
        ].join(" ");

        if (format.trim() == "") {
            return "0s";
        }

        return format;
    }

    function formatBCP47(translation) {
        const findings = [];

        if (translation.country) {
            findings.push(translation.country.name);
        }

        if (translation.language) {
            findings.push(translation.language.name);
        }

        return findings.join(" / ");
    }

    function processLocalizations(partDiv, partJson) {
        const translations = [];

        for (let code in partJson) {
            translations.push("<li><span class='orange'>" + String(code).toUpperCase() + "</span> which is <span class='orange'>" + formatBCP47(bcp47.lookup(code)) + "</span></li>")
        }

        partDiv.append("<p class='mb-15'><strong>Localizations for...</strong>" +
                "<ul>" + translations.join() + "</ul>" +
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
                            " (" + recordMoment.fromNow() + ")" +
                            "</p>";
                        partDiv.append(dateHtml);

                        const published = moment(fullJson.snippet.publishedAt);
                        const format = formatDuration(getDuration(recordMoment, published));
                        if (published.isAfter(recordMoment)) {
                            partDiv.append("<p class='mb-15'>The video was recorded <span class='orange'>" + format + "</span> before the publish date</p>")
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

                            partDiv.append("<p class='mb-15'><a href='" + url + "'>" + text + "</a></p>")
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
            brandingSettings: {
                title: "Branding Settings",
                postProcess: function (partJson) {
                    const partDiv = $("#channel-section #brandingSettings");

                    if (partJson.hasOwnProperty("trackingAnalyticsAccountId")) {
                        partDiv.append("<p class='mb-15'>This channel is tracking and measuring traffic with Google Analytics</p>")
                    }

                    if (partJson.moderateComments) {
                        partDiv.append("<p class='mb-15'>Comments on the channel page require approval by the channel owner.</p>")
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
                            partDiv.append("<p class='mb-15'><a href='https://www.youtube.com/playlist?list=" + related.uploads + "'>Uploads playlist</a></p>")
                        }
                        if (related.hasOwnProperty("favorites")) {
                            partDiv.append("<p class='mb-15'><a href='https://www.youtube.com/playlist?list=" + related.favorites + "'>Favorites playlist</a></p>")
                        }
                        if (related.hasOwnProperty("likes")) {
                            partDiv.append("<p class='mb-15'><a href='https://www.youtube.com/playlist?list=" + related.likes + "'>Likes playlist</a></p>")
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
            topicDetails: {
                title: "Topic Details",
                postProcess: function (partJson) {
                    const partDiv = $("#channel-section #topicDetails");

                    const categories = partJson.topicCategories;
                    if (categories) {
                        for(let i = 0; i < categories.length; i++) {
                            const url = categories[i];
                            const text = url.substr(url.lastIndexOf('/')+1).replace(/_/g, " ");

                            partDiv.append("<p class='mb-15'><a href='" + url + "'>" + text + "</a></p>")
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

    function parseType(partMapType, sectionId, res) {
        if (res.items.length) {
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
            console.log('bad value');
        }
    }

    async function parseVideo(res) {
        parseType("video", "video-section", res);
    }

    async function parsePlaylist(res) {
        parseType("playlist", "playlist-section", res);
    }

    async function parseChannel(res) {
        parseType("channel", "channel-section", res);
    }

    async function submit(parsedInput) {
        console.log(parsedInput);

        if (parsedInput.type === 'unknown') {
            console.log("didn't recognize your input");
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

                parseVideo(res);

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

                parseChannel(res);
            }).fail(function (err) {
                console.error(err);
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

                parseChannel(res);
            }).fail(function (err) {
                console.error(err);
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

                parsePlaylist(res);
            }).fail(function (err) {
                console.error(err);
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