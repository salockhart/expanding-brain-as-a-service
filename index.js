const Jimp = require("jimp");

const inputFileName = 'input.jpg';
const outputFileName = 'output.jpg';

Promise.all([
	Jimp.read(inputFileName),
	Jimp.loadFont(Jimp.FONT_SANS_16_BLACK),
]).then(data => {
	const [loadedImage, font] = data;
	loadedImage
		.print(font, 10, 157.25 * 0 + 10, "who")
		.print(font, 10, 157.25 * 1 + 10, "whom")
		.print(font, 10, 157.25 * 2 + 10, "whom'st")
		.print(font, 10, 157.25 * 3 + 10, "whom'st'd")
		.write(outputFileName);
}).catch(function (err) {
	console.error(err);
});