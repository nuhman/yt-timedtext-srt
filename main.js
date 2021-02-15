const readFile = (file) => {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.onload = x=> resolve(fr.result);
      fr.readAsText(file);
    });
}

const read = async (input) => {
    try {
        
        dispayResult({
            content: 'Parsing and Converting the file contents. Please wait...'
        });

        const textContent = await readFile(input.files.length && input.files[0]);        
        const parsedSegments = await parseTimedText(textContent);
        const filename = createSrtFileName(input.files.length && input.files[0].name);
        
        await handleProcessAndDownload(parsedSegments, filename);        

        setTimeout(() => {
            dispayResult({
                content: 'Your converted file has been downloaded...'
            });
        }, 1000);        
        
        
    } catch (err) {
        console.log('error occured');
        console.log(err);
        dispayResult({
            isInvalid: true,
            content: 'Error while reading the file! Please try again'
        });
    }    
}


/**
 * Parses stringified JSON content for getting text & time details
 * @param {string} txt 
 * @returns {Array<Segment>} segments
 */
const parseTimedText = async (txt) => {
    const timedTextJson = JSON.parse(txt);    
    const events = timedTextJson.events || [];
    const x = await getSegments(events);
    console.log(x);
    return x;
}

/**
 * Parses events array and returns Array of Segments containing: 
 * (startTime, endTime, and caption text)
 * @param {Array<EventObject>} events 
 * EventObject : {
      "tStartMs": Number,
      "dDurationMs": Number,
      "id"?: Number,
      "wpWinPosId"?: Number,
      "wsWinStyleId"?: Number,
      "wWinId"?: Number,
      "segs"?: Array<{utf8: String}>,
      "aAppend"?: Number
    }
 * @returns {Array<Segment>} segments
 * Segment: {
     "startTimeMs": Number,
     "endTimeMs": Number,
     "text": String
    } 
 *
 */
const getSegments = async (events) => {

    const segments = [];
    let segmentText = '';
    let segment = {
        startTimeMs: 0,
    };  

    // events = events.slice(0, 10);
    // console.log(events);

    events.map(evt => {
        
        // check whether it is manually uploaded CC or not
        if (!evt.wWinId && evt.segs) {

            segment.startTimeMs = evt.tStartMs;
            segment.endTimeMs = evt.tStartMs + evt.dDurationMs;
            (evt.segs || []).map(seg => {
                const text = seg.utf8; //.trim();                
                if (text && text !== '\n') {
                    segmentText += (text || '');
                }
            }); 
            segment.text = segmentText;            
            segments.push(segment);
            segment = {};
            segmentText = '';

            return;
        }

        // Below code is a fall back for Auto Generated CC

        if (!evt.aAppend) {
            segment.startTimeMs = evt.tStartMs;
            (evt.segs || []).map(seg => {
                const text = seg.utf8; //.trim();                
                if (text && text !== '\n') {
                    segmentText += (text || '');
                }
            });  

        } else {
            segment.endTimeMs = evt.tStartMs;
            segment.text = segmentText;
            segments.push(segment);
            segment = {};
            segmentText = '';
        }            

    });

    return segments;

}

/**
 * 
 * @param {Array<Segment>} segments 
 */
const convertSegmentsToSrt = async (segments) => {
    let srtString = '';

    segments.map((segment, index) => {
        const startTime = convertToStrTime(segment.startTimeMs);    
        const endTime = convertToStrTime(segment.endTimeMs);    
        const text = "" + (index + 1) + "\r\n" +
                startTime + " --> " + endTime + "\r\n" +
                segment.text + "\r\n\r\n";
        srtString += text;
    });

    return srtString;
    
}

const convertToStrTime = (ms) => {
    
    let seconds = Math.floor(ms / 1000);
    
    ms = ms % 1000;
    const milliseconds = ms;        

    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    // return format: 00:00:06,319
    return `${paddZero([hours, minutes, seconds]).join(':')},${paddZero([milliseconds])[0]}`;

}

const paddZero = (numList) => {
    
    if(!Array.isArray(numList)) return [];

    return numList.map(num => {
        if (+num >= 10) return `${num}`;
        return `0${num}`;
    });

}

const createSrtFileName = (fileName) => {
    
    if (!fileName) return 'captions';

    let splitName = fileName.split('.');
    if (splitName.length > 1) {
        splitName = splitName.slice(0, splitName.length - 1);
    }
    return splitName.join('.');
}

const handleProcessAndDownload = async (parsedSegments, filename) => {    
    const srtData = await convertSegmentsToSrt(parsedSegments);        
    var blob = new Blob([srtData], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${filename}.srt`);
}


const dispayResult = (result) => {
    msg.innerText = result.content;
}