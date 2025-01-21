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

    const hourMs = 60 * 60 * 1000;
    const dayMs = hourMs * 24;
    const timeMs = {
        "hour-1": hourMs,
        "hour-3": hourMs * 3,
        "hour-6": hourMs * 6,
        "hour-12": hourMs * 12,
        "hour-24": dayMs,
        "day-7": dayMs * 7,
        "day-30": dayMs * 30,
        "day-90": dayMs * 90,
        "day-180": dayMs * 180,
        "day-365": dayMs * 365,
        "year": dayMs * 365
    };

    const delaySubmitKey = "delaySubmitSearch";
    const can = {
        submit: true,
    };

    const RFC_3339 = 'YYYY-MM-DDTHH:mm:ss';

    const apiNextPageMs = 600;
    const delay15Sec = 15;
    const delay15SecMs = delay15Sec * 1000;

    let shareUrls = [];
    let absoluteShareUrls = [];

    function countdown(key, control, delay, flag) {
        control.addClass("loading").addClass("disabled");
        can[flag] = false;

        let value = localStorage.getItem(key);
        if (!moment(value).isValid()) {
            console.warn('value for %s was not a valid date, resetting to now', key);
            localStorage.setItem(key, moment().format());
            value = localStorage.getItem(key);
        }
        if (moment(value).isAfter(moment())) {
            console.warn('value for %s was set in the future, resetting to now', key);
            localStorage.setItem(key, moment().format());
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

    function doneProgressMessage() {
        const about = [];
        if (rawVideoData.length) {
            about.push(rawVideoData.length + " video(s)");
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

    function processSearch() {
        const videoIds = [];

        console.log('Submit');

        // if (controls.checkClearResults.is(":checked")) {
        //     clearResults();
        // }
        // updateSearchShareLink(true);

        const params = {
            part: "id",
            maxResults: 50,
            type: "video",
            q: controls.keywordsInput.val(),
            timeframe: controls.comboTimeframe.find(":selected").val(),
            safeSearch: controls.comboSafeSearch.find(":selected").val(),
            order: controls.comboSortBy.find(":selected").val(),
            videoDuration: controls.comboDuration.find(":selected").val(),
        };
        if (params.timeframe !== 'any') {
            let dateFrom = new Date();
            let dateTo = new Date();

            if (params.timeframe === "custom") {
                dateFrom = new Date(controls.dateFromInput.val());
                dateTo = new Date(controls.dateToInput.val());
            } else {
                dateFrom.setTime(dateTo.getTime() - timeMs[params.timeframe]);
            }

            params.publishedAfter = dateFrom.toISOString();
            params.publishedBefore = dateTo.toISOString();

            delete params.timeframe;
        }
        const lang = controls.comboRelevanceLang.find(":selected").val();
        if (lang !== 'any') {
            params.relevanceLanguage = lang;
        }
        if (controls.checkLive.is(":checked")) {
            params.eventType = "live";
        }
        if (controls.checkCC.is(":checked")) {
            params.videoLicense = "creativecommon";
        }
        if (controls.checkHQ.is(":checked")) {
            params.videoDefinition = "high";
        }
        if (controls.checkDimension3d.is(":checked")) {
            params.videoDimension = "3d";
        }
        if (controls.checkPaidProduct.is(":checked")) {
            params.videoPaidProductPlacement = "true";
        }

        let maxPages = Number(controls.comboPageLimit.find(":selected").val());
        if (!Number.isInteger(maxPages) || maxPages < 1) {
            maxPages = 1;
        }
        if (maxPages > 5) {
            maxPages = 5;
        }

        console.log("maxPages=%s params=%s", maxPages, JSON.stringify(params));

        controls.progress.update({
            value: 1,
            max: 1,
            text: '0',
            subtext: 'Searching'
        });

        handleSearch(maxPages, params).then(function (videoIds) {
            return handleVideoIds(videoIds);
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

            controls.videosTable.columns.adjust().draw(false);
        }).then(function () {
            controls.progress.update({
                text: doneProgressMessage(),
                subtext: 'Done' + (Object.keys(failedData).length ? ' (with errors). Check browser console.' : '')
            });

            console.log(failedData)

            setTimeout(loadAggregateTables, 200);
        }).catch(function (err) {
            console.error(err);
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
                    setTimeout(resolve, apiNextPageMs);
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

                    setTimeout(function () {
                        get(index + slice, slice);
                    }, apiNextPageMs);
                }).fail(function (err) {
                    console.error(err);
                    setTimeout(function () {
                        get(index + slice, slice);
                    }, apiNextPageMs);
                });
            }

            setTimeout(function () {get(0, 50);}, apiNextPageMs);
        });
    }


    const defaultParams = {
        radius: 25,
        pages: 3,
        keywords: '',
        timeframe: 'any',
        duration: 'any',
        safeSearch: 'moderate',
        relevanceLanguage: 'any',
        sort: 'date',
        live: false,
        creativeCommons: false,
        hq: false,
        "3d": false
    }
    function buildShareLink(absolute) {
        const params = {};
        params["keywords"] = controls.keywordsInput.val();
        params["timeframe"] = controls.comboTimeframe.find(":selected").val();
        if (params.timeframe !== "any") {
            let dateFrom = new Date();
            let dateTo = new Date();

            if (params.timeframe === "custom") {
                dateFrom = new Date(controls.dateFromInput.val());
                dateTo = new Date(controls.dateToInput.val());
            } else {
                dateFrom.setTime(dateTo.getTime() - timeMs[params.timeframe]);
            }

            params["start"] = dateFrom.toISOString();
            params["end"] = dateTo.toISOString();
        }
        const lang = controls.comboRelevanceLang.find(":selected").val();
        if (lang !== 'any') {
            params["relevanceLanguage"] = lang;
        }
        params["safeSearch"] = controls.comboSafeSearch.find(":selected").val();
        params["sort"] = controls.comboSortBy.find(":selected").val();
        params["duration"] = controls.comboDuration.find(":selected").val();
        let pages = Number(controls.comboPageLimit.find(":selected").val());
        if (!Number.isInteger(pages) || pages < 1) {
            pages = 1;
        }
        if (pages > 5) {
            pages = 5;
        }
        params["pages"] = pages;
        if (controls.checkLive.is(":checked")) {
            params["live"] = true;
        }
        if (controls.checkCC.is(":checked")) {
            params["creativeCommons"] = true;
        }
        if (controls.checkHQ.is(":checked")) {
            params["hq"] = true;
        }
        if (controls.checkDimension3d.is(":checked")) {
            params["3d"] = true;
        }
        if (controls.checkPaidProduct.is(":checked")) {
            params["paidProduct"] = true;
        }

        if (params.hasOwnProperty("timeframe")) {
            if (!absolute && params.timeframe !== 'custom') {
                // relative time should not show calculated timestamps
                delete params["start"];
                delete params["end"];
            } else if (absolute && params.timeframe !== 'any' && params.timeframe !== 'custom') {
                params["timeframeWas"] = params.timeframe;
                params.timeframe = "custom";
            }
        }

        const linkParams = [];
        for (let key in params) {
            if (defaultParams.hasOwnProperty(key) && defaultParams[key] === params[key]) {
                continue;
            }
            linkParams.push(key + "=" + encodeURIComponent(params[key]));
        }
        linkParams.push("submit=true");

        return location.origin + location.pathname + "?" + linkParams.join("&").replace("%2C", ",");
    }

    function updateSearchShareLink(pushLinks) {
        const absolute = controls.checkAbsoluteTimeframe.is(":checked");

        if (pushLinks) {
            const share = buildShareLink(false);
            shareUrls.push(share);
            const shareAbsolute = buildShareLink(true);
            if (share !== shareAbsolute) {
                absoluteShareUrls.push(shareAbsolute);
            }
        }

        controls.shareLink.val(buildShareLink(absolute));
        controls.shareLink.attr("disabled", false);
    }

    function handleSearch(maxPages, queryParams) {
        return new Promise(function (resolve) {
            const results = [];

            function doSearch(page, token) {
                console.log("page " + page);

                youtube.ajax("search", $.extend({pageToken: token}, queryParams)).done(function (res) {
                    console.log(res);

                    (res.items || []).forEach(function (item) {
                        const videoId = item?.id?.videoId;
                        if (videoId && results.indexOf(videoId) === -1) {
                            results.push(videoId);
                        }
                    });

                    controls.progress.update({
                        value: 1,
                        max: 1,
                        text: results.length,
                        subtext: 'Searching'
                    });

                    if (res.hasOwnProperty("nextPageToken") && page < maxPages) {
                        setTimeout(function () {
                            doSearch(page + 1, res.nextPageToken);
                        }, apiNextPageMs);
                    } else {
                        resolve(results);
                    }
                }).fail(function (err) {
                    console.log(err);
                    resolve(results);
                });
            }

            doSearch(1, "");
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
                    setTimeout(resolve, apiNextPageMs);
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
                            "contentDetails,topicDetails,paidProductPlacementDetails",
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
                            }, apiNextPageMs);
                        } catch (error) {
                            controls.progress.addClass('error');
                            console.error(error);
                            const reason = JSON.stringify(error, null, 0);
                            for (let i = 0; i < ids.length; i++) {
                                failedData[ids[i]] = {reason: reason}
                            }
                            setTimeout(function () {
                                get(index + slice, slice);
                            }, apiNextPageMs);
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
                        }, apiNextPageMs);
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

            setTimeout(function () {get(0, 50);}, apiNextPageMs);
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
                data: [0, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
            title: "Thumb",
            type: "html",
            visible: false,
            _idx: ["snippet", "thumbnails", "default", "url"],
            valueMod: function (value, video) {
                return "<a target='_blank' href='https://youtu.be/" + video.id + "'>" +
                    "<img src='" + value + "' style='width:120px;' alt='video thumb small' loading='lazy'>" +
                    "</a>"
            }
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
            title: "Paid Promotion",
            visible: false,
            _visibleIf: function (value) {
                return value;
            },
            _idx: ["paidProductPlacementDetails", "hasPaidProductPlacement"]
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
        isPaidProductPlacement: {
            text: "Videos with hasPaidProductPlacement=true",
            value: 0,
            check: function (video) {
                const stat = shared.idx(["paidProductPlacementDetails", "hasPaidProductPlacement"], video);
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

            controls.videosTable = new DataTable("#videosTable", {
                columns: columns,
                columnDefs: [{
                    "defaultContent": "",
                    "targets": "_all"
                }],
                order: [[9, 'desc']],
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

            controls.createdPlaylists = $("#createdPlaylists");
            controls.includeThumbs = $("#includeThumbs");
            elements.thumbProgress = $("#thumbProgress");

            controls.tagsTable = new DataTable("#tagsTable", {
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
            controls.geotagsTable = new DataTable("#geotagsTable", {
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
            controls.linksTable = new DataTable("#linksTable", {
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
                    background: "transparent"
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

            controls.otherTable = $("#otherTable").DataTable({
                columns: [
                    {title: "Statistic"},
                    {
                        title: "Value",
                        className: "dt-left dt-nowrap"
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

            controls.channelInput = $("#channels");
            controls.keywordsInput = $("#keywords");
            controls.btnRandomKeywords = $("#randomTopic");
            controls.comboTimeframe = $("#timeframe");
            elements.customRangeDiv = $(".customRange");
            controls.dateFromInput = $("#dateFrom");
            controls.dateToInput = $("#dateTo");
            controls.comboSortBy = $("#sortBy");
            controls.comboRelevanceLang = $("#relevanceLanguage");
            controls.comboSafeSearch = $("#safeSearch");
            controls.comboDuration = $("#videoDuration");
            controls.comboPageLimit = $("#pageLimit");
            controls.checkLive = $("#liveOnly");
            controls.checkCC = $("#creativeCommons");
            controls.checkHQ = $("#highQuality");
            controls.checkDimension3d = $("#dimension3d");
            controls.checkPaidProduct = $("#paidProduct");
            controls.checkClearResults = $("#clearOnSearch");
            controls.checkAbsoluteTimeframe = $("#absoluteTimeframe");

            controls.btnExport = $("#export");
            controls.btnImport = $("#import");
            controls.importFileChooser = $("#importFileChooser");

            controls.comboTimeframe.change(function () {
                const value = controls.comboTimeframe.find(":selected").val();

                if (value === "custom") {
                    elements.customRangeDiv.show();
                } else {
                    elements.customRangeDiv.hide();
                }
            });
            controls.dateToInput.val(moment().format('yyyy-MM-DDT23:59'));

            controls.checkAbsoluteTimeframe.change(function () {
                if (controls.shareLink.val().length) {
                    updateSearchShareLink(false);
                }
            });

            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            })

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
                if (controls.darkMode.is(":checked")) {
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

            countdownCheck(delaySubmitKey, controls.btnSubmit, delay15SecMs, "submit");

            controls.btnRandomKeywords.click(function () {
                controls.keywordsInput.val(shared.randomFromList(TOPICS));
            });

            controls.btnSubmit.on('click', function () {
                if (!can.submit) {
                    return;
                }
                localStorage.setItem(delaySubmitKey, moment().format());
                countdownCheck(delaySubmitKey, controls.btnSubmit, delay15SecMs, "submit");

                if (controls.checkClearResults.is(":checked")) {
                    internal.reset();
                }
                updateSearchShareLink(true);

                controls.progress.update({
                    text: 'Indeterminate',
                    value: 100,
                    max: 100
                });

                processSearch();
            });

            function getImageBinaryCorsProxy(fileName, imageUrl, zip, delay, imageStatuses) {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        // CORS proxy workaround for downloading YouTube thumbnails in client-side app
                        // https://github.com/Rob--W/cors-anywhere/issues/301#issuecomment-962623118
                        console.log('Attempting to download image over CORS proxy (' + delay + ' ms start delay): ' + imageUrl);
                        const start = new Date();
                        JSZipUtils.getBinaryContent("https://cors.apps.mattw.io/" + imageUrl, function (err, data) {
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
                    (shareUrls.length > 0 ? "Share url(s): " + JSON.stringify(shareUrls, null, 4) + "\n\n"
                        : "") +
                    (absoluteShareUrls.length > 0 ?
                        "Share url(s) absolute timeframe: " + JSON.stringify(absoluteShareUrls, null, 4)
                        : "")
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

                    const fileName = shared.safeFileName("search_metadata" + hint + ".zip");

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

                    controls.btnImport.removeClass("loading").removeClass("disabled");
                }).catch(function () {
                    controls.btnImport.removeClass("loading").removeClass("disabled");
                })
            }

            const parsedQuery = shared.parseQuery(window.location.search);
            if (parsedQuery.keywords && controls.keywordsInput.length) {
                controls.keywordsInput.val(parsedQuery.keywords);
            }
            if (parsedQuery.safeSearch && controls.comboSafeSearch.length) {
                controls.comboSafeSearch.val(parsedQuery.safeSearch);
                controls.comboSafeSearch.trigger('change');
            }
            if (parsedQuery.relevanceLanguage && controls.comboRelevanceLang.length) {
                controls.comboRelevanceLang.val(parsedQuery.relevanceLanguage);
                controls.comboRelevanceLang.trigger('change');
            }
            if (parsedQuery.sort && controls.comboSortBy.length) {
                controls.comboSortBy.val(parsedQuery.sort);
                controls.comboSortBy.trigger('change');
            }
            if (parsedQuery.duration && controls.comboDuration.length) {
                controls.comboDuration.val(parsedQuery.duration);
                controls.comboDuration.trigger('change');
            }
            if (parsedQuery.timeframe && $("#timeframe option[value='" + parsedQuery.timeframe + "']").length) {
                controls.comboTimeframe.val(parsedQuery.timeframe);
                controls.comboTimeframe.trigger('change');
            }
            const rfcStart = moment(parsedQuery.start).utcOffset(0, true).format(RFC_3339);
            if (parsedQuery.start && controls.comboTimeframe.length) {
                controls.dateFromInput.val(rfcStart);
            }
            const rfcEnd = moment(parsedQuery.end).utcOffset(0, true).format(RFC_3339);
            if (parsedQuery.end && controls.comboTimeframe.length) {
                controls.dateToInput.val(rfcEnd);
            }
            if (parsedQuery.live && controls.checkLive.length) {
                controls.checkLive.prop("checked", parsedQuery.live === "true");
            }
            if (parsedQuery.creativeCommons && controls.checkCC.length) {
                controls.checkCC.prop("checked", parsedQuery.creativeCommons === "true");
            }
            if (parsedQuery.hq && controls.checkHQ.length) {
                controls.checkHQ.prop("checked", parsedQuery.hq === "true");
            }
            if (parsedQuery["3d"] && controls.checkDimension3d.length) {
                controls.checkDimension3d.prop("checked", parsedQuery["3d"] === "true");
            }
            if (parsedQuery["paidProduct"] && controls.checkPaidProduct.length) {
                controls.checkPaidProduct.prop("checked", parsedQuery["paidProduct"] === "true");
            }
            if (parsedQuery.pages && controls.comboPageLimit.length) {
                controls.comboPageLimit.val(parsedQuery.pages);
                controls.comboPageLimit.trigger('change');
            }
            if (String(parsedQuery["submit"]).toLowerCase() === "true") {
                setTimeout(function () {
                    controls.btnSubmit.click();
                }, 500);
            }
        },
        reset: function () {
            controls.progress.update({reset: true});
            controls.progress.removeClass('error');

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
        }
    }
    return external;
}());
