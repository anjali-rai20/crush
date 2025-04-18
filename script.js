let highestZ = 1;

class Paper {
  holdingPaper = false;
  prevMouseX = 0;
  prevMouseY = 0;

  mouseX = 0;
  mouseY = 0;

  velocityX = 0;
  velocityY = 0;

  currentPaperX = 0;
  currentPaperY = 0;
  rotation = 0;

  init(paper) {
    // Get the initial rotation from CSS variable or default to a random value
    const rotationVar = getComputedStyle(paper).getPropertyValue("--rotation");
    this.rotation = rotationVar
      ? parseFloat(rotationVar)
      : Math.random() * 10 - 5;

    // Set initial transform to include rotation
    paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;

    paper.addEventListener("mousedown", (e) => {
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button == 0) {
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
    });

    paper.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.velocityX = this.mouseX - this.prevMouseX;
      this.velocityY = this.mouseY - this.prevMouseY;

      if (this.holdingPaper) {
        this.currentPaperX += this.velocityX;
        this.currentPaperY += this.velocityY;

        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        // Apply both translation and rotation
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    // Use document instead of window for better mouse tracking
    document.addEventListener("mouseup", (e) => {
      this.holdingPaper = false;
    });

    // Add touch support for mobile devices
    paper.addEventListener("touchstart", (e) => {
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.prevMouseX = e.touches[0].clientX;
      this.prevMouseY = e.touches[0].clientY;

      e.preventDefault(); // Prevent scrolling
    });

    paper.addEventListener("touchmove", (e) => {
      this.mouseX = e.touches[0].clientX;
      this.mouseY = e.touches[0].clientY;

      this.velocityX = this.mouseX - this.prevMouseX;
      this.velocityY = this.mouseY - this.prevMouseY;

      if (this.holdingPaper) {
        this.currentPaperX += this.velocityX;
        this.currentPaperY += this.velocityY;

        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }

      e.preventDefault(); // Prevent scrolling
    });

    document.addEventListener("touchend", (e) => {
      this.holdingPaper = false;
    });
  }
}

// Distribute papers randomly across the screen
function distributeRandomly() {
  const papers = Array.from(document.querySelectorAll(".paper"));
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  papers.forEach((paper) => {
    // Random position around the center
    const offsetX = (Math.random() - 0.5) * window.innerWidth * 0.5;
    const offsetY = (Math.random() - 0.5) * window.innerHeight * 0.5;

    // Set initial position
    paper.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px) rotateZ(${parseFloat(
      getComputedStyle(paper).getPropertyValue("--rotation")
    )}deg)`;
  });
}

// Initialize all papers
document.addEventListener("DOMContentLoaded", () => {
  const papers = Array.from(document.querySelectorAll(".paper"));

  // First distribute papers randomly
  distributeRandomly();

  // Then initialize dragging for each paper
  papers.forEach((paper) => {
    const p = new Paper();
    p.init(paper);
  });

  // Reduce console noise
  console.log("✨ Lovely notes initialized - drag papers to move them around!");
});
