import confetti from 'canvas-confetti';

// Celebratory coffee-bean and golden caramel particle burst
export const triggerVoteConfetti = (event) => {
  let x = 0.5;
  let y = 0.7;

  if (event && event.clientX && event.clientY) {
    x = event.clientX / window.innerWidth;
    y = event.clientY / window.innerHeight;
  }

  confetti({
    particleCount: 28,
    spread: 55,
    origin: { x, y },
    colors: ['#c8965a', '#f59e0b', '#78350f', '#fef3c7', '#d97706'],
    ticks: 120,
    gravity: 1.2,
    scalar: 0.85,
    shapes: ['circle', 'square']
  });
};

