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

    const delaySubmitKey = "delaySubmitNormal";
    const can = {
        submit: true,
    };

    const delay5Sec = 5;
    const delay5SecMs = delay5Sec * 1000;

    function countdown(key, control, delay, flag) {
        control.addClass("loading").addClass("disabled");
        can[flag] = false;

        let value = localStorage.getItem(key);
        if (!moment(value).isValid()) {
            console.warn('value for %s was not a valid date, resetting to now', key);
            localStorage.setItem(key, new Date());
            value = localStorage.getItem(key);
        }
        if (moment(value).isAfter(moment())) {
            console.warn('value for %s was set in the future, resetting to now', key);
            localStorage.setItem(key, new Date());
            value = localStorage.getItem(key);
        }
        let count = (delay - moment().diff(value)) / 1000;
        control.find(".countdown").text(Math.trunc(count));

        function c(control, count) {
            if (count <= 1) {
                control.removeClass("loading").removeClass("disabled");
                control.find(".countdown").text("");

                can[flag] = true;
            } else {
                control.find(".countdown").text(Math.trunc(count));
                setTimeout(function () {
                    c(control, count - 1)
                }, 1000);
            }
        }

        setTimeout(function () {
            c(control, count)
        }, 1000);
    }

    function countdownCheck(key, control, delayMs, flag) {
        const value = localStorage.getItem(key);
        if (key in localStorage && moment(value).isValid() && moment().diff(value) < delayMs) {
            countdown(key, control, delayMs, flag);
        } else {
            control.removeClass("loading").removeClass("disabled");
            control.find(".countdown").text("");
        }
    }
    function getSuggestedHtml(parsedInput, fullJson, jsonType, filmot) {
        const suggested = getSuggestedLinks(parsedInput, fullJson, jsonType, filmot);
        suggested.sort((a, b) => (a.text > b.text) ? 1 : -1)
        const html = [];
        for (let i = 0; i < suggested.length; i++) {
            const link = suggested[i];
            html.push("<li><a target='_blank' href='" + link.url + "'>" + link.text + "</a></li>")
        }
        return "<ul>" + html.join("") + "</ul>";
    }

    function getConvertTime(date) {
        const momentTime = moment(date).utc();

        return " (<a target='_blank' href='https://www.timeanddate.com/worldclock/converter.html?iso=" +
            momentTime.format("YYYYMMDDTHHmmss") + "'>convert</a>)"
    }

    function getSuggestedLinks(parsedInput, fullJson, jsonType, filmot) {
        const data = {}
        if (parsedInput) {
            data[parsedInput.type] = parsedInput.value;
        } else if (fullJson) {
            if (jsonType === "video") {
                data["video_id"] = fullJson.id;
                data["video_title"] = shared.idx(["snippet", "title"], fullJson);
                data["test"] = "test";
            } else if (jsonType === "playlist") {
                data["playlist_id"] = fullJson.id;
                data["playlist_title"] = shared.idx(["snippet", "title"], fullJson);
            } else if (jsonType === "channel") {
                data["channel_id"] = fullJson.id;
                data["channel_title"] = shared.idx(["snippet", "title"], fullJson);

                const custom = shared.idx(["snippet", "customUrl"], fullJson);
                if (custom) {
                    data["channel_custom"] = custom;
                }
            }
        } else if (filmot) {
            data["video_title"] = filmot.title;
            data["channel_id"] = filmot.channelid;
            data["channel_title"] = filmot.channelname;
        }
        console.log(data);

        function encode(text) {
            return encodeURIComponent(text).replace(/'/g, "%27");
        }

        const suggestions = [];
        if (data.hasOwnProperty("video_title")) {
            suggestions.push({
                url: "https://www.google.com/search?q=\"" + encode(data.video_title) + "\"",
                text: "Google - \"" + data.video_title + "\""
            });
            suggestions.push({
                url: "https://archive.org/search.php?query=" + encode(data.video_title),
                text: "Archive.org (search) - " + data.video_title
            });
        }
        if (data.hasOwnProperty("video_id")) {
            suggestions.push({
                url: "https://www.google.com/search?q=\"" + data.video_id + "\"",
                text: "Google - \"" + data.video_id + "\""
            });
            suggestions.push({
                url: "https://web.archive.org/web/*/https://www.youtube.com/watch?v=" + data.video_id,
                text: "Archive.org (web) - https://www.youtube.com/watch?v=" + data.video_id
            });
            suggestions.push({
                url: "https://archive.org/details/youtube-" + data.video_id,
                text: "Archive.org (details) - youtube-" + data.video_id
            });
            suggestions.push({
                url: "https://web.archive.org/web/2/http://wayback-fakeurl.archive.org/yt/" + data.video_id,
                text: "Archive.org (direct video wayback-header) - " + data.video_id
            });
            suggestions.push({
                url: "https://web.archive.org/web/2oe_/http://wayback-fakeurl.archive.org/yt/" + data.video_id,
                text: "Archive.org (direct video raw) - " + data.video_id
            });
            suggestions.push({
                url: "https://filmot.com/video/" + data.video_id,
                text: "Filmot.com - https://filmot.com/video/" + data.video_id
            });
            suggestions.push({
               url: "https://ghostarchive.org/varchive/" + data.video_id,
               text: "GhostArchive.org - " + data.video_id
            });
            // suggestions.push({
            //    url: "https://www.youtuberecover.com/watch?v=" + data.video_id,
            //    text: "YouTube Recover - " + data.video_id
            // });
            suggestions.push({
               url: "https://hobune.stream/videos/" + data.video_id,
               text: "Hobune Archive - " + data.video_id
            });
        }
        if (data.hasOwnProperty("playlist_title")) {
            suggestions.push({
                url: "https://www.google.com/search?q=\"" + encode(data.playlist_title) + "\"",
                text: "Google - \"" + data.playlist_title + "\""
            });
        }
        if (data.hasOwnProperty("playlist_id")) {
            suggestions.push({
                url: "https://www.google.com/search?q=\"" + data.playlist_id + "\"",
                text: "Google - \"" + data.playlist_id + "\""
            });
            suggestions.push({
                url: "https://web.archive.org/web/*/https://www.youtube.com/playlist?list=" + data.playlist_id,
                text: "Archive.org - https://www.youtube.com/playlist?list=" + data.playlist_id
            });
        }
        if (data.hasOwnProperty("channel_title")) {
            suggestions.push({
                url: "https://www.google.com/search?q=\"" + encode(data.channel_title) + "\"",
                text: "Google - \"" + data.channel_title + "\""
            });
            suggestions.push({
                url: "https://archive.org/search.php?query=creator%3A%22" + encode(data.channel_title) + "%22",
                text: "Archive.org (search) - creator:\"" + data.channel_title + "\""
            });
            suggestions.push({
                url: "https://archive.org/search.php?query=subject%3A%22" + encode(data.channel_title) + "%22",
                text: "Archive.org (search) - subject:\"" + data.channel_title + "\""
            });
            suggestions.push({
                url: "https://archive.org/search.php?query=" + encode(data.channel_title),
                text: "Archive.org (search) - " + data.channel_title
            });
        }
        if (data.hasOwnProperty("channel_user")) {
            // this can only happen if /user/ no longer exists on submit
            suggestions.push({
                url: "https://www.google.com/search?q=\"" + data.channel_user + "\"",
                text: "Google - \"" + data.channel_user + "\""
            });
            suggestions.push({
                url: "https://web.archive.org/web/*/https://www.youtube.com/user/" + data.channel_user,
                text: "Archive.org - https://www.youtube.com/user/" + data.channel_user
            });
            suggestions.push({
                url: "https://archive.org/search.php?query=subject%3A%22" + encode(data.channel_user) + "%22",
                text: "Archive.org (search) - subject:\"" + data.channel_user + "\""
            });
            suggestions.push({
                url: "https://archive.org/search.php?query=" + data.channel_user,
                text: "Archive.org (search) - " + data.channel_user
            });
        }
        if (data.hasOwnProperty("channel_custom")) {
            // this can only happen in channel-more if user has custom value
            suggestions.push({
                url: "https://www.google.com/search?q=\"" + data.channel_custom + "\"",
                text: "Google - \"" + data.channel_custom + "\""
            });
            if (data.channel_custom.startsWith('@')) {
                suggestions.push({
                    url: "https://web.archive.org/web/*/https://www.youtube.com/" + data.channel_custom,
                    text: "Archive.org - https://www.youtube.com/" + data.channel_custom
                });
            } else {
                suggestions.push({
                    url: "https://web.archive.org/web/*/https://www.youtube.com/c/" + data.channel_custom,
                    text: "Archive.org - https://www.youtube.com/c/" + data.channel_custom
                });
            }
            suggestions.push({
                url: "https://web.archive.org/web/*/https://www.youtube.com/" + data.channel_custom,
                text: "Archive.org - https://www.youtube.com/" + data.channel_custom
            });
            suggestions.push({
                url: "https://archive.org/search.php?query=" + data.channel_custom,
                text: "Archive.org (search) - " + data.channel_custom
            });
        }
        if (data.hasOwnProperty("channel_id")) {
            suggestions.push({
                url: "https://www.google.com/search?q=\"" + data.channel_id + "\"",
                text: "Google - \"" + data.channel_id + "\""
            });
            suggestions.push({
                url: "https://web.archive.org/web/*/https://www.youtube.com/channel/" + data.channel_id,
                text: "Archive.org - https://www.youtube.com/channel/" + data.channel_id
            });
            suggestions.push({
                url: "https://archive.org/search.php?query=subject%3A%22" + encode(data.channel_id) + "%22",
                text: "Archive.org (search) - subject:\"" + data.channel_id + "\""
            });
            suggestions.push({
                url: "https://archive.org/search.php?query=" + data.channel_id,
                text: "Archive.org (search) - " + data.channel_id
            });
            suggestions.push({
                url: "https://socialblade.com/youtube/channel/" + data.channel_id,
                text: "Socialblade.com - " + data.channel_id
            })
            suggestions.push({
                url: "https://filmot.com/channel/" + data.channel_id,
                text: "Filmot.com - https://filmot.com/channel/" + data.channel_id
            });
            // suggestions.push({
            //     url: "https://www.youtuberecover.com/channel?id=" + data.channel_id,
            //     text: "YouTube Recover - " + data.channel_id
            // });
            suggestions.push({
                url: "https://hobune.stream/channels/" + data.channel_id,
                text: "Hobune Archive - " + data.channel_id
            });
        }

        return suggestions;
    }

    function getDuration(a, b) {
        if (a.isBefore(b)) {
            return moment.duration(b.diff(a));
        } else {
            return moment.duration(a.diff(b));
        }
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
                    const thumbUrl = (thumbs.maxres || thumbs.high || thumbs.medium || thumbs.default || {url: "https://placehold.it/480x360"}).url;

                    partDiv.append("<a target='_blank' href='https://youtu.be/" + fullJson.id + "'><img id='video-thumb' src='" + thumbUrl + "' class='mb-15'></a>");

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
                        " (" + moment(published).utc().fromNow() + ") " + getConvertTime(published) +
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

                    if (partJson.categoryId) {
                        const html =
                            "<p class='mb-15'>Category id is " +
                            "<span class='orange'>" + partJson.categoryId + "</span> which means " +
                            "<span class='orange'>" + ytCategory.lookup(partJson.categoryId) + "</span>" +
                            "</p>";

                        partDiv.append(html);
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

                    partDiv.append("<p class='mb-15'>The video id is <span class='orange'>" + fullJson.id + "</span></p>");

                    partDiv.append("<p class='mb-15'><a style='display:inline;vertical-align:middle' target='_blank' href='./bulk?submit=true&url=https://www.youtube.com/channel/" + partJson.channelId + "'>" +
                        "<img src='./img/metadata.png' style='margin-left:4px;width:20px;height:20px;;margin-right:5px;' alt='youtube metadata icon' >" +
                        "Inspect the metadata for the rest of this channel's videos" +
                        "</a></p>");
                }
            },
            statistics: {
                title: "Statistics",
                postProcess: function (partJson, fullJson) {
                    const partDiv = $("#video-section #statistics");

                    if (partJson.hasOwnProperty("likeCount") && partJson.hasOwnProperty("dislikeCount")) {
                        const normalized = normalize(partJson.likeCount, partJson.dislikeCount);

                        const html =
                            "<p class='mb-15'>" +
                            "Normalized like ratio: " +
                            "<span style='color:green'>" + Math.trunc(normalized.a) + " like(s)</span> per " +
                            "<span style='color:red'>" + Math.trunc(normalized.b) + " dislike(s)</span>" +
                            "</p>";
                        partDiv.append(html);
                    } else if (!partJson.hasOwnProperty("likeCount")) {
                        partDiv.append("<p class='mb-15'>This video has <span class='orange'>likes disabled.</span></p>");
                    }

                    if (!partJson.hasOwnProperty("viewCount")) {
                        partDiv.append("<p class='mb-15'>This video has <span class='orange'>view counts disabled.</span></p>")
                    }

                    if (!partJson.hasOwnProperty("commentCount")) {
                        partDiv.append("<p class='mb-15'>This video has <span class='orange'>comments disabled.</span></p>")
                    }

                    if (!partJson.hasOwnProperty("dislikeCount")) {
                        partDiv.append(
                            "<p class='mb-15'>YouTube no longer provides the <span class='orange'>dislikeCount</span> since 2021-12-13 " +
                            "(<a href='https://developers.google.com/youtube/v3/revision_history#november-18,-2021' target='_blank'>see more here</a>). " +
                            "</p>");
                        partDiv.append("<p class='mb-15'>Want dislikes back? Check out the " +
                            "<a href='https://returnyoutubedislike.com/' target='_blank'>return-youtube-dislike</a> project!" +
                            "</p>");
                        // Potentially output RYD dislikes from their API.
                        // $.ajax({
                        //     type: "GET",
                        //     url: "https://returnyoutubedislikeapi.com/votes?videoId=" + fullJson.id
                        // }).then(function (res) {
                        //     const dislikes = shared.idx(["dislikes"], res);
                        //     if (dislikes) {
                        //         partDiv.append("<p class='mb-15'>RYD Estimated Dislikes: <span class='orange'>" + dislikes + "</span></p>")
                        //     }
                        // });
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
                        const staticMap = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlng + "&zoom=14&size=1000x300&key=AIzaSyAa-o55aIMt4YC0mhPyp8WfGql5DVg_fp4&markers=color:red|" + latlng;

                        const link = partJson.hasOwnProperty("locationDescription") ?
                            "https://maps.google.com/maps/search/" + encodeURI(partJson.locationDescription).replace(/'/g, "%27") + "/@" + latlng + ",14z" :
                            "https://maps.google.com/maps?q=loc:" + latlng;

                        const html =
                            "<p class='mb-15'><a href='" + link + "' target='_blank'>" +
                            "<img src='" + staticMap + "' alt='Google Maps Static Map'>" +
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
                        const format = shared.formatDuration(getDuration(recordDate, published), false, true);
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

                    if (partJson.hasOwnProperty("actualStartTime")) {
                        const start = new Date(partJson.actualStartTime);
                        const dateHtml =
                            "<p class='mb-15'>The stream started on " +
                            "<span class='orange'>" + start.toUTCString() + "</span>" +
                            " (" + moment(start).utc().fromNow() + ") " + getConvertTime(start) +
                            "</p>";
                        partDiv.append(dateHtml);
                    }
                    if (partJson.hasOwnProperty("actualEndTime")) {
                        const end = new Date(partJson.actualEndTime);
                        const dateHtml =
                            "<p class='mb-15'>The stream ended on " +
                            "<span class='orange'>" + end.toUTCString() + "</span>" +
                            " (" + moment(end).utc().fromNow() + ") " + getConvertTime(end) +
                            "</p>";
                        partDiv.append(dateHtml);
                    }

                    const now = moment(new Date()).utc();
                    if (partJson.hasOwnProperty("scheduledStartTime") && partJson.hasOwnProperty("scheduledEndTime")) {
                        const start = moment(partJson.scheduledStartTime).utc();
                        const end = moment(partJson.scheduledEndTime).utc();
                        const format = shared.formatDuration(getDuration(start, end));

                        partDiv.append("<p class='mb-15'>The stream was scheduled to run for <span class='orange'>" + format + "</span></p>");
                    }
                    if (partJson.hasOwnProperty("scheduledStartTime") && !partJson.hasOwnProperty("actualStartTime")) {
                        // Stream hasn't started
                        const start = moment(partJson.scheduledStartTime).utc();
                        const format = shared.formatDuration(getDuration(start, now));

                        if (start.isAfter(now)) {
                            partDiv.append("<p class='mb-15'>The stream hasn't started yet. It will start in <span class='orange'>" + format + "</span></p>");
                        } else {
                            partDiv.append("<p class='mb-15'>The stream hasn't started yet. It was supposed to start <span class='orange'>" + format + "</span> ago</p>");
                        }
                    }
                    if (partJson.hasOwnProperty("actualStartTime") && partJson.hasOwnProperty("scheduledStartTime")) {
                        // Stream started. Time between schedule date and actual start?
                        const start = moment(partJson.actualStartTime).utc();
                        const scheduled = moment(partJson.scheduledStartTime).utc();
                        const format = shared.formatDuration(getDuration(start, scheduled));
                        if (start.isAfter(scheduled)) {
                            partDiv.append("<p class='mb-15'>The stream was <span class='orange'>" + format + "</span> late to start</p>")
                        } else {
                            partDiv.append("<p class='mb-15'>The stream was <span class='orange'>" + format + "</span> early to start</p>");
                        }
                    }
                    if (partJson.hasOwnProperty("actualStartTime") && !partJson.hasOwnProperty("actualEndTime")) {
                        // Stream started but still going. Time between start and now?
                        const start = moment(partJson.actualStartTime).utc();
                        const format = shared.formatDuration(getDuration(start, now));

                        partDiv.append("<p class='mb-15'>The stream is still going. It has been running for <span class='orange'>" + format + "</span></p>");
                    }
                    if (partJson.hasOwnProperty("actualStartTime") && partJson.hasOwnProperty("actualEndTime")) {
                        // Stream done. Time between start and end?
                        const start = moment(partJson.actualStartTime).utc();
                        const end = moment(partJson.actualEndTime).utc();
                        const format = shared.formatDuration(getDuration(start, end));

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
                    const format = shared.formatDuration(duration);

                    if (format === "0s") {
                        partDiv.append("<p class='mb-15'>A video can't be 0 seconds. This must be a livestream.</p>");
                    } else {
                        partDiv.append("<p class='mb-15'>The video length was <span style='color:orange'>" + format + "</span></p>");
                    }

                    if (partJson.hasOwnProperty('regionRestriction')) {
                        const restriction = partJson.regionRestriction;

                        const totalIsoCodes = iso3166.codes.length;
                        // Should have only one or the other, never both
                        let message;
                        if (restriction.hasOwnProperty('allowed')) {
                            partDiv.append("<p class='mb-15'>This video is <span class='orange'>region-restriction</span> <span class='green'>allowed</span>.");
                            message = "These <span class='orange'>" + restriction.allowed.length + " / " + totalIsoCodes + "</span> region(s) are <span class='green'>allowed</span> to watch the video.</p>";
                            restriction.allowed.sort();
                        } else if (restriction.hasOwnProperty('blocked')) {
                            partDiv.append("<p class='mb-15'>This video is <span class='orange'>region-restriction</span> <span class='red'>blocked</span>.");
                            message = "These <span class='orange'>" + restriction.blocked.length + " / " + totalIsoCodes + "</span> region(s) are <span class='red'>not allowed</span> to watch the video.</p>";
                            restriction.blocked.sort();
                        }

                        const inList = restriction.allowed || restriction.blocked;
                        const translations = [];
                        inList.forEach(function (code) {
                            const result = iso3166.lookup(code);
                            const name = (result ? result.name : 'ISO-3166 Could not translate')

                            translations.push("<li><span class='orange'>" + String(code).toUpperCase() + "</span> which is <span class='orange'>" + name + "</span></li>")
                        });
                        partDiv.append(
                            "<p class='mb-15'><a data-bs-toggle='collapse' href='#restriction-list-1'>" + message + "</a></p>" +
                            "<div id='restriction-list-1' class='collapse'>" +
                            "<ul>" + translations.join("") + "</ul>" +
                            "</div>");

                        const notInList = [];
                        iso3166.codes.forEach(function (code) {
                            if (inList.indexOf(code.alpha2) === -1) {
                                notInList.push(code.alpha2);
                            }
                        });
                        let message2;
                        if (restriction.hasOwnProperty('allowed')) {
                            message2 = "These <span class='orange'>" + notInList.length + " / " + totalIsoCodes + "</span> region(s) are <span class='red'>not allowed</span> to watch the video.";
                            restriction.allowed.sort();
                        } else if (restriction.hasOwnProperty('blocked')) {
                            message2 = "These <span class='orange'>" + notInList.length + " / " + totalIsoCodes + "</span> region(s) are <span class='green'>allowed</span> to watch the video.";
                            restriction.blocked.sort();
                        }
                        notInList.sort();
                        const translations2 = [];
                        notInList.forEach(function (code) {
                            const result = iso3166.lookup(code);
                            const name = (result ? result.name : 'ISO-3166 Could not translate')

                            translations2.push("<li><span class='orange'>" + String(code).toUpperCase() + "</span> which is <span class='orange'>" + name + "</span></li>");
                        });
                        partDiv.append(
                            "<p class='mb-15'><a data-bs-toggle='collapse' href='#restriction-list-2'>" + message2 + "</a></p>" +
                            "<div id='restriction-list-2' class='collapse'>" +
                            "<ul>" + translations2.join("") + "</ul>" +
                            "</div>");
                    }

                    const contentRating = partJson.contentRating;
                    if (!$.isEmptyObject(contentRating)) {
                        const pairs = [];

                        Object.keys(contentRating).forEach(function (key) {
                            pairs.push(key + "/" + contentRating[key]);
                        });

                        partDiv.append("<p class='mb-15'>This video has a content rating of <span class='orange'>" + pairs.join(", ") + "</span></p>")
                    }
                }
            },
            topicDetails: {
                title: "Topic Details",
                postProcess: function (partJson) {
                    const partDiv = $("#video-section #topicDetails");

                    const topics = [];
                    (partJson.topicCategories || []).forEach(function (categoryUrl) {
                        const text = categoryUrl.substr(categoryUrl.lastIndexOf('/') + 1).replace(/_/g, " ");

                        topics.push("<li><a target='_blank' href='" + categoryUrl + "'>" + text + "</a></li>");
                    });

                    partDiv.append("<p class='mb-15'><ul>" + topics.join("") + "</ul></p>");
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
                    const thumbUrl = (thumbs.maxres || thumbs.high || thumbs.medium || thumbs.default || {url: "https://placehold.it/240x240"}).url;

                    partDiv.append("<a target='_blank' href='https://www.youtube.com/channel/" + fullJson.id + "'><img id='channel-thumb' src='" + thumbUrl + "' class='mb-15 profile'></a>");
                    partDiv.append("<p class='mb-15' style='font-size: 1.25em'>" + partJson.title + "</p>");

                    const published = new Date(partJson.publishedAt);
                    const dateHtml =
                        "<p class='mb-15'>Channel created on " +
                        "<span class='orange'>" + published.toUTCString() + "</span>" +
                        " (" + moment(published).utc().fromNow() + ")" + getConvertTime(published) +
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
                        const urlPart = partJson.customUrl.startsWith('@') ? '' : 'c/';
                        const customUrl = "https://www.youtube.com/" + urlPart + partJson.customUrl;

                        partDiv.append("<p class='mb-15'>The channel has a custom url of value '<a target='_blank' href='" + customUrl + "'>" + partJson.customUrl + "</a>'</p>");
                    }

                    partDiv.append("<p class='mb-15'>The channel id is <span class='orange'>" + fullJson.id + "</span></p>");
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
                        partDiv.append("<p class='mb-15'><a style='display:inline;vertical-align:middle' target='_blank' href='./bulk?submit=true&url=https://www.youtube.com/channel/" + fullJson.id + "'>" +
                            "<img src='./img/metadata.png' style='margin-left:4px;width:20px;height:20px;;margin-right:5px;' alt='youtube metadata icon' >" +
                            "Inspect the metadata for all of this channel's videos" +
                            "</a></p>");
                    } else {
                        partDiv.append("<p class='mb-15'>This channel has no public videos.</p>");
                    }
                }
            },
            brandingSettings: {
                title: "Branding Settings",
                postProcess: function (partJson) {
                    const partDiv = $("#channel-section #brandingSettings");

                    const bannerImage = shared.idx(["image", "bannerExternalUrl"], partJson);
                    if (bannerImage) {
                        partDiv.append("<img id='channel-banner' src='" + bannerImage + "' class='mb-15'>");
                    }

                    if (!partJson.hasOwnProperty("channel")) {
                        return;
                    }

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
                        for (let i = 0; i < keywords.length; i++) {
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

                    const topics = [];
                    (partJson.topicCategories || []).forEach(function (categoryUrl) {
                        const text = categoryUrl.substr(categoryUrl.lastIndexOf('/') + 1).replace(/_/g, " ");

                        topics.push("<li><a target='_blank' href='" + categoryUrl + "'>" + text + "</a></li>");
                    });

                    partDiv.append("<p class='mb-15'><ul>" + topics.join("") + "</ul></p>");
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
                    const thumbUrl = (thumbs.maxres || thumbs.high || thumbs.medium || thumbs.default || {url: "https://placehold.it/480x360"}).url;

                    partDiv.append("<a target='_blank' href='https://www.youtube.com/playlist?list=" + fullJson.id + "'><img id='playlist-thumb' src='" + thumbUrl + "' class='mb-15'></a>");
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
                        " (" + moment(published).utc().fromNow() + ")" + getConvertTime(published) +
                        "</p>";
                    partDiv.append(dateHtml);

                    partDiv.append("<p class='mb-15'>The playlist id is <span class='orange'>" + fullJson.id + "</span></p>");

                    partDiv.append("<p class='mb-15'><a style='display:inline;vertical-align:middle' target='_blank' href='./bulk?submit=true&url=https://www.youtube.com/channel/" + fullJson.id + "'>" +
                        "<img src='./img/metadata.png' style='margin-left:4px;width:20px;height:20px;margin-right:5px;' alt='youtube metadata icon' >" +
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

    function errorState(message, funcAppend, errorJson) {
        $("#video,#playlist,#channel").hide();

        let reasonAppend;
        const reason = shared.idx(["responseJSON", "error", "errors", 0, "reason"], errorJson);
        if (reason === "quotaExceeded") {
            $("#quota").show();
            reasonAppend = $("#quota-reason-append");
            reasonAppend.empty();
        } else {
            $("#unknown").show();
            $("#reason").html(message);

            reasonAppend = $("#reason-append");
            reasonAppend.empty();

            if (funcAppend) {
                funcAppend(reasonAppend);
            }
        }
        if (errorJson) {
            reasonAppend.append("<pre><code class='prettyprint language-json'></code></pre>");

            const json = reasonAppend.find("code");
            json.text(JSON.stringify(errorJson, null, 4));
            hljs.highlightElement(json[0]);
        }
    }

    function attemptLoadFilmot(parsedInput) {
        $("#filmot").hide();

        if (parsedInput.type === "video_id") {
            // Note: Filmot has limited resources. Do not misuse, please contact about usage first.
            // https://filmot.com/contactus
            const hostname = window.location.hostname;
            if (hostname !== "localhost" && hostname !== "mattw.io") {
                console.log("do not call filmot from other instances")
                return;
            }
            if (!shared.isValidVideoId(parsedInput.value)) {
                console.log("do not call filmot for invalid ids")
                $("#reason-append").append("<p class='mb-15'>However, this is an <span class='orange'>invalid</span> video id and must follow pattern: <span class='orange'>[A-Za-z0-9_-]{10}[AEIMQUYcgkosw048]</span>.</p>");
                return;
            }

            $.ajax({
                cache: false,
                data: {
                    key: "md5paNgdbaeudounjp39",
                    id: parsedInput.value,
                    flags: 1 // Get channel and description too,
                },
                dataType: "json",
                type: "GET",
                timeout: 5000,
                url: "https://filmot.com/api/getvideos",
            }).done(function (res) {
                const filmotAppend = $("#filmot-append");
                filmotAppend.empty();

                const video = shared.idx([0], res);
                if (!video) {
                    filmotAppend.append("<p class='mb-15'>No archive about this video id.</p>");
                    $("#filmot").show();
                    return;
                }

                exportData["filmot"] = video;

                filmotAppend.append("<pre><code class='prettyprint language-json'></code></pre>");
                const json = filmotAppend.find("code");
                json.text(JSON.stringify(video, null, 4));
                hljs.highlightElement(json[0]);

                $("#filmot").show();

                const titleHtml = "<p class='mb-15' style='font-size: 1.25em'>" + video.title + "</p>";
                filmotAppend.append(titleHtml);

                const authorHtml =
                    "<p class='mb-15'>Published by " +
                    "<a href='https://www.youtube.com/channel/" + video.channelid + "' target='_blank'>" +
                    video.channelname +
                    "</a>" +
                    "</p>";
                filmotAppend.append(authorHtml);

                const published = new Date(video.uploaddate);
                const dateHtml =
                    "<p class='mb-15'>Published on " +
                    "<span class='orange'>" + moment(published).format("ddd, DD MMM YYYY") + "</span>" +
                    " (" + moment(published).utc().fromNow() + ")" +
                    "</p>";
                filmotAppend.append(dateHtml);

                const duration = moment.duration({"seconds": video.duration});
                const format = shared.formatDuration(duration);
                if (format === "0s") {
                    filmotAppend.append("<p class='mb-15'>A video can't be 0 seconds. This must be a livestream.</p>");
                } else {
                    filmotAppend.append("<p class='mb-15'>The video length was <span style='color:orange'>" + format + "</span></p>");
                }

                filmotAppend.append(getSuggestedHtml(null, null, null, video));
            }).fail(function (err) {
                console.warn(err);
            })
        } else if (parsedInput.type === "channel_id") {
            if (!shared.isValidChannelId(parsedInput.value)) {
                $("#reason-append").append("<p class='mb-15'>However, this is an <span class='orange'>invalid</span> channel id and must follow pattern: <span class='orange'>[A-Za-z0-9_-]{21}[AQgw]</span>.</p>");
            }
        }
    }

    function attemptWaybackCDX(parsedInput) {
        if (parsedInput.type === "video_id") {
            $("#wayback").show();
            $("#wayback-show-older,#wayback-copy").hide();
            $("#wayback-append").html("Checking... <span id='wayback-progress'></span>")

            const results = []
            const promises = []
            const cdxUrls = []

            // Video thumbs
            cdxUrls.push("https://web.archive.org/cdx/search/cdx?url=i.ytimg.com/vi/" + parsedInput.value + "*&collapse=digest&filter=statuscode:200&mimetype:image/jpeg&output=json")
            cdxUrls.push("https://web.archive.org/cdx/search/cdx?url=s.ytimg.com/vi/" + parsedInput.value + "*&collapse=digest&filter=statuscode:200&mimetype:image/jpeg&output=json")
            cdxUrls.push("https://web.archive.org/cdx/search/cdx?url=img.youtube.com/vi/" + parsedInput.value + "*&collapse=digest&filter=statuscode:200&mimetype:image/jpeg&output=json")

            // Storyboard thumbs
            const sbSub = ["i", "i9", "i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8"]
            for (let i in sbSub) {
                const subdomain = sbSub[i];
                const cdxUrl = "https://web.archive.org/cdx/search/cdx?url=" + subdomain + ".ytimg.com/sb/" + parsedInput.value + "*&collapse=digest&filter=statuscode:200&mimetype:image/jpeg&output=json"

                cdxUrls.push(cdxUrl)
            }

            let progress = 0
            let failed = 0
            $("#wayback-progress").html(`${progress+failed}/${cdxUrls.length} done; ${failed} failed`)

            promises.push(new Promise(function (resolve) {
                function cdxCall(i) {
                    if (i >= cdxUrls.length) {
                        console.log("promise done")
                        resolve()
                        return
                    }
                    console.log("calling " + i)

                    const url = cdxUrls[i]
                    if (!url) {
                        resolve()
                        return
                    }

                    const promise = new Promise(function (resolve2) {
                        $.ajax({
                            url: "https://cors-proxy-mw324.herokuapp.com/" + url,
                        }).done(function (res) {
                            console.log(url)
                            if (res) {
                                for (let i = 0; i < res.length; i++) {
                                    results.push(res[i])
                                }
                            }
                            progress += 1
                            $("#wayback-progress").html(`${progress+failed}/${cdxUrls.length} done; ${failed} failed`)
                            resolve2()
                        }).fail(function (err) {
                            console.error(url)
                            failed += 1
                            $("#wayback-progress").html(`${progress+failed}/${cdxUrls.length} done; ${failed} failed`)
                            resolve2()
                        })
                    })

                    promises.push(promise)
                    promise.then(function () {cdxCall(i + 1)})
                }
                cdxCall(0)
            }))

            Promise.all(promises).then(function () {
                console.log("Done!")
                console.log(results)

                const links = []
                for (let i in results) {
                    const result = results[i];
                    if (result[0] === "urlkey") {
                        continue
                    }

                    const url = new URL(result[2])
                    const base = url.hostname + url.pathname

                    links.push([base, result[2], result[1], `https://web.archive.org/web/${result[1]}/${result[2]}`])
                }

                if (links.length) {
                    links.sort(function (a,b) {
                        // url base
                        if (a[0] < b[0]) return -1
                        if (a[0] > b[0]) return 1

                        // timestamp
                        return b[2] - a[2]
                    })

                    const hideOlder = $("#checkHideOlder").is(":checked")

                    function formatTime(waybackTime) {
                        return waybackTime.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1-$2-$3 $4:$5:$6")
                    }

                    let currentBase = null;
                    const linkHtml = []
                    for (let i in links) {
                        const link = links[i];

                        if (link[0] === currentBase) {
                            linkHtml.push(`<li class="cdx-link wayback-cdx-older" ${hideOlder ? "style='display:none'" : ""}>
                                <a target="_blank" href="${link[3]}">Archive.org - ${link[0]}</a> <small class="text-muted">${formatTime(link[2])}</small></li>`)
                            continue
                        }

                        currentBase = link[0]
                        linkHtml.push(`<li class="cdx-link wayback-cdx-newest"><a target="_blank" href="${link[3]}">Archive.org - ${link[0]}</a> <small class="text-muted">${formatTime(link[2])}</small></li>`)
                    }
                    $("#wayback-append").html(`<ul>${linkHtml.join("")}</ul>`)
                    $("#wayback-show-older,#wayback-copy").show();
                    $("#wayback-show-older .older-count").text($(".wayback-cdx-older").length)
                } else {
                    $("#wayback-append").text("No cdx records were found.")
                }
            })
        }
    }

    function parseType(partMapType, sectionId, res, parsedInput) {
        if (res && res.items && res.items.length > 0) {
            const item = res.items[0];

            exportData[partMapType] = res;

            for (let part in partMap[partMapType]) {
                const section = $("#" + sectionId + " #" + part);
                const sectionHeader = $(section.find(".section-header"));

                if (item.hasOwnProperty(part) && !$.isEmptyObject(item[part])) {
                    sectionHeader.removeClass("unknown").addClass("good");
                    sectionHeader.find("i").removeClass("bi-question-circle-fill").addClass("bi-check-circle-fill");
                } else {
                    sectionHeader.removeClass("unknown").addClass("bad");
                    sectionHeader.find("i").removeClass("bi-question-circle-fill").addClass("bi-dash-circle-fill");
                }

                if (item.hasOwnProperty(part)) {
                    if (part === 'localizations') {
                        item[part] = shared.sortObject(item[part]);
                    }

                    section.append("<pre><code class='prettyprint language-json'></code></pre>");

                    const json = section.find("code");
                    json.text(JSON.stringify(item[part], null, 4));
                    hljs.highlightElement(json[0]);

                    partMap[partMapType][part].postProcess(item[part], item);
                }

                if (!item.hasOwnProperty(part) || $.isEmptyObject(item[part])) {
                    section.append("<p class='mb-15 bad'>The " + partMapType + " does not have " + part + ".</p>");
                }
            }
        } else {
            errorState("Your input looked like a <span class='orange'>" + partMapType + "</span> but nothing came back. " +
                "It may have been <a target='_blank' href='https://github.com/mattwright324/youtube-metadata/wiki/Deleted-and-Private-Videos'>deleted or made private</a>.", function (append) {
                append.append("<p class='mb-15'>" +
                    "You may find more details by trying..." +
                    getSuggestedHtml(parsedInput) +
                    "</p>");
            });
            attemptLoadFilmot(parsedInput);
            $("#wayback,#wayback-check").show()
            $("#wayback-append").html("")
        }
    }

    async function parseVideo(res, input, skipGetChannel) {
        const channelId = shared.idx(["items", "0", "snippet", "channelId"], res)
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
        const names = ["0", "hq1", "hq2", "hq3"]
        for (let i in names) {
            const name = names[i]
            const thumbUrl = "https://img.youtube.com/vi/" + id + "/" + name + ".jpg";
            const html =
                "<div class='column' style='margin-bottom: 1.5%!important;'>" +
                "<a href='https://lens.google.com/uploadbyurl?url=" + thumbUrl + "' target='_blank'>" +
                "<img id='video-thumb-" + name + "' src='" + thumbUrl + "' alt='Thumb " + name + "' style='max-width: 200px;'>" +
                "<p>Click to reverse image search</p>" +
                "</a>" +
                "</div>";

            thumbsDiv.append(html);
        }

        const videoMore = $("#video-more");
        videoMore.empty();
        videoMore.append(getSuggestedHtml(null, shared.idx(["items", 0], res), "video"));
    }

    async function parsePlaylist(res, input, skipGetChannel) {
        const channelId = shared.idx(["items", "0", "snippet", "channelId"], res)
        if (!skipGetChannel && channelId) {
            submit({
                type: 'channel_id',
                value: channelId,
                mayHideOthers: false
            });
        }

        parseType("playlist", "playlist-section", res, input);

        const playlistMore = $("#playlist-more");
        playlistMore.empty();
        playlistMore.append(getSuggestedHtml(null, shared.idx(["items", 0], res), "playlist"));
    }

    async function parseChannel(res, input) {
        parseType("channel", "channel-section", res, input);

        const channelMore = $("#channel-more");
        channelMore.empty();
        channelMore.append(getSuggestedHtml(null, shared.idx(["items", 0], res), "channel"));
    }

    /**
     * Attempt to resolve the channel handle URL via CORS workaround. Grab webpage content and extract url pattern.
     */
    async function resolveChannelHandleCORS(parsedInput, callbackResubmit) {
        console.log('Attempting to resolve custom channel via CORS')

        $.ajax({
            url: "https://cors-proxy-mw324.herokuapp.com/https://www.youtube.com/@" + parsedInput.value,
            dataType: 'html'
        }).then(function (res) {
            const pageHtml = $("<div>").html(res);
            const channelId = pageHtml.find("meta[itemprop='channelId']").attr('content');
            const ogUrl = pageHtml.find("meta[property='og:url']").attr('content');
            const canonical = pageHtml.find("link[rel='canonical']").attr('href');

            console.log('Retrieved [channelId=%s, ogUrl=%s, canonical=%s]', channelId, ogUrl, canonical);

            const newParsed = shared.determineInput(channelId || ogUrl || canonical);
            if (newParsed.type !== "unknown") {
                callbackResubmit(newParsed);
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
        });
    }

    async function submit(parsedInput) {
        console.log(parsedInput);

        if (parsedInput.original) {
            controls.inputValue.val(parsedInput.original);

            const baseUrl = location.origin + location.pathname;
            if (parsedInput.type === "video_id" || parsedInput.type === "playlist_id" || parsedInput.type === "channel_id") {
                controls.shareLink.val(baseUrl + "?url=" + encodeURIComponent(parsedInput.original) + "&submit=true");
            } else {
                controls.shareLink.val(baseUrl + "?url=" + encodeURIComponent(parsedInput.original) + "&submit=true");
            }

            controls.shareLink.attr("disabled", false);
        }

        if (parsedInput.type === 'unknown') {
            errorState("Your link did not follow an accepted format.");
        } else if (parsedInput.type === 'channel_handle' || parsedInput.type === 'channel_custom') {
            resolveChannelHandleCORS(parsedInput, submit);
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

                errorState("There was a problem querying for the video.", null, err);
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

                errorState("There was a problem querying for the channel.", null, err);
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

                errorState("There was a problem querying for the channel.", null, err);
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

                errorState("There was a problem querying for the playlist.", null, err);
            });
        }
    }

    const internal = {
        init: function () {
            elements.hljsTheme = $("#highlightjs-theme");
            controls.darkMode = $("#darkMode");
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

            const randomVideoId = shared.randomFromList(EXAMPLE_VIDEOS);
            const exampleLink = "https://youtu.be/" + randomVideoId;
            controls.inputValue.val(exampleLink);

            internal.buildPage(true);
        },
        buildPage: function (doSetup) {
            $(".part-section").remove();
            $("#thumbnails").empty();

            for (let part in partMap.video) {
                const partData = partMap.video[part];
                const html =
                    "<div id='" + part + "' class='part-section'>" +
                    "<div class='section-header unknown'><i class='bi bi-question-circle-fill'></i><span>" + partData.title + "</span></div>" +
                    "</div>";
                elements.videoSection.append(html);
            }

            for (let part in partMap.channel) {
                const partData = partMap.channel[part];
                const html =
                    "<div id='" + part + "' class='part-section'>" +
                    "<div class='section-header unknown'><i class='bi bi-question-circle-fill'></i><span>" + partData.title + "</span></div>" +
                    "</div>";
                elements.channelSection.append(html);
            }

            for (let part in partMap.playlist) {
                const partData = partMap.playlist[part];
                const html =
                    "<div id='" + part + "' class='part-section'>" +
                    "<div class='section-header unknown'><i class='bi bi-question-circle-fill'></i></i><span>" + partData.title + "</span></div>" +
                    "</div>";
                elements.playlistSection.append(html);
            }

            if (doSetup) {
                internal.setupControls();
            }
        },
        setupControls: function () {
            function checkTheme() {
                if (DarkMode.getColorScheme() === "dark") {
                    elements.hljsTheme.attr("href", "//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.3.1/build/styles/stackoverflow-dark.min.css");
                } else {
                    elements.hljsTheme.attr("href", "//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.3.1/build/styles/stackoverflow-light.min.css")
                }
            }

            controls.darkMode.change(function () {
                checkTheme();
            });
            checkTheme();

            controls.inputValue.on('keypress', function (e) {
                if (e.originalEvent.code === "Enter") {
                    controls.btnSubmit.click();
                }
            });

            countdownCheck(delaySubmitKey, controls.btnSubmit, delay5SecMs, "submit");

            controls.btnSubmit.on('click', function () {
                if (!can.submit) {
                    return;
                }
                localStorage.setItem(delaySubmitKey, new Date());
                countdownCheck(delaySubmitKey, controls.btnSubmit, delay5SecMs, "submit");

                exportData = {};

                const value = controls.inputValue.val();

                const baseUrl = location.origin + location.pathname;
                controls.shareLink.val(baseUrl + "?url=" + encodeURIComponent(value) + "&submit=true");
                controls.shareLink.attr("disabled", false);

                const parsed = shared.determineInput(value);
                window["parsed"] = parsed

                $("#video,#playlist,#channel").show();
                $("#unknown,#quota,#filmot,#wayback").hide();
                internal.buildPage(false);
                submit(parsed);
            });

            $("#wayback-check").click(function () {
                if ($("#wayback").is(":visible")) {
                    $("#wayback-check").hide()
                    attemptWaybackCDX(window.parsed);
                }
            })

            $("#checkHideOlder").change(function () {
                if ($("#checkHideOlder").is(":checked")) {
                    $(".wayback-cdx-older").hide()
                } else {
                    $(".wayback-cdx-older").show()
                }
            })

            new ClipboardJS("#wayback-copy", {
                text: function (trigger) {
                    const links = []
                    $(".cdx-link:visible").each(function (i, el) {
                        const link = $(el).find("a").attr("href")
                        if (link) {
                            links.push(link)
                        }
                    })
                    return links.join("\n")
                }
            })

            function getImageBinaryCorsProxy(fileName, imageUrl, zip) {
                return new Promise(function (resolve) {
                    // CORS proxy workaround for downloading YouTube thumbnails in client-side app
                    // https://github.com/Rob--W/cors-anywhere/issues/301#issuecomment-962623118
                    console.log('Attempting to download image over CORS proxy: ' + imageUrl);
                    const start = new Date();
                    JSZipUtils.getBinaryContent("https://cors-proxy-mw324.herokuapp.com/" + imageUrl, function (err, data) {
                        const ms = new Date() - start;

                        if (err) {
                            console.log('Failed ' + fileName + " (" + ms + "ms)");
                            console.warn("Could not get image: " + imageUrl)
                            console.warn(err);
                        } else {
                            console.log('Retrieved ' + fileName + " (" + ms + "ms)");
                            console.log("Creating " + fileName + "...");
                            zip.file(fileName, data, {binary: true});
                        }

                        resolve();
                    });
                });
            }

            controls.btnExport.on('click', async function () {
                controls.btnExport.addClass("loading").addClass("disabled");

                const zip = new JSZip();
                console.log("Creating about.txt...")
                zip.file("about.txt",
                    "Downloaded by YouTube Metadata " + new Date().toLocaleString() + "\n\n" +
                    "URL: " + window.location + "\n\n" +
                    "Input: " + controls.inputValue.val()
                );

                const thumbLinks = {};
                if (exportData.hasOwnProperty("video")) {
                    console.log("Creating video.json...");
                    zip.file("video.json", JSON.stringify(exportData.video, null, 4));

                    const names = ["0", "hq1", "hq2", "hq3"]
                    for (let i in names) {
                        const name = names[i];

                        thumbLinks[`video-thumb-${name}.png`] = document.getElementById(`video-thumb-${name}`).src;
                    }
                }

                if (exportData.hasOwnProperty("playlist")) {
                    console.log("Creating playlist.json...");
                    zip.file("playlist.json", JSON.stringify(exportData.playlist, null, 4));

                    thumbLinks["playlist-thumb.png"] = document.getElementById('playlist-thumb').src;
                }

                if (exportData.hasOwnProperty("channel")) {
                    console.log("Creating channel.json...");
                    zip.file("channel.json", JSON.stringify(exportData.channel, null, 4));

                    thumbLinks["channel-thumb.png"] = document.getElementById('channel-thumb').src;
                    if (document.getElementById('channel-banner')) {
                        thumbLinks["channel-banner.png"] = document.getElementById('channel-banner').src;
                    }
                }

                if (exportData.hasOwnProperty("filmot")) {
                    console.log("Creating filmot.json...");
                    zip.file("filmot.json", JSON.stringify(exportData.filmot, null, 4));
                }

                const optionalImages = [];
                for (let fileName in thumbLinks) {
                    optionalImages.push(getImageBinaryCorsProxy(fileName, thumbLinks[fileName], zip));
                }

                Promise.all(optionalImages).then(function () {
                    let hint = '';
                    if (exportData.hasOwnProperty("video")) {
                        hint = " (video-" + shared.idx(["items", 0, "snippet", "title"], exportData.video).substr(0, 15) + ")";
                    } else if (exportData.hasOwnProperty("playlist")) {
                        hint = " (playlist-" + shared.idx(["items", 0, "snippet", "title"], exportData.playlist).substr(0, 15) + ")";
                    } else if (exportData.hasOwnProperty("channel")) {
                        hint = " (channel-" + shared.idx(["items", 0, "snippet", "title"], exportData.channel).substr(0, 15) + ")";
                    } else if (exportData.hasOwnProperty("filmot")) {
                        hint = " (filmot-" + exportData.filmot.title.substr(0, 15);
                    }

                    const fileName = shared.safeFileName("metadata" + hint + ".zip");
                    console.log("Saving as " + fileName);
                    zip.generateAsync({
                        type: "blob",
                        compression: "DEFLATE",
                        compressionOptions: {
                            level: 9
                        }
                    }).then(function (content) {
                        saveAs(content, fileName);

                        controls.btnExport.removeClass("loading").removeClass("disabled");
                    });
                });
            });

            // Drag & Drop listener
            document.addEventListener("dragover", function (event) {
                event.preventDefault();
            });
            document.documentElement.addEventListener('drop', async function (e) {
                e.stopPropagation();
                e.preventDefault();

                let file = e.dataTransfer.files[0];
                console.log("Loading file");
                console.log(file);

                importFile(file);
            });

            controls.importFileChooser.on('change', function (event) {
                console.log(event);

                let file = event.target.files[0];

                if (file) {
                    controls.inputValue.val(file.name);
                } else {
                    return;
                }

                importFile(file);
            });

            function importFile(file) {
                console.log("Importing from file " + file.name);

                controls.btnImport.addClass("loading").addClass("disabled");

                $("#video,#playlist,#channel").show();
                $("#unknown,#quota,#filmot,#wayback").hide();
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
                            value: shared.idx(["items", 0, "id"], content)
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
            }

            const query = shared.parseQuery(window.location.search);
            console.log(query);
            const input = query.url || query.id;
            if (input) {
                controls.inputValue.val(decodeURIComponent(input));
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
