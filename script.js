import * as PIXI from "https://cdn.skypack.dev/pixi.js@5.x";
import { KawaseBlurFilter } from "https://cdn.skypack.dev/@pixi/filter-kawase-blur@3.2.0";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@3.0.0";
import hsl from "https://cdn.skypack.dev/hsl-to-hex";
import debounce from "https://cdn.skypack.dev/debounce";

// return a random number between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// map a number from one range to another
function map(value, min1, max1, min2, max2) {
    return ((value - min1) / (max1 - min1)) * (max2 - min2) + min2;
}

// Create simplex noise instance
const simplex = new SimplexNoise();

// create ColorPalette
class ColorPalette {
    constructor() {
        // set color palette
        this.setColors();
        this.setCustomProperties();
    }

    setColors() {
        // pick random hue (220-360)
        this.hue = ~~random(220, 360);
        this.complimentaryHue1 = this.hue + 30;
        this.complimentaryHue2 = this.hue + 60;

        // define saturation and lightness
        this.saturation = 95;
        this.lightness = 50;

        // define a base color
        this.baseColor = hsl(this.hue, this.saturation, this.lightness);

        // define a complimentary color
        this.complimentaryColor1 = hsl(
            this.complimentaryHue1,
            this.saturation,
            this.lightness
        );

        // define a second complimentary color
        this.complimentaryColor2 = hsl(
            this.complimentaryHue2,
            this.saturation,
            this.lightness
        );

        // store colors in array for random selection
        this.colorChoices = [
            this.baseColor,
            this.complimentaryColor1,
            this.complimentaryColor2
        ];
    }

    randomColor() {
        // pick a random color
        return this.colorChoices[~~random(0, this.colorChoices.length)].replace(
            "#",
            "0x"
        );
    }

    setCustomProperties() {
        document.documentElement.style.setProperty("--hue", this.hue);
        document.documentElement.style.setProperty("--hue-complimentary1", this.complimentaryHue1);
        document.documentElement.style.setProperty("--hue-complimentary2", this.complimentaryHue2
        );
    }
}

// create Orb class
class Orb {
    constructor(fill = 0x000000) {
        // area for the orb to move around
        this.bounds = this.setBounds();
        // initial position of the orb
        this.x = random(this.bounds['x'].min, this.bounds['x'].max);
        this.y = random(this.bounds['y'].min, this.bounds['y'].max);

        this.scale = 1;
        this.fill = fill;

        // set orb radius based on window size
        this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

        // noise offset
        this.xOff = random(0, 1000);
        this.yOff = random(0, 1000);

        // noise step speed
        this.inc = 0.002;

        // circle graphics 
        this.graphics = new PIXI.Graphics();
        this.graphics.alpha = 0.825;

        // recalculate orb positions
        window.addEventListener('resize', debounce(() => { this.bounds = this.setBounds() }, 250));
    }

    setBounds() {
        // set bounds for orb to move around
        const maxDist = window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;

        // orb position (bottom right)
        const originX = window.innerWidth - 1.25;
        const originY = window.innerWidth < 1000 ? window.innerHeight : window.innerHeight - 1.375;

        return {
            x: {
                min: originX - maxDist,
                max: originX + maxDist
            },
            y: {
                min: originY - maxDist,
                max: originY + maxDist
            }
        };
    }

    update() {
        // noise values
        const xNoise = simplex.noise2D(this.xOff, this.xOff);
        const yNoise = simplex.noise2D(this.yOff, this.yOff);
        const scaleNoise = simplex.noise2D(this.xOff, this.yOff);

        // map noise values to position in orb bounds
        this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
        this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);

        //map scale noise
        this.scale = map(scaleNoise, -1, 1, 0.5, 1);

        // step
        this.xOff += this.inc;
        this.yOff += this.inc;
    }

    render() {
        // update PIXI.Graphics position and scale
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.graphics.scale.set(this.scale);

        // clear graphics
        this.graphics.clear();

        // draw filled circle
        this.graphics.beginFill(this.fill);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
    }
}

// Create PixiJS app
const app = new PIXI.Application({
    // render to <canvas class="orb-canvas"></canvas>
    view: document.querySelector(".orb-canvas"),
    // auto adjust size to fit the current window
    resizeTo: window,
    // transparent background
    transparent: true
});

// add blur to app
app.stage.filters = [new KawaseBlurFilter(30, 10, true)];

// Create orbs
const orbs = [];

// create color palette
const colorPalette = new ColorPalette();

for (let i = 0; i < 10; i++) {
    // create 10 orbs
    const orb = new Orb(colorPalette.randomColor());
    app.stage.addChild(orb.graphics);

    orbs.push(orb);
}

// Animate orbs
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    app.ticker.add(() => {
        // update and render each orb, each frame
        orbs.forEach((orb) => {
            orb.update();
            orb.render();
        });
    });
} else {
    // perform one update and render per orb, do not animate
    orbs.forEach((orb) => {
        orb.update();
        orb.render();
    });
}