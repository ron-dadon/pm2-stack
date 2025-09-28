// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function () {
  // Set current year in footer
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Handle navigation clicks
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // If it's an external link (starts with http) or a different page, let it navigate normally
      if (href.startsWith('http') || href.includes('.html') || href.includes('#')) {
        // For hash links on the same page, handle smooth scrolling
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetSection = document.getElementById(targetId);

          if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
          }
        }
        // For other links, let them navigate normally (don't prevent default)
      } else {
        // For internal anchor links, handle smooth scrolling
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Update active nav link
          navLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
        }
      }
    });
  });

  // Handle tab switching for installation
  const installTabs = document.querySelectorAll('.install-tabs .tab-btn');
  const installPanes = document.querySelectorAll('.install-tabs + .tab-content .tab-pane');

  installTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab');

      // Update active tab
      installTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Update active pane
      installPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetTab) {
          pane.classList.add('active');
        }
      });
    });
  });

  // Handle tab switching for examples
  const exampleTabs = document.querySelectorAll('.example-tabs .tab-btn');
  const examplePanes = document.querySelectorAll('.example-tabs + .tab-content .tab-pane');

  exampleTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab');

      // Update active tab
      exampleTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Update active pane
      examplePanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetTab) {
          pane.classList.add('active');
        }
      });
    });
  });

  // Update active nav link based on scroll position
  window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (correspondingLink) {
          correspondingLink.classList.add('active');
        }
      }
    });
  });

  // Copy code functionality
  const codeBlocks = document.querySelectorAll('.code-block pre code');
  codeBlocks.forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.innerHTML = '📋';
    button.title = 'Copy code';
    button.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #374151;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;

    const codeContainer = block.parentElement;
    codeContainer.style.position = 'relative';
    codeContainer.appendChild(button);

    button.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(block.textContent);
        button.innerHTML = '✅';
        button.style.opacity = '1';
        setTimeout(() => {
          button.innerHTML = '📋';
          button.style.opacity = '0.7';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
        button.innerHTML = '❌';
        setTimeout(() => {
          button.innerHTML = '📋';
        }, 2000);
      }
    });

    button.addEventListener('mouseenter', function () {
      this.style.opacity = '1';
    });

    button.addEventListener('mouseleave', function () {
      this.style.opacity = '0.7';
    });
  });

  // Add syntax highlighting for code blocks
  const codeElements = document.querySelectorAll('code');
  codeElements.forEach(code => {
    // Simple syntax highlighting for TypeScript/JavaScript
    let content = code.textContent;

    // Highlight keywords
    content = content.replace(/\b(import|export|from|const|let|var|function|class|interface|type|async|await|new|if|else|for|while|return|try|catch|finally|throw)\b/g, '<span style="color: #c678dd;">$1</span>');

    // Highlight strings
    content = content.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span style="color: #98c379;">$1$2$1</span>');

    // Highlight numbers
    content = content.replace(/\b(\d+)\b/g, '<span style="color: #d19a66;">$1</span>');

    // Highlight comments
    content = content.replace(/(\/\/.*$)/gm, '<span style="color: #5c6370;">$1</span>');

    // Only apply if it's not already HTML
    if (!content.includes('<span')) {
      code.innerHTML = content;
    }
  });

  // Add animation to feature cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

  // Add typing effect to hero title
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }

    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
  }
});
