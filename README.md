# YouTube Metadata
A quick way to gather all the metadata about a video, playlist, or channel from the YouTube API.

- https://mattw.io/youtube-metadata/

What's unique about this tool? How can you use it?

1. If you're just curious about a video, playlist, or channel!
    - How long has the channel or playlist been around?
    - What's the like/dislike ratio?
    - What can YouTube tell you?
2. Use it for investigative purposes, OSINT.
    - Tells you what it found **and** what it didn't find.
    - Exact date and times for video publish and playlist/channel creation
    - Auto-translations for BCP-47 country and language codes
    - Livestream date and times; actual runtime and how late/early it started
    - Geolocation with direct link to Google Maps
    - Time difference between actual publish date and video recording date
    - Reverse image search for a video's default 4 thumbnails
    - Whether the video is aimed at children or not
    - Channel long uploads status
    - Tags present on a video
3. Gives helpful suggestions if a link doesn't work
    - Google search for the id
    - Archive.org for the link
    - YouTubeRecover.com for the video id
    - SocialBlade.com for the channel username

### Building

Refer to [BUILD.md](https://github.com/mattwright324/youtube-metadata/blob/master/BUILD.md)
for instructions on how to build and run `youtube-geofind` from source.

### Contributing

Contributions are welcome, refer to [CONTRIBUTING.md](https://github.com/mattwright324/youtube-metadata/blob/master/CONTRIBUTING.md)
for more detail.
