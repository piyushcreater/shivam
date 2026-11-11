/* ============================================================
   💍 Piyush & Priya - Wedding Album | JavaScript
   ============================================================ */

// ===== PRELOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 2500);
});

// ===== FLOATING PARTICLES =====
const particlesContainer = document.getElementById('particles');
const emojis = ['💕', '✨', '🌹', '💍', '❤️', '🌸', '💫', '🦋'];

function createParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.fontSize = (Math.random() * 15 + 12) + 'px';
    p.style.animationDuration = (Math.random() * 10 + 10) + 's';
    p.style.animationDelay = Math.random() * 5 + 's';
    particlesContainer.appendChild(p);
    setTimeout(() => p.remove(), 20000);
}

setInterval(createParticle, 2000);
for (let i = 0; i < 8; i++) setTimeout(createParticle, i * 500);

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 80);
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .couple-card, .timeline-item, .gallery-item, .wish-card, .counter-item').forEach(el => {
    observer.observe(el);
});

// ===== GALLERY FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.gallery-item').forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                setTimeout(() => item.classList.add('visible'), 100);
            } else {
                item.classList.remove('visible');
                setTimeout(() => item.style.display = 'none', 400);
            }
        });
    });
});

// ===== TOAST =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}

// ===== LIKE BUTTON =====
function toggleLike(btn) {
    btn.classList.toggle('liked');
    btn.textContent = btn.classList.contains('liked') ? '❤️' : '🤍';
}

// ===== DOWNLOAD PHOTO =====
function downloadPhoto(btn) {
    const item = btn.closest('.gallery-item');
    const img = item.querySelector('.photo img');
    if (!img || img.style.display === 'none') {
        showToast('⚠️ Koi photo nahi hai download ke liye');
        return;
    }

    const title = item.dataset.title || 'wedding-photo';
    const fileName = title.replace(/\s+/g, '-').toLowerCase() + '.jpg';

    // Fetch image as blob and download
    fetch(img.src, { mode: 'cors' })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('✅ Photo download ho rahi hai!');
        })
        .catch(() => {
            // Fallback: open in new tab
            window.open(img.src, '_blank');
            showToast('📷 Photo new tab mein khul gayi — right-click karke save karein');
        });
}

// ===== LIGHTBOX =====
let currentLightbox = 0;
let galleryItems = [];

function refreshGalleryItems() {
    galleryItems = Array.from(document.querySelectorAll('.gallery-item')).filter(
        item => item.style.display !== 'none'
    );
}

// Open lightbox on gallery item click
document.getElementById('gallery-grid').addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    // Don't open lightbox if clicking heart or download button
    if (e.target.closest('.heart-btn') || e.target.closest('.download-btn')) return;

    refreshGalleryItems();
    const index = galleryItems.indexOf(item);
    if (index === -1) return;
    currentLightbox = index;
    openLightbox(index);
});

function openLightbox(index) {
    const item = galleryItems[index];
    if (!item) return;

    const img = item.querySelector('.photo img');
    const lightbox = document.getElementById('lightbox');
    const content = document.getElementById('lightbox-content');
    const caption = document.getElementById('lightbox-caption');
    const dlBtn = document.getElementById('lightbox-download-btn');

    if (img && img.style.display !== 'none' && img.src) {
        content.innerHTML = '<img src="' + img.src + '" alt="' + (item.dataset.title || '') + '">';
        dlBtn.style.display = 'flex';
    } else {
        const emoji = item.querySelector('.photo-placeholder');
        content.innerHTML = '<div style="font-size:8rem;">' + (emoji ? emoji.textContent : '📷') + '</div>';
        dlBtn.style.display = 'none';
    }

    caption.textContent = (item.dataset.title || '') + ' — ' + (item.dataset.desc || '');
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(dir) {
    refreshGalleryItems();
    currentLightbox = (currentLightbox + dir + galleryItems.length) % galleryItems.length;
    openLightbox(currentLightbox);
}

// Download from lightbox
function downloadLightboxPhoto() {
    const item = galleryItems[currentLightbox];
    if (!item) return;

    const img = item.querySelector('.photo img');
    if (!img || img.style.display === 'none') return;

    const title = item.dataset.title || 'wedding-photo';
    const fileName = title.replace(/\s+/g, '-').toLowerCase() + '.jpg';

    fetch(img.src, { mode: 'cors' })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('✅ Photo download ho rahi hai!');
        })
        .catch(() => {
            window.open(img.src, '_blank');
            showToast('📷 Photo new tab mein khul gayi — right-click karke save karein');
        });
}

// Lightbox close on background click
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightbox').classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const num = entry.target.querySelector('.counter-number');
            const target = parseInt(num.dataset.target);
            let current = 0;
            const step = Math.ceil(target / 60);
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                num.textContent = current.toLocaleString() + '+';
            }, 30);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-item').forEach(el => counterObserver.observe(el));
