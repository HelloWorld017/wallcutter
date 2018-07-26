class Dropzone {
	constructor(cropper) {
		this.elem = document.querySelector('.Dropzone');
		this.input = this.elem.querySelector('input');
		this.crop = cropper;
		this.init();
		this.previousUrl = undefined;
	}

	init() {
		this.elem.addEventListener('dragover', e => {
			e.preventDefault();
			e.stopPropagation();
			this.elem.classList.add('Dropzone--active');
		});

		this.elem.addEventListener('dragleave', e => {
			e.preventDefault();
			e.stopPropagation();
			this.elem.classList.remove('Dropzone--active');
		});

		this.elem.addEventListener('drop', e => {
			e.preventDefault();
			e.stopPropagation();
			this.elem.classList.remove('Dropzone--active');
			this.onDrop(e);
		});

		this.elem.addEventListener('click', () => {
			this.input.value = null;
			this.input.click();
		});
	}

	onDrop(event) {
		let files, temp = this.previousUrl;

		if(event.dataTransfer)
			files = event.dataTransfer.files;

		else if(e.target)
			files = e.target.files;

		if(!files[0]) return;

		const file = files[0];
		this.previousUrl = URL.createObjectURL(file);
		this.crop.createCrop(this.previousUrl);

		URL.revokeObjectURL(temp);
	}
}

export default Dropzone;
