// Desktop View Toggle Logic
const desktopToggle = document.getElementById('desktop-toggle');
const htmlEl = document.documentElement;
const viewportMeta = document.querySelector('meta[name="viewport"]');

desktopToggle.addEventListener('click', () => {
    const isDesktop = htmlEl.getAttribute('data-mode') === 'desktop';

    if (!isDesktop) {
        htmlEl.setAttribute('data-mode', 'desktop');
        desktopToggle.classList.add('active');
        // Set viewport to a fixed width to force desktop layout
        viewportMeta.setAttribute('content', 'width=1280, initial-scale=0.3, shrink-to-fit=no');
    } else {
        htmlEl.removeAttribute('data-mode');
        desktopToggle.classList.remove('active');
        // Reset viewport to default mobile-responsive settings
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
});

// Particles System
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 - 0.5,
            color: Math.random() > 0.5 ? '#4facfe' : '#5d5dff'
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections first
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(79, 172, 254, ${1 - distance / 150})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initParticles);
initParticles();
animateParticles();

// Cursor Glow Effect
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Scroll Progress
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / scrollMax) * 100;
    scrollProgress.style.width = progress + '%';
});

// Card Tilt Effect
document.querySelectorAll('.project-card, .skill-category').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (centerY - y) / 10;
        const rotateY = (x - centerX) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
});

// Magnetic Buttons Effect
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// Hero Name Fly-in Animation
const heroName = document.querySelector('#hero-name');
const nameText = heroName.textContent;
heroName.textContent = '';
heroName.classList.remove('fade-in');

// Wrap words and then letters
const words = nameText.split(' ');
let characters = [];

words.forEach((word, wIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';

    word.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'letter';
        wordSpan.appendChild(span);
        characters.push(span);
    });

    heroName.appendChild(wordSpan);

    // Add space after word (except last one)
    if (wIndex < words.length - 1) {
        const space = document.createElement('span');
        space.textContent = ' ';
        space.className = 'letter';
        heroName.appendChild(space);
        characters.push(space);
    }
});

function initNameAnimation() {
    const isMobile = window.innerWidth <= 768;
    characters.forEach(span => {
        // Random directions: fly from top, bottom, left, or right
        const side = Math.floor(Math.random() * 4);
        const distance = isMobile ? 300 : 1000; // Shorter distance for mobile

        let x = 0, y = 0;
        switch (side) {
            case 0: y = -distance; break; // Top
            case 1: x = distance; break;  // Right
            case 2: y = distance; break;  // Bottom
            case 3: x = -distance; break; // Left
        }

        span.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Animate letters to their original position after a short delay
    setTimeout(() => {
        characters.forEach((span, index) => {
            setTimeout(() => {
                span.classList.add('arrived');
            }, index * 50); // Staggered arrival
        });
    }, 500);
}

// Start animation on first load
window.addEventListener('load', initNameAnimation);

// Sticky Navbar
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('is-active');
});

// Add CSS for active mobile menu
const style = document.createElement('style');
style.innerHTML = `
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(18, 20, 29, 0.95);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-bottom: 2px solid var(--primary-color);
        }
        .nav-links li {
            margin: 1rem 0;
            text-align: center;
        }
        .is-active .bar:nth-child(2) { opacity: 0; }
        .is-active .bar:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .is-active .bar:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
        .menu-toggle {
            display: block;
            cursor: pointer;
        }
        .bar {
            display: block;
            width: 25px;
            height: 3px;
            margin: 5px auto;
            transition: all 0.3s ease-in-out;
            background-color: white;
        }
    }
`;
document.head.appendChild(style);

// Scroll Reveal Animation using Intersection Observer
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add revealing classes to sections
document.querySelectorAll('.section, .project-card, .skill-category, .education-card, .timeline-item, .hackathon-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Add CSS for reveal animation
const revealStyle = document.createElement('style');
revealStyle.innerHTML = `
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
    }
    .reveal.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(revealStyle);

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            mobileMenu.classList.remove('is-active');
        }
    });
});

// Typing effect for hero subtitle
const heroSubtitle = document.querySelector('.subtitle');
const text = heroSubtitle.textContent;
heroSubtitle.textContent = '';
let i = 0;

function typeWriter() {
    if (i < text.length) {
        heroSubtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    }
}

// Start typing after initial fade-in
window.addEventListener('load', () => {
    setTimeout(typeWriter, 1000);
});

// Project Modal Logic
const modal = document.getElementById('project-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalTech = document.getElementById('modal-tech');
const modalLink = document.getElementById('modal-link');
const closeModal = document.querySelector('.close-modal');

document.querySelectorAll('.card-gh-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent opening modal
    });
});

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').innerText;
        const details = card.getAttribute('data-details');
        const img = card.getAttribute('data-img');
        const link = card.getAttribute('data-link');
        const tech = card.querySelector('.tech-stack').innerHTML;

        modalTitle.innerText = title;
        modalDesc.innerText = details;
        modalImg.src = img;
        modalTech.innerHTML = tech;

        if (link && link !== '#') {
            modalLink.href = link;
            modalLink.style.display = 'inline-block';
        } else {
            modalLink.style.display = 'none';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});
