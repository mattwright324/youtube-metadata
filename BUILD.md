Build Documentation
=

### Setup

Get a copy of the repository

```
git clone https://github.com/mattwright324/youtube-metadata.git
```

Install Ruby (and gems jekyll and bundler) following the steps for your operating system

- https://jekyllrb.com/docs/installation/
    - Ruby+Devkit default settings
    - `gem install jekyll bundler`

In CMD or terminal, cd to the project directory you cloned to and run `bundle install` to install necessary gems 
for github-pages in the project Gemfile (this may take some time).

### Build and Run

In CMD or terminal, cd to the project directory you cloned to and run `bundle exec jekyll serve`
 and you can view a live version at http://localhost:4000

Update the application with any editor you prefer (WebStorm, VSCode, Notepad++, etc.), Jekyll works such that edits to files
made while it is running will be picked up and published only needing you to refresh the browser instance to see them.

*Note: My YouTube API key provided in the application is restricted only to `https://mattw.io/*`, `http://localhost:4000/*`, and `http://127.0.0.1:4000/*`.
Access should work for all local development. Please do not abuse it such that it uses up the daily quota.*

### Deployment note

If you are planning to deploy your own version of this application on another domain you will need your own YouTube and Maps API keys.

- https://console.cloud.google.com/apis/dashboard
- https://developers.google.com/youtube/v3/getting-started
- https://console.cloud.google.com/google/maps-apis/start

You can replace the YouTube API key in `youtube-api-v3.js` and replace the final line as such:

```js
youtube.setDefaultKey('AIzaSy...');
```

You can replace the Maps API key in `youtube-metadata.js` by searching for `maps.googleapis.com`.

It will also be important to note that the current YouTube API quota for new project keys is 10,000 units per day and may not be enough for your desired usage or if you plan to share your version.
My keys were lucky enough to be grandfathered in when the default quota limit was 1,000,000 units per day.
There is a process to request for more quota, however I have had not luck with it in the past.

- https://developers.google.com/youtube/v3/determine_quota_cost
- https://support.google.com/youtube/contact/yt_api_form
