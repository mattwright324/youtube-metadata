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

    async function submit(parsedInput) {
        // console.log(parsedInput);
        if (parsedInput.type === 'unknown') {
            console.log("didn't recognize your input");
        } else if (parsedInput.type === 'video_id') {
            console.log('grabbing video');
            youtube.ajax('videos', {
                part: 'contentDetails,id,liveStreamingDetails,localizations,player,recordingDetails,snippet,statistics,status,topicDetails',
                id: parsedInput.value
            }).done(function (res) {
                console.log(res);
                if (res.items.length) {
                    const item = res.items[0];

                    $("#videoSnippet").text(JSON.stringify(item.snippet, null, 4));
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
                    });
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

            controls.inputValue.on('keypress', function (e) {
                if (e.originalEvent.code === "Enter") {
                    controls.btnSubmit.click();
                }
            });
            controls.btnSubmit.on('click', function () {
                const parsed = determineInput(controls.inputValue.val());

                submit(parsed);
            });
        }
    };
    $(document).ready(internal.init);
}());