import {Croppie} from "croppie";
import toBuffer from "blob-to-buffer";

class Crop {
	constructor() {
		this.elem = document.querySelector('.Crop');
		this.croppie = undefined;
		this.width = 1920;
		this.height = 1080;
		this.vpWidth = this.elem.clientWidth;
		this.vpHeight = this.elem.clientHeight;
		this.calculateRatio();
	}

	calculateRatio() {
		this.ratio = Math.min(this.vpWidth / this.width, this.vpHeight / this.height);
	}

	createCrop(imageUrl) {
		this.deleteCrop();
		this.croppie = new Croppie(
			this.elem,
			{
				url: imageUrl,
				viewport: {
					width: this.width * this.ratio,
					height: this.height * this.ratio,
					type: 'square'
				},
				zoom: this.ratio
			}
		);
	}

	deleteCrop() {
		if(this.croppie)
			this.croppie.destroy();
	}

	async exportCrop() {
		const blob = await this.croppie.result({
			type: 'blob',
			size: {width: this.width, height: this.height}
		});

		return await new Promise((resolve, reject) => toBuffer(blob, (e, buff) => {
			if(e) return reject(e);
			resolve(buff);
		}));
	}
}

export default Crop;
