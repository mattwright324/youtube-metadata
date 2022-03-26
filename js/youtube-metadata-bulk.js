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

    function doneProgressMessage() {
        const about = [];
        if (rawVideoData.length) {
            about.push(rawVideoData.length + " video(s)");
        }
        if (Object.keys(unavailableData).length) {
            about.push(Object.keys(unavailableData).length + " unavailable");
        }
        if (Object.keys(failedData).length) {
            about.push(Object.keys(failedData).length + " failed");
        }
        if (Object.keys(rawChannelMap).length) {
            about.push(Object.keys(rawChannelMap).length + " channel(s)");
        }
        if (Object.keys(rawPlaylistMap).length) {
            about.push(Object.keys(rawPlaylistMap).length + " playlist(s)");
        }
        return about.join(", ")
    }

    function unavailableProgressMessage() {
        const about = [];

        if (Object.keys(unavailableData).length) {
            about.push(Object.keys(unavailableData).length + " unavailable");

            let noData = 0;
            let filmot = 0;
            for (let key in unavailableData) {
                if (unavailableData[key].hasOwnProperty("filmot")) {
                    filmot = filmot + 1;
                } else {
                    noData = noData + 1;
                }
            }

            if (filmot > 0) {
                about.push(filmot + " data");
            }
            if (noData > 0) {
                about.push(filmot + " no-data");
            }
        }

        return about.join(", ");
    }

    function processFromParsed(parsed) {
        console.log(parsed);

        const channelUsers = [];
        const channelCustoms = [];
        const channelIds = [];
        const channelIdsCreatedPlaylists = [];
        const playlistIds = [];
        const videoIds = [];

        parsed.forEach(function (p) {
            if (p.type === 'video_id' && videoIds.indexOf(p.value) === -1) {
                videoIds.push(p.value);

                controls.progress.update({
                    text: videoIds.length
                });
            } else if (p.type === "playlist_id" && playlistIds.indexOf(p.value) === -1) {
                playlistIds.push(p.value);
            } else if (p.type === "channel_id" && channelIds.indexOf(p.value) === -1 && shared.isValidChannelId(p.value)) {
                channelIds.push(p.value);
            } else if (p.type === "channel_custom" && channelCustoms.indexOf(p.value) === -1) {
                channelCustoms.push(p.value);
            } else if (p.type === "channel_user" && channelUsers.indexOf(p.value) === -1) {
                channelUsers.push(p.value);
            }
        });

        controls.progress.update({
            subtext: 'Grabbing unique video ids'
        });

        Promise.all([
            handleChannelCustoms(channelCustoms, channelIds)
        ]).then(function () {
            return Promise.all([
                // Channels condense to uploads playlist ids and channel ids
                handleChannelUsers(channelUsers, playlistIds, channelIdsCreatedPlaylists),
                handleChannelIds(channelIds, playlistIds, channelIdsCreatedPlaylists)
            ]);
        }).then(function () {
            // Created playlists condense to playlist ids (when option checked)
            return handleChannelIdsCreatedPlaylists(channelIdsCreatedPlaylists, playlistIds);
        }).then(function () {
            // Grab playlist names
            return handlePlaylistNames(playlistIds);
        }).then(function () {
            // Playlists condense to video ids
            return handlePlaylistIds(playlistIds, videoIds);
        }).then(function () {
            controls.progress.update({
                subtext: 'Processing video ids'
            });

            // Videos are results to be displayed
            return handleVideoIds(videoIds);
        }).then(function () {
            return new Promise(function (resolve) {
                sliceLoad(rows, controls.videosTable, resolve);
            });
        }).then(function () {
            controls.progress.update({
                subtext: 'Processing channel ids'
            });

            // Ids for channels not in the original request, likely from playlists
            const newChannelIds = [];
            rawVideoData.forEach(function (video) {
                const channelId = shared.idx(["snippet", "channelId"], video);
                if (!rawChannelMap.hasOwnProperty(channelId) && newChannelIds.indexOf(channelId) === -1) {
                    newChannelIds.push(channelId);
                }
            });

            return handleChannelIds(newChannelIds, [], []);
        }).then(function () {
            console.log(videoIds);

            const resultIds = [];
            rawVideoData.forEach(function (video) {
                resultIds.push(video.id);
            });
            videoIds.forEach(function (videoId) {
                if (!unavailableData.hasOwnProperty(videoId) && !failedData.hasOwnProperty(videoId) && resultIds.indexOf(videoId) === -1) {
                    unavailableData[videoId] = {
                        title: "Did not come back in API",
                        source: ""
                    };
                }
            });

            controls.videosTable.columns.adjust().draw(false);
        }).then(function () {
            controls.progress.update({
                text: doneProgressMessage(),
                subtext: 'Done' + (Object.keys(failedData).length ? ' (with errors). Check browser console.' : '')
            });

            console.log(failedData)

            controls.unavailableTable.columns.adjust().draw(false);

            if (Object.keys(unavailableData).length > 0) {
                controls.checkUnavailable.removeClass("disabled");
            }

            setTimeout(loadAggregateTables, 200);
        }).catch(function (err) {
            console.error(err);
        });
    }

    function handleChannelUsers(channelUsers, playlistIds, channelIdsCreatedPlaylists) {
        return new Promise(function (resolve) {
            if (channelUsers.length === 0) {
                console.log("no channelUsers")
                resolve();
                return;
            }

            function get(index) {
                if (index >= channelUsers.length) {
                    console.log("finished channelUsers");
                    setTimeout(resolve, 250);
                    return;
                }

                console.log("handleChannelUsers.get(" + index + ")")
                console.log(channelUsers[index])

                youtube.ajax("channels", {
                    part: "snippet,statistics,brandingSettings,contentDetails,localizations,status,topicDetails",
                    forUsername: channelUsers[index]
                }).done(function (res) {
                    console.log(res);

                    const channel = shared.idx(["items", 0], res);
                    if (!channel) {
                        get(index + 1);
                        return;
                    }

                    const channelId = shared.idx(["id"], channel);
                    rawChannelMap[channelId] = channel;

                    if (channelIdsCreatedPlaylists.indexOf(channelId) === -1) {
                        channelIdsCreatedPlaylists.push(channelId);
                    }

                    const uploadsPlaylistId = shared.idx(["items", 0, "contentDetails", "relatedPlaylists", "uploads"], res);
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

    function handleChannelCustoms(channelCustoms, channelIds) {
        return new Promise(function (resolve) {
            if (channelCustoms.length === 0) {
                console.log("no channelCustoms")
                resolve();
                return;
            }

            function get(index) {
                if (index >= channelCustoms.length) {
                    console.log("finished channelCustoms");
                    setTimeout(resolve, 250);
                    return;
                }

                console.log("handleChannelCustoms.get(" + index + ")")

                $.ajax({
                    url: "https://cors-proxy-mw324.herokuapp.com/https://www.youtube.com/" + channelCustoms[index],
                    dataType: 'html'
                }).then(function (res) {
                    const pageHtml = $("<div>").html(res);
                    const ogUrl = pageHtml.find("meta[property='og:url']").attr('content');
                    console.log('Retrieved og:url ' + ogUrl);

                    const newParsed = shared.determineInput(ogUrl);
                    if (newParsed.type === "channel_id") {
                        channelIds.push(newParsed.value);
                        setTimeout(function () {
                            get(index + 1);
                        }, 100);
                    } else {
                        console.log('Could not resolve custom url');
                        console.warn(newParsed);

                        setTimeout(function () {
                            get(index + 1);
                        }, 100);
                    }
                }).fail(function (err) {
                    console.warn(err);

                    setTimeout(function () {
                        get(index + 1);
                    }, 100);
                });
            }

            get(0);
        });
    }

    function handleChannelIds(channelIds, playlistIds, channelIdsCreatedPlaylists) {
        let processed = 0;
        channelIds.forEach(function (channelId) {
            if (channelIdsCreatedPlaylists.indexOf(channelId) === -1) {
                channelIdsCreatedPlaylists.push(channelId);
            }
        });
        return new Promise(function (resolve) {
            if (channelIds.length === 0) {
                console.log("no channelIds")
                resolve();
                return;
            }

            controls.progress.update({
                value: 0,
                max: channelIds.length,
                text: "0 / " + channelIds.length
            });

            function get(index, slice) {
                if (index >= channelIds.length) {
                    console.log("finished channelIds");
                    setTimeout(resolve, 250);
                    return;
                }

                console.log("handleChannelIds.get(" + index + ", " + slice + ")")

                const ids = channelIds.slice(index, index + slice);

                youtube.ajax("channels", {
                    part: "snippet,statistics,brandingSettings,contentDetails,localizations,status,topicDetails",
                    id: ids.join(","),
                    maxResults: 50
                }).done(function (res) {
                    console.log(res);

                    (res.items || []).forEach(function (channel) {
                        const channelId = shared.idx(["id"], channel);
                        rawChannelMap[channelId] = channel;

                        const uploadsPlaylistId = shared.idx(["contentDetails", "relatedPlaylists", "uploads"], channel);
                        console.log(uploadsPlaylistId);

                        if (playlistIds.indexOf(uploadsPlaylistId) === -1) {
                            playlistIds.push(uploadsPlaylistId);
                        }
                    });

                    processed = processed + ids.length;

                    controls.progress.update({
                        value: processed,
                        text: processed + " / " + channelIds.length
                    });

                    get(index + slice, slice);
                }).fail(function (err) {
                    console.error(err);
                    get(index + slice, slice);
                });
            }

            get(0, 50);
        });
    }

    function handleChannelIdsCreatedPlaylists(channelIds, playlistIds) {
        return new Promise(function (resolve) {
            if (channelIds.length === 0) {
                console.log("no handleChannelIdsCreatedPlaylists")
                resolve();
                return;
            }

            if (controls.createdPlaylists.is(":checked") === false) {
                console.log("createdPlaylists not checked, skipping")
                resolve();
                return;
            }


            function get(index) {
                if (index >= channelIds.length) {
                    console.log("finished handleChannelIdsCreatedPlaylists");
                    setTimeout(resolve, 250);
                    return;
                }

                console.log("handleChannelIdsCreatedPlaylists.get(" + index + ")")

                const id = channelIds[index];
                console.log(id);

                function paginate(pageToken) {
                    youtube.ajax("playlists", {
                        part: "snippet,status,localizations,contentDetails",
                        channelId: id,
                        maxResults: 50,
                        pageToken: pageToken
                    }).done(function (res) {
                        console.log(res);

                        (res.items || []).forEach(function (playlist) {
                            const createdPlaylistId = shared.idx(["id"], playlist);
                            console.log(createdPlaylistId);

                            rawPlaylistMap[createdPlaylistId] = playlist;

                            playlistMap[createdPlaylistId] = shared.idx(["snippet", "title"], playlist);

                            if (playlistIds.indexOf(createdPlaylistId) === -1) {
                                playlistIds.push(createdPlaylistId);
                            }
                        });

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

    function handlePlaylistNames(playlistIds) {
        return new Promise(function (resolve) {
            if (playlistIds.length === 0) {
                console.log("no playlistIds")
                resolve();
                return;
            }

            const notYetRetrieved = [];
            playlistIds.forEach(function (id) {
                if (!playlistMap.hasOwnProperty(id)) {
                    notYetRetrieved.push(id);
                }
            });
            console.log(notYetRetrieved);

            function get(index) {
                if (index >= notYetRetrieved.length) {
                    console.log("finished notYetRetrieved");
                    setTimeout(resolve, 250);
                    return;
                }

                console.log("handlePlaylistNames.get(" + index + ")")

                function paginate(pageToken) {
                    console.log(pageToken);
                    youtube.ajax("playlists", {
                        part: "snippet,status,localizations,contentDetails",
                        maxResults: 50,
                        id: notYetRetrieved[index],
                        pageToken: pageToken
                    }).done(function (res) {
                        console.log(res);

                        (res.items || []).forEach(function (playlist) {
                            const playlistId = shared.idx(["id"], playlist);
                            console.log(playlistId);

                            rawPlaylistMap[playlistId] = playlist;
                            playlistMap[playlistId] = shared.idx(["snippet", "title"], playlist);
                        });

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

    function handlePlaylistIds(playlistIds, videoIds) {
        return new Promise(function (resolve) {
            if (playlistIds.length === 0) {
                console.log("no playlistIds")
                resolve();
                return;
            }

            function get(index) {
                if (index >= playlistIds.length) {
                    console.log("finished playlistIds");
                    setTimeout(resolve, 250);
                    return;
                }

                function paginate(pageToken) {
                    console.log("handlePlaylistIds.get(" + index + ")")

                    youtube.ajax("playlistItems", {
                        part: "snippet",
                        maxResults: 50,
                        playlistId: playlistIds[index],
                        pageToken: pageToken
                    }).done(function (res) {
                        console.log(res);

                        (res.items || []).forEach(function (video) {
                            const videoId = shared.idx(["snippet", "resourceId", "videoId"], video);
                            const videoOwnerChannelId = shared.idx(["snippet", "videoOwnerChannelId"], video);
                            const dateFormat = "YYYY-MM-DD";
                            const dateAdded = shared.idx(["snippet", "publishedAt"], video);

                            if (videoIds.indexOf(videoId) === -1) {
                                videoIds.push(videoId);

                                availableData[videoId] = {
                                    source: "Playlist: " +
                                        "<a target='_blank' href='https://www.youtube.com/playlist?list=" + playlistIds[index] + "'>" +
                                        playlistMap[playlistIds[index]] +
                                        "</a> (added " + moment(dateAdded).format(dateFormat) + ")"
                                }
                            }
                            if (!videoOwnerChannelId) {
                                unavailableData[videoId] = {
                                    title: shared.idx(["snippet", "title"], video),
                                    source: "Playlist: " +
                                        "<a target='_blank' href='https://www.youtube.com/playlist?list=" + playlistIds[index] + "'>" +
                                        playlistMap[playlistIds[index]] +
                                        "</a> (added " + moment(dateAdded).format(dateFormat) + ")"
                                }
                            }
                        });

                        controls.progress.update({
                            text: videoIds.length
                        })

                        if (res.hasOwnProperty("nextPageToken")) {
                            setTimeout(function () {
                                paginate(res.nextPageToken);
                            }, 150);
                        } else {
                            setTimeout(function () {
                                get(index + 1);
                            }, 150);
                        }
                    }).fail(function (err) {
                        console.error(err);
                        setTimeout(function () {
                            get(index + 1);
                        }, 150);
                    });
                }

                paginate("");
            }

            get(0);
        });
    }

    function handleUnavailableVideos() {
        const videoIds = [];
        for (let videoId in unavailableData) {
            if (shared.isValidVideoId(videoId)) {
                videoIds.push(videoId);
            } else {
                unavailableData[videoId].title = "Invalid ID";
            }
        }

        let processed = 0;
        return new Promise(function (resolve) {
            const hostname = window.location.hostname;
            if (hostname !== "localhost" && hostname !== "mattw.io") {
                console.log("do not call filmot from other instances")
                resolve();
                return;
            }

            if (videoIds.length === 0) {
                console.log("no videoIds")
                resolve();
                return;
            }

            console.log("checking " + videoIds.length + " videoIds");

            function get(index, slice) {
                if (index >= videoIds.length) {
                    console.log("finished videoIds");
                    setTimeout(resolve, 250);
                    return;
                }

                console.log("handleUnavailableVideos.get(" + index + ", " + (index + slice) + ")")

                const ids = videoIds.slice(index, index + slice);

                // Note: Filmot has limited resources. Do not misuse, please contact about usage first.
                // https://filmot.com/contactus
                $.ajax({
                    cache: false,
                    data: {
                        key: "md5paNgdbaeudounjp39",
                        id: ids.join(","),
                        flags: 1 // Get channel and description too,
                    },
                    dataType: "json",
                    type: "GET",
                    timeout: 5000,
                    url: "https://filmot.com/api/getvideos",
                }).done(function (res) {
                    console.log(res);

                    res.forEach(function (video) {
                        unavailableData[video.id]["filmot"] = video;
                    });

                    processed = processed + ids.length;

                    controls.unavailableProgress.update({
                        value: processed,
                        max: videoIds.length,
                        text: processed + " / " + videoIds.length
                    })

                    setTimeout(function () {
                        get(index + slice, slice);
                    }, 1500);
                }).fail(function (err) {
                    console.error(err);
                    setTimeout(function () {
                        get(index + slice, slice);
                    }, 1500);
                });
            }

            get(0, 100);
        });
    }

    function handleVideoIds(videoIds) {
        let processed = 0;

        return new Promise(function (resolve) {
            if (videoIds.length === 0) {
                console.log("no videoIds")
                resolve();
                return;
            }

            console.log("checking " + videoIds.length + " videoIds");

            function get(index, slice) {
                if (index >= videoIds.length) {
                    console.log("finished videoIds");
                    setTimeout(resolve, 250);
                    return;
                }

                console.log("handleVideoIds.get(" + index + ", " + (index + slice) + ")")

                const ids = videoIds.slice(index, index + slice);

                console.log(ids.length);
                console.log(ids);

                try {
                    youtube.ajax("videos", {
                        part: "snippet,statistics,recordingDetails," +
                            "status,liveStreamingDetails,localizations," +
                            "contentDetails,topicDetails",
                        maxResults: 50,
                        id: ids.join(",")
                    }).done(function (res) {
                        try {
                            console.log(res);

                            (res.items || []).forEach(function (video) {
                                loadVideo(video, true);
                            });

                            processed = processed + ids.length;

                            controls.progress.update({
                                value: processed,
                                max: videoIds.length,
                                text: processed + " / " + videoIds.length
                            });

                            setTimeout(function () {
                                get(index + slice, slice);
                            }, 150);
                        } catch (error) {
                            controls.progress.addClass('error');
                            console.error(error);
                            const reason = JSON.stringify(error, null, 0);
                            for (let i = 0; i < ids.length; i++) {
                                failedData[ids[i]] = {reason: reason}
                            }
                            setTimeout(function () {
                                get(index + slice, slice);
                            }, 150);
                        }
                    }).fail(function (err) {
                        controls.progress.addClass('error');
                        console.warn(err)
                        const reason = shared.idx(["responseJSON", "error", "errors", 0, "reason"], err) ||
                            JSON.stringify(err, null, 0);
                        for (let i = 0; i < ids.length; i++) {
                            failedData[ids[i]] = {reason: reason}
                        }
                        setTimeout(function () {
                            get(index + slice, slice);
                        }, 150);
                    });
                } catch (error) {
                    controls.progress.addClass('error');
                    console.error(error);
                    const reason = JSON.stringify(error, null, 0);
                    for (let i = 0; i < ids.length; i++) {
                        failedData[ids[i]] = {reason: reason}
                    }
                    get(index + slice, slice);
                }
            }

            get(0, 50);
        });
    }

    function loadVideo(video, skipAdd) {
        const dataRow = [];
        const csvDataRow = [];
        const publishedAt = moment(shared.idx(["snippet", "publishedAt"], video));
        publishedAt.utc();

        const tags = shared.idx(["snippet", "tags"], video);
        (tags || []).forEach(function (tag) {
            if (!tagsData[tag]) {
                tagsData[tag] = {}
            }

            tagsData[tag].count = ++tagsData[tag].count || 1;

            if (tagsData[tag].firstUsed) {
                if (publishedAt.isBefore(tagsData[tag].firstUsed)) {
                    tagsData[tag].firstUsed = publishedAt;
                    tagsData[tag].firstVideo = video.id;
                }
            } else {
                tagsData[tag].firstUsed = publishedAt;
                tagsData[tag].firstVideo = video.id;
            }

            if (tagsData[tag].lastUsed) {
                if (publishedAt.isAfter(tagsData[tag].lastUsed)) {
                    tagsData[tag].lastUsed = publishedAt;
                    tagsData[tag].lastVideo = video.id;
                }
            } else {
                tagsData[tag].lastUsed = publishedAt;
                tagsData[tag].lastVideo = video.id;
            }
        });

        const geotag = shared.idx(["recordingDetails"], video);
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

        const description = shared.idx(["snippet", "description"], video);
        if (description) {
            // https://stackoverflow.com/a/3809435/2650847
            //const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9@:%_!+.~#?&/=]*)/gi;
            //const matches = description.match(URL_REGEX);
            const URL_XREGEX = XRegExp("(\\p{L}[\\p{L}\\d\\-+.]*)?:\\/\\/[-\\p{L}0-9@:%._+~#=]{1,256}\\.[\\p{L}0-9()]{1,6}\\b([-\\p{L}0-9@:%_!+.~#?&\\/=]*)", "gi");
            const matches = XRegExp.match(description, URL_XREGEX);
            const END_CHARS = /[.()]*$/gi; // Remove periods and parenthesis on end of the link.
            (matches || []).forEach(function (match) {
                const link = match.replace(END_CHARS, "");
                if (!linksData[link]) {
                    linksData[link] = {}
                }
                linksData[link].count = ++linksData[link].count || 1;

                if (linksData[link].firstUsed) {
                    if (publishedAt.isBefore(linksData[link].firstUsed)) {
                        linksData[link].firstUsed = publishedAt;
                        linksData[link].firstVideo = video.id;
                    }
                } else {
                    linksData[link].firstUsed = publishedAt;
                    linksData[link].firstVideo = video.id;
                }

                if (linksData[link].lastUsed) {
                    if (publishedAt.isAfter(linksData[link].lastUsed)) {
                        linksData[link].lastUsed = publishedAt;
                        linksData[link].lastVideo = video.id;
                    }
                } else {
                    linksData[link].lastUsed = publishedAt;
                    linksData[link].lastVideo = video.id;
                }
            });
        }

        for (let key in otherData) {
            otherData[key].check(video);
        }

        columns.forEach(function (column) {
            const value = column._idx ? shared.idx(column._idx, video) : undefined;
            const displayValue = column.hasOwnProperty("valueMod") ? column.valueMod(value, video) : value;

            dataRow.push(displayValue);

            const button = document.querySelector("button[title='" + column.title + "']");
            const input = document.querySelector("button[title='" + column.title + "'] input");
            if (!$(button).hasClass("active") && input.indeterminate === true && column._visibleIf && column._visibleIf(value)) {
                button.click();
            }

            if (column.csvSkip) {
                return;
            }

            let csvValue = displayValue && displayValue.hasOwnProperty("display") ?
                displayValue.display : displayValue;

            if (csvValue) {
                csvValue = String(csvValue).replace(/([\r]?\n)/g, "<br>");
            }

            csvDataRow.push(csvValue);
        });

        tableRows.push(csvDataRow.join("\t"));
        rows.push(dataRow);
        rawVideoData.push(video);

        if (skipAdd) {
            return dataRow;
        } else {
            controls.videosTable.row.add(dataRow).draw(false);
        }
    }

    function loadAggregateTables(callback) {
        const dateFormat = "YYYY-MM-DD";

        const tagRows = [];
        for (let tag in tagsData) {
            const tagData = tagsData[tag];
            tagRows.push([
                tag,
                "<a data-value='" + tagData.firstUsed + "' href='https://youtu.be/" + tagData.firstVideo + "' target='_blank'>" + tagData.firstUsed.format(dateFormat) + "</a>",
                "<a data-value='" + tagData.lastUsed + "' href='https://youtu.be/" + tagData.lastVideo + "' target='_blank'>" + tagData.lastUsed.format(dateFormat) + "</a>",
                tagData.count
            ]);
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

        const linksRows = [];
        for (let link in linksData) {
            const linkData = linksData[link];
            linksRows.push([
                link,
                link.startsWith('http') ? "<a href='" + link + "' target='_blank'>" + link + "</a>" : link,
                "<a data-value='" + linkData.firstUsed + "' href='https://youtu.be/" + linkData.firstVideo + "' target='_blank'>" + linkData.firstUsed.format(dateFormat) + "</a>",
                "<a data-value='" + linkData.lastUsed + "' href='https://youtu.be/" + linkData.lastVideo + "' target='_blank'>" + linkData.lastUsed.format(dateFormat) + "</a>",
                linkData.count
            ]);
        }
        sliceLoad(linksRows, controls.linksTable);

        const timezoneOffset = controls.offset.val();
        const years = [];
        const yearCount = {};
        rawVideoData.forEach(function (video) {
            const timestamp = moment(shared.idx(["snippet", "publishedAt"], video)).utcOffset(String(timezoneOffset));
            const year = timestamp.format('yyyy');
            if (years.indexOf(year) === -1) {
                years.push(year);
                yearCount[year] = 1;
            } else {
                yearCount[year] = yearCount[year] + 1;
            }
        });
        years.sort();
        years.reverse();
        years.forEach(function (year) {
            controls.year.append("<option value='" + year + "'>" + year + "  (" + yearCount[year] + " videos)</option>");
        });
        loadChartData(timezoneOffset);

        console.log(unavailableData);
        const unavailableRows = [];
        for (let videoId in unavailableData) {
            const video = unavailableData[videoId];
            const filmotTitle = shared.idx(["filmot", "title"], video) || "<span style='color:gray'>No data</span>";
            const filmotDesc = shared.idx(["filmot", "description"], video) || "";
            const filmotAuthorName = shared.idx(["filmot", "channelname"], video);
            const filmotAuthor = filmotAuthorName ?
                "<a target='_blank' href='https://www.youtube.com/channel/" + shared.idx(["filmot", "channelid"], video) + "'>" + shared.idx(["filmot", "channelname"], video) + "</a>" : "";
            const filmotUploadDate = shared.idx(["filmot", "uploaddate"], video) || "";
            const duration = shared.idx(["filmot", "duration"], video) || -1;
            const filmotDuration = duration === -1 ? "" : shared.formatDuration(moment.duration({seconds: duration}));
            unavailableRows.push([
                "<a target='_blank' href='https://youtu.be/" + videoId + "'>" + videoId + "</a>",
                String(video.title),
                "<a target='_blank' href='https://filmot.com/video/" + videoId + "'>Filmot</a> · " +
                "<a target='_blank' href='https://web.archive.org/web/*/https://www.youtube.com/watch?v=" + videoId + "'>Archive Web</a> · " +
                "<a target='_blank' href='https://archive.org/details/youtube-" + videoId + "'>Archive Details</a> · " +
                "<a target='_blank' href='https://web.archive.org/web/2/http://wayback-fakeurl.archive.org/yt/" + videoId + "'>Archive Video</a> · " +
                "<a target='_blank' href='https://www.google.com/search?q=\"" + videoId + "\"'>Google</a>",
                video.source,
                filmotTitle,
                filmotAuthor,
                filmotUploadDate,
                {"display": filmotDuration, "num": duration},
                filmotDesc
            ]);
        }
        sliceLoad(unavailableRows, controls.unavailableTable);

        unavailableColumns.forEach(function (column) {
            const button = document.querySelector("button[title='" + column.title + "']");
            const input = document.querySelector("button[title='" + column.title + "'] input");
            if (!$(button).hasClass("active") && input.indeterminate === true && column._visibleIf && column._visibleIf(value)) {
                button.click();
            }
        })

        console.log(otherData)
        for (let key in otherData) {
            const row = otherData[key];
            const value = row.value;
            const displayValue = Number(value) === value ? Number(value).toLocaleString() : value;

            controls.otherTable.row.add([row.text, displayValue]).draw(false);
        }

        if (callback) {
            callback();
        }
    }

    function loadChartData(timezoneOffset, yearFilter) {
        if (rawVideoData.length === 0) {
            return;
        }

        console.log('Loading chart data [offset=' + timezoneOffset + ", yearFilter=" + yearFilter + "]")

        const days = ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday']
        const rawChartData = {};
        days.forEach(function (dayName) {
            rawChartData[dayName] = {
                name: dayName,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        });

        rawVideoData.forEach(function (video) {
            const timestamp = moment(shared.idx(["snippet", "publishedAt"], video)).utcOffset(String(timezoneOffset));
            const dayName = timestamp.format('dddd');
            const hour24 = timestamp.format('H');
            const year = timestamp.format('yyyy');

            if (!yearFilter || yearFilter === "" || year === yearFilter) {
                rawChartData[dayName].data[hour24] = rawChartData[dayName].data[hour24] + 1;
            }
        });

        console.log(rawChartData);

        const newChartData = [];
        days.forEach(function (dayName) {
            for (let weekday in rawChartData) {
                if (weekday === dayName) {
                    newChartData.push(rawChartData[weekday]);
                    chartData[rawChartData[weekday].name] = rawChartData[weekday].data;
                }
            }
        });

        controls.uploadFrequency.updateSeries(newChartData);
    }

    function sliceLoad(data, table, callback) {
        function slice(index, size) {
            const toAdd = data.slice(index, index + size);
            if (toAdd.length === 0) {
                if (callback) {
                    callback();
                }
                return;
            }

            table.rows.add(toAdd).draw(false);
            table.columns.adjust().draw(false);

            setTimeout(function () {
                slice(index + size, size)
            }, 200);
        }

        slice(0, 1000);
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
                const channelId = shared.idx(["snippet", "channelId"], video);
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
                    display: shared.formatDuration(duration, false),
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
            title: "Length (Seconds)",
            type: "num",
            visible: false,
            _idx: ["contentDetails", "duration"],
            valueMod: function (value) {
                const duration = moment.duration(value);
                const length = duration.asMilliseconds();

                return length === 0 ? {
                    display: 'livestream',
                    num: length
                } : {
                    display: length / 1000,
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
            visible: false,
            _visibleIf: function (value) {
                return value;
            },
            _idx: ["statistics", "dislikeCount"],
            valueMod: function (value) {
                return value ? {
                    display: Number(value).toLocaleString(),
                    num: value
                } : {
                    display: "",
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
            title: "Source",
            type: "html",
            visible: false,
            valueMod: function (value, video) {
                if (availableData.hasOwnProperty(video.id)) {
                    return availableData[video.id].source;
                } else {
                    return ""
                }
            }
        },
        {
            title: "Kids",
            type: "boolean",
            visible: false,
            _visibleIf: function (value) {
                return value;
            },
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
            _visibleIf: function (value) {
                return value && value !== "public";
            },
            _idx: ["status", "privacyStatus"]
        },
        {
            title: "Content Rating",
            visible: false,
            _idx: ["contentDetails", "contentRating"],
            valueMod: function (value) {
                if (!$.isEmptyObject(value)) {
                    console.log(value);

                    const pairs = [];
                    Object.keys(value).forEach(function (key) {
                        pairs.push(key + "/" + value[key]);
                    });

                    return pairs.join(", ");
                }

                return "";
            }
        },
        {
            title: "Region Restriction Count",
            type: "num",
            visible: false,
            indeterminate: true,
            _visibleIf: function (value) {
                return !$.isEmptyObject(value) && (value.allowed || value.blocked).length > 0;
            },
            _idx: ["contentDetails", "regionRestriction"],
            valueMod: function (value) {
                if (!$.isEmptyObject(value)) {
                    if (value.hasOwnProperty('allowed')) {
                        return {
                            display: value.allowed.length + " (allowed)",
                            num: value.allowed.length
                        };
                    } else if (value.hasOwnProperty('blocked')) {
                        return {
                            display: value.blocked.length + " (blocked)",
                            num: value.blocked.length
                        };
                    }
                }

                return {
                    display: "",
                    num: 0
                };
            },
            render: {
                _: 'display',
                sort: 'num'
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
            visible: false,
            _visibleIf: function (value) {
                return !$.isEmptyObject(value) && value.locationDescription;
            },
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
            _visibleIf: function (value) {
                // Display when there are coordinates but no location name, this sometimes happens and not sure how.
                // return !$.isEmptyObject(value) && value.location && !value.locationDescription;
            },
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
            visible: false,
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

    const unavailableColumns = [
        {
            title: "Video ID",
            type: "html",
            visible: true
        },
        {
            title: "Status",
            type: "html",
            visible: true
        },
        {
            title: "Research",
            type: "html",
            visible: true
        },
        {
            title: "Source",
            type: "html",
            visible: true
        },
        {
            title: "Title (Filmot)",
            type: "html",
            visible: false,
            indeterminate: true,
            _idx: ["filmot", "title"],
            _visibleIf: function (value) {
                return !$.isEmptyObject(value) && value !== "No data";
            }
        },
        {
            title: "Author (Filmot)",
            type: "html",
            visible: false,
            indeterminate: true,
            _idx: ["filmot", "channelname"],
            _visibleIf: function (value) {
                return !$.isEmptyObject(value);
            }
        },
        {
            title: "Published (Filmot)",
            type: "html",
            visible: false,
            indeterminate: true,
            _idx: ["filmot", "uploaddate"],
            _visibleIf: function (value) {
                return !$.isEmptyObject(value);
            }
        },
        {
            title: "Length (Filmot)",
            type: "num",
            visible: false,
            indeterminate: true,
            _idx: ["filmot", "duration"],
            _visibleIf: function (value) {
                return !$.isEmptyObject(value);
            },
            render: {
                _: 'display',
                sort: 'num'
            },
            className: "dt-nowrap"
        },
        {
            title: "Description (Filmot)",
            type: "html",
            visible: false
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
    let rows = [];
    let rawVideoData = [];
    let availableData = {};
    let rawChannelMap = {};
    let rawPlaylistMap = {};
    let playlistMap = {};
    let unavailableData = {};
    let failedData = {}; // google requests failed, don't send to filmot
    let tagsData = {};
    let geotagsData = {};
    let linksData = {};
    let chartData = {};
    let otherData = {
        totalVideos: {
            text: "Total videos", value: 0, check: function (video) {
                if (video) {
                    this.value = this.value + 1;
                }
            }
        },
        totalViews: {
            text: "Total views",
            value: 0,
            check: function (video) {
                const views = shared.idx(["statistics", "viewCount"], video);
                this.value = this.value + (views ? Number(views) : 0);
            }
        },
        totalLikes: {
            text: "Total likes",
            value: 0,
            check: function (video) {
                const likes = shared.idx(["statistics", "likeCount"], video);
                this.value = this.value + (likes ? Number(likes) : 0);
            }
        },
        totalDislikes: {
            text: "Total dislikes",
            value: 0,
            check: function (video) {
                const dislikes = shared.idx(["statistics", "dislikeCount"], video);
                this.value = this.value + (dislikes ? Number(dislikes) : 0);
            }
        },
        totalComments: {
            text: "Total comments",
            value: 0,
            check: function (video) {
                const comments = shared.idx(["statistics", "commentCount"], video);
                this.value = this.value + (comments ? Number(comments) : 0);
            }
        },
        totalLength: {
            text: "Total video length",
            value: '',
            reset: function () {
                this.totalSeconds = 0;
            },
            totalSeconds: 0,
            check: function (video) {
                const duration = moment.duration(shared.idx(["contentDetails", "duration"], video));
                this.totalSeconds = this.totalSeconds + duration.asSeconds();
                this.value = shared.formatDuration(moment.duration({seconds: this.totalSeconds}), false);
            }
        },
        averageLength: {
            text: "Average video length",
            value: '',
            check: function (video) {
                const seconds = otherData.totalLength.totalSeconds / otherData.totalVideos.value;
                this.value = shared.formatDuration(moment.duration({seconds: seconds}), false);
            }
        },
        withGeolocation: {
            text: "Videos with geolocation",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["recordingDetails", "location", "latitude"], video);
                if (stat) {
                    this.value = this.value + 1;
                }
            }
        },
        withRecordingDate: {
            text: "Videos with recordingDate",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["recordingDetails", "recordingDate"], video);
                if (stat) {
                    this.value = this.value + 1;
                }
            }
        },
        withTags: {
            text: "Videos with tags",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["snippet", "tags"], video);
                if (stat) {
                    this.value = this.value + 1;
                }
            }
        },
        withLanguage: {
            text: "Videos with language",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["snippet", "defaultLanguage"], video);
                if (stat) {
                    this.value = this.value + 1;
                }
            }
        },
        withAudioLanguage: {
            text: "Videos with audio language",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["snippet", "defaultAudioLanguage"], video);
                if (stat) {
                    this.value = this.value + 1;
                }
            }
        },
        withLocalizations: {
            text: "Videos with localizations",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["localizations"], video);
                if (stat) {
                    this.value = this.value + 1;
                }
            }
        },
        withContentRatings: {
            text: "Videos with content rating(s)",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["contentDetails", "contentRating"], video);
                if (!$.isEmptyObject(stat)) {
                    this.value = this.value + 1;
                }
            }
        },
        withRegionRestrictions: {
            text: "Videos with region restriction(s)",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["contentDetails", "regionRestriction"], video);
                if (!$.isEmptyObject(stat)) {
                    this.value = this.value + 1;
                }
            }
        },
        withCaptions: {
            text: "Videos with captions",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["contentDetails", "caption"], video);
                if (stat === "true") {
                    this.value = this.value + 1;
                }
            }
        },
        withCommentsDisabled: {
            text: "Videos with comments disabled",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["statistics", "commentCount"], video);
                if (!stat) {
                    this.value = this.value + 1;
                }
            }
        },
        withLikesDisabled: {
            text: "Videos with likes disabled",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["statistics", "likeCount"], video);
                if (!stat) {
                    this.value = this.value + 1;
                }
            }
        },
        withViewsDisabled: {
            text: "Videos with views disabled",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["statistics", "viewCount"], video);
                if (!stat) {
                    this.value = this.value + 1;
                }
            }
        },
        consideredLivestreams: {
            text: "Videos considered livestreams",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["liveStreamingDetails"], video);
                if (stat !== null) {
                    this.value = this.value + 1;
                }
            }
        },
        isCreativeCommons: {
            text: "Videos with license=creativeCommon",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["status", "license"], video);
                if (stat === "creativeCommon") {
                    this.value = this.value + 1;
                }
            }
        },
        isUnlisted: {
            text: "Videos with privacyStatus=unlisted",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["status", "privacyStatus"], video);
                if (stat === "unlisted") {
                    this.value = this.value + 1;
                }
            }
        },
        isMadeForKids: {
            text: "Videos with madeForKids=true",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["status", "madeForKids"], video);
                if (stat === true) {
                    this.value = this.value + 1;
                }
            }
        },
        isNotEmbeddable: {
            text: "Videos with embeddable=false",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["status", "embeddable"], video);
                if (stat === false) {
                    this.value = this.value + 1;
                }
            }
        },
        is3d: {
            text: "Videos with dimension=3d",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["contentDetails", "dimension"], video);
                if (stat === "3d") {
                    this.value = this.value + 1;
                }
            }
        },
        is360: {
            text: "Videos with projection=360",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["contentDetails", "projection"], video);
                if (stat === "360") {
                    this.value = this.value + 1;
                }
            }
        }
    };

    const columnOptionsHtml = [];
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];

        columnOptionsHtml.push("<option value='" + i + "'" + (column.visible ? " selected" : "") + " title='" + column.title + "'>" +
            column.title +
            "</option>")
    }

    const internal = {
        init: function () {
            controls.darkMode = $("#darkMode");
            controls.inputValue = $("#value");
            controls.inputValue.val(shared.randomFromList(EXAMPLE_BULK));
            controls.btnSubmit = $("#submit");
            controls.shareLink = $("#shareLink");
            controls.videosTable = $('#videosTable').DataTable({
                columns: columns,
                columnDefs: [{
                    "defaultContent": "",
                    "targets": "_all"
                }],
                order: [[8, 'desc']],
                lengthMenu: [[10, 25, 50, 100, 250, -1], [10, 25, 50, 100, 250, "All"]],
                deferRender: true,
                bDeferRender: true,

            });
            controls.columnOptions = $("#column-options");
            controls.columnOptions.html(columnOptionsHtml.join(""));
            controls.columnOptions.multiselect({
                buttonClass: 'form-select',
                templates: {
                    button: '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
                },
                onChange: function (option, checked, select) {
                    external.toggleResultsColumn($(option).val())
                }
            });
            columns.forEach(function (column) {
                if (column.hasOwnProperty("_visibleIf")) {
                    document.querySelector("button[title='" + column.title + "'] input").indeterminate = true;
                }
            })
            controls.progress = $("#progressBar");
            elements.progressText = $("#progressText")
            controls.progress.progressData = {
                min: 0,
                value: 0,
                max: 100
            }
            controls.progress.update = function (options) {
                console.log(options)
                if (String(options["reset"]).toLowerCase() === "true") {
                    console.log('reset')
                    this.update({
                        min: 0,
                        value: 0,
                        max: 100,
                        text: "",
                        subtext: 'Idle'
                    });
                    return;
                }
                if (options.hasOwnProperty("subtext")) {
                    elements.progressText.text(options.subtext);
                }
                if (options.hasOwnProperty("text")) {
                    this.find('.label').text(options.text);
                }
                if (options.hasOwnProperty("min")) {
                    this.progressData.min = options.min;
                }
                if (options.hasOwnProperty("value")) {
                    this.progressData.value = options.value;
                }
                if (options.hasOwnProperty("max")) {
                    this.progressData.max = options.max;
                }

                const data = this.progressData;
                const percent = 100 * ((data.value - data.min) / (data.max - data.min));
                this.css('width', percent + "%");
            }
            controls.unavailableProgress = $("#unavailableProgressBar");
            elements.unavailableProgressText = $("#unavailableProgressText")
            controls.unavailableProgress.progressData = {
                min: 0,
                value: 0,
                max: 100
            }
            controls.unavailableProgress.update = function (options) {
                console.log(options)
                if (String(options["reset"]).toLowerCase() === "true") {
                    console.log('reset')
                    this.update({
                        min: 0,
                        value: 0,
                        max: 100,
                        text: "",
                        subtext: 'Idle'
                    });
                    return;
                }
                if (options.hasOwnProperty("subtext")) {
                    elements.unavailableProgressText.text(options.subtext);
                }
                if (options.hasOwnProperty("text")) {
                    this.find('.label').text(options.text);
                }
                if (options.hasOwnProperty("min")) {
                    this.progressData.min = options.min;
                }
                if (options.hasOwnProperty("value")) {
                    this.progressData.value = options.value;
                }
                if (options.hasOwnProperty("max")) {
                    this.progressData.max = options.max;
                }

                const data = this.progressData;
                const percent = 100 * ((data.value - data.min) / (data.max - data.min));
                this.css('width', percent + "%");
            }
            controls.createdPlaylists = $("#createdPlaylists");
            controls.includeThumbs = $("#includeThumbs");
            elements.thumbProgress = $("#thumbProgress");

            controls.tagsTable = $("#tagsTable").DataTable({
                columns: [
                    {title: "Tag"},
                    {
                        title: "First used",
                        type: 'datetime',
                        className: "dt-nowrap"
                    },
                    {
                        title: "Last used",
                        type: 'datetime',
                        className: "dt-nowrap"
                    },
                    {
                        title: "Count",
                        type: "num",
                        className: "text-right dt-nowrap"
                    }
                ],
                columnDefs: [{
                    "defaultContent": "",
                    "targets": "_all"
                }, {
                    "width": "100%",
                    "targets": 0
                }],
                order: [[3, 'desc'], [0, 'asc']],
                lengthMenu: [[10, 25, 50, 100, 250, -1], [10, 25, 50, 100, 250, "All"]],
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
                lengthMenu: [[10, 25, 50, 100, 250, -1], [10, 25, 50, 100, 250, "All"]],
                deferRender: true,
                bDeferRender: true
            });
            controls.linksTable = $("#linksTable").DataTable({
                columns: [
                    {
                        title: "Link",
                        visible: true
                    },
                    {
                        title: "Link (hyper)",
                        visible: false,
                    },
                    {
                        title: "First used",
                        type: 'datetime',
                        className: "dt-nowrap"
                    },
                    {
                        title: "Last used",
                        type: 'datetime',
                        className: "dt-nowrap"
                    },
                    {
                        title: "Count",
                        type: "num",
                        className: "text-right dt-nowrap"
                    }
                ],
                columnDefs: [{
                    "defaultContent": "",
                    "targets": "_all"
                }, {
                    "width": "100%",
                    "className": "wrap",
                    "targets": [0, 1]
                }],
                order: [[4, 'desc'], [0, 'asc']],
                lengthMenu: [[10, 25, 50, 100, 250, -1], [10, 25, 50, 100, 250, "All"]],
                deferRender: true,
                bDeferRender: true
            });
            controls.offset = $("#offset");
            controls.offset.on('change', function () {
                loadChartData(controls.offset.val(), controls.year.val());
            });
            controls.year = $("#year");
            controls.year.on('change', function () {
                loadChartData(controls.offset.val(), controls.year.val());
            });
            const options = {
                series: [
                    {
                        name: 'Saturday',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Friday',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Thursday',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Wednesday',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Tuesday',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Monday',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Sunday',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ],
                xaxis: {
                    categories: [
                        "12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
                        "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"
                    ]
                },
                chart: {
                    height: 350,
                    type: 'heatmap',
                },
                dataLabels: {
                    enabled: false
                },
                colors: ["#008FFB"],
                title: {
                    text: 'Day and Time Frequency'
                },
                stroke: {
                    show: false
                },
                grid: {
                    show: false
                }
            };
            controls.uploadFrequency = new ApexCharts(document.querySelector("#uploadFrequency"), options);
            controls.uploadFrequency.render();
            controls.checkUnavailable = $("#checkUnavailable");

            const unavailableColumnsHtml = [];
            for (let i = 0; i < unavailableColumns.length; i++) {
                const column = unavailableColumns[i];

                unavailableColumnsHtml.push("<option value='" + i + "'" + (column.visible ? " selected" : "") + ">" +
                    column.title +
                    "</option>")
            }
            controls.unavailableTable = $("#unavailableTable").DataTable({
                columns: unavailableColumns,
                columnDefs: [{
                    "defaultContent": "",
                    "targets": "_all"
                }],
                order: [[3, 'asc']],
                lengthMenu: [[10, 25, 50, 100, 250, -1], [10, 25, 50, 100, 250, "All"]],
                deferRender: true,
                bDeferRender: true
            });
            controls.unavailableColumns = $("#unavailable-columns");
            controls.unavailableColumns.html(unavailableColumnsHtml.join(""));
            controls.unavailableColumns.multiselect({
                buttonClass: 'form-select',
                templates: {
                    button: '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
                },
                onChange: function (option, checked, select) {
                    external.toggleUnavailableColumn($(option).val())
                }
            });
            unavailableColumns.forEach(function (column) {
                if (column.hasOwnProperty("_visibleIf")) {
                    document.querySelector("button[title='" + column.title + "'] input").indeterminate = true;
                }
            })

            controls.otherTable = $("#otherTable").DataTable({
                columns: [
                    {title: "Statistic"},
                    {
                        title: "Value",
                        className: "text-right dt-nowrap"
                    }
                ],
                columnDefs: [{
                    "defaultContent": "",
                    "targets": "_all"
                }],
                order: [],
                lengthMenu: [[10, 25, 50, 100, 250, -1], [10, 25, 50, 100, 250, "All"]],
                deferRender: true,
                bDeferRender: true,
                pageLength: -1
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
            function checkTheme() {
                if (DarkMode.getColorScheme() === "dark") {
                    controls.uploadFrequency.updateOptions({
                        theme: {
                            mode: 'dark'
                        }
                    });
                } else {
                    controls.uploadFrequency.updateOptions({
                        theme: {
                            mode: 'light'
                        }
                    });
                }
            }

            controls.darkMode.change(function () {
                checkTheme();
            });
            checkTheme();

            controls.progress.update({reset: true});

            controls.inputValue.on('keypress', function (e) {
                if (e.originalEvent.code === "Enter") {
                    controls.btnSubmit.click();
                }
            });

            const submitKey = 'last-submit-metadata-bulk-date';

            function countdown(count) {
                $("#submit").addClass("loading").addClass("disabled")
                $("#submit .countdown").text(Math.trunc(count));

                setTimeout(function () {
                    if (count <= 1) {
                        $("#submit").removeClass("loading").removeClass("disabled");
                        canSubmit = true;
                    } else {
                        countdown(count - 1);
                    }
                }, 1000);
            }

            const lastSubmit = localStorage.getItem(submitKey);
            if (submitKey in localStorage && moment(lastSubmit).isValid() && moment().diff(lastSubmit) < 30000) {
                countdown((30000 - moment().diff(lastSubmit)) / 1000);
            } else {
                $("#submit").removeClass("loading").removeClass("disabled");
            }

            let canSubmit = true;
            controls.btnSubmit.on('click', function () {
                const lastSubmit = localStorage.getItem(submitKey);
                if (!canSubmit || (submitKey in localStorage && moment(lastSubmit).isValid() && moment().diff(lastSubmit) < 30000)) {
                    return;
                }
                canSubmit = false;
                localStorage.setItem(submitKey, moment())

                internal.reset();

                countdown(30);

                const value = controls.inputValue.val();

                const parsed = [];
                value.split(/[,\s]+/g).forEach(function (valuePart) {
                    parsed.push(shared.determineInput(valuePart.trim()));
                });
                if (parsed.length === 0) {
                    return;
                }

                const optionalCreatedPlaylists = controls.createdPlaylists.is(":checked") ? "&createdPlaylists=true" : "";
                const minifiedInput = [];
                parsed.forEach(function (input) {
                    if (input.type === "video_id" || input.type === "playlist_id" || input.type === "channel_id") {
                        minifiedInput.push(input.original);
                    } else {
                        minifiedInput.push(input.original);
                    }
                });
                controls.shareLink.val(location.origin + location.pathname + "?url=" + encodeURIComponent(minifiedInput.join(",")) + optionalCreatedPlaylists + "&submit=true");
                controls.shareLink.attr("disabled", false);

                controls.progress.update({
                    text: 'Indeterminate',
                    value: 100,
                    max: 100
                })

                processFromParsed(parsed);
            });

            controls.checkUnavailable.on('click', function () {
                controls.checkUnavailable.addClass("disabled");

                if (Object.keys(unavailableData).length <= 0) {
                    return;
                }

                controls.unavailableProgress.update({
                    text: '0 / ' + Object.keys(unavailableData).length,
                    subtext: 'Processing unavailable ids',
                    value: 0,
                    max: Object.keys(unavailableData).length
                });

                handleUnavailableVideos().then(function () {
                    controls.unavailableTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
                        const data = this.data();

                        const videoId = $(data[0]).text();
                        const video = unavailableData[videoId];

                        const filmotTitle = shared.idx(["filmot", "title"], video) || "<span style='color:gray'>No data</span>";
                        const filmotDesc = shared.idx(["filmot", "description"], video) || "";
                        const filmotAuthorName = shared.idx(["filmot", "channelname"], video);
                        const filmotAuthor = filmotAuthorName ?
                            "<a target='_blank' href='https://www.youtube.com/channel/" + shared.idx(["filmot", "channelid"], video) + "'>" + shared.idx(["filmot", "channelname"], video) + "</a>" : "";
                        const filmotUploadDate = shared.idx(["filmot", "uploaddate"], video) || "";
                        const duration = shared.idx(["filmot", "duration"], video) || -1;
                        const filmotDuration = duration === -1 ? "" : shared.formatDuration(moment.duration({seconds: duration}));
                        data[4] = filmotTitle;
                        data[5] = filmotAuthor;
                        data[6] = filmotUploadDate;
                        data[7] = {"display": filmotDuration, "num": duration};
                        data[8] = filmotDesc;

                        this.data(data).draw();
                    });

                    const about = [];
                    if (Object.keys(unavailableData).length) {
                        about.push(Object.keys(unavailableData).length + " unavailable");
                    }

                    controls.unavailableProgress.update({
                        text: unavailableProgressMessage(),
                        subtext: 'Done'
                    });
                });
            });

            function getImageBinaryCorsProxy(fileName, imageUrl, zip, delay, imageStatuses) {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        // CORS proxy workaround for downloading YouTube thumbnails in client-side app
                        // https://github.com/Rob--W/cors-anywhere/issues/301#issuecomment-962623118
                        console.log('Attempting to download image over CORS proxy (' + delay + ' ms start delay): ' + imageUrl);
                        const start = new Date();
                        JSZipUtils.getBinaryContent("https://cors-proxy-mw324.herokuapp.com/" + imageUrl, function (err, data) {
                            const ms = new Date() - start;

                            if (err) {
                                console.log('Failed ' + fileName + " (" + ms + "ms)");
                                console.warn("Could not get image: " + imageUrl)
                                console.warn(err);
                                imageStatuses[false] = imageStatuses[false] + 1 || 1;
                            } else {
                                console.log('Retrieved ' + fileName + " (" + ms + "ms)");
                                console.log("Creating " + fileName + "...");
                                zip.folder('thumbs').file(fileName, data, {binary: true});
                                imageStatuses[true] = imageStatuses[true] + 1 || 1;
                            }

                            elements.thumbProgress.text("(" + imageStatuses[true] + " downloaded / " + imageStatuses[false] + " failed)");

                            resolve();
                        });
                    }, delay);
                });
            }

            controls.btnExport.on('click', function () {
                const includeThumbs = controls.includeThumbs.is(":checked");
                const dateFormat = "YYYY-MM-DD";
                controls.btnExport.addClass("loading").addClass("disabled");

                const zip = new JSZip();
                console.log("Creating about.txt...")
                zip.file("about.txt",
                    "Downloaded by YouTube Metadata " + new Date().toLocaleString() + "\n\n" +
                    "URL: " + window.location + "\n\n" +
                    "Input: " + controls.inputValue.val() + "\n\n" +
                    "Created Playlists: " + controls.createdPlaylists.is(":checked")
                );

                console.log("Creating videos.json...")
                zip.file("videos.json", JSON.stringify(rawVideoData));

                console.log("Creating available.json...")
                zip.file("available.json", JSON.stringify(availableData));

                console.log("Creating channels.json...")
                const rawChannelData = [];
                for (let id in rawChannelMap) {
                    rawChannelData.push(rawChannelMap[id]);
                }
                zip.file("channels.json", JSON.stringify(rawChannelData));

                console.log("Creating playlists.json...")
                const rawPlaylistData = [];
                for (let id in rawPlaylistMap) {
                    rawPlaylistData.push(rawPlaylistMap[id]);
                }
                zip.file("playlists.json", JSON.stringify(rawPlaylistData));

                console.log("Creating unavailable.json...")
                zip.file("unavailable.json", JSON.stringify(unavailableData));

                console.log("Creating videos.csv...")
                zip.file("videos.csv", tableRows.join("\r\n"));

                console.log("Creating tags.csv...")
                const tagCsvRows = ["Tag\tCount\tFirst used\tFirst video\tLast used\tLast video"];
                for (let tag in tagsData) {
                    const tagData = tagsData[tag];
                    tagCsvRows.push(tag + "\t" + tagData.count + "\t" + tagData.firstUsed.format(dateFormat) + "\t" + tagData.firstVideo + "\t" + tagData.lastUsed.format(dateFormat) + "\t" + tagData.lastVideo);
                }
                zip.file("tags.csv", tagCsvRows.join("\r\n"));

                console.log("Creating geotags.csv...")
                const geotagCsvRows = ["Coords\tName(s)\tCount"];
                for (let geotag in geotagsData) {
                    const tag = geotagsData[geotag];
                    geotagCsvRows.push(geotag + "\t" + tag.names.join(", ") + "\t" + tag.count);
                }
                zip.file("geotags.csv", geotagCsvRows.join("\r\n"));

                console.log("Creating links.csv...")
                const linkCsvRows = ["Link\tCount\tFirst used\tFirst video\tLast used\tLast video"];
                for (let link in linksData) {
                    const linkData = linksData[link];
                    linkCsvRows.push(link + "\t" + linkData.count + "\t" + linkData.firstUsed.format(dateFormat) + "\t" + linkData.firstVideo + "\t" + linkData.lastUsed.format(dateFormat) + "\t" + linkData.lastVideo);
                }
                zip.file("links.csv", linkCsvRows.join("\r\n"));

                console.log("Creating frequency.csv...")
                const frequencyCsvRows = ["Weekday\t12AM\t1AM\t2AM\t3AM\t4AM\t5AM\t6AM\t7AM\t8AM\t9AM\t10AM\t11AM\t12PM\t1PM\t2PM\t3PM\t4PM\t5PM\t6PM\t7PM\t8PM\t9PM\t10PM\t11PM"];
                for (let row in chartData) {
                    const data = chartData[row];
                    frequencyCsvRows.push(row + "\t" + data.join("\t"));
                }
                zip.file("frequency.csv", frequencyCsvRows.join("\r\n"));

                console.log("Creating other.csv...")
                const otherCsvRows = ["Statistic\tValue"];
                for (let key in otherData) {
                    const row = otherData[key];
                    const statistic = row.text;
                    const rowValue = row.value;
                    const displayValue = Number(rowValue) === rowValue ? Number(rowValue).toLocaleString() : rowValue;
                    otherCsvRows.push(statistic + "\t" + displayValue);
                }
                zip.file("other.csv", otherCsvRows.join("\r\n"));

                const optionalImages = [];
                const imageStatuses = {true: 0, false: 0};
                if (includeThumbs) {
                    let delay = 0;
                    for (let i = 0; i < rawVideoData.length; i++) {
                        const video = rawVideoData[i];
                        const fileName = video.id + ".png";
                        const thumbs = shared.idx(["snippet", "thumbnails"], video) || {};
                        const thumbUrl = (thumbs.maxres || thumbs.high || thumbs.medium || thumbs.default || {url: null}).url;
                        if (thumbUrl) {
                            optionalImages.push(getImageBinaryCorsProxy(fileName, thumbUrl, zip, delay * 100, imageStatuses));
                        }
                        delay++;
                    }
                    for (let id in rawPlaylistMap) {
                        console.log(id);
                        const playlist = rawPlaylistMap[id];
                        const fileName = id + ".png";
                        const thumbs = shared.idx(["snippet", "thumbnails"], playlist) || {};
                        const thumbUrl = (thumbs.maxres || thumbs.high || thumbs.medium || thumbs.default || {url: null}).url;
                        if (thumbUrl) {
                            optionalImages.push(getImageBinaryCorsProxy(fileName, thumbUrl, zip, delay * 100, imageStatuses));
                        }
                        delay++;
                    }
                    for (let id in rawChannelMap) {
                        console.log(id);
                        const channel = rawChannelMap[id];
                        const fileName = id + ".png";
                        const thumbs = shared.idx(["snippet", "thumbnails"], channel) || {};
                        const thumbUrl = (thumbs.maxres || thumbs.high || thumbs.medium || thumbs.default || {url: null}).url;
                        if (thumbUrl) {
                            optionalImages.push(getImageBinaryCorsProxy(fileName, thumbUrl, zip, delay * 100, imageStatuses));
                        }
                        delay++;
                        const bannerFileName = id + "-banner.png";
                        const bannerUrl = shared.idx(["brandingSettings", "image", "bannerExternalUrl"], channel);
                        if (bannerUrl) {
                            optionalImages.push(getImageBinaryCorsProxy(bannerFileName, bannerUrl, zip, delay * 100, imageStatuses));
                        }
                        delay++;
                    }
                }

                Promise.all(optionalImages).then(function () {
                    const channelTitles = [];
                    rawVideoData.forEach(function (video) {
                        const channelTitle = shared.idx(["snippet", "channelTitle"], video)
                        if (channelTitles.indexOf(channelTitle) === -1) {
                            channelTitles.push(channelTitle);
                        }
                    });

                    console.log(channelTitles)
                    let hint = '';
                    if (channelTitles.length === 0) {
                        hint = ' (none)'
                    } else if (channelTitles.length === 1) {
                        hint = ' (' + channelTitles[0].substr(0, 15) + ")"
                    } else {
                        hint = ' (' + channelTitles[0].substr(0, 15) + " and " + (channelTitles.length - 1) + " others)"
                    }

                    const fileName = shared.safeFileName("bulk_metadata" + hint + ".zip");

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
                if (file) {
                    controls.inputValue.val(file.name);
                } else {
                    return;
                }

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

                internal.reset();
                controls.progress.update({
                    text: '',
                    subtext: 'Importing file',
                    value: 2,
                    max: 5
                });

                function loadZipFile(fileName, process, onfail) {
                    return new Promise(function (resolve, reject) {
                        console.log('loading ' + fileName);

                        JSZip.loadAsync(file).then(function (content) {
                            // if you return a promise in a "then", you will chain the two promises
                            return content.file(fileName).async("string");
                        }).then(function (text) {
                            process(text);

                            resolve();
                        }).catch(function (err) {
                            console.warn(err);
                            console.warn(fileName + ' not in imported file');
                            if (onfail) {
                                onfail()
                                reject()
                            } else {
                                resolve()
                            }
                        });
                    })
                }

                loadZipFile('available.json', function (text) {
                    availableData = JSON.parse(text);
                }).then(function () {
                    return Promise.all([
                        loadZipFile('unavailable.json', function (text) {
                            unavailableData = JSON.parse(text);
                        }),
                        loadZipFile('playlists.json', function (text) {
                            rawPlaylistMap = JSON.parse(text);
                        }),
                        loadZipFile('channels.json', function (text) {
                            const channels = JSON.parse(text);
                            if (Array.isArray(channels)) {
                                channels.forEach(function (channel) {
                                    rawChannelMap[channel.id] = channel;
                                })
                            } else {
                                rawChannelMap = channels;
                            }
                        }),
                        loadZipFile('videos.json', function (text) {
                            const rows = [];
                            (JSON.parse(text) || []).forEach(function (video) {
                                rows.push(loadVideo(video, true));
                            });

                            sliceLoad(rows, controls.videosTable);
                        }, function () {
                            controls.progress.update({
                                value: 0,
                                max: 5,
                                subtext: 'Import failed (no videos.json)'
                            });
                        })
                    ]);
                }).then(function () {
                    loadAggregateTables(function () {
                        controls.btnImport.removeClass("loading").removeClass("disabled");
                        controls.progress.update({
                            value: 5,
                            max: 5,
                            text: rows.length + " / " + rows.length
                        });
                    });

                    controls.progress.update({
                        value: 5,
                        max: 5,
                        text: doneProgressMessage(),
                        subtext: 'Import done'
                    });

                    controls.unavailableProgress.update({
                        value: 5,
                        max: 5,
                        text: unavailableProgressMessage(),
                        subtext: 'Import done'
                    });

                    controls.btnImport.removeClass("loading").removeClass("disabled");
                }).catch(function () {
                    controls.btnImport.removeClass("loading").removeClass("disabled");
                })
            }

            const query = shared.parseQuery(window.location.search);
            console.log(query);
            if (String(query["searchMode"]).toLowerCase() === "true") {
                elements.regularInput.attr("hidden", true);
                elements.searchInput.attr("hidden", false);
                $("#formatShare").hide();
            }
            const input = query.url || query.id;
            if (input) {
                controls.inputValue.val(decodeURIComponent(input));
            }
            if (String(query["createdPlaylists"]).toLowerCase() === "true") {
                controls.createdPlaylists.prop("checked", true);
            } else {
                controls.createdPlaylists.prop("checked", false);
            }
            if (String(query["submit"]).toLowerCase() === "true") {
                setTimeout(function () {
                    controls.btnSubmit.click();
                }, 500);
            }
        },
        reset: function () {
            controls.progress.update({reset: true});
            controls.progress.removeClass('error');
            controls.checkUnavailable.addClass("disabled");

            rows = [];
            tableRows = [csvHeaderRow.join("\t")];
            rawVideoData = [];
            availableData = {};
            rawChannelMap = {};
            rawPlaylistMap = {};
            failedData = {};
            controls.videosTable.clear();
            controls.videosTable.draw(false);

            columns.forEach(function (column) {
                const button = document.querySelector("button[title='" + column.title + "']");
                const input = document.querySelector("button[title='" + column.title + "'] input");

                // Reset still-indeterminate columns
                if (input.indeterminate === true && button.className.indexOf('active') !== -1) {
                    button.click();
                }
            });

            tagsData = {};
            controls.tagsTable.clear();
            controls.tagsTable.draw(false);

            geotagsData = {};
            controls.geotagsTable.clear();
            controls.geotagsTable.draw(false);

            linksData = {};
            controls.linksTable.clear();
            controls.linksTable.draw(false);

            unavailableData = {};
            playlistMap = {};
            controls.unavailableTable.clear();
            controls.unavailableTable.draw(false);

            unavailableColumns.forEach(function (column) {
                const button = document.querySelector("button[title='" + column.title + "']");
                const input = document.querySelector("button[title='" + column.title + "'] input");

                // Reset still-indeterminate columns
                if (input.indeterminate === true && button.className.indexOf('active') !== -1) {
                    button.click();
                }
            });

            controls.year.html("<option value='' selected>All years</option>")

            for (let key in otherData) {
                const row = otherData[key];
                if (row.hasOwnProperty('reset')) {
                    row.reset();
                } else {
                    row.value = 0;
                }
            }
            controls.otherTable.clear();
            controls.otherTable.draw(false);
        }
    }

    $(document).ready(internal.init);

    const external = {
        toggleResultsColumn(index) {
            const column = controls.videosTable.column(index);

            column.visible(!column.visible());
        },
        toggleLinksColumn(index) {
            console.log('toggle links ' + index)
            const column = controls.linksTable.column(index);

            column.visible(!column.visible());
        },
        toggleUnavailableColumn(index) {
            const column = controls.unavailableTable.column(index);

            column.visible(!column.visible());
        }
    }
    return external;
}());
