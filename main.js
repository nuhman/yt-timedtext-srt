const readFile = (file) => {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.onload = x=> resolve(fr.result);
      fr.readAsText(file);
    });
}

const read = async (input) => {
    try {
        console.log('reading file contents');
        const textContent = await readFile(input.files[0]);
        console.log('done reading');
        const parsedSegments = await parseTimedText(textContent);
        // const srtData = convertSegmentsToSrt(parsedSegments);
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
    return await getSegments(events);
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

    events.map(evt => {         

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


const convertToStrTime = (ms) => {
    
    let seconds = Math.floor(ms / 1000);
    
    ms = ms % 1000;
    const milliseconds = ms;        

    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    return paddZero([hours, minutes, seconds, milliseconds]).join(':');

}

const paddZero = (numList) => {
    
    if(!Array.isArray(numList)) return [];

    return numList.map(num => {
        if (+num >= 10) return `${num}`;
        return `0${num}`;
    });

}

const dispayResult = (result) => {
    if (!result.isInvalid) {

    } else {
        msg.innerText = result.content;
    }
}