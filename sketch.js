const words = [
  "CHINESE",
  "HOMOPHONE",
  "SEARCH",
  "CENSORSHIP",
  "BYPASS",
  "AI",
  "SURVEILLANCE",
  "MACHINE",
  "MODERATION",
  "ENCRYPTION",
  "中文",
  "同音词",
  "敏感词",
  "查找",
  "同音",
  "审查",
  "词",
  "查",
  "找",
  "文",
  "中",
  "和谐",
  "河蟹",
];

const palette = [
  "rgb(50, 100, 200)", // Blue
  "rgb(0, 51, 204)", // Blue
  "rgb(10, 10, 255)", // Bright Blue
  "rgb(138, 43, 226)", // Blue Violet
  "rgb(75, 0, 130)", // Indigo
  "rgb(217, 175, 248)", // Light Purple
  "rgb(131, 114, 247)", // Purple
  "rgb(255, 215, 0)", // Gold
  "rgb(50, 205, 50)", // Lime Green
  "rgb(0, 255, 127)", // Spring Green
  "rgb(124, 252, 0)", // Lawn Green
  "rgb(121, 240, 179)", // Light Green
];

let rows = [];
let p5Canvas;

function colorToRgba(color, alpha) {
  if (!color) return `rgba(0, 0, 0, ${alpha})`;

  if (color.startsWith("rgb(")) {
    const values = color.match(/\d+/g);
    if (values && values.length >= 3) {
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
    }
  }

  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
}

function getRandomColor() {
  return palette[Math.floor(Math.random() * palette.length)];
}

function createGradientBackground(color) {
  return `linear-gradient(90deg, 
          ${colorToRgba(color, 0.4)} 0%, 
          ${colorToRgba(color, 0.35)} 5%, 
          ${colorToRgba(color, 0.28)} 15%, 
          ${colorToRgba(color, 0.22)} 25%, 
          ${colorToRgba(color, 0.16)} 30%, 
          ${colorToRgba(color, 0.12)} 45%, 
          ${colorToRgba(color, 0.08)} 60%, 
          ${colorToRgba(color, 0.05)} 75%, 
          ${colorToRgba(color, 0.02)} 80%, 
          ${colorToRgba(color, 0.01)} 85%, 
          transparent 80%, 
          transparent 100%)`;
}

function setup() {
  p5Canvas = createCanvas(windowWidth, windowHeight);
  p5Canvas.parent("p5-canvas");
  generateRows();
}

function draw() {
  background(255);

  // Draw all rows
  for (const row of rows) {
    row.x += row.speed;

    // Draw all words in this row
    for (const word of row.words) {
      const wordX = row.x + word.offset;

      // Skip if completely off screen
      if (wordX > windowWidth + 100 || wordX < -word.width - 100) continue;

      // Draw gradient background using p5.js drawingContext
      push();

      // Create gradient with color always fading from left edge
      const gradient = drawingContext.createLinearGradient(
        wordX,
        row.y,
        wordX + word.width,
        row.y
      );

      gradient.addColorStop(0, colorToRgba(word.color, 0.4));
      gradient.addColorStop(0.05, colorToRgba(word.color, 0.35));
      gradient.addColorStop(0.1, colorToRgba(word.color, 0.28));
      gradient.addColorStop(0.15, colorToRgba(word.color, 0.22));
      gradient.addColorStop(0.2, colorToRgba(word.color, 0.16));
      gradient.addColorStop(0.35, colorToRgba(word.color, 0.12));
      gradient.addColorStop(0.6, colorToRgba(word.color, 0.08));
      gradient.addColorStop(0.75, colorToRgba(word.color, 0.05));
      gradient.addColorStop(0.85, colorToRgba(word.color, 0.02));
      gradient.addColorStop(0.9, colorToRgba(word.color, 0.01));
      gradient.addColorStop(0.95, "rgba(0,0,0,0)");
      gradient.addColorStop(1.0, "rgba(0,0,0,0)");

      // Set the gradient as fill style
      drawingContext.fillStyle = gradient;
      noStroke();

      // Draw rounded rectangle with gradient
      rect(wordX, row.y, word.width, row.height, row.height / 2);

      // Draw text
      fill(0, 0, 0, 150); // Semi-transparent black text
      textAlign(CENTER, CENTER);
      text(word.text, wordX + word.width / 2, row.y + row.height / 2 + 2);

      pop();
    }

    // Reset row position when it goes off screen
    if (row.speed > 0 && row.x > windowWidth) {
      row.x = -row.totalWidth;
    } else if (row.speed < 0 && row.x + row.totalWidth < 0) {
      row.x = windowWidth;
    }
  }
}

function generateRows() {
  rows = [];
  const rowHeight = windowHeight / 12;

  // Calculate font size and padding based on row height
  const fontSize = Math.floor(rowHeight * 0.45); // Font size is 45% of row height
  const padding = Math.floor((rowHeight - fontSize) / 2); // Equal padding on all sides
  const totalHorizontalPadding = padding * 2;

  // Set font properties
  textFont("Arial", fontSize);

  const numRows = Math.ceil(windowHeight / rowHeight) + 3; // Add extra rows for better coverage

  for (let i = 0; i < numRows; i++) {
    const row = {
      y: i * rowHeight,
      height: rowHeight,
      x: 0,
      speed: random(-2, 2),
      words: [],
      totalWidth: 0,
    };

    // Make sure speed is not too slow
    if (Math.abs(row.speed) < 0.5) {
      row.speed = row.speed > 0 ? 0.5 : -0.5;
    }

    // Calculate how many words we need to fill the screen width
    const targetWidth = windowWidth * 3; // Increased to 300% for better coverage
    let currentOffset = 0;

    while (currentOffset < targetWidth) {
      let word;
      let color1, color2;

      // Ensure same word doesn't appear consecutively
      do {
        word = random(words);
      } while (
        row.words.length > 0 &&
        row.words[row.words.length - 1].text === word
      );

      const wordWidth = textWidth(word) + totalHorizontalPadding;

      // Get one random color, always from left
      const color = getRandomColor();

      // Ensure color is different from previous word
      let finalColor = color;
      while (
        row.words.length > 0 &&
        row.words[row.words.length - 1].color === finalColor
      ) {
        finalColor = getRandomColor();
      }

      row.words.push({
        text: word,
        width: wordWidth,
        offset: currentOffset,
        color: finalColor,
      });

      currentOffset += wordWidth;
    }

    row.totalWidth = currentOffset;

    if (row.speed > 0) {
      // For rightward moving rows, start with words visible from the left
      row.x = random(-row.totalWidth * 0.5, 0);
    } else {
      // For leftward moving rows, start with words visible from the right
      row.x = random(windowWidth * 0.5, windowWidth);
    }

    rows.push(row);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateRows();
}

function keyPressed() {
  if (key === "r" || key === "R") {
    generateRows();
  }
}

// Scroll Animation Implementation
function handleScrollAnimations() {
  const scrollElements = document.querySelectorAll(".scroll-animate");
  const windowHeight = window.innerHeight;
  const heroHeight = document.getElementById("hero-section").offsetHeight;

  scrollElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = elementTop < windowHeight - 100; // Trigger 100px before element enters viewport
    const pastHero = window.scrollY > heroHeight * 0.3; // Start animations after scrolling 30% past hero

    if (elementVisible && pastHero) {
      element.classList.add("visible");
    }
  });
}

// Throttle scroll events for better performance
let scrollTimeout;
function throttledScrollHandler() {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  scrollTimeout = setTimeout(handleScrollAnimations, 16); // ~60fps
}

window.addEventListener("scroll", throttledScrollHandler);
window.addEventListener("load", handleScrollAnimations);

// Search functionality
var homephoneData;
var foundHomephone = [];

fetch("./sample.json")
  .then((response) => response.json())
  .then((data) => {
    homephoneData = data.dataset;
  })
  .catch((error) => {
    console.error("Error loading JSON:", error);
  });

function buildFoundDivs(filterItem, inList) {
  const keys = Object.keys(inList);
  var destDiv = document.getElementById("searcResultBox");

  let colorIndex = 0;

  for (var key of keys) {
    if (key != "spell") {
      var valN = inList[key];
      if (valN != filterItem) {
        var newDiv = document.createElement("div");
        newDiv.textContent = valN;
        newDiv.className = "searchResult";

        const color = palette[colorIndex % palette.length];
        newDiv.style.background = createGradientBackground(color);
        colorIndex++;

        destDiv.appendChild(newDiv);
      }
    }
  }
}

function removeFoundElements() {
  var pdivs = document.querySelectorAll(".searchResult");
  for (var i = 0; i < pdivs.length; i++) {
    pdivs[i].remove();
  }
}

function searchHomophone() {
  var input = document.getElementById("type").value;
  console.log(input);

  if (!homephoneData) {
    console.error("Homophone data not loaded yet");
    return;
  }

  for (var i = homephoneData.length - 1; i >= 0; i--) {
    const keys = Object.keys(homephoneData[i]);
    for (const key of keys) {
      var valN = homephoneData[i][key];
      if (input == valN) {
        console.log("MATCH FOUND");
        removeFoundElements();
        buildFoundDivs(input, homephoneData[i]);
        return;
      }
    }
  }
}

// Allow Enter key to trigger search
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("type").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchHomophone();
    }
  });
});

// Set colorful link backgrounds with gradients
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".colorful-link");
  const shuffled = [...palette].sort(() => 0.5 - Math.random());

  links.forEach((link, i) => {
    const color = shuffled[i % shuffled.length];
    link.style.background = createGradientBackground(color);
  });
});

// Auto-fill input when clicking example words
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".example-word").forEach((word) => {
    word.style.cursor = "pointer";

    word.addEventListener("click", () => {
      document.getElementById("type").value = word.textContent;
    });
  });
});
