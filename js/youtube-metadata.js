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
            /http[s]?:\/\/www.youtube.com\/watch\?v=([\w_-]+)(?:&.*)?/i,
            /http[s]?:\/\/youtu.be\/([\w_-]+)(?:\?.*)?/i
        ],
        playlist_id: [
            /http[s]?:\/\/www.youtube.com\/playlist\?list=([\w_-]+)(?:&.*)?/i
        ],
        channel_user: [
            /http[s]?:\/\/www.youtube.com\/user\/([\w_-]+)(?:\?.*)?/i
        ],
        channel_id: [
            /http[s]?:\/\/www.youtube.com\/channel\/([\w_-]+)(?:\?.*)?/i
        ]
    };

    function determineInput(value) {
        const parsed = {
            type: 'unknown'
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

    /**
     * Can't access part(s): fileDetails, processingDetails, suggestions
     * Useless part(s): player, id
     * Every other part below:
     */
    const partMap = {
        video: {
            snippet: {
                title: "Snippet",
                postProcess: function (partJson) {
                    const partDiv = $("#snippet");

                    partDiv.append("<img src='" + partJson.thumbnails.medium.url + "' class='mb-15'>");

                    /*const html =
                        "<div style='font-size: 1.1em;'>" +
                            "<p>" + partJson.title + "</p>" +
                            "<a href='https://www.youtube.com/channel/" + partJson.channelId + "'>" + partJson.channelTitle + "</a>" +
                        "</div>";

                    partDiv.append(html);*/

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
                    }
                }
            },
            statistics: {
                title: "Statistics",
                postProcess: function (partJson) {
                    const partDiv = $("#statistics");
                }
            },
            recordingDetails: {
                title: "Geolocation",
                postProcess: function (partJson) {
                    const partDiv = $("#recordingDetails");

                    const location = partJson.location;
                    if (location && location.latitude && location.longitude) {
                        const latlng = location.latitude + "," + location.longitude;
                        const staticMap = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlng + "&zoom=13&size=1000x300&key=AIzaSyCGWanOEMEgdHqsxNDaa_ZXTZ6hoYQrnAI&markers=color:red|" + latlng;

                        const html =
                            "<a href='https://maps.google.com/maps?q=loc:"+latlng+"' target='_blank'>" +
                                "<img src='"+ staticMap +"'>" +
                                "<p>Click to open in Google Maps</p>" +
                            "</a>";

                        partDiv.append(html);
                    }
                }
            },
            status: {
                title: "Status",
                postProcess: function (partJson) {
                    const partDiv = $("#status");
                }
            },
            liveStreamingDetails: {
                title: "Livestream Details",
                postProcess: function (partJson) {
                    const partDiv = $("#liveStreamingDetails");
                }
            },
            localizations: {
                title: "Localizations",
                postProcess: function (partJson) {
                    const partDiv = $("#localizations");
                }
            },
            contentDetails: {
                title: "Content Details",
                postProcess: function (partJson) {
                    const partDiv = $("#contentDetails");
                }
            },
            topicDetails: {
                title: "Topic Details",
                postProcess: function (partJson) {
                    const partDiv = $("#topicDetails");
                }
            }
        }
    };

    async function submit(parsedInput) {
        // console.log(parsedInput);
        if (parsedInput.type === 'unknown') {
            console.log("didn't recognize your input");
        } else if (parsedInput.type === 'video_id') {
            console.log('grabbing video');

            youtube.ajax('videos', {
                part: Object.keys(partMap.video).join(','),
                id: parsedInput.value
            }).done(function (res) {
                console.log(res);
                if (res.items.length) {
                    const item = res.items[0];

                    for (let part in partMap.video) {
                        const section = $("#" + part);
                        const sectionHeader = $(section.find(".section-header"));

                        if (item.hasOwnProperty(part)) {
                            sectionHeader.removeClass("unknown").addClass("good");
                            sectionHeader.find("i").removeClass("question").addClass("check");

                            section.append("<pre><code class=\"prettyprint json-lang\"></code></pre>");

                            const json = section.find("code");
                            json.text(JSON.stringify(item[part], null, 4));
                            hljs.highlightBlock(json[0]);

                            partMap.video[part].postProcess(item[part]);
                        } else {
                            sectionHeader.removeClass("unknown").addClass("bad");
                            sectionHeader.find("i").removeClass("question").addClass("minus");

                            section.append("<p class='mb-15 bad'>The video does not have " + part + ".</p>");
                        }
                    }
                    /*$("#videoSnippet").text(JSON.stringify(item.snippet, null, 4));
                    hljs.highlightBlock(document.getElementById("videoSnippet"));
                    const published = new Date(item.snippet.publishedAt);
                    $("#videoSnippet").parent().after("<ul><li>"+item.snippet.title+"</li><li>Published by <a href='https://www.youtube.com/channel/"+item.snippet.channelId+"'>"+item.snippet.channelTitle+"</a></li><li>Published on "+published.toUTCString()+" ("+moment(published).fromNow()+")</li></ul>");
                    $("#videoSnippet").parent().after("<img src='"+item.snippet.thumbnails.medium.url+"'>");

                    $("#videoStats").text(JSON.stringify(item.statistics, null, 4));
                    hljs.highlightBlock(document.getElementById("videoStats"));

                    $("#videoStatus").text(JSON.stringify(item.status, null, 4));
                    hljs.highlightBlock(document.getElementById("videoStatus"));

                    $("#videoTopic").text(JSON.stringify(item.topicDetails, null, 4));
                    hljs.highlightBlock(document.getElementById("videoTopic"));

                    $("#videoRecordingDetails").text(JSON.stringify(item.recordingDetails, null, 4));
                    hljs.highlightBlock(document.getElementById("videoRecordingDetails"));

                    if (item.recordingDetails &&
                        item.recordingDetails.location &&
                        item.recordingDetails.location.latitude &&
                        item.recordingDetails.location.longitude) {
                        const location = item.recordingDetails.location;
                        const latlng = location.latitude + "," + location.longitude;
                        const staticMap = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlng + "&zoom=13&size=1000x300&key=AIzaSyCGWanOEMEgdHqsxNDaa_ZXTZ6hoYQrnAI&markers=color:red|" + latlng;
                        $("#videoRecordingDetails").parent().after("<a href='https://maps.google.com/maps?q=loc:"+latlng+"' target='_blank'><img src='"+ staticMap +"'><p>Click to open in Google Maps</p></a>")
                    }

                    submit({
                        type: 'channel_id',
                        value: item.snippet.channelId
                    });*/
                } else {
                    console.log('bad video_id');
                }
            }).fail(function (err) {
                console.log(err);
            });
        } else if (parsedInput.type === 'channel_id') {
            console.log('grabbing channel id');
            youtube.ajax('channels', {
                part: 'brandingSettings,contentDetails,contentOwnerDetails,id,invideoPromotion,localizations,snippet,statistics,status,topicDetails',
                id: parsedInput.value
            }).done(function (res) {
                console.log(res);
                if (res.items.length) {
                    const item = res.items[0];

                    //$("#channelResult").text(JSON.stringify(item, null, 4));
                    //hljs.highlightBlock(document.getElementById("channelResult"));

                    $("#channelSnippet").text(JSON.stringify(item.snippet, null, 4));
                    hljs.highlightBlock(document.getElementById("channelSnippet"));
                    const published = new Date(item.snippet.publishedAt);
                    $("#channelSnippet").parent().after("<ul><li>Channel created on "+published.toUTCString()+" ("+moment(published).fromNow()+")</li></ul>");
                    $("#channelSnippet").parent().after("<img src='"+item.snippet.thumbnails.medium.url+"' style='width: 80px!important;'>");
                } else {
                    console.log('bad channel_id');
                }
            }).fail(function (err) {
                console.error(err);
            });
        } else if (parsedInput.type === 'channel_user') {
            console.log('grabbing channel user');
            youtube.ajax('channels', {
                part: 'brandingSettings,contentDetails,contentOwnerDetails,id,invideoPromotion,localizations,snippet,statistics,status,topicDetails',
                forUsername: parsedInput.value
            }).done(function (res) {
                console.log(res);
                if (res.items.length) {
                    const item = res.items[0];
                } else {
                    console.log('bad channel_user');
                }
            }).fail(function (err) {
                console.error(err);
            });
        } else if (parsedInput.type === 'playlist_id') {
            console.log('grabbing playlist');
            youtube.ajax('playlists', {
                part: 'contentDetails,id,localizations,player,snippet,status',
                id: parsedInput.value
            }).done(function (res) {
                console.log(res);
                if (res.items.length) {
                    const item = res.items[0];
                } else {
                    console.log('bad playlist_id');
                }
            }).fail(function (err) {
                console.error(err);
            });
        }
    }

    const internal = {
        init: function () {
            controls.inputValue = $("#value");
            controls.btnSubmit = $("#submit");

            elements.videoSection = $("#video-section");

            internal.buildPage(true);
        },
        buildPage: function(doSetup) {
            $(".part-section").remove();

            for (let part in partMap.video) {
                const partData = partMap.video[part];
                const html =
                    "<div id='" + part + "' class='part-section'>" +
                        "<div class='section-header unknown'><i class='question circle icon'></i><span>" + partData.title + "</span></div>" +
                    "</div>";
                elements.videoSection.append(html);
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
                const parsed = determineInput(controls.inputValue.val());

                internal.buildPage(false);
                submit(parsed);
            });
        }
    };
    $(document).ready(internal.init);
}());