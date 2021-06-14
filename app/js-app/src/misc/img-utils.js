/**
 * @function
 * @param {HTMLImageElement}: img
 * @return {ImageData}
*/
export const fetch_imgdata_from_image = (img) => {	
	const {width, height} = img;
	// console.log(`${width}-${height}`);
	const canvas = window.document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height);
	return ctx.getImageData(0, 0, width, height);
}

/**
 * @function
 * @param {HTMLVideoElement}: video
 * @param {HTMLCanvasElement}: canvas
 * @param {Number}: scale (0-1)
*/
export const fetch_imagedata_from_video = (video, canvas, scale) => {
	const {videoWidth, videoHeight} = video;
  // console.log(videoWidth + ", " + videoHeight);
	const _width = videoWidth * scale, _height = videoHeight * scale;

	canvas.width = _width;
	canvas.height = _height;
	const context = canvas.getContext("2d");
	context.drawImage(video, 0, 0, _width, _height);
	const frame_imgdata = context.getImageData(0, 0, _width, _height);
	frame_imgdata['context'] = context;
	return frame_imgdata;
}

export function getStringFromMemory(memoryOffset, moduleMemory, size=256) {
    let returnValue = "";    
    const bytes = new Uint8Array(moduleMemory.buffer, memoryOffset, size);

    let character = "";
    for (let i = 0; i < size; i++) {
        character = String.fromCharCode(bytes[i]);
        if (character === "\0") { break; }

        returnValue += character;
    }

    return returnValue;
}

export function convertDataURIToBinary(dataURI) {    
    var raw = window.atob(dataURI);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
  
    for(let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }