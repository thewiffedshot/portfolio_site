// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener("mousemove", parallax);
document.addEventListener("touchmove", parallax);
$('document').ready(perlinFloat);

function parallax(e) {
    this.querySelectorAll('.parallax').forEach(layer => {
        lastMove = Date.now();
        const speed = layer.getAttribute('data-speed');

        var pageX;
        var pageY;

        if ((e.pageX) && (e.pageY)) {
            pageX = e.pageX;
            pageY = e.pageY;
        } else if (e.targetTouches) {
            pageX = e.targetTouches[0].clientX;
            pageY = e.targetTouches[0].clientY;
            e.preventDefault();
        }

        const x = (window.innerWidth - pageX * speed) / 333;
        const y = (window.innerHeight - pageY * speed) / 333;

        $(layer).data('parallax-x-offset', x);
        $(layer).data('parallax-y-offset', y);
    });
}

class PerlinFloatObject {
    #element;
    #amplitude;
    #samplePerlinX;
    #samplePerlinY;
    #position;
    #indexX = 0;
    #indexY = 0;
    #indexIncrementX = 1;
    #indexIncrementY = 1;

    constructor(element, amplitude, samplePerlinX, samplePerlinY) {
        this.#element = element;
        this.#amplitude = amplitude;
        this.#samplePerlinX = samplePerlinX;
        this.#samplePerlinY = samplePerlinY;
        this.#position = { x: 0, y: 0 };

        $(element).data('parallax-x-offset', 0);
        $(element).data('parallax-y-offset', 0);
    }

    lin_interp(x, a, b) {
        return a + x * (b - a);
    }

    move(delta) {
        if (this.#indexX === this.#samplePerlinX.length || this.#indexX < 0) {
            this.#indexIncrementX *= -1;
        }

        if (this.#indexY === this.#samplePerlinY.length || this.#indexY < 0) {
            this.#indexIncrementY *= -1;
        }

        this.#position.x = this.lin_interp((this.#samplePerlinX[this.#indexX] - 0.5) * 2, -this.#amplitude, this.#amplitude);
        this.#position.y = this.lin_interp((this.#samplePerlinY[this.#indexY] - 0.5) * 2, -this.#amplitude, this.#amplitude);

        this.#element[0].style.transform = `translateX(${this.#position.x + this.#element.data('parallax-x-offset')}px) translateY(${this.#position.y + this.#element.data('parallax-y-offset')}px)`;

        this.#indexX += this.#indexIncrementX;
        this.#indexY += this.#indexIncrementY;
    }
}

function perlinFloat() {
    var timestepMs = 7;
    var floatObjects = [];
    var perlinSampler = new PerlinSampler('/images/perlin_sample.png');
    var lastTime = Date.now();

    perlinSampler.onsampleready = function () {
        $(".float").each(function () {
            floatObjects.push(
                new PerlinFloatObject(
                    $(this),
                    Math.max($(this).data('float-minamp'), Math.random() * $(this).data('float-maxamp')),
                    perlinSampler.sampleRandomColumn(),
                    perlinSampler.sampleRandomColumn()
                ));
        });

        let id = null;

        clearInterval(id);

        id = setInterval(frame, timestepMs);

        function frame() {
            floatObjects.forEach(x => x.move((Date.now() - lastTime) / 1000));
            lastTime = Date.now();
        }
    };
}