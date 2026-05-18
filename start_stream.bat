@echo off
setlocal

:: ─────────────────────────────────────────────
::  DUST Stream Script
::  Captures the screen and pushes to the
::  mediamtx server running on the mission PC.
::
::  REQUIREMENTS:
::    - FFmpeg must be installed and on PATH
::      Download: https://ffmpeg.org/download.html
::
::  EDIT THESE IF NEEDED:
:: ─────────────────────────────────────────────

:: IP address of the machine running mediamtx (the server/frontend PC)
set SERVER_IP=192.168.4.230

:: RTMP port (mediamtx default is 1935)
set SERVER_PORT=1935

:: Stream key (must match mediamtx path config)
set STREAM_KEY=live/dust

:: Capture framerate
set FRAMERATE=30

:: Video bitrate (increase for better quality, lower for less bandwidth)
set BITRATE=4000k

:: Which monitor to capture (0 = primary, 1 = second monitor, etc.)
set MONITOR=0

:: ─────────────────────────────────────────────
::  Check FFmpeg is available
:: ─────────────────────────────────────────────

where ffmpeg >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  ERROR: FFmpeg not found on PATH.
    echo  Download it from https://ffmpeg.org/download.html
    echo  and add it to your system PATH, then try again.
    echo.
    pause
    exit /b 1
)

:: ─────────────────────────────────────────────
::  Start stream
:: ─────────────────────────────────────────────

echo.
echo  Starting DUST stream...
echo  Sending to: rtmp://%SERVER_IP%:%SERVER_PORT%/%STREAM_KEY%
echo  Framerate:  %FRAMERATE% fps
echo  Bitrate:    %BITRATE%
echo  Monitor:    %MONITOR%
echo.
echo  Press Ctrl+C to stop streaming.
echo.

ffmpeg ^
  -f gdigrab ^
  -framerate %FRAMERATE% ^
  -offset_x 0 -offset_y 0 ^
  -video_size 1920x1080 ^
  -draw_mouse 0 ^
  -i desktop ^
  -vf "scale=1920:1080" ^
  -vcodec libx264 ^
  -preset ultrafast ^
  -tune zerolatency ^
  -b:v %BITRATE% ^
  -maxrate %BITRATE% ^
  -bufsize 2000k ^
  -pix_fmt yuv420p ^
  -g %FRAMERATE% ^
  -f flv ^
  rtmp://%SERVER_IP%:%SERVER_PORT%/%STREAM_KEY%

:: If FFmpeg exits unexpectedly, pause so the user can see the error
if %errorlevel% neq 0 (
    echo.
    echo  Stream stopped unexpectedly ^(exit code %errorlevel%^).
    echo  Check the output above for errors.
    echo.
    pause
)