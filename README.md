# plaster
A Desktop App for Making Great Podcasts

## Why Plaster?

In 2016, it remains too difficult to make a podcast and self-publish it. There are already great options for sites that will host podcasts for you. Plaster is for when you just want to host the static files yourself.

## What Plaster Does

- Creates an rss feed from form inputs that is standards-compliant (escapes ampersands, etc.)
- Encodes audio files to mp3, normalizing to the best-practice loudness level of -18LUFS
- Syncs with static hosting environments via rsync and S3

## What Plaster Does Not Do

- Provide any functionality for editing of audio files
- Submit the finished podcast to directories like iTunes
- Set up the web hosting environment

## Building

Creating a local build of Plaster requires Node and NPM to be installed globally. FFMPEG must also be compiled with --enable-libebur128 and placed in the `app/compiled` folder.

## Contributing

Contributions are welcome! I'd love to hear any ideas for how Plaster could be more useful as well as about any bugs or unclear documentation. If you are at all interested in this project, please reach out.
