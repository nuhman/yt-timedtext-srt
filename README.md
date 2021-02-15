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
  
* Once you have the `timedtext.json` file downloaded, Go to https://nuhman.github.io/yt-timedtext-srt/ and upload the file  
* After the file is processed, SRT file will be downloaded to your local machine  
  
  
<i>Tip: </i><span style="font-size:10px">In the timedtext URL add a new URL query parameter `tlang` with language code (eg.: es, ml, ko etc.) as the value  into which you want the CC to be translated to.</span>  
<span>Sample URL looks like <a href="https://www.youtube.com/api/timedtext?v=WYijIV5JrKg&asr_langs=de%2Cen%2Ces%2Cfr%2Cit%2Cja%2Cko%2Cnl%2Cpt%2Cru&caps=asr&exp=xftt&xorp=true&xoaf=5&hl=en&ip=0.0.0.0&ipbits=0&expire=1613403337&sparams=ip%2Cipbits%2Cexpire%2Cv%2Casr_langs%2Ccaps%2Cexp%2Cxorp%2Cxoaf&signature=5695DB8C859D9BAE57086F7E254AF8EC468E293F.6298CAF263F431EB1BEF8B33DA1B1DB58B7DB100&key=yt8&lang=es-419&fmt=json3&xorb=2&xobt=3&xovt=3&tlang=en" target="_blank">this</a> (may be expired by now). Change `tlang` parameter to `ml` for example to convert CC into 'Malayalam' language.  
  