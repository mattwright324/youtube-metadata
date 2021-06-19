/**
 * YouTube Metadata
 *
 * Grab everything publicly available from the YouTube API.
 *
 * @requires jquery
 * @author mattwright324
 */
const bulk = (function () {
    'use strict';

    const elements = {};
    const controls = {};

    const idx = (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);

    const patterns = {
        video_id: [
            /(?:http[s]?:\/\/)?(?:\w+\.)?youtube.com\/watch\?v=([\w_-]+)(?:&.*)?/i,
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

    function handleParsedNew(parsed) {
        console.log(parsed);

        const channelUsers = [];
        const channelCustoms = [];
        const channelIds = [];
        const playlistIds = [];
        const videoIds = [];

        for (let i = 0; i < parsed.length; i++) {
            const p = parsed[i];

            if (p.type === 'video_id' && videoIds.indexOf(p.value) === -1) {
                videoIds.push(p.value);

                controls.progress.indeterminate(videoIds.length);
            } else if (p.type === "playlist_id" && playlistIds.indexOf(p.value) === -1) {
                playlistIds.push(p.value);
            } else if (p.type === "channel_id" && channelIds.indexOf(p.value) === -1) {
                channelIds.push(p.value);
            } else if (p.type === "channel_custom" && channelCustoms.indexOf(p.value) === -1) {
                channelCustoms.push(p.value);
            } else if (p.type === "channel_user" && channelUsers.indexOf(p.value) === -1) {
                channelUsers.push(p.value);
            }
        }

        // Channels condense to uploads playlist ids
        const channelProcess = Promise.all([
            handleChannelUsers(channelUsers, playlistIds),
            handleChannelCustoms(channelCustoms, playlistIds),
            handleChannelIds(channelIds, playlistIds)
        ]);
        // Playlists condense to video ids
        const playlistProcess = channelProcess.then(function () {
            return handlePlaylistIds(playlistIds, videoIds)
        });
        // Videos are results to be displayed
        const videosProcess = playlistProcess.then(function () {
            return handleVideoIds(videoIds)
        });

        videosProcess.then(function (res) {
            console.log("done");
            console.log(videoIds);

            setTimeout(loadAggregateTables, 200);
        }).catch(function (err) {
            console.error(err);
        });
    }

    function handleChannelUsers(channelUsers, playlistIds) {
        return new Promise(function (resolve, reject) {
            if (channelUsers.length === 0) {
                console.log("no channelUsers")
                resolve();
                return;
            }

            function get(index) {
                if (index >= channelUsers.length) {
                    console.log("finished channelUsers");
                    resolve();
                    return;
                }

                console.log("handleChannelUsers.get(" + index + ")")
                console.log(channelUsers[index])

                youtube.ajax("channels", {
                    part: "contentDetails",
                    forUsername: channelUsers[index]
                }).done(function (res) {
                    console.log(res);

                    const uploadsPlaylistId = idx(["items", 0, "contentDetails", "relatedPlaylists", "uploads"], res);
                    console.log(uploadsPlaylistId);

                    if (playlistIds.indexOf(uploadsPlaylistId) === -1) {
                        playlistIds.push(uploadsPlaylistId);
                    }

                    get(index + 1);
                }).fail(function (err) {
                    console.error(err);
                    get(index + 1);
                });
            }

            get(0);
        });
    }

    function handleChannelCustoms(channelCustoms, playlistIds) {
        return new Promise(function (resolve, reject) {
            if (channelCustoms.length === 0) {
                console.log("no channelCustoms")
                resolve();
                return;
            }

            function get(index) {
                if (index >= channelCustoms.length) {
                    console.log("finished channelCustoms");
                    resolve();
                    return;
                }

                console.log("handleChannelCustoms.get(" + index + ")")

                youtube.ajax("search", {
                    part: "snippet",
                    maxResults: 50,
                    q: channelCustoms[index],
                    type: 'channel',
                    order: 'relevance'
                }).done(function (res) {
                    console.log(res);

                    const channelIds = [];
                    for (let i = 0; i < res.items.length; i++) {
                        channelIds.push(res.items[i].id.channelId);
                    }

                    youtube.ajax("channels", {
                        part: "snippet,contentDetails",
                        id: channelIds.join(","),
                        maxResults: 50
                    }).done(function (res2) {
                        console.log(res2);

                        for (let i = 0; i < res2.items.length; i++) {
                            const customUrl = idx(["snippet", "customUrl"], res2.items[i]);

                            if (String(customUrl).toLowerCase() === String(channelCustoms[index]).toLowerCase()) {
                                const uploadsPlaylistId = idx(["contentDetails", "relatedPlaylists", "uploads"], res2.items[i]);
                                console.log(uploadsPlaylistId);

                                if (playlistIds.indexOf(uploadsPlaylistId) === -1) {
                                    playlistIds.push(uploadsPlaylistId);
                                }
                            }
                        }

                        get(index + 1);
                    }).fail(function (err) {
                        console.error(err);
                        get(index + 1);
                    });
                }).fail(function (err) {
                    console.error(err);
                    get(index + 1);
                });
            }

            get(0);
        });
    }

    function handleChannelIds(channelIds, playlistIds) {
        return new Promise(function (resolve, reject) {
            if (channelIds.length === 0) {
                console.log("no channelIds")
                resolve();
                return;
            }

            function get(index, slice) {
                if (index >= channelIds.length) {
                    console.log("finished channelIds");
                    resolve();
                    return;
                }

                console.log("handleChannelIds.get(" + index + ", " + slice + ")")

                const ids = channelIds.slice(index, index + slice);

                console.log(ids.length);
                console.log(ids);

                youtube.ajax("channels", {
                    part: "contentDetails",
                    id: ids.join(","),
                    maxResults: 50
                }).done(function (res) {
                    console.log(res);

                    if (res.items) {
                        for (let i = 0; i < res.items.length; i++) {
                            const channel = res.items[i];

                            const uploadsPlaylistId = idx(["contentDetails", "relatedPlaylists", "uploads"], channel);
                            console.log(uploadsPlaylistId);

                            if (playlistIds.indexOf(uploadsPlaylistId) === -1) {
                                playlistIds.push(uploadsPlaylistId);
                            }
                        }
                    }

                    get(index + slice, slice);
                }).fail(function (err) {
                    console.error(err);
                    get(index + slice, slice);
                });
            }

            get(0, 50);
        });
    }

    function handlePlaylistIds(playlistIds, videoIds) {
        return new Promise(function (resolve, reject) {
            if (playlistIds.length === 0) {
                console.log("no playlistIds")
                resolve();
                return;
            }

            function get(index) {
                if (index >= playlistIds.length) {
                    console.log("finished playlistIds");
                    resolve();
                    return;
                }

                console.log("handlePlaylistIds.get(" + index + ")")

                function paginate(pageToken) {
                    console.log(pageToken);
                    youtube.ajax("playlistItems", {
                        part: "snippet",
                        maxResults: 50,
                        playlistId: playlistIds[index],
                        pageToken: pageToken
                    }).done(function (res) {
                        console.log(res);

                        for (let i = 0; i < res.items.length; i++) {
                            const videoId = idx(["snippet", "resourceId", "videoId"], res.items[i]);

                            if (videoIds.indexOf(videoId) === -1) {
                                videoIds.push(videoId);
                            }
                        }

                        controls.progress.indeterminate(videoIds.length);

                        if (res.hasOwnProperty("nextPageToken")) {
                            paginate(res.nextPageToken);
                        } else {
                            get(index + 1);
                        }
                    }).fail(function (err) {
                        console.error(err);
                        get(index + 1);
                    });
                }

                paginate("");
            }

            get(0);
        });
    }

    function handleVideoIds(videoIds) {
        let processed = 0;

        return new Promise(function (resolve, reject) {
            if (videoIds.length === 0) {
                console.log("no videoIds")
                resolve();
                return;
            }

            console.log("checking " + videoIds.length + " videoIds")

            function get(index, slice) {
                if (index >= videoIds.length) {
                    console.log("finished videoIds");
                    resolve();
                    return;
                }

                console.log("handleVideoIds.get(" + index + ", " + (index + slice) + ")")

                const ids = videoIds.slice(index, index + slice);

                console.log(ids.length);
                console.log(ids);

                youtube.ajax("videos", {
                    part: "snippet,statistics,recordingDetails," +
                        "status,liveStreamingDetails,localizations," +
                        "contentDetails,topicDetails",
                    maxResults: 50,
                    id: ids.join(",")
                }).done(function (res) {
                    console.log(res);

                    for (let i = 0; i < res.items.length; i++) {
                        loadVideo(res.items[i]);
                    }

                    processed = processed + ids.length;
                    controls.progress.processing(processed, videoIds.length);

                    get(index + slice, slice);
                }).fail(function (err) {
                    console.error(err);
                    get(index + slice, slice);
                });
            }

            get(0, 50);
        });
    }

    function loadVideo(video, skipAdd) {
        const dataRow = [];
        const csvDataRow = [];

        const tags = idx(["snippet", "tags"], video);
        if (tags) {
            for (let j = 0; j < tags.length; j++) {
                const tag = tags[j];

                tagsData[tag] = ++tagsData[tag] || 1;
            }
        }

        const geotag = idx(["recordingDetails"], video);
        if (geotag.location) {
            const latLng = geotag.location.latitude + "," + geotag.location.longitude;
            const name = geotag.locationDescription;
            if (geotagsData.hasOwnProperty(latLng)) {
                const data = geotagsData[latLng];
                data.count = data.count + 1;

                if (data.names.indexOf(name) === -1) {
                    data.names.push(name);
                }
            } else {
                geotagsData[latLng] = {
                    names: [name],
                    count: 1
                }
            }
        }

        for (let i = 0; i < otherData.length; i++) {
            otherData[i].check(video);
        }

        for (let j = 0; j < columns.length; j++) {
            const column = columns[j];

            const value = column._idx ? idx(column._idx, video) : undefined;
            const displayValue = column.hasOwnProperty("valueMod") ? column.valueMod(value, video) : value;

            dataRow.push(displayValue);

            if (column.csvSkip) {
                continue;
            }

            let csvValue = displayValue && displayValue.hasOwnProperty("display") ?
                displayValue.display : displayValue;

            if (csvValue) {
                csvValue = String(csvValue).replace(/([\r]?\n)/g, "<br>");
            }

            csvDataRow.push(csvValue);
        }

        tableRows.push(csvDataRow.join("\t"));
        rawVideoData.push(video);

        if (skipAdd) {
            return dataRow;
        } else {
            controls.videosTable.row.add(dataRow).draw(false);
        }
    }

    function loadAggregateTables(callback) {
        const tagRows = [];
        for (let tag in tagsData) {
            tagRows.push([tag, tagsData[tag]]);
        }
        sliceLoad(tagRows, controls.tagsTable);

        const geotagRows = [];
        for (let geotag in geotagsData) {
            geotagRows.push([
                "<a href='https://maps.google.com/maps?q=loc:" + geotag + "' target='_blank'>" + geotag + "</a>",
                "<a href='https://maps.google.com/maps/search/" + encodeURI(geotagsData[geotag].names[0]).replace(/'/g, "%27") + "/@" + geotag + ",14z' target='_blank'>" + geotagsData[geotag].names.join(", ") + "</a>",
                geotagsData[geotag].count
            ]);
        }
        sliceLoad(geotagRows, controls.geotagsTable);

        for (let i = 0; i < otherData.length; i++) {
            const other = otherData[i];
            controls.otherTable.row.add([other.text, Number(other.value).toLocaleString()]).draw(false);
        }

        if (callback) {
            callback();
        }
    }

    function sliceLoad(data, table) {
        function slice(index, size) {
            const toAdd = data.slice(index, index + size);
            if (toAdd.length === 0) {
                return;
            }

            table.rows.add(toAdd).draw(false);

            setTimeout(function() {
                slice(index + size, size)
            }, 200);
        }
        slice(0, 1000);
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

    const columns = [
        {
            title: " ",
            type: "html",
            visible: true,
            valueMod: function (value, video) {
                return "<a target='_blank' href='./?submit=true&url=https://youtu.be/" + video.id + "'>" +
                    "<img src='./img/metadata.png' style='margin-left:4px;width:24px;' alt='youtube metadata icon' >" +
                    "</a>"
            },
            csvSkip: true
        },
        {
            title: "Video ID",
            type: "html",
            visible: false,
            _idx: ["id"],
            valueMod: function (value, video) {
                return "<a target='_blank' href='https://youtu.be/" + value + "'>" + value + "</a>"
            }
        },
        {
            title: "Title",
            type: "html",
            visible: true,
            _idx: ["snippet", "title"],
            valueMod: function (value, video) {
                return "<a target='_blank' href='https://youtu.be/" + video.id + "'>" + value + "</a>"
            }
        },
        {
            title: "Channel ID",
            type: "html",
            visible: false,
            _idx: ["snippet", "channelId"],
            valueMod: function (value) {
                return "<a target='_blank' href='https://www.youtube.com/channel/" + value + "'>" + value + "</a>"
            }
        },
        {
            title: "Author",
            type: "html",
            visible: true,
            _idx: ["snippet", "channelTitle"],
            valueMod: function (value, video) {
                const channelId = idx(["snippet", "channelId"], video);
                return "<a target='_blank' href='https://www.youtube.com/channel/" + channelId + "'>" + value + "</a>"
            }
        },
        {
            title: "Description",
            visible: false,
            _idx: ["snippet", "description"]
        },
        {
            title: "Length",
            type: "num",
            visible: true,
            _idx: ["contentDetails", "duration"],
            valueMod: function (value) {
                const duration = moment.duration(value);
                const length = duration.asMilliseconds();

                return length === 0 ? {
                    display: 'livestream',
                    num: length
                } : {
                    display: formatDuration(duration, false),
                    num: length
                }
            },
            render: {
                _: 'display',
                sort: 'num'
            },
            className: "dt-nowrap"
        },
        {
            title: "Published",
            type: "date",
            visible: true,
            _idx: ["snippet", "publishedAt"],
            className: "dt-nowrap"
        },
        {
            title: "Language",
            visible: false,
            _idx: ["snippet", "defaultLanguage"]
        },
        {
            title: "Audio Language",
            visible: false,
            _idx: ["snippet", "defaultAudioLanguage"]
        },
        {
            title: "Views",
            type: "num",
            visible: true,
            _idx: ["statistics", "viewCount"],
            valueMod: function (value) {
                return value ? {
                    display: Number(value).toLocaleString(),
                    num: value
                } : {
                    display: "disabled",
                    num: -1
                };
            },
            render: {
                _: 'display',
                sort: 'num'
            },
            className: "text-right dt-nowrap"
        },
        {
            title: "Likes",
            type: "num",
            visible: true,
            _idx: ["statistics", "likeCount"],
            valueMod: function (value) {
                return value ? {
                    display: Number(value).toLocaleString(),
                    num: value
                } : {
                    display: "disabled",
                    num: -1
                };
            },
            render: {
                _: 'display',
                sort: 'num'
            },
            className: "text-right dt-nowrap"
        },
        {
            title: "Dislikes",
            type: "num",
            visible: true,
            _idx: ["statistics", "dislikeCount"],
            valueMod: function (value) {
                return value ? {
                    display: Number(value).toLocaleString(),
                    num: value
                } : {
                    display: "disabled",
                    num: -1
                };
            },
            render: {
                _: 'display',
                sort: 'num'
            },
            className: "text-right dt-nowrap"
        },
        {
            title: "Like Ratio",
            type: "num",
            visible: false,
            _idx: ["statistics"],
            valueMod: function (value) {
                const likes = value.likeCount;
                const dislikes = value.dislikeCount;

                if (likes && dislikes) {
                    const ratio = dislikes === 0 ? likes : likes / dislikes;
                    return {
                        display: Number(ratio).toLocaleString(),
                        num: ratio
                    }
                } else {
                    return {
                        display: "",
                        num: -1
                    }
                }
            },
            render: {
                _: 'display',
                sort: 'num'
            },
            className: "text-right dt-nowrap"
        },
        {
            title: "Comments",
            type: "num",
            visible: true,
            _idx: ["statistics", "commentCount"],
            valueMod: function (value) {
                return value ? {
                    display: Number(value).toLocaleString(),
                    num: value
                } : {
                    display: "disabled",
                    num: "-1"
                };
            },
            render: {
                _: 'display',
                sort: 'num'
            },
            className: "text-right dt-nowrap"
        },
        {
            title: "Kids",
            type: "boolean",
            visible: true,
            _idx: ["status", "madeForKids"],
            className: "text-center"
        },
        {
            title: "Embeddable",
            type: "boolean",
            visible: false,
            _idx: ["status", "embeddable"],
            className: "text-center"
        },
        {
            title: "Licensed Content",
            type: "boolean",
            visible: false,
            _idx: ["contentDetails", "licensedContent"],
            className: "text-center"
        },
        {
            title: "Dimension",
            visible: false,
            _idx: ["contentDetails", "dimension"]
        },
        {
            title: "Definition",
            visible: false,
            _idx: ["contentDetails", "definition"]
        },
        {
            title: "Caption",
            visible: false,
            _idx: ["contentDetails", "caption"]
        },
        {
            title: "Projection",
            visible: false,
            _idx: ["contentDetails", "projection"]
        },
        {
            title: "License",
            visible: false,
            _idx: ["status", "license"]
        },
        {
            title: "Privacy Status",
            visible: false,
            _idx: ["status", "privacyStatus"]
        },
        {
            title: "Content Rating",
            visible: false,
            _idx: ["contentDetails", "contentRating"],
            valueMod: function (value) {
                if (!$.isEmptyObject(value)) {
                    console.log(value);

                    const keys = Object.keys(value);
                    const pairs = [];

                    for (let i = 0; i < keys.length; i++) {
                        pairs.push(keys[i] + "/" + value[keys[i]]);
                    }

                    return pairs.join(", ");
                }

                return "";
            }
        },
        {
            title: "Region Restriction",
            visible: false,
            _idx: ["contentDetails", "regionRestriction"],
            valueMod: function (value) {
                if (!$.isEmptyObject(value)) {
                    console.log(value);

                    if (value.hasOwnProperty('allowed')) {
                        value.allowed.sort();

                        return "Allowed [" + value.allowed.join(", ") + "]";
                    } else if (value.hasOwnProperty('blocked')) {
                        value.blocked.sort();

                        return "Blocked [" + value.blocked.join(", ") + "]";
                    }
                }

                return "";
            }
        },
        {
            title: "Livestream",
            type: "num",
            visible: false,
            _idx: ["liveStreamingDetails"],
            valueMod: function (value) {
                const is = value !== null;

                if (is) {
                    if (value.hasOwnProperty("actualEndTime")) {
                        return {
                            display: "true (ended)",
                            num: 1
                        }
                    } else if (value.hasOwnProperty("actualStartTime")) {
                        return {
                            display: "true (on-going)",
                            num: 2
                        }
                    }

                    return {
                        display: "true (scheduled)",
                        num: 3
                    }
                } else {
                    return {
                        display: "",
                        num: 0
                    }
                }
            },
            render: {
                _: 'display',
                sort: 'num'
            }
        },
        {
            title: "Location Name",
            type: "html",
            visible: true,
            _idx: ["recordingDetails"],
            valueMod: function (value) {
                if ($.isEmptyObject(value) || !value.locationDescription) {
                    return "";
                }

                if (!value.location) {
                    return value.locationDescription
                }

                const latlng = value.location.latitude + "," + value.location.longitude;

                return "<a href='https://maps.google.com/maps/search/" + encodeURI(value.locationDescription).replace(/'/g, "%27") + "/@" + latlng + ",14z' target='_blank'>" + value.locationDescription + "</a>";
            }
        },
        {
            title: "Location",
            type: "html",
            visible: false,
            _idx: ["recordingDetails"],
            valueMod: function (value) {
                if ($.isEmptyObject(value) || !value.location) {
                    return "";
                }

                const latlng = value.location.latitude + "," + value.location.longitude;

                return "<a href='https://maps.google.com/maps?q=loc:" + latlng + "' target='_blank'>" + latlng + "</a>";
            }
        },
        {
            title: "Recording Date",
            type: "date",
            visible: false,
            _idx: ["recordingDetails", "recordingDate"],
            className: "dt-nowrap"
        },
        {
            title: "Tag Count",
            type: "num",
            visible: true,
            _idx: ["snippet", "tags"],
            valueMod: function (value) {
                return value ? value.length : 0;
            },
            className: "text-right dt-nowrap"
        },
        {
            title: "Tags",
            visible: false,
            _idx: ["snippet", "tags"],
            valueMod: function (value) {
                return value ? value.join(", ") : "";
            }
        },
        {
            title: "Localization Count",
            type: "num",
            visible: true,
            _idx: ["localizations"],
            valueMod: function (value) {
                return value ? Object.keys(value).length : 0;
            },
            className: "text-right dt-nowrap"
        },
        {
            title: "Localizations",
            visible: false,
            _idx: ["localizations"],
            valueMod: function (value) {
                return value ? Object.keys(value).sort().join(", ") : "";
            }
        }
    ];

    const csvHeaderRow = [];
    for (let j = 0; j < columns.length; j++) {
        const column = columns[j];
        if (column.csvSkip) {
            continue;
        }
        csvHeaderRow.push(column.title);
    }

    let tableRows = [csvHeaderRow.join("\t")];
    let rawVideoData = [];
    let tagsData = {};
    let geotagsData = {};
    let otherData = [
        {
            text: "Total videos",
            value: 0,
            check: function (video) {
                if (video) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Total views",
            value: 0,
            check: function (video) {
                const views = idx(["statistics", "viewCount"], video);
                this.value = this.value + (views ? Number(views) : 0);
            }
        }, {
            text: "Total likes",
            value: 0,
            check: function (video) {
                const likes = idx(["statistics", "likeCount"], video);
                this.value = this.value + (likes ? Number(likes) : 0);
            }
        }, {
            text: "Total dislikes",
            value: 0,
            check: function (video) {
                const dislikes = idx(["statistics", "dislikeCount"], video);
                this.value = this.value + (dislikes ? Number(dislikes) : 0);
            }
        }, {
            text: "Total comments",
            value: 0,
            check: function (video) {
                const comments = idx(["statistics", "commentCount"], video);
                this.value = this.value + (comments ? Number(comments) : 0);
            }
        }, {
            text: "Videos with geolocation",
            value: 0,
            check: function (video) {
                const stat = idx(["recordingDetails", "location", "latitude"], video);
                if (stat) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with recordingDate",
            value: 0,
            check: function (video) {
                const stat = idx(["recordingDetails", "recordingDate"], video);
                if (stat) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with tags",
            value: 0,
            check: function (video) {
                const stat = idx(["snippet", "tags"], video);
                if (stat) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with language",
            value: 0,
            check: function (video) {
                const stat = idx(["snippet", "defaultLanguage"], video);
                if (stat) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with audio language",
            value: 0,
            check: function (video) {
                const stat = idx(["snippet", "defaultAudioLanguage"], video);
                if (stat) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with localizations",
            value: 0,
            check: function (video) {
                const stat = idx(["localizations"], video);
                if (stat) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with content rating(s)",
            value: 0,
            check: function (video) {
                const stat = idx(["contentDetails", "contentRating"], video);
                if (!$.isEmptyObject(stat)) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with region restriction(s)",
            value: 0,
            check: function (video) {
                const stat = idx(["contentDetails", "regionRestriction"], video);
                if (!$.isEmptyObject(stat)) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with comments disabled",
            value: 0,
            check: function (video) {
                const stat = idx(["statistics", "commentCount"], video);
                if (!stat) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with likes disabled",
            value: 0,
            check: function (video) {
                const stat = idx(["statistics", "likeCount"], video);
                if (!stat) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with views disabled",
            value: 0,
            check: function (video) {
                const stat = idx(["statistics", "viewCount"], video);
                if (!stat) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos considered livestreams",
            value: 0,
            check: function (video) {
                const stat = idx(["liveStreamingDetails"], video);
                if (stat !== null) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with license=creativeCommon",
            value: 0,
            check: function (video) {
                const stat = idx(["status", "license"], video);
                if (stat === "creativeCommon") {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with privacyStatus=unlisted",
            value: 0,
            check: function (video) {
                const stat = idx(["status", "privacyStatus"], video);
                if (stat === "unlisted") {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with madeForKids=true",
            value: 0,
            check: function (video) {
                const stat = idx(["status", "madeForKids"], video);
                if (stat === true) {
                    this.value = this.value + 1;
                }
            }
        }, {
            text: "Videos with embeddable=false",
            value: 0,
            check: function (video) {
                const stat = idx(["status", "embeddable"], video);
                if (stat === false) {
                    this.value = this.value + 1;
                }
            }
        }
    ]

    const columnOptionsHtml = [];
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];

        columnOptionsHtml.push("<div class='item ui checkbox'>" +
            "<input id='column-" + column.title + "' " +
            "type='checkbox' " +
            "name='" + column.title + "' " +
            (column.visible ? "checked" : "") + " " +
            "onclick='bulk.toggleColumn(" + i + ")'" +
            ">" +
            "<label for='column-" + column.title + "'>" + column.title + "</label>" +
            "</div>")
    }

    const internal = {
        init: function () {
            controls.inputValue = $("#value");
            controls.inputValue.val(EXAMPLE_BULK[Math.trunc(Math.random() * EXAMPLE_BULK.length)])
            controls.btnSubmit = $("#submit");
            controls.shareLink = $("#shareLink");
            controls.videosTable = $('#videosTable').DataTable({
                columns: columns,
                columnDefs: [{
                    "defaultContent": "",
                    "targets": "_all"
                }],
                order: [[7, 'desc']],
                deferRender: true,
                bDeferRender: true
            });
            controls.columnOptions = $("#column-options");
            controls.columnOptions.html(columnOptionsHtml.join(""));
            controls.progress = $("#videoProgress").progress();

            controls.progress.reset = function () {
            }
            controls.progress.indeterminate = function (total) {
                console.log("indeterminate(" + total + ") = " + (value / total))
                this.addClass('indeterminate');
                this.progress({
                    label: 'percent',
                    total: total,
                    value: total,
                    autoSuccess: false,
                    text: {
                        active: 'Grabbing unique video ids',
                        percent: '0 / {total}'
                    }
                });
            }
            controls.progress.processing = function (value, total) {
                console.log("processing(" + value + " / " + total + ") = " + (value / total))
                this.removeClass('indeterminate');
                this.progress({
                    label: 'ratio',
                    total: total,
                    value: value,
                    autoSuccess: true,
                    text: {
                        active: 'Processing video ids',
                        success: 'Done',
                        ratio: value + ' / ' + total
                    }
                })
            }

            controls.tagsTable = $("#tagsTable").DataTable({
                columns: [
                    {title: "Tag"},
                    {
                        title: "Count",
                        type: "num",
                        className: "text-right dt-nowrap"
                    }
                ],
                columnDefs: [{
                    "defaultContent": "",
                    "targets": "_all"
                }],
                order: [[1, 'desc'], [0, 'asc']],
                deferRender: true,
                bDeferRender: true
            });
            controls.geotagsTable = $("#geotagsTable").DataTable({
                columns: [
                    {title: "Coords"},
                    {title: "Name(s)"},
                    {
                        title: "Count",
                        type: "num",
                        className: "text-right dt-nowrap"
                    }
                ],
                columnDefs: [{
                    "defaultContent": "",
                    "targets": "_all"
                }],
                order: [[2, 'desc'], [0, 'asc']],
                deferRender: true,
                bDeferRender: true
            });

            controls.otherTable = $("#otherTable").DataTable({
                columns: [
                    {title: "Statistic"},
                    {
                        title: "Value",
                        type: "num",
                        className: "text-right dt-nowrap"
                    }
                ],
                columnDefs: [{
                    "defaultContent": "",
                    "targets": "_all"
                }],
                order: [],
                deferRender: true,
                bDeferRender: true,
                pageLength: 100
            });

            controls.btnExport = $("#export");
            controls.btnImport = $("#import");
            controls.importFileChooser = $("#importFileChooser");

            new ClipboardJS(".clipboard");

            internal.buildPage(true);
        },
        buildPage: function (doSetup) {
            if (doSetup) {
                internal.setupControls();
            }
        },
        setupControls: function () {
            controls.inputValue.on('keypress', function (e) {
                if (e.originalEvent.code === "Enter") {
                    controls.btnSubmit.click();
                }
            });
            controls.btnSubmit.on('click', function () {
                internal.reset();

                const value = controls.inputValue.val();

                const baseUrl = location.origin + location.pathname;
                controls.shareLink.val(baseUrl + "?url=" + encodeURIComponent(value) + "&submit=true");
                controls.shareLink.attr("disabled", false);

                const parsed = [];
                const split = value.split(",");

                for (let i = 0; i < split.length; i++) {
                    parsed.push(determineInput(split[i]));
                }

                if (parsed.length === 0) {
                    return;
                }

                controls.progress.indeterminate(0);

                handleParsedNew(parsed);
            });

            controls.btnExport.on('click', function () {
                controls.btnExport.addClass("loading").addClass("disabled");

                const zip = new JSZip();
                console.log("Creating about.txt...")
                zip.file("about.txt",
                    "Downloaded by YouTube Metadata " + new Date().toLocaleString() + "\n\n" +
                    "URL: " + window.location + "\n\n" +
                    "Input: " + controls.inputValue.val()
                );

                console.log("Creating videos.json...")
                zip.file("videos.json", JSON.stringify(rawVideoData));

                console.log("Creating videos.csv...")
                zip.file("videos.csv", tableRows.join("\r\n"));

                console.log("Creating tags.csv...")
                const tagCsvRows = ["Tag\tCount"];
                for (let tag in tagsData) {
                    tagCsvRows.push(tag + "\t" + tagsData[tag]);
                }
                zip.file("tags.csv", tagCsvRows.join("\r\n"));

                console.log("Creating geotags.csv...")
                const geotagCsvRows = ["Coords\tName(s)\tCount"];
                for (let geotag in geotagsData) {
                    const tag = geotagsData[geotag];
                    geotagCsvRows.push(geotag + "\t" + tag.names.join(", ") + "\t" + tag.count);
                }
                zip.file("geotags.csv", geotagCsvRows.join("\r\n"));

                console.log("Creating other.csv...")
                const otherCsvRows = ["Statistic\tValue"];
                for (let i = 0; i < otherData.length; i++) {
                    const row = otherData[i];
                    otherCsvRows.push(row.text + "\t" + Number(row.value).toLocaleString());
                }
                zip.file("other.csv", otherCsvRows.join("\r\n"));

                console.log("Saving as bulk_metadata.zip")
                zip.generateAsync({type: "blob"}).then(function (content) {
                    saveAs(content, "bulk_metadata.zip");

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

                controls.btnImport.addClass("loading").addClass("disabled");

                JSZip.loadAsync(file).then(function (content) {
                    // if you return a promise in a "then", you will chain the two promises
                    return content.file("videos.json").async("string");
                }).then(function (text) {
                    internal.reset();

                    const videos = JSON.parse(text);
                    const rows = [];
                    for (let i = 0; i < videos.length; i++) {
                        rows.push(loadVideo(videos[i], true));
                    }

                    console.log(rows);

                    sliceLoad(rows, controls.videosTable);

                    console.log(tagsData);

                    loadAggregateTables(function () {
                        controls.btnImport.removeClass("loading").removeClass("disabled");
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
        },
        reset: function () {
            tableRows = [csvHeaderRow.join("\t")];
            rawVideoData = [];
            tagsData = {};
            geotagsData = {};
            controls.videosTable.clear();
            controls.videosTable.draw(false);

            controls.tagsTable.clear();
            controls.tagsTable.draw(false);

            controls.geotagsTable.clear();
            controls.geotagsTable.draw(false);

            for (let i = 0; i < otherData.length; i++) {
                otherData[i].value = 0;
            }
            controls.otherTable.clear();
            controls.otherTable.draw(false);
        }
    }

    $(document).ready(internal.init);

    return {
        toggleColumn(index) {
            const column = controls.videosTable.column(index);

            column.visible(!column.visible());
        }
    }
}());
