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