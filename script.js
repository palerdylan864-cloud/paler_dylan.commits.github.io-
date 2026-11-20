
const canvas = document.getElementById("galaxy");
const ctx = canvas.getContext("2d");

const surpriseBtn = document.getElementById("surpriseBtn");
const loveContainer = document.querySelector(".love-container");
const loveMessage = document.getElementById("loveMessage");
const loveTitle = document.getElementById("loveTitle");
const journeyStatus = document.getElementById("journeyStatus");
const heartName = document.getElementById("heartName");
const orbitingGallery = document.getElementById("orbitingGallery");
const pageTitle = document.getElementById("pageTitle");
const smallTitle = document.querySelector(".small-title");
const subtitle = document.querySelector(".subtitle");
const signature = document.querySelector(".signature");
const footerMessage = document.querySelector(".bottom-text");
const musicPlayerFrame = document.querySelector(".music-player iframe");
const musicPlayButton = document.getElementById("musicPlayButton");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const journeyDuration = 18000;
const heartCoreColors = ["#ff1744", "#ff2f75", "#ff4f9a", "#ff75b5", "#ff9bcf"];

if (musicPlayerFrame && window.location.origin !== "null") {
    const musicPlayerUrl = new URL(musicPlayerFrame.src);
    musicPlayerUrl.searchParams.set("origin", window.location.origin);
    musicPlayerFrame.src = musicPlayerUrl.toString();
}

function requestMusicPlayback() {
    if (!musicPlayerFrame || !musicPlayerFrame.contentWindow) {
        return;
    }

    for (const func of ["unMute", "playVideo"]) {
        musicPlayerFrame.contentWindow.postMessage(
            JSON.stringify({ event: "command", func, args: [] }),
            "https://www.youtube-nocookie.com"
        );
    }
}

musicPlayButton.addEventListener("click", () => {
    requestMusicPlayback();
    musicPlayButton.disabled = true;
    musicPlayButton.setAttribute("aria-hidden", "true");
    musicPlayButton.classList.add("is-fading");
});

musicPlayButton.addEventListener("transitionend", event => {
    if (event.propertyName === "opacity" && musicPlayButton.classList.contains("is-fading")) {
        musicPlayButton.hidden = true;
    }
});

let width, height;
let time = 0;
let journeyStarted = false;
let journeyComplete = false;
let animationFrameId = null;
let journeyElapsed = 0;
let lastFrameTime = null;
let journeyMilestone = -1;

const colors = [
    "#ff0a7f",
    "#ff258f",
    "#ff4fb8",
    "#e60076",
    "#ffb5df",
    "#ffe6f4",
    "#ffffff"
];

const messages = [
    "Maria, my heart feels at home with you.",
    "You make every day softer and brighter.",
    "I love the way you make ordinary moments magical.",
    "You are my favorite person in every universe.",
    "My heart chooses you, again and again.",
    "Your smile is my favorite kind of sunshine.",
    "I am grateful for every moment by your side.",
    "Your kindness makes the world more beautiful.",
    "I love you more with every passing day.",
    "You make my whole world feel like home.",
    "Maria, you are cherished beyond words.",
    "Your laugh is my favorite melody.",
    "I feel lucky to love you and be loved by you.",
    "You bring warmth to every corner of my heart.",
    "I will always be here cheering you on.",
    "You are beautiful in every way that matters.",
    "My favorite memories all have you in them.",
    "I adore the little things that make you, you.",
    "Life is sweeter with you beside me.",
    "You are the most precious part of my world.",
    "I will keep choosing you, today and every day.",
    "My love for you is my favorite story.",
    "You make my heart glow brighter than the stars.",
    "Maria, I appreciate you more than you know.",
    "Every day with you is a gift I treasure.",
    "I love your gentle heart and the way you care."
];

const titleMessages = [
    "Maria, My Favorite Universe",
    "For Maria, With All My Heart",
    "To My Forever Love, Maria",
    "Maria, You Make My World Beautiful",
    "My Favorite Person in Every Universe"
];

const eyebrowMessages = [
    "FOR MY DEAREST MARIA",
    "FROM MY HEART TO YOURS",
    "A LITTLE LOVE NOTE",
    "TO THE ONE I ADORE"
];

let stars = [];
let journeyStars = [];
let journeyHearts = [];
let heartParticles = [];
let galaxyParticles = [];
let galaxyHearts = [];
let heartCoreParticles = [];
let orbitalParticles = [];
let floatingMessages = [];
let explosions = [];
let messageDeck = [];
let lastSelectedMessage = "";

// Canvas size

function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);

    if (ctx) {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    if (prefersReducedMotion) {
        drawFrame();
    }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Random number

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function nextRomanticMessage() {
    if (messageDeck.length === 0) {
        messageDeck = messages.filter(message => message !== lastSelectedMessage);

        for (let i = messageDeck.length - 1; i > 0; i--) {
            const swapIndex = Math.floor(Math.random() * (i + 1));
            [messageDeck[i], messageDeck[swapIndex]] = [messageDeck[swapIndex], messageDeck[i]];
        }
    }

    lastSelectedMessage = messageDeck.pop();
    return lastSelectedMessage;
}

function chooseMessage(options) {
    return options[Math.floor(Math.random() * options.length)];
}

function setOpeningMessages() {
    const heading = chooseMessage(titleMessages);
    const cardHeading = chooseMessage(titleMessages.filter(message => message !== heading));
    document.title = heading;
    pageTitle.textContent = heading;
    smallTitle.textContent = chooseMessage(eyebrowMessages);
    subtitle.textContent = nextRomanticMessage();
    loveTitle.textContent = cardHeading;
    loveMessage.textContent = nextRomanticMessage();
    signature.textContent = nextRomanticMessage();
    footerMessage.textContent = nextRomanticMessage();
}

setOpeningMessages();

// Create background stars

for (let i = 0; i < 220; i++) {
    stars.push({
        x: Math.random(),
        y: Math.random(),
        size: random(0.5, 2.2),
        alpha: random(0.2, 1),
        speed: random(0.005, 0.025)
    });
}

for (let i = 0; i < 250; i++) {
    journeyStars.push({
        x: random(-1, 1),
        y: random(-1, 1),
        z: random(0.12, 1),
        speed: random(0.18, 0.38),
        size: random(0.6, 1.8),
        swirl: random(-0.3, 0.3),
        color: colors[Math.floor(Math.random() * colors.length)]
    });
}

const travelHeartEmojis = ["💗", "❤️", "💖", "💕", "✨"];

for (let i = 0; i < 56; i++) {
    journeyHearts.push({
        x: random(-1, 1),
        y: random(-1, 1),
        z: random(0.15, 1),
        speed: random(0.12, 0.3),
        rotation: random(-0.4, 0.4),
        swirl: random(-0.5, 0.5),
        emoji: travelHeartEmojis[Math.floor(Math.random() * travelHeartEmojis.length)]
    });
}

// Heart shape formula

function heartShape(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return { x, y };
}

// Generate galaxy heart

for (let i = 0; i < 1300; i++) {

    const angle = Math.random() * Math.PI * 2;

    const point = heartShape(angle);

    const scale = random(0.75, 1.08);

    heartParticles.push({
        x: point.x * scale,
        y: point.y * scale,

        size: random(0.5, 2.5),

        color: colors[
            Math.floor(Math.random() * colors.length)
        ],

        phase: random(0, Math.PI * 2),
        speed: random(0.2, 1.2)
    });
}

for (let i = 0; i < 1050; i++) {
    const point = heartShape(random(0, Math.PI * 2));
    const depth = Math.sqrt(Math.random()) * 0.94;

    galaxyParticles.push({
        x: point.x * depth,
        y: point.y * depth,
        size: random(0.35, 1.4),
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: random(0, Math.PI * 2),
        speed: random(0.2, 1.1)
    });
}

for (let i = 0; i < 700; i++) {
    const point = heartShape(random(0, Math.PI * 2));
    const depth = Math.sqrt(Math.random()) * 0.96;

    galaxyHearts.push({
        x: point.x * depth,
        y: point.y * depth,
        size: random(0.13, 0.28),
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: random(0, Math.PI * 2),
        speed: random(0.2, 1)
    });
}

for (let i = 0; i < 680; i++) {
    const point = heartShape(random(0, Math.PI * 2));
    const fillDepth = Math.sqrt(Math.random());

    heartCoreParticles.push({
        x: point.x * fillDepth,
        y: point.y * fillDepth,
        z: random(-1, 1) * Math.sqrt(1 - fillDepth * fillDepth),
        size: random(0.9, 1.55),
        color: heartCoreColors[Math.floor(Math.random() * heartCoreColors.length)],
        phase: random(0, Math.PI * 2),
        speed: random(0.5, 1.6)
    });
}

for (let i = 0; i < 1050; i++) {
    orbitalParticles.push({
        arm: i % 3,
        radius: Math.sqrt(Math.random()),
        phase: random(-0.28, 0.28),
        speed: random(0.018, 0.065),
        size: random(0.45, 1.8),
        color: ["#ff1688", "#ff4bab", "#f21b8f", "#ffc4e5"][i % 4]
    });
}

// Create floating romantic messages

for (let i = 0; i < 6; i++) {

    floatingMessages.push({
        text: nextRomanticMessage(),
        angle: (Math.PI * 2 / 6) * i,
        speed: random(0.0015, 0.004),
        color: colors[i % colors.length],
        changeAfter: random(3, 5.5)
    });

}

// Draw glowing star

function drawStar(x, y, size, alpha) {

    ctx.save();

    ctx.globalAlpha = alpha;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff69b4";

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// Draw background

function drawBackground(arrival, deltaSeconds) {

    stars.forEach(star => {

        star.alpha += star.speed * deltaSeconds * 60;

        if (star.alpha > 1 || star.alpha < 0.2) {
            star.speed *= -1;
        }

        drawStar(
            star.x * width,
            star.y * height,
            star.size,
            star.alpha * (0.35 + arrival * 0.65)
        );

    });

}

function drawWarpStars(intensity, deltaSeconds) {
    if (intensity <= 0) {
        return;
    }

    journeyStars.forEach(star => {
        const previousZ = star.z;
        star.z -= star.speed * (0.3 + intensity * 3.2) * deltaSeconds;

        if (star.z <= 0.08) {
            star.x = random(-1, 1);
            star.y = random(-1, 1);
            star.z = 1;
            return;
        }

        const swirlAngle = time * star.swirl * (1 - star.z);
        const rotatedX = star.x * Math.cos(swirlAngle) - star.y * Math.sin(swirlAngle);
        const rotatedY = star.x * Math.sin(swirlAngle) + star.y * Math.cos(swirlAngle);
        const x = width / 2 + rotatedX * width * 0.22 / star.z;
        const y = height / 2 + rotatedY * height * 0.22 / star.z;
        const previousX = width / 2 + rotatedX * width * 0.22 / previousZ;
        const previousY = height / 2 + rotatedY * height * 0.22 / previousZ;
        const alpha = Math.min(1, (1 - star.z) * 1.7) * intensity;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = star.color;
        ctx.lineWidth = star.size * (0.5 + (1 - star.z) * 1.5);
        ctx.shadowBlur = 12;
        ctx.shadowColor = star.color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(previousX, previousY);
        ctx.stroke();
        ctx.restore();
    });
}

function drawTravelHearts(intensity, deltaSeconds) {
    if (intensity <= 0) {
        return;
    }

    journeyHearts.forEach(heart => {
        heart.z -= heart.speed * (0.3 + intensity * 2.5) * deltaSeconds;

        if (heart.z <= 0.08) {
            heart.x = random(-1, 1);
            heart.y = random(-1, 1);
            heart.z = 1;
            heart.rotation = random(-0.4, 0.4);
            return;
        }

        const swirlAngle = time * heart.swirl * (1 - heart.z);
        const rotatedX = heart.x * Math.cos(swirlAngle) - heart.y * Math.sin(swirlAngle);
        const rotatedY = heart.x * Math.sin(swirlAngle) + heart.y * Math.cos(swirlAngle);
        const x = width / 2 + rotatedX * width * 0.22 / heart.z;
        const y = height / 2 + rotatedY * height * 0.22 / heart.z;

        if (x < -80 || x > width + 80 || y < -80 || y > height + 80) {
            return;
        }

        ctx.save();
        ctx.globalAlpha = Math.min(1, (1 - heart.z) * 1.8) * intensity;
        ctx.translate(x, y);
        ctx.rotate(heart.rotation + heart.x * 0.2);
        ctx.font = `${12 + (1 - heart.z) * 34}px "Segoe UI Emoji", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowBlur = 16;
        ctx.shadowColor = "#ff69b4";
        ctx.fillText(heart.emoji, 0, 0);
        ctx.restore();
    });
}

function drawCosmicNebula(intensity) {
    const drift = time * 0.12;
    const radius = Math.max(width, height) * 0.62;
    const clouds = [
        {
            x: width * (0.32 + Math.sin(drift) * 0.08),
            y: height * (0.42 + Math.cos(drift * 0.8) * 0.08),
            color: "255, 20, 112"
        },
        {
            x: width * (0.72 + Math.cos(drift * 0.72) * 0.08),
            y: height * (0.62 + Math.sin(drift) * 0.07),
            color: "214, 0, 94"
        },
        {
            x: width * (0.54 + Math.sin(drift * 0.6) * 0.1),
            y: height * (0.18 + Math.cos(drift) * 0.06),
            color: "255, 80, 177"
        }
    ];

    ctx.save();

    clouds.forEach((cloud, index) => {
        const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, radius);
        gradient.addColorStop(0, `rgba(${cloud.color}, ${intensity * (0.14 - index * 0.02)})`);
        gradient.addColorStop(1, `rgba(${cloud.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    });

    ctx.restore();
}

function drawCosmicTunnels(intensity, progress) {
    const centerX = width / 2;
    const centerY = height / 2;
    const palette = ["#ff1688", "#ff5bb6", "#d90070", "#ffa4d4", "#fff0f8"];

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(time * 0.08);

    for (let i = 0; i < palette.length; i++) {
        const pulse = 1 + Math.sin(time * 1.4 + i * 0.8) * 0.035;
        const radiusX = Math.min(width * 0.68, width * (0.16 + i * 0.105)) * pulse;
        const radiusY = Math.min(height * 0.62, height * (0.14 + i * 0.105)) * pulse;

        ctx.globalAlpha = intensity * (0.045 + progress * 0.045);
        ctx.strokeStyle = palette[i];
        ctx.lineWidth = 2 + i * 0.35;
        ctx.shadowBlur = 20;
        ctx.shadowColor = palette[i];
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, time * 0.035 + i * 0.22, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.restore();
}

function drawOrbitalGalaxy(progress, arrival) {
    const visibility = smoothStep(0.16, 0.55, progress);
    if (visibility <= 0) {
        return;
    }

    const centerX = width / 2;
    const centerY = height * 0.68;
    const radiusX = Math.min(width * 0.72, height * 1.05);
    const radiusY = radiusX * 0.23;
    const rotation = time * 0.035;
    const color = "#ff1688";

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    for (let ring = 0; ring < 7; ring++) {
        const ringScale = 0.16 + ring * 0.13;
        const pulse = 1 + Math.sin(time * 1.4 - ring * 0.7) * 0.012;

        ctx.globalAlpha = visibility * (0.12 + arrival * 0.1);
        ctx.strokeStyle = ring % 2 === 0 ? color : "#b54cff";
        ctx.lineWidth = ring < 2 ? 2 : 1;
        ctx.shadowBlur = ring < 2 ? 14 : 6;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX * ringScale * pulse, radiusY * ringScale * pulse, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    orbitalParticles.forEach(particle => {
        const spiralAngle = particle.arm * Math.PI * 2 / 3
            + particle.radius * 7.4
            + particle.phase
            + time * particle.speed;
        const radius = particle.radius * (0.88 + 0.12 * Math.sin(time * 0.3 + particle.phase));
        const x = Math.cos(spiralAngle) * radiusX * radius;
        const y = Math.sin(spiralAngle) * radiusY * radius;
        const glow = 0.65 + (Math.sin(time * 1.7 + particle.phase) + 1) * 0.17;

        ctx.globalAlpha = visibility * glow;
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = particle.size > 1.25 ? 8 : 3;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(x, y, particle.size * (0.72 + arrival * 0.4), 0, Math.PI * 2);
        ctx.fill();
    });

    const coreGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, 34);
    coreGlow.addColorStop(0, "rgba(4, 2, 10, 0.98)");
    coreGlow.addColorStop(0.36, "rgba(20, 3, 22, 0.92)");
    coreGlow.addColorStop(0.56, `rgba(255, 38, 154, ${0.72 * visibility})`);
    coreGlow.addColorStop(0.72, `rgba(255, 125, 216, ${0.45 * visibility})`);
    coreGlow.addColorStop(1, "rgba(255, 72, 184, 0)");
    ctx.globalAlpha = visibility;
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawHeartConstellations(intensity, progress) {
    const centerX = width / 2;
    const centerY = height / 2;
    const count = width < 600 ? 3 : 5;

    for (let i = 0; i < count; i++) {
        const phase = time * 0.18 + i * Math.PI * 2 / count;
        const orbit = Math.min(width, height) * (0.15 + (i % 3) * 0.08);
        const x = centerX + Math.cos(phase) * orbit;
        const y = centerY + Math.sin(phase) * orbit * 0.62;
        const size = 0.9 + progress * 0.55 + Math.sin(time + i) * 0.08;
        const color = colors[(i + 2) % colors.length];

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-phase * 0.45);
        ctx.scale(size, size);
        ctx.globalAlpha = intensity * (0.16 + progress * 0.12);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.1;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.beginPath();

        for (let pointIndex = 0; pointIndex <= 60; pointIndex++) {
            const point = heartShape(pointIndex / 60 * Math.PI * 2);
            const pointX = point.x * 1.25;
            const pointY = -point.y * 1.25;

            if (pointIndex === 0) {
                ctx.moveTo(pointX, pointY);
            } else {
                ctx.lineTo(pointX, pointY);
            }
        }

        ctx.closePath();
        ctx.stroke();

        for (let starIndex = 0; starIndex < 7; starIndex++) {
            const point = heartShape(starIndex / 7 * Math.PI * 2);
            ctx.beginPath();
            ctx.arc(point.x * 1.25, -point.y * 1.25, 1.4, 0, Math.PI * 2);
            ctx.fillStyle = "#fff2fb";
            ctx.fill();
        }

        ctx.restore();
    }
}

function smoothStep(edge0, edge1, value) {
    const amount = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
    return amount * amount * (3 - 2 * amount);
}

function drawArrivalGlow(arrival, progress) {
    if (arrival <= 0) {
        return;
    }

    const centerX = width / 2;
    const lift = smoothStep(0.55, 1, progress);
    const centerY = height * (0.66 - lift * 0.16);
    const radius = Math.max(width, height) * 0.58;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, `rgba(255, 54, 160, ${0.17 * arrival})`);
    gradient.addColorStop(0.48, `rgba(164, 0, 76, ${0.1 * arrival})`);
    gradient.addColorStop(1, "rgba(20, 5, 28, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const arrivalFlash = Math.exp(-Math.pow((progress - 0.88) / 0.045, 2)) * 0.22;
    if (arrivalFlash > 0.01) {
        ctx.fillStyle = `rgba(255, 202, 235, ${arrivalFlash})`;
        ctx.fillRect(0, 0, width, height);
    }
}

function drawHeartMark(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.28);
    ctx.bezierCurveTo(x - size * 1.25, y - size * 0.42, x - size * 0.85, y - size * 1.18, x, y - size * 0.58);
    ctx.bezierCurveTo(x + size * 0.85, y - size * 1.18, x + size * 1.25, y - size * 0.42, x, y + size * 0.28);
    ctx.closePath();
    ctx.fill();
}

function traceHeartPath(scale) {
    ctx.beginPath();

    for (let i = 0; i <= 96; i++) {
        const point = heartShape(i / 96 * Math.PI * 2);
        const x = point.x * scale;
        const y = -point.y * scale;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();
}

function drawHeartCore(arrival, galaxyScale) {
    const rotateY = Math.sin(time * 0.24) * 0.42;
    const rotateX = Math.sin(time * 0.18) * 0.12;
    const cosY = Math.cos(rotateY);
    const sinY = Math.sin(rotateY);
    const cosX = Math.cos(rotateX);
    const sinX = Math.sin(rotateX);

    ctx.save();
    ctx.globalAlpha = arrival * 0.38;
    ctx.shadowBlur = 42;
    ctx.shadowColor = "#ff247f";
    const glow = ctx.createRadialGradient(0, -26, 8, 0, 0, 164);
    glow.addColorStop(0, "rgba(255, 165, 218, 0.8)");
    glow.addColorStop(0.62, "rgba(255, 38, 120, 0.52)");
    glow.addColorStop(1, "rgba(184, 12, 88, 0.08)");
    ctx.fillStyle = glow;
    traceHeartPath(8.5);
    ctx.fill();
    ctx.restore();

    const projectedParticles = heartCoreParticles.map(particle => {
        const rotatedX = particle.x * cosY + particle.z * sinY;
        const rotatedZ = -particle.x * sinY + particle.z * cosY;
        const rotatedY = particle.y * cosX - rotatedZ * sinX;
        const depth = particle.y * sinX + rotatedZ * cosX;
        const perspective = 1 / (1.85 - depth * 0.035);

        return {
            particle,
            x: rotatedX * 11 * galaxyScale * perspective,
            y: -rotatedY * 11 * galaxyScale * perspective,
            depth,
            perspective
        };
    }).sort((a, b) => a.depth - b.depth);

    projectedParticles.forEach(({ particle, x, y, depth, perspective }) => {
        const shimmer = 0.82 + (Math.sin(time * particle.speed + particle.phase) + 1) * 0.18;
        const size = particle.size * 4.8 * perspective * shimmer;

        ctx.globalAlpha = arrival * Math.min(1, 0.72 + (depth + 16) / 80);
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 4 + perspective * 4;
        ctx.shadowColor = particle.color;
        drawHeartMark(x, y, size);
    });

    ctx.shadowBlur = 0;
}

// Draw the destination as a dense heart-shaped field with a glowing heart at its core.
function drawHeartGalaxy(arrival, progress) {
    if (arrival <= 0) {
        return;
    }

    const centerX = width / 2;
    const lift = smoothStep(0.55, 1, progress);
    const centerY = height * (0.66 - lift * 0.16);
    const pulse = 1 + Math.sin(time * 1.8) * 0.025 * arrival;
    const scale = Math.min(width / 700, height / 600, 1.4)
        * (0.72 + arrival * 0.28)
        * pulse;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);

    galaxyParticles.forEach(particle => {
        const glow = Math.sin(time * particle.speed + particle.phase);
        ctx.globalAlpha = arrival * (0.34 + (glow + 1) * 0.28);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(
            particle.x * 11,
            -particle.y * 11,
            particle.size * (0.8 + glow * 0.25),
            0,
            Math.PI * 2
        );
        ctx.fill();
    });

    galaxyHearts.forEach(heart => {
        const glow = Math.sin(time * heart.speed + heart.phase);
        ctx.globalAlpha = arrival * (0.42 + (glow + 1) * 0.25);
        ctx.fillStyle = heart.color;
        drawHeartMark(heart.x * 11, -heart.y * 11, heart.size * (0.9 + glow * 0.12) * 11);
    });

    heartParticles.forEach(particle => {
        const glow = Math.sin(time * particle.speed + particle.phase);
        ctx.globalAlpha = arrival * (0.48 + glow * 0.4);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(
            particle.x * 11,
            -particle.y * 11,
            particle.size * (1 + glow * 0.3),
            0,
            Math.PI * 2
        );
        ctx.fill();
    });

    drawHeartCore(arrival, 1);

    ctx.restore();
}

// Orbiting romantic messages

function drawMessages(arrival, travelIntensity, deltaSeconds) {
    const visibility = Math.max(travelIntensity * 0.5, arrival * 0.85);
    if (visibility <= 0) {
        return;
    }

    const centerX = width / 2;
    const centerY = height / 2 + 50;
    const radiusX = width < 600 ? width * 0.25 : Math.min(width * 0.38, 420);
    const radiusY = height < 600 ? height * 0.2 : Math.min(height * 0.32, 260);

    floatingMessages.forEach((item, index) => {
        if (width < 600 && index !== 0) {
            return;
        }

        item.changeAfter -= deltaSeconds;
        if (item.changeAfter <= 0) {
            item.text = nextRomanticMessage();
            item.changeAfter = random(3, 5.5);
        }

        item.angle += item.speed * deltaSeconds * 60;

        const x = centerX +
            Math.cos(item.angle) * radiusX;

        const y = centerY +
            Math.sin(item.angle) * radiusY;

        ctx.save();

        ctx.font = width < 600 ? "10px Arial" : "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.globalAlpha = visibility * (0.3 + arrival * 0.4);

        ctx.shadowBlur = 15;
        ctx.shadowColor = item.color;

        ctx.fillStyle = item.color;

        ctx.fillText(item.text, x, y);

        ctx.restore();

    });

}

// Floating little hearts

function drawFloatingHearts(arrival, orbitAngle) {
    if (arrival <= 0) {
        return;
    }

    const orbitHearts = ["❤️", "💗", "💖", "💕"];
    for (let i = 0; i < 24; i++) {

        const angle = orbitAngle + i * Math.PI * 2 / 24;

        const radius = 112 + (i % 6) * 28;

        const x = width / 2 + Math.cos(angle) * radius;
        const y = height / 2 + Math.sin(angle) * radius * 0.7;

        ctx.save();

        ctx.font = (13 + (i % 4) * 2) + "px Arial";
        ctx.globalAlpha = 0.8 * arrival;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ff4f9a";

        ctx.fillText(
            orbitHearts[i % orbitHearts.length],
            x,
            y
        );

        ctx.restore();

    }

}

// Surprise explosion

function createExplosion() {

    const centerX = width / 2;
    const centerY = height / 2 + 50;

    for (let i = 0; i < 180; i++) {

        const angle = Math.random() * Math.PI * 2;

        explosions.push({

            x: centerX,
            y: centerY,

            vx: Math.cos(angle) * random(1, 6),
            vy: Math.sin(angle) * random(1, 6),

            size: random(2, 5),
            life: 1,

            color: colors[
                Math.floor(Math.random() * colors.length)
            ]

        });

    }

}

function drawExplosions() {

    for (let index = explosions.length - 1; index >= 0; index--) {
        const p = explosions[index];

        p.x += p.vx;
        p.y += p.vy;

        p.life -= 0.012;

        ctx.save();

        ctx.globalAlpha = Math.max(0, p.life);

        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

        if (p.life <= 0) {
            explosions.splice(index, 1);
        }
    }

}

function updateJourneyStatus(progress) {
    const milestones = [0.16, 0.38, 0.58, 0.78, 0.94, 1];

    while (
        journeyMilestone < milestones.length - 1
        && progress >= milestones[journeyMilestone + 1]
    ) {
        journeyMilestone++;
        journeyStatus.textContent = nextRomanticMessage();
    }
}

function drawFrame(deltaSeconds = 0) {
    if (!ctx || !journeyStarted) {
        return;
    }
    ctx.clearRect(0, 0, width, height);

    time += deltaSeconds * 0.9;
    const progress = Math.min(1, journeyElapsed / journeyDuration);
    const arrival = prefersReducedMotion ? 1 : smoothStep(0.58, 0.98, progress);
    const travelIntensity = prefersReducedMotion ? 0 : 1 - smoothStep(0.72, 0.98, progress);
    const orbitAngle = time * 0.7;
    const orbitPhotoWidth = Math.min(150, Math.max(100, width * 0.13));
    const orbitRadius = Math.max(
        40,
        Math.min(280, width * 0.33, width / 2 - orbitPhotoWidth / 2 - 8)
    );

    updateJourneyStatus(progress);

    if (progress >= 1 && !journeyComplete) {
        journeyComplete = true;
        document.body.classList.add("destination-reached");
        loveContainer.classList.add("show");
        loveContainer.setAttribute("aria-hidden", "false");
        surpriseBtn.disabled = false;
        surpriseBtn.setAttribute("aria-expanded", "true");
        surpriseBtn.textContent = "Another Surprise? 💞";
        loveTitle.textContent = chooseMessage(titleMessages);
        loveMessage.textContent = nextRomanticMessage();
        signature.textContent = nextRomanticMessage();
    }

    heartName.style.opacity = String(arrival);
    orbitingGallery.style.opacity = String(arrival);
    orbitingGallery.style.setProperty("--orbit-angle", `${orbitAngle}rad`);
    orbitingGallery.style.setProperty("--orbit-radius", `${orbitRadius}px`);

    if (arrival >= 0.95) {
        heartName.setAttribute("aria-hidden", "false");
        orbitingGallery.setAttribute("aria-hidden", "false");
    }

    drawCosmicNebula(0.18 + travelIntensity * 0.42 + arrival * 0.12);
    drawBackground(arrival, deltaSeconds);
    drawCosmicTunnels(0.16 + travelIntensity * 0.84, progress);
    drawOrbitalGalaxy(progress, arrival);
    drawHeartConstellations(0.2 + travelIntensity * 0.8, progress);
    drawWarpStars(travelIntensity, deltaSeconds);
    drawTravelHearts(travelIntensity, deltaSeconds);
    drawMessages(arrival, travelIntensity, deltaSeconds);
    drawArrivalGlow(arrival, progress);

    drawHeartGalaxy(arrival, progress);

    drawFloatingHearts(arrival, orbitAngle);

    drawExplosions();
}

// Main animation
function animate(timestamp) {
    animationFrameId = null;

    if (document.hidden || prefersReducedMotion || !journeyStarted) {
        return;
    }

    const elapsedMilliseconds = lastFrameTime === null
        ? 0
        : Math.max(0, timestamp - lastFrameTime);
    const deltaSeconds = Math.min(elapsedMilliseconds / 1000, 0.1);
    lastFrameTime = timestamp;
    journeyElapsed = Math.min(journeyDuration, journeyElapsed + elapsedMilliseconds);

    drawFrame(deltaSeconds);
    animationFrameId = window.requestAnimationFrame(animate);
}

function startAnimation() {
    if (journeyStarted && !prefersReducedMotion && !document.hidden && animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(animate);
    }
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        if (animationFrameId !== null) {
            window.cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        lastFrameTime = null;
    } else {
        startAnimation();
    }
});

// Surprise button

surpriseBtn.addEventListener("click", () => {
    if (!journeyStarted) {
        journeyStarted = true;
        journeyElapsed = prefersReducedMotion ? journeyDuration : 0;
        lastFrameTime = null;
        journeyMilestone = -1;
        document.body.classList.add("journey-active");
        surpriseBtn.disabled = true;
        surpriseBtn.textContent = "Traveling through time... ✨";
        createExplosion();

        if (prefersReducedMotion) {
            drawFrame();
        } else {
            startAnimation();
        }
        return;
    }

    if (journeyComplete) {
        loveMessage.textContent = nextRomanticMessage();
        signature.textContent = nextRomanticMessage();
        createExplosion();
    }

});
