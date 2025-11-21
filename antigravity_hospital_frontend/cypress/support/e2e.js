// Visual Effects for Demo Video
// Note: Sidebar is NOT hidden to keep the 'original' look as requested previously, 
// but effects are added.
Cypress.on('window:before:load', (win) => {
    const doc = win.document;

    // 1. Inject CSS for effects
    const style = doc.createElement('style');
    style.innerHTML = `
    /* Click Ripple Effect */
    .demo-click-ripple {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(255, 0, 0, 0.6);
      transform: scale(0);
      animation: ripple 0.5s linear;
      pointer-events: none;
      z-index: 999999;
    }
    @keyframes ripple {
      to {
        transform: scale(3);
        opacity: 0;
      }
    }

    /* Focus/Typing Highlight */
    input:focus, select:focus, textarea:focus {
      outline: none;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.6) !important; /* Indigo glow */
      transition: box-shadow 0.3s ease;
      border-color: #6366f1 !important;
    }
  `;
    doc.head.appendChild(style);

    // 2. Inject JS for Click Listener
    win.addEventListener('click', (e) => {
        const ripple = doc.createElement('div');
        ripple.className = 'demo-click-ripple';
        ripple.style.left = `${e.pageX - 10}px`; // Center the 20px circle
        ripple.style.top = `${e.pageY - 10}px`;
        doc.body.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }, true);
});
