/**
 * YouTube API v3
 * Reference documentation:
 * https://developers.google.com/youtube/v3/docs/
 *
 * youtube.ajax("videos", {
 *     part: 'snippet'
 * }).done(function (res) {
 *
 * }).fail(function (err) {
 *
 * });
 *
 * @requires jquery
 * @author mattwright324
 */
const youtube = (function ($) {
    'use strict';

    let defaultKey = "";
    let currentKey = "";

    return {
        setDefaultKey: function (key) {
            defaultKey = key;
            this.setKey(key);
        },
        getDefaultKey: function () {
            return defaultKey;
        },
        setKey: function (key) {
            if (defaultKey === "") {
                this.setDefaultKey(key);
            }
            currentKey = key;
        },
        getKey: function () {
            return currentKey;
        },
        ajax: function (type, data) {
            if (!defaultKey && defaultKey === "" && !currentKey && currentKey === "") {
                console.error("YouTube API Key Missing");
            } else {
                return $.ajax({
                    cache: false,
                    data: $.extend({key: currentKey}, data),
                    dataType: "json",
                    type: "GET",
                    timeout: 5000,
                    url: "https://www.googleapis.com/youtube/v3/" + type
                });
            }
        }
    };
}($));
youtube.setDefaultKey("AIzaSyCGWanOEMEgdHqsxNDaa_ZXTZ6hoYQrnAI");