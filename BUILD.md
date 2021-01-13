Build Documentation
=

### Building youtube-metadata
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

### Running youtube-metadata

In CMD or terminal, cd to the project directory you cloned to and run `bundle exec jekyll serve`
 and you can view a live version at http://localhost:4000

Update the application with any editor you prefer (WebStorm, VSCode, Notepad++, etc.), Jekyll works such that edits to files
made while it is running will be picked up and published only needing you to refresh the browser instance to see them.

*Note: My YouTube API key provided in the application is restricted only to `https://mattw.io/*`, `http://localhost:4000/*`, and `http://127.0.0.1:4000/*`.
Access should work for all local development. Please do not abuse it such that it uses up the daily quota.*
