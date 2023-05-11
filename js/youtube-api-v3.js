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

    function makeStr(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    const tempId = localStorage.getItem("tempId") || makeStr(40);
    localStorage.setItem("tempId", tempId);

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
                    data: $.extend({key: currentKey, quotaUser: tempId}, data),
                    dataType: "json",
                    type: "GET",
                    timeout: 5000,
                    url: "https://www.googleapis.com/youtube/v3/" + type
                });
            }
        }
    };
}($));
youtube.setDefaultKey(atob('QUl6YVN5QVNUTVFjay1qdHRGOHF5OXJ0RW50MUh5RVl3NUFtaEU4'));
