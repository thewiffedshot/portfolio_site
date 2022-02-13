class PerlinSampler {
    canvas;
    pngSampleUrl;
    sampleWidth;
    sampleHeight;
    sampleColorData;
    sampleNormalizedIntensities;
    onsampleready;

    constructor(pngSampleUrl) {
        this.pngSampleUrl = pngSampleUrl;
        this.canvas = document.createElement('canvas');
        this.#loadSample(pngSampleUrl);
    }

    sampleRandomColumn() {
        return this.sampleNormalizedIntensities[this.#getRandomInt(this.sampleWidth)].slice();
    }

    #getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    #normalizeData() {
        this.sampleNormalizedIntensities = Array(this.sampleWidth).fill(0).map(x => Array(this.sampleHeight).fill(0));

        for (var i = 0, y = 0; i < this.sampleColorData.data.length; y++) {
            if (y === this.sampleHeight - 1)
                y = 0;

            for (var x = 0; x < this.sampleWidth; i += 4, x++) {
                var value = this.sampleColorData.data[i] / 255;

                this.sampleNormalizedIntensities[x][y] = value;
            }
        }

        this.onsampleready();
    }

    #loadSample(url) {
        var _this = this;

        var request = new XMLHttpRequest();

        request.responseType = 'blob';

        request.open('GET', url, true);

        request.onload = function (e) {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    var img = new Image();
                    var response = request.response;

                    var reader = new FileReader();

                    reader.onloadend = function () {
                        img.src = reader.result;

                        img.onload = function () {
                            var context = _this.canvas.getContext('2d');

                            _this.sampleWidth = Math.max(1, Math.floor(img.naturalWidth));
                            _this.sampleHeight = Math.max(1, Math.floor(img.naturalHeight));

                            _this.canvas.width = _this.sampleWidth;
                            _this.canvas.height = _this.sampleHeight;

                            context.drawImage(img, 0, 0);
                          
                            _this.sampleColorData = context.getImageData(0, 0, _this.sampleWidth, _this.sampleHeight);

                            _this.#normalizeData();
                        }
                    }

                    reader.readAsDataURL(response);           
                }
            }
        }

        request.onerror = function (e) {
            console.error(request.statusText);
        }

        request.send(null);
    }
}