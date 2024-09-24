---
title: "Live streaming a DJI drone"
date: 2024-09-24 08:19:00
---

# {{ $frontmatter.title }}

Here's the easiest way I could get my DJI drone live streaming. At the end of this you'll have an RTMP server
to point your drone to and an RTSP/SRT server to connect for downstream consumers.

## Step 1: Install mediamtx

[mediamtx](https://github.com/bluenviron/mediamtx.git) is a Golang streaming server. You can download a pre-built version or
build your own like this:

```bash
git clone git@github.com:bluenviron/mediamtx.git
cd mediamtx
go generate ./...
go install .
```

If you get an error about `hls.min.js` you skipped the `go generate ./...` step. [It's a common mistake](https://github.com/bluenviron/mediamtx/issues/3097)
that I also ran into.

This will install a mediamtx binary on your system with sane defaults.

## Step 2: Get your local IP address

This is up to you to figure out. `ifconfig`, `ipconfig --all`, or whatever works on your platform.

## Step 3: Start mediamtx

Just run `mediamtx`. It will start listening for lots of protocols. You can lock this down later if you want.

## Step 4: Configure RTMP in DJI Fly

Start up your drone and connect to it with DJI Fly. Then hit the `...` menu in the corner, go to `Transmission`, click
`Live streaming platforms`. [AirHub has a video on this if you want a visual](https://airhub.app/helpcenter/set-up-rtmp-stream-for-the-dji-fly-app).

Set the RTMP URL to: `rtmp://YOUR_IP_ADDRESS:1935/drone`

Make sure `YOUR_IP_ADDRESS` is the IP address you got from step 2, not that actual string.

Select whatever quality and bitrate you want (1080 or 720, 2 Mbps or 1 Mbps) and press `Start`.

If it worked you should see a few messages like this in the mediamtx console output:

```
2024/09/24 08:15:56 INF [RTMP] [conn 172.12.8.55:61052] opened
2024/09/24 08:15:56 INF [RTMP] [conn 172.12.8.55:61052] is publishing to path 'drone', 1 track (MPEG-4 Audio)
2024/09/24 08:15:57 INF [RTMP] [conn 172.12.8.55:61052] closed: received a video packet, but track is not set up
2024/09/24 08:15:57 INF [RTMP] [conn 172.12.8.55:61054] opened
2024/09/24 08:15:58 INF [RTMP] [conn 172.12.8.55:61054] is publishing to path 'drone', 2 tracks (H264, MPEG-4 Audio)
```

## Step 5: Connect via RTSP/SRT

Your stream is now available via RTSP, SRT, and other protocols.

If you want to use RTSP, and you've set your stream up as `drone` then the RTSP URL will be `rtsp://YOUR_IP_ADDRESS:8554/drone`.
And again, switch out your real IP address in there.

If you want to use SRT, and you've set your stream up as `drone` then the SRT stream ID will be `read:drone` and the port
will be 8890. The IP address will be your IP address from step 2.

## Troubleshooting

If you can't connect and you just want to verify that your streaming setup works do the following:

- Find any MP4 video that is a few minutes long
- Run this command

```bash
ffmpeg -re -i VIDEO.MP4 -c:v copy -c:a copy -f flv rtmp://YOUR_IP_ADDRESS:1935/drone
```

Replace the video file name and your IP address again.

This will start streaming the MP4 file to your mediamtx server. If ffmpeg fails immediately then likely issues are:

- Your IP address is incorrect
- mediamtx is not running
- Something is blocking mediamtx from receiving inbound connections
- The device running DJI Fly is not on the same network as the system running mediamtx

If that works then try connecting to your stream with VLC with the RTSP URL and see if that works. If VLC fails then
the likely issues are:

- Something is blocking mediamtx from receiving inbound connections
- The video file is in a format it can't understand
- Your video file already ended and you'll need to restart it and try again
