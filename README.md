# yt-timedtext-to-srt
convert and download youtube timedtext json (subtitles/captions) to srt file

Steps to download captions including auto-generated captions from youtube as a SRT file:  
  
* Get the `timedtext` for the youtube video 
    - Open the youtube video and right click -> choose inspect  
    - Select the network tab
    - Play the video & toggle ON the CC button (or go to video settings and choose the subtitles)  
    - Try filtering for `timedtext` in the network tab  
    - Open the `timedtext` in a new tab & right click -> save file  
  
    ![Screenshot](https://github.com/nuhman/yt-timedtext-srt/blob/master/screenshots/timedtext-demo.png "Fetch timedtext file by clicking on 'open in new tab'")  
  
* Once you have the `timedtext.json` file downloaded, Go to https://nuhman.github.io/yt-timedtext-to-srt/ and upload the file  
* After the file is processed, SRT file will be downloaded to your local machine  
