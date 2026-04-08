// ═══════════════════════════════════════════════════════════════════
//  DenQ Chatbot — Hana Bank style Level System
//  Level 0 → Main Menu
//  Level 1 → Product sub-menu  (after clicking "Products")
//  Level 2 → Product detail    (after clicking a specific product)
// ═══════════════════════════════════════════════════════════════════

const chatMessages = document.getElementById('chat-messages');
const userInput    = document.getElementById('user-input');
const sendButton   = document.getElementById('send-button');

// ── State tracker ──────────────────────────────────────────────────
const chatState = {
    level:          0,      // 0 = main menu, 1 = product list, 2 = product detail
    currentProduct: null    // key into PRODUCTS.detail
};

// ─────────────────────────────────────────────────────────────────
//  EDITABLE DATA  ◀  Change product info here, no need to touch
//  the logic below.
// ─────────────────────────────────────────────────────────────────

// Level-1 product menu buttons — add / remove rows freely
const PRODUCT_MENU = [
    { label: '🔩 Fixture',            key: 'fixture'             },
    { label: '🦷 Cement Abutment',    key: 'cement_abutment'     },
    { label: '📐 Angle Abutment',     key: 'angle_abutment'      },
    { label: '🩺 Healing Abutment',   key: 'healing_abutment'    },
    { label: '🧰 Surgical Kit',       key: 'surgical_kit'        },
    { label: '💻 CAD/CAM Library',    key: 'cadcam'              },
];

// Level-2 detail data — one entry per key above
const PRODUCT_DETAIL = {
    fixture: {
        image:    'Fixture.jpg',
        title:    'DenQ Sub Fixture',
        subtitle: 'Premium Dental Implant Solution',
        details:  'Inserted into the jawbone to function as an artificial tooth root through SLA surface treatment — 5× stronger than conventional fixtures.',
        specs: [
            'Diameters: 3.5 mm, 4.0 mm, 4.5 mm, 5.0 mm',
            'Lengths: 7 mm, 8.5 mm, 10 mm, 11.5 mm, 13 mm',
        ],
    },
    cement_abutment: {
        image:    'Cement.png',
        title:    'DenQ Cement Abutment',
        subtitle: 'Cement-retained restoration interface',
        details:  'Connects the fixture to the crown. Curved cuff design reduces pressure and irritation on the gums.',
        specs: [
            'Diameters: 4.0 mm, 4.5 mm, 5.0 mm, 5.5 mm',
            'Gingival heights: 1.0 mm, 2.0 mm, 3.0 mm, 4.0 mm',
            'Torque: 30 Ncm',
        ],
    },
    angle_abutment: {
        image:    'Angled15.png',
        title:    'DenQ Angle Abutment',
        subtitle: 'Angular restorative alignment',
        details:  'Specialised abutment for angled implant cases. Metal coating allows instant visual identification.',
        specs: [
            'Angles: 15°, 25°',
            'Diameters: 4.0 mm, 4.5 mm, 5.0 mm, 5.5 mm',
            'Gingival heights: 1.0 mm, 2.0 mm, 3.0 mm, 4.0 mm',
            'Torque: 30 Ncm',
        ],
    },
    healing_abutment: {
        image:    'Healing Abutment.png',
        title:    'Healing Abutment',
        subtitle: 'Soft tissue preservation abutment',
        details:  'Supports gingival healing and shapes the soft tissue after implant placement.',
        specs: [
            'Diameters: 4.0 mm, 4.5 mm, 5.0 mm, 5.5 mm',
            'Gingival heights: 3.0 mm, 5.0 mm, 7.0 mm',
            'Torque: 10 Ncm',
        ],
    },
    surgical_kit: {
        image:    'DenQTaper.png',
        title:    'DenQ Surgical Kit',
        subtitle: 'DenQ Tapered Implant System',
        details:  'Comprehensive drill set for smooth implant placement and efficient surgical workflow.',
        specs: [
            'Simple KIT: 13 drills',
            'Full KIT: 25 drills',
            'Includes guide pins and measuring tools',
        ],
    },
    cadcam: {
        image:    'cadcam.png',
        title:    'CAD/CAM Library',
        subtitle: 'Digital design support for restorations',
        details:  'High-precision digital libraries for seamless prosthetic design and manufacturing.',
        specs: [
            'Ti-base',
            'Scan body',
            'Lab analogs for digital workflows',
        ],
    },
};

// Static company and CEO data
const CEO_DATA = {
    name:        'Lee Tae Hoon',
    title:       'Founder & CEO',
    image:       'CEO.png',
    company:     'DenQ Implant Co., Ltd',
    founded:     2019,
    vision:      'We Plant Trust, We Grow Smiles',
    highlights: [
        '20+ years of dentistry industry experience',
        'Previously worked at Osstem Implant and leading dental companies',
        'Founded on principles of quality, accessibility, and affordability',
        'Mission: Empower beautiful smiles worldwide with precision solutions',
        'Certifications: FDA Clearance, ISO 13485, MFDS approved',
    ],
};

const COMPANY_DATA = {
    name:      'DenQ Implant Co., Ltd',
    founded:   2019,
    location:  'Busan, South Korea',
    about:     'DenQ Implant Co., Ltd. is a manufacturer of dental implant systems and prosthetic solutions with over 20 years of expertise in clinical precision machining, cleaning, assembly, and quality control.',
    mission:   'To empower beautiful smiles worldwide by providing precision dental implant solutions that are accessible, affordable, and trusted by professionals.',
    vision:    'We Plant Trust, We Grow Smiles',
    timeline: [
        { year: 2019, event: 'DenQ Implant Co., Ltd founded by Lee Tae Hoon in Busan' },
        { year: 2020, event: 'FDA 510(k) clearance achieved for implant systems' },
        { year: 2021, event: 'ISO 13485 Medical Device Quality Management certified' },
        { year: 2022, event: 'MFDS (Korean FDA) approval received for all products' },
        { year: 2023, event: 'Expanded to 15+ countries across Asia, Middle East, CIS, Americas' },
        { year: 2024, event: 'Launched advanced CAD/CAM library and expanded product portfolio' },
    ],
};

const CATALOG_DATA = {
    catalog:   'DenQ_Catalog.pdf',
    brochure:  'DenQ_Brochure.pdf',
};

// ─────────────────────────────────────────────────────────────────
//  UI HELPERS
// ─────────────────────────────────────────────────────────────────

function getCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function appendMessage(text, senderType, isHTML = false) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', senderType === 'bot' ? 'wrapper-bot' : 'wrapper-user');

    const bubble = document.createElement('div');
    bubble.classList.add('message', senderType === 'bot' ? 'bot-message' : 'user-message');

    if (isHTML) { bubble.innerHTML = text; }
    else         { bubble.textContent = text; }

    const time = document.createElement('div');
    time.classList.add('timestamp');
    time.textContent = getCurrentTimestamp();

    wrapper.appendChild(bubble);
    wrapper.appendChild(time);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Render a row of pill buttons below the last bot message.
 * buttons = [{ label, onClick }]
 * layoutHint = 'grid' (default 2-col) | 'wrap' (flex-wrap, natural width)
 */
function showButtons(buttons, layoutHint = 'grid') {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', 'wrapper-bot');

    const container = document.createElement('div');
    container.classList.add('bot-quick-reply-container');

    if (layoutHint === 'wrap') {
        // flex-wrap so buttons size to their label
        container.style.display        = 'flex';
        container.style.flexWrap       = 'wrap';
        container.style.gap            = '8px';
        container.style.paddingTop     = '6px';

        buttons.forEach(btn => {
            const el = document.createElement('button');
            el.classList.add('bot-quick-reply-btn');
            el.textContent = btn.label;
            el.onclick = () => {
                appendMessage(btn.label, 'user', false);
                setTimeout(btn.onClick, 400);
            };
            container.appendChild(el);
        });
    } else {
        // 2-column grid rows (original style)
        for (let i = 0; i < buttons.length; i += 2) {
            const row = document.createElement('div');
            row.classList.add('bot-quick-reply-row');
            for (let j = i; j < i + 2 && j < buttons.length; j++) {
                const el = document.createElement('button');
                el.classList.add('bot-quick-reply-btn');
                el.textContent = buttons[j].label;
                el.onclick = () => {
                    appendMessage(buttons[j].label, 'user', false);
                    setTimeout(buttons[j].onClick, 400);
                };
                row.appendChild(el);
            }
            container.appendChild(row);
        }
    }

    wrapper.appendChild(container);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ─────────────────────────────────────────────────────────────────
//  HTML CARD BUILDERS
// ─────────────────────────────────────────────────────────────────

function buildProductCard(key) {
    const info = PRODUCT_DETAIL[key];
    if (!info) return '<p>Product info not found.</p>';

    const imgHtml = info.image
        ? `<img src="${info.image}" alt="${info.title}" class="bot-product-image"
               onclick="openImageModal('${info.image}', '${info.title}')"
               style="cursor:pointer;">`
        : '';

    const specsHtml = (info.specs || []).map(s => `<li>${s}</li>`).join('');

    return `
        <div class="bot-product-card">
            <div class="bot-product-card-top">
                ${imgHtml}
                <div class="bot-product-copy">
                    <div class="bot-product-title">${info.title}</div>
                    <div class="bot-product-subtitle">${info.subtitle || ''}</div>
                </div>
            </div>
            <p class="bot-product-details">${info.details}</p>
            <ul class="bot-product-specs">${specsHtml}</ul>
        </div>`;
}

function buildCeoCard() {
    const d = CEO_DATA;
    const imgHtml = d.image
        ? `<img src="${d.image}" alt="${d.name}" class="bot-founder-image"
               onclick="openImageModal('${d.image}', '${d.name}')"
               style="cursor:pointer;">`
        : '';
    const highlights = d.highlights.map(h => `<li>${h}</li>`).join('');

    return `
        <div class="bot-history-card">
            <div class="bot-history-photo-block">
                ${imgHtml}
                <div class="bot-founder-info">
                    <div class="bot-founder-name">${d.name}</div>
                    <div class="bot-founder-title">${d.title}</div>
                </div>
            </div>
            <div class="bot-history-text">
                <h3 class="bot-history-company">${d.company}</h3>
                <p class="bot-history-vision">"${d.vision}"</p>
            </div>
            <div class="bot-history-content">
                <div class="bot-history-timeline">
                    <span class="bot-timeline-year">Est. ${d.founded}</span>
                </div>
                <ul class="bot-history-highlights">${highlights}</ul>
            </div>
        </div>`;
}

function buildCompanyCard() {
    const d = COMPANY_DATA;
    const timelineHtml = d.timeline.map(t => `
        <div style="margin-bottom:14px;padding-left:18px;border-left:3px solid var(--denq-pink);">
            <div style="color:var(--denq-pink);font-weight:700;margin-bottom:4px;">${t.year}</div>
            <div style="font-size:0.9rem;color:var(--text-main);">${t.event}</div>
        </div>`).join('');

    return `
        <div class="bot-history-card">
            <div class="bot-history-text">
                <h3 class="bot-history-company">${d.name}</h3>
                <p class="bot-history-vision">"${d.vision}"</p>
            </div>
            <p style="font-size:0.9rem;line-height:1.6;color:var(--text-main);margin-bottom:16px;">${d.about}</p>
            <p style="font-size:0.9rem;line-height:1.6;color:var(--text-muted);margin-bottom:20px;">
                <strong>📍 Location:</strong> ${d.location} &nbsp;|&nbsp;
                <strong>📅 Founded:</strong> ${d.founded}
            </p>
            <h4 style="color:var(--denq-pink);margin:0 0 12px;">🎯 Our Mission</h4>
            <p style="font-size:0.9rem;line-height:1.6;color:var(--text-main);margin-bottom:20px;">${d.mission}</p>
            <h4 style="color:var(--denq-pink);margin:0 0 12px;">📅 Company Timeline</h4>
            <div style="max-height:320px;overflow-y:auto;padding-right:8px;">${timelineHtml}</div>
        </div>`;
}

// ─────────────────────────────────────────────────────────────────
//  LEVEL 0 — Main Menu
// ─────────────────────────────────────────────────────────────────

function showMainMenu() {
    chatState.level          = 0;
    chatState.currentProduct = null;

    appendMessage('Hello customer, how may I help you? 😊', 'bot', false);

    showButtons([
        { label: '📦 Products',                onClick: showProductMenu },
        { label: '📋 Catalog & Brochure',      onClick: showCatalogInfo },
        { label: '👤 CEO Bio',                 onClick: showCeoInfo },
        { label: '🏢 Company History & Intro', onClick: showCompanyInfo },
    ]);
}

// ─────────────────────────────────────────────────────────────────
//  LEVEL 1 — Product sub-menu
// ─────────────────────────────────────────────────────────────────

function showProductMenu() {
    chatState.level          = 1;
    chatState.currentProduct = null;

    appendMessage('Please select a product to see full details:', 'bot', false);

    const btns = PRODUCT_MENU.map(item => ({
        label:   item.label,
        onClick: () => showProductDetail(item.key),
    }));
    btns.push({ label: '◀ Back to Menu', onClick: showMainMenu });

    showButtons(btns, 'wrap');
}

// ─────────────────────────────────────────────────────────────────
//  LEVEL 2 — Product detail
// ─────────────────────────────────────────────────────────────────

function showProductDetail(key) {
    chatState.level          = 2;
    chatState.currentProduct = key;

    if (!PRODUCT_DETAIL[key]) {
        appendMessage('Sorry, product info not found. Please try again.', 'bot', false);
        showProductMenu();
        return;
    }

    appendMessage(buildProductCard(key), 'bot', true);

    showButtons([
        { label: '◀ Back to Products',  onClick: showProductMenu },
        { label: '📞 Request More Info', onClick: showContactInfo },
        { label: '🏠 Main Menu',         onClick: showMainMenu },
    ]);
}

// ─────────────────────────────────────────────────────────────────
//  OTHER SECTION SCREENS
// ─────────────────────────────────────────────────────────────────

function showCeoInfo() {
    chatState.level = 0;
    appendMessage('👤 Meet our founder:', 'bot', false);
    appendMessage(buildCeoCard(), 'bot', true);
    showButtons([
        { label: '🏢 Company History', onClick: showCompanyInfo },
        { label: '📞 Contact Us',       onClick: showContactInfo },
        { label: '🏠 Main Menu',        onClick: showMainMenu },
    ]);
}

function showCompanyInfo() {
    chatState.level = 0;
    appendMessage('🏢 About DenQ Implant Co., Ltd:', 'bot', false);
    appendMessage(buildCompanyCard(), 'bot', true);
    showButtons([
        { label: '👤 CEO Bio',      onClick: showCeoInfo },
        { label: '📞 Contact Us',   onClick: showContactInfo },
        { label: '🏠 Main Menu',    onClick: showMainMenu },
    ]);
}

function showCatalogInfo() {
    chatState.level = 0;

    const html = `
        <div class="bot-product-card">
            <div class="bot-product-title" style="margin-bottom:12px;">📋 DenQ Documents</div>
            <p class="bot-product-details">
                Download our latest catalog and brochure for complete product details,
                specifications, and technical data.
            </p>
            <div style="display:flex;flex-direction:column;gap:10px;margin-top:12px;">
                <a href="${CATALOG_DATA.catalog}" target="_blank" class="resource-button">
                    📥 Download Catalog
                </a>
                <a href="${CATALOG_DATA.brochure}" target="_blank" class="resource-button secondary">
                    📄 Download Brochure
                </a>
            </div>
        </div>`;

    appendMessage(html, 'bot', true);
    showButtons([
        { label: '📦 Products',  onClick: showProductMenu },
        { label: '🏠 Main Menu', onClick: showMainMenu },
    ]);
}

function showContactInfo() {
    chatState.level = 0;

    const html = `
        <div class="bot-product-card">
            <div class="bot-product-title" style="margin-bottom:12px;">📞 Contact DenQ</div>
            <p class="bot-product-details">
                <strong>📱 WhatsApp:</strong> +82 10 8210-9792<br>
                <strong>📧 Email:</strong> biz@denq.kr<br>
                <strong>🌐 Website:</strong> denq.kr<br>
                <strong>📍 HQ:</strong> Busan, South Korea<br>
                <strong>⏰ Support:</strong> 24/7 Available
            </p>
        </div>`;

    appendMessage(html, 'bot', true);
    showButtons([
        { label: '📦 Products',  onClick: showProductMenu },
        { label: '🏠 Main Menu', onClick: showMainMenu },
    ]);
}

// ─────────────────────────────────────────────────────────────────
//  FREE-TEXT INPUT HANDLER
// ─────────────────────────────────────────────────────────────────

function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user', false);
    userInput.value = '';
    setTimeout(() => handleFreeText(text), 700);
}

function handleFreeText(text) {
    const t = text.toLowerCase();

    if (/\b(hi|hello|hey|start|menu|help)\b/.test(t))       { showMainMenu();    return; }
    if (/\b(product|fixture|abutment|kit|implant|cad)\b/.test(t)) { showProductMenu(); return; }
    if (/\b(catalog|brochure|download|pdf)\b/.test(t))       { showCatalogInfo(); return; }
    if (/\b(ceo|founder|lee tae hoon|bio)\b/.test(t))        { showCeoInfo();     return; }
    if (/\b(history|company|about|introduction|intro)\b/.test(t)) { showCompanyInfo(); return; }
    if (/\b(contact|whatsapp|email|phone|reach)\b/.test(t))  { showContactInfo(); return; }

    // Fallback
    appendMessage(
        "I'm not sure I understood that. 🤔 Please choose from the menu or contact us directly.",
        'bot', false
    );
    showButtons([
        { label: '📦 Products',                onClick: showProductMenu },
        { label: '📋 Catalog',                  onClick: showCatalogInfo },
        { label: '👤 CEO Bio',                 onClick: showCeoInfo },
        { label: '🏢 Company History & Intro', onClick: showCompanyInfo },
        { label: '📞 Contact Us',              onClick: showContactInfo },
    ], 'wrap');
}

sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleSend(); });

// ─────────────────────────────────────────────────────────────────
//  IMAGE MODAL
// ─────────────────────────────────────────────────────────────────

function openImageModal(src, title) {
    const modal      = document.getElementById('image-modal');
    const modalImg   = document.getElementById('modal-image');
    const captionEl  = document.getElementById('modal-caption');
    modal.style.display         = 'block';
    modalImg.src                = src;
    captionEl.textContent       = title;
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    document.getElementById('image-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ─────────────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // Kick off with Level 0 main menu
    showMainMenu();

    // Modal close handlers
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeImageModal);

    const modal = document.getElementById('image-modal');
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeImageModal(); });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeImageModal(); });
});