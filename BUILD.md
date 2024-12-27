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

### API Keys

If you are planning to deploy your own version of this application on another domain or just to run it locally you will need your own YouTube and Maps API keys.

- https://console.cloud.google.com/apis/dashboard
- https://developers.google.com/youtube/v3/getting-started
- https://console.cloud.google.com/google/maps-apis/start

You can replace the YouTube API key in `youtube-api-v3.js` and replace the final lines as such:

```js
youtube.setBaseUrl('https://www.googleapis.com/youtube/v3/')
youtube.setDefaultKey('AIzaSy...');
```

You can replace the Maps API key in `youtube-metadata.js` by searching for `maps.googleapis.com`.

It will also be important to note that the current YouTube API quota for new project keys is 10,000 units per day and may not be enough for your desired usage or if you plan to share your version.
There is a process to request for more quota, however I have had not luck with it in the past.

- https://developers.google.com/youtube/v3/determine_quota_cost
- https://support.google.com/youtube/contact/yt_api_form
