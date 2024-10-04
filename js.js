let highestZ = 1;
class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Common function to get mouse or touch coordinates
    const getCoordinates = (e) => {
      if (e.type.includes('touch')) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else {
        return { x: e.clientX, y: e.clientY };
      }
    };

    // Move and rotate logic
    const movePaper = (e) => {
      const { x, y } = getCoordinates(e);
      if (!this.rotating) {
        this.mouseX = x;
        this.mouseY = y;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      const dirX = x - this.mouseTouchX;
      const dirY = y - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }
      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Mouse and touch move event listeners
    document.addEventListener('mousemove', movePaper);
    document.addEventListener('touchmove', movePaper);

    // Mouse and touch start event listener
    const startPaperHold = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      const { x, y } = getCoordinates(e);
      this.mouseTouchX = x;
      this.mouseTouchY = y;
      this.prevMouseX = x;
      this.prevMouseY = y;

      if (e.type === 'mousedown' && e.button === 2) {
        this.rotating = true;
      }
    };

    paper.addEventListener('mousedown', startPaperHold);
    paper.addEventListener('touchstart', startPaperHold);

    // Mouse and touch end event listener
    const endPaperHold = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    window.addEventListener('mouseup', endPaperHold);
    window.addEventListener('touchend', endPaperHold);
  }
}

// Initialize the papers
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
