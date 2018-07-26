import "croppie/croppie.css";
import "roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css";

import Crop from "./Crop";
import Dropzone from "./Dropzone";

class Wallcutter {
	constructor() {
		this.crop = new Crop;
		this.dropzone = new Dropzone(this.crop);
		this.wallSet = true;
	}

	attachListener(ipc) {
		this.ipc = ipc;
		this.ipc.on('screen-resolution', (_, {width, height}) => {
			this.crop.width = width;
			this.crop.height = height;
			this.crop.calculateRatio();
		});
	}

	async sendImage() {
		if(!this.wallSet) return;

		if(this.crop.croppie) {
			const data = await this.crop.exportCrop();
			this.ipc.once('wallpaper', () => {
				this.wallSet = true;
			});
			this.ipc.send('wallpaper', data);
			this.wallSet = false;
		}
	}
}

window.$wallcutter = new Wallcutter;
