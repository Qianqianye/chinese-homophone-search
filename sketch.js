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
  "rgb(255, 20, 147)", // Deep Pink
  "rgb(50, 100, 200)", // Blue
  "rgb(0, 51, 204)", // Blue
  "rgb(255, 69, 0)", // Red Orange
  "rgb(50, 205, 50)", // Lime Green
  "rgb(255, 0, 255)", // Magenta
  "rgb(255, 215, 0)", // Gold
  "rgb(138, 43, 226)", // Blue Violet
  "rgb(0, 255, 127)", // Spring Green
  "rgb(255, 20, 20)", // Bright Red
  "rgb(30, 144, 255)", // Dodger Blue
  "rgb(255, 105, 180)", // Hot Pink
  "rgb(124, 252, 0)", // Lawn Green
  "rgb(255, 140, 0)", // Dark Orange
  "rgb(75, 0, 130)", // Indigo
  "rgb(121, 240, 179)", // Light Green
  "rgb(255, 0, 100)", // Bright Pink
  "rgb(217, 175, 248)", // Light Purple
  "rgb(131, 114, 247)", // Purple
];
let rows = [];
let p5Canvas;

function setup() {
  p5Canvas = window.createCanvas(window.innerWidth, window.innerHeight);
  p5Canvas.parent("p5-canvas");
  generateRows();
}

function draw() {
  window.background(255);

  // Draw all rows
  for (const row of rows) {
    row.x += row.speed;

    // Draw all words in this row
    for (const word of row.words) {
      const wordX = row.x + word.offset;

      // Skip if completely off screen
      if (wordX > window.innerWidth + 100 || wordX < -word.width - 100)
        continue;

      // Draw background rectangle with rounded corners
      window.fill(word.color);
      window.noStroke();
      window.rect(wordX, row.y, word.width, row.height, row.height / 2);

      // Draw text
      window.fill(255);
      window.textAlign(window.CENTER, window.CENTER);
      window.text(
        word.text,
        wordX + word.width / 2,
        row.y + row.height / 2 + 2
      );
    }

    // Reset row position when it goes off screen
    if (row.speed > 0 && row.x > window.innerWidth) {
      row.x = -row.totalWidth;
    } else if (row.speed < 0 && row.x + row.totalWidth < 0) {
      row.x = window.innerWidth;
    }
  }
}

function generateRows() {
  rows = [];
  const rowHeight = window.innerHeight / 12;

  // Calculate font size and padding based on row height
  const fontSize = Math.floor(rowHeight * 0.45); // Font size is 45% of row height
  const padding = Math.floor((rowHeight - fontSize) / 2); // Equal padding on all sides
  const totalHorizontalPadding = padding * 2;

  // Set font properties
  window.textFont("Arial", fontSize);
  window.textStyle(window.BOLD);

  const numRows = Math.ceil(window.innerHeight / rowHeight) + 3; // Add extra rows for better coverage

  for (let i = 0; i < numRows; i++) {
    const row = {
      y: i * rowHeight,
      height: rowHeight,
      x: 0,
      speed: window.random(-2, 2),
      words: [],
      totalWidth: 0,
    };

    // Make sure speed is not too slow
    if (Math.abs(row.speed) < 0.5) {
      row.speed = row.speed > 0 ? 0.5 : -0.5;
    }

    // Calculate how many words we need to fill the screen width
    const targetWidth = window.innerWidth * 3; // Increased to 300% for better coverage
    let currentOffset = 0;

    while (currentOffset < targetWidth) {
      let word;
      let wordColor;

      // Ensure same word doesn't appear consecutively
      do {
        word = window.random(words);
      } while (
        row.words.length > 0 &&
        row.words[row.words.length - 1].text === word
      );

      const wordWidth = window.textWidth(word) + totalHorizontalPadding;

      // Ensure same color doesn't appear consecutively
      do {
        wordColor = window.random(palette);
      } while (
        row.words.length > 0 &&
        row.words[row.words.length - 1].color.toString() ===
          wordColor.toString()
      );

      row.words.push({
        text: word,
        width: wordWidth,
        offset: currentOffset,
        color: wordColor,
      });

      currentOffset += wordWidth;
    }

    row.totalWidth = currentOffset;

    if (row.speed > 0) {
      // For rightward moving rows, start with words visible from the left
      row.x = window.random(-row.totalWidth * 0.5, 0);
    } else {
      // For leftward moving rows, start with words visible from the right
      row.x = window.random(window.innerWidth * 0.5, window.innerWidth);
    }

    rows.push(row);
  }
}

function windowResized() {
  window.resizeCanvas(window.innerWidth, window.innerHeight);
  generateRows();
}

function keyPressed() {
  if (window.key === "r" || window.key === "R") {
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

        newDiv.style.backgroundColor = palette[colorIndex % palette.length];
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

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".colorful-link");

  // Shuffle colors
  const shuffled = palette.sort(() => 0.5 - Math.random());

  links.forEach((link, i) => {
    link.style.backgroundColor = shuffled[i % shuffled.length];
  });
});

// Auto-fill input when clicking example words
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".example-word").forEach((word) => {
    word.style.cursor = "pointer"; // make it look clickable

    word.addEventListener("click", () => {
      document.getElementById("type").value = word.textContent;
    });
  });
});
