// ============================================
// 1. DATA
// ============================================
const IMAGES = [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1470071459604-7b6ec5a8b8b0?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop&crop=center'
];

const STAYS = [
    {
        id: 1,
        title: 'خانه بوم‌گردی باران',
        desc: 'اقامتگاه سنتی با حیاط پرگل و اتاق‌های روستایی، مناسب برای خانواده‌ها.',
        price: '۹۵۰,۰۰۰',
        capacity: 6,
        img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop&crop=center'
    },
    {
        id: 2,
        title: 'کلبه جنگلی آوای باد',
        desc: 'کلبه‌ای چوبی در دل جنگل با چشم‌انداز به دره و آبشار، تجربه‌ای رویایی.',
        price: '۱,۲۰۰,۰۰۰',
        capacity: 4,
        img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop&crop=center'
    },
    {
        id: 3,
        title: 'مجتمع گردشگری کهن‌دشت',
        desc: 'مجموعه‌ای با کلبه‌های مدرن و امکانات رفاهی کامل، نزدیک به پل شاپور.',
        price: '۱,۶۵۰,۰۰۰',
        capacity: 8,
        img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&crop=center'
    }
];

// ============================================
// 2. HELPERS
// ============================================
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function showToast(msg, type = 'info') {
    const container = $('#toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ============================================
// 3. MOBILE MENU
// ============================================
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');

menuToggle?.addEventListener('click', () => {
    mainNav.classList.toggle('open');
});

// Close menu on link click
$$('nav a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// ============================================
// 4. GALLERY
// ============================================
const galleryGrid = $('#galleryGrid');

IMAGES.forEach((url, i) => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = `منظره طبیعی چای‌باغ ${i+1}`;
    img.loading = 'lazy';
    img.dataset.src = url;
    galleryGrid.appendChild(img);
});

// Lightbox
const lightbox = $('#lightbox');
const lightboxImg = $('#lightboxImg');
const lightboxClose = $('#lightboxClose');

galleryGrid.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    lightboxImg.src = img.src;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
});

function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ============================================
// 5. STAY CARDS (dynamic)
// ============================================
const stayGrid = $('#stayGrid');

STAYS.forEach(stay => {
    const card = document.createElement('div');
    card.className = 'stay-card';
    card.innerHTML = `
        <img src="${stay.img}" alt="${stay.title}" class="stay-card-img" loading="lazy">
        <div class="stay-card-body">
            <h3>${stay.title}</h3>
            <p style="color: rgba(255,255,255,0.7); font-size: 13.5px; margin-bottom: 12px;">${stay.desc}</p>
            <div class="stay-meta">
                <span><i class="fas fa-users"></i> ${stay.capacity} نفر</span>
                <span><i class="fas fa-bed"></i> ${stay.capacity >= 6 ? 'خواب‌خوری' : stay.capacity >= 4 ? 'اتاق' : 'کلبه'}</span>
            </div>
            <div class="stay-price">${stay.price} <small>تومان / شب</small></div>
            <button class="btn btn-accent book-stay-btn" data-id="${stay.id}" style="width: 100%; justify-content: center;">
                <i class="fas fa-calendar-plus"></i> رزرو این اقامتگاه
            </button>
        </div>
    `;
    stayGrid.appendChild(card);
});

// ============================================
// 6. RESERVATION FORM
// ============================================
const form = $('#reservationForm');
const modal = $('#reservationModal');
const modalClose = $('#modalClose');
const modalOkBtn = $('#modalOkBtn');
const modalLoading = $('#modalLoading');
const modalSuccess = $('#modalSuccess');
const modalError = $('#modalError');
const modalErrorText = $('#modalErrorText');

function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    modalLoading.style.display = 'flex';
    modalSuccess.style.display = 'none';
    modalError.style.display = 'none';
}

modalClose?.addEventListener('click', closeModal);
modalOkBtn?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function validatePhone(phone) {
    return /^09[0-9]{9}$/.test(phone.replace(/\s/g, ''));
}

form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = $('#fullName').value.trim();
    const phone = $('#phone').value.trim();
    const checkIn = $('#checkIn').value;
    const checkOut = $('#checkOut').value;
    const guests = $('#guests').value;
    const message = $('#message').value.trim();

    // Validation
    let valid = true;
    
    if (!name) {
        $('#nameError').style.display = 'block';
        valid = false;
    } else {
        $('#nameError').style.display = 'none';
    }
    
    if (!validatePhone(phone)) {
        $('#phoneError').style.display = 'block';
        valid = false;
    } else {
        $('#phoneError').style.display = 'none';
    }
    
    if (!checkIn || !checkOut) {
        showToast('لطفاً تاریخ ورود و خروج را انتخاب کنید.', 'error');
        valid = false;
    }
    
    if (checkIn && checkOut && checkIn > checkOut) {
        showToast('تاریخ ورود نباید از تاریخ خروج بزرگ‌تر باشد.', 'error');
        valid = false;
    }
    
    if (!valid) return;

    // Show modal
    openModal();
    modalLoading.style.display = 'flex';
    modalSuccess.style.display = 'none';
    modalError.style.display = 'none';

    // Simulate API call
    const data = { name, phone, checkIn, checkOut, guests, message };
    console.log('📋 داده‌های رزرو:', data);

    setTimeout(() => {
        const success = Math.random() > 0.15;
        modalLoading.style.display = 'none';
        
        if (success) {
            modalSuccess.style.display = 'block';
            showToast('✅ درخواست رزرو با موفقیت ثبت شد!', 'success');
            form.reset();
        } else {
            modalErrorText.textContent = 'متأسفانه در ثبت درخواست خطایی رخ داد. لطفاً دوباره تلاش کنید.';
            modalError.style.display = 'block';
            showToast('❌ خطا در ثبت درخواست', 'error');
        }
    }, 1200);
});

// ============================================
// 7. BOOK STAY BUTTONS
// ============================================
stayGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.book-stay-btn');
    if (!btn) return;
    
    const stayId = parseInt(btn.dataset.id);
    const stay = STAYS.find(s => s.id === stayId);
    if (!stay) return;

    $('#contact').scrollIntoView({ behavior: 'smooth' });
    const msgField = $('#message');
    
    if (msgField) {
        msgField.value = `درخواست رزرو اقامتگاه "${stay.title}" - ظرفیت ${stay.capacity} نفر`;
        msgField.focus();
        showToast(`📝 اطلاعات اقامتگاه "${stay.title}" اضافه شد.`, 'info');
    }
});

// ============================================
// 8. REVEAL ON SCROLL
// ============================================
const revealEls = $$('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

revealEls.forEach(el => observer.observe(el));

// Check after page load
window.addEventListener('load', () => {
    revealEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
            el.classList.add('visible');
        }
    });
});

// ============================================
// 9. NAV ACTIVE LINK
// ============================================
const navLinks = $$('nav a');

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Update active on scroll
const sections = $$('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) {
            current = sec.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
});

// ============================================
// 10. LIGHTBOX KEYBOARD NAV
// ============================================
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const imgs = $$('#galleryGrid img');
        const currentSrc = lightboxImg.src;
        let idx = imgs.findIndex(img => img.src === currentSrc);
        if (idx === -1) return;
        
        if (e.key === 'ArrowRight') {
            idx = (idx + 1) % imgs.length;
        } else {
            idx = (idx - 1 + imgs.length) % imgs.length;
        }
        lightboxImg.src = imgs[idx].src;
    }
});

console.log('🌿 روستای چای‌باغ - وب‌سایت با موفقیت بارگذاری شد!');
