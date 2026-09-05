/**
 * Delhi News Live — Application Controller
 * Continuous broadsheet newspaper scroll — single unified page
 */

(function () {
    'use strict';

    const SECTIONS = ['Nation', 'City', 'World', 'Politics', 'Business', 'Sport', 'Culture', 'Opinion'];
    const CALIBRATION_COLORS = ['#8f8f8f', '#e5007d', '#00a0e3', '#f6e500', '#111111'];

    class DNLApp {
        constructor() {
            this.appRoot = document.getElementById('app');
            this.currentRoute = '/';
            this.currentSection = null;
            this.editingArticle = null;
            this.searchQuery = '';
            this.init();
        }

        init() {
            window.addEventListener('hashchange', () => this.handleRoute());
            window.addEventListener('popstate', () => this.handleRoute());
            this.handleRoute();
        }

        navigate(route) {
            const targetHash = route === '/' ? '' : route;
            const currentHash = window.location.hash.replace(/^#/, '');
            if (currentHash === targetHash) {
                this.handleRoute();
            } else {
                window.location.hash = targetHash;
            }
        }

        handleRoute() {
            let hash = window.location.hash.replace(/^#/, '') || '/';
            if (!hash.startsWith('/')) hash = '/' + hash;
            this.currentRoute = hash;

            if (hash.startsWith('/section/')) {
                this.currentSection = decodeURIComponent(hash.replace('/section/', ''));
            } else {
                this.currentSection = null;
            }

            this.render();
            window.scrollTo({ top: 0, behavior: 'instant' });
        }

        escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        showToast(msg, type = 'success') {
            const existing = document.getElementById('dnl-toast');
            if (existing) existing.remove();
            const toast = document.createElement('div');
            toast.id = 'dnl-toast';
            toast.className = `dnl-toast ${type === 'error' ? 'dnl-toast--error' : 'dnl-toast--success'}`;
            toast.innerText = msg;
            document.body.appendChild(toast);
            setTimeout(() => toast.classList.add('dnl-toast--visible'), 10);
            setTimeout(() => {
                toast.classList.remove('dnl-toast--visible');
                setTimeout(() => toast.remove(), 400);
            }, 3500);
        }

        getFormattedDate(settings) {
            settings = settings || window.DNLDataStore.getSettings();
            if (settings && settings.date_mode === 'manual' && settings.custom_date && settings.custom_date.trim()) {
                return settings.custom_date.trim();
            }
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            return 'New Delhi, ' + new Date().toLocaleDateString('en-GB', options);
        }

        renderBreakingBanner() {
            const breaking = window.DNLDataStore.getBreakingArticle();
            if (!breaking) return '';

            const tickerText = `${breaking.headline} &nbsp;·&nbsp; ${breaking.standfirst ? breaking.standfirst + ' &nbsp;·&nbsp; ' : ''}<span class="breaking-arrow">READ FULL REPORT →</span>`;

            return `
                <div class="breaking-banner" role="alert">
                    <div class="breaking-badge">
                        <div class="breaking-pulse-dot"></div>
                        <span class="breaking-label">⚡ BREAKING</span>
                    </div>
                    <div class="breaking-ticker-viewport">
                        <div class="breaking-ticker-track">
                            <div class="breaking-ticker-item">
                                <a href="#/article/${breaking.slug}" class="breaking-headline-link">${tickerText}</a>
                            </div>
                            <div class="breaking-ticker-item" aria-hidden="true">
                                <a href="#/article/${breaking.slug}" class="breaking-headline-link">${tickerText}</a>
                            </div>
                            <div class="breaking-ticker-item" aria-hidden="true">
                                <a href="#/article/${breaking.slug}" class="breaking-headline-link">${tickerText}</a>
                            </div>
                            <div class="breaking-ticker-item" aria-hidden="true">
                                <a href="#/article/${breaking.slug}" class="breaking-headline-link">${tickerText}</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        render() {
            if (!this.appRoot) return;

            const settings = window.DNLDataStore.getSettings();
            const route = this.currentRoute;

            let mainContent = '';
            if (route === '/' || route === '') {
                mainContent = this.renderFrontPageScroll();
            } else if (route.startsWith('/section/')) {
                mainContent = this.renderSectionPage(this.currentSection);
            } else if (route.startsWith('/article/')) {
                const slug = route.replace('/article/', '');
                mainContent = this.renderArticlePage(slug);
            } else if (route === '/search') {
                mainContent = this.renderSearchPage();
            } else if (route === '/interviews') {
                mainContent = this.renderInterviewsPage();
            } else if (route === '/gallery' || route === '/archive') {
                mainContent = this.renderGalleryPage();
            } else if (route === '/admin' || route === '/auth') {
                const session = window.DNLDataStore.getAuthSession();
                if (!session) {
                    mainContent = this.renderAuthPage();
                } else {
                    mainContent = this.renderAdminPage();
                }
            } else {
                mainContent = this.render404Page();
            }

            this.appRoot.innerHTML = `
                <div class="paper-page-wrapper">
                    <main class="paper">
                        ${this.renderBreakingBanner()}
                        ${this.renderTopMetaStrip(settings)}
                        ${this.renderMasthead(settings)}
                        ${this.renderSubMastheadStrip(settings)}
                        ${this.renderNavBar()}
                        <div id="route-view-container">
                            ${mainContent}
                        </div>
                        ${this.renderCalibrationDots()}
                        ${this.renderFooter()}
                    </main>
                </div>
            `;

            this.attachEventListeners();
        }

        renderTopMetaStrip(settings) {
            const dateStr = this.getFormattedDate(settings);
            const taglineStr = settings.tagline || 'National English Daily';
            const rniStr = settings.rni_line || 'RNI : DELENG2016/66892';

            return `
                <div class="top-meta-strip">
                    <span class="meta-date">${dateStr}</span>
                    <span class="meta-divider">|</span>
                    <span class="font-condensed" style="letter-spacing: -0.01em;">${taglineStr}</span>
                    <span class="meta-divider">|</span>
                    <span class="font-condensed meta-rni">${rniStr}</span>
                </div>
            `;
        }

        renderMasthead(settings) {
            const isCustomLogo = settings.masthead_url &&
                                 settings.masthead_url !== 'assets/logo.jpg' &&
                                 settings.masthead_url !== 'assets/logo.png' &&
                                 !settings.masthead_url.includes('assets/logo');

            if (isCustomLogo) {
                return `
                    <a href="#/" class="masthead-track" aria-label="Delhi News Live Front Page">
                        <div class="masthead-marquee">
                            <img src="${settings.masthead_url}" alt="${settings.paper_name}" class="masthead-item" />
                            <img src="${settings.masthead_url}" alt="${settings.paper_name}" class="masthead-item" aria-hidden="true" />
                        </div>
                    </a>
                `;
            }

            return `
                <a href="#/" class="masthead-track" aria-label="Delhi News Live Front Page">
                    <div class="masthead-marquee">
                        <div class="masthead-item dnl-logo-lockup" aria-label="${settings.paper_name}">
                            <img src="assets/logo_banner.png" alt="${settings.paper_name}" class="dnl-logo-banner" />
                            <div class="dnl-circle-spin-wrap">
                                <div class="dnl-globe-disc">
                                    <img src="assets/dnl_circle.png" alt="DNL Media" class="dnl-globe-face dnl-globe-front" />
                                    <img src="assets/dnl_circle.png" alt="" class="dnl-globe-face dnl-globe-back" aria-hidden="true" />
                                </div>
                            </div>
                        </div>
                        <div class="masthead-item dnl-logo-lockup" aria-hidden="true">
                            <img src="assets/logo_banner.png" alt="" class="dnl-logo-banner" />
                            <div class="dnl-circle-spin-wrap">
                                <div class="dnl-globe-disc">
                                    <img src="assets/dnl_circle.png" alt="" class="dnl-globe-face dnl-globe-front" />
                                    <img src="assets/dnl_circle.png" alt="" class="dnl-globe-face dnl-globe-back" aria-hidden="true" />
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            `;
        }

        renderSubMastheadStrip(settings) {
            const title = this.currentSection
                ? `${this.currentSection.toUpperCase()} DESK`
                : (settings.edition_line || 'METRO CITY');

            return `
                <div class="sub-masthead-strip">
                    <span class="sub-strip-bar"></span>
                    <span class="edition-title">${title}</span>
                    <span class="sub-strip-bar"></span>
                    <span class="website-label">${settings.website_line || 'www.delhinewslive.co.in'}</span>
                </div>
            `;
        }

        renderNavBar() {
            const current = this.currentRoute;
            const currentSecLower = (this.currentSection || '').toLowerCase();
            const isHome = current === '/' || current === '';
            const isSearch = current === '/search';
            const isVideos = current === '/interviews';
            const isGallery = current === '/gallery' || current === '/archive';

            return `
                <nav class="nav-bar">
                    <a href="#/" class="nav-link ${isHome ? 'active' : ''}">Front Page</a>
                    ${SECTIONS.map(s => `
                        <a href="#/section/${s.toLowerCase()}" class="nav-link ${currentSecLower === s.toLowerCase() ? 'active' : ''}">
                            ${s}
                        </a>
                    `).join('')}
                    <a href="#/gallery" class="nav-link ${isGallery ? 'active' : ''}">Gallery/Archive</a>
                    <a href="#/interviews" class="nav-link ${isVideos ? 'active' : ''}">Videos</a>
                    <a href="#/search" class="nav-link ${isSearch ? 'active' : ''}">Search</a>
                </nav>
            `;
        }

        /* ═══════════════════════════════════════════════════════════════
         * FRONT PAGE CONTINUOUS NEWSPAPER SCROLL
         * Renders: lead banner → side-rail boxed stories → continuation rows
         * ═══════════════════════════════════════════════════════════════ */
        renderFrontPageScroll() {
            const settings = window.DNLDataStore.getSettings();
            const articles = window.DNLDataStore.getPublishedArticles();
            const lead = articles.find(a => (a.placement || '').toString().trim().toLowerCase() === 'lead') || articles[0];
            const secondary = articles.filter(a => (a.placement || '').toString().trim().toLowerCase() === 'front_secondary' && a.id !== lead?.id);
            // Continuation stories: all published stories except the active lead and front_secondary
            const continuation = articles.filter(a =>
                a.id !== lead?.id &&
                (a.placement || '').toString().trim().toLowerCase() !== 'front_secondary'
            );

            if (!lead) {
                return `<p style="padding: 4rem 0; text-align: center; font-family: var(--font-condensed); color: var(--color-stone);">Setting type on Front Page…</p>`;
            }

            return `
                <!-- ── FROM THE EDITOR'S DESK (TOP SPOTLIGHT) ── -->
                ${this.renderEditorDeskSection(settings)}

                <!-- ── FRONT PAGE LEAD ── -->
                <article class="lead-article">
                    ${lead.image_url ? `
                        <figure class="figure-wrapper">
                            <img src="${lead.image_url}" alt="${lead.image_caption || lead.headline}" class="lead-image" loading="eager" />
                            ${lead.image_caption ? `<figcaption class="lead-caption">${lead.image_caption}</figcaption>` : ''}
                        </figure>
                    ` : ''}

                    <h1 class="lead-headline">
                        <a href="#/article/${lead.slug}">${lead.headline}</a>
                    </h1>

                    ${lead.standfirst ? `<p class="lead-standfirst">${lead.standfirst}</p>` : ''}

                    <div class="story-grid-split">
                        <div>
                            ${lead.author_name ? `
                                <div class="byline-bar">
                                    <p>${lead.author_name}</p>
                                </div>
                            ` : ''}

                            <div class="newscols">
                                ${this.renderArticleBodyColumns(lead.body)}
                            </div>

                            <p style="margin-top: 0.5rem;">
                                <a href="#/article/${lead.slug}" class="read-full-report-link">Read the full report →</a>
                            </p>
                        </div>

                        ${secondary.length > 0 ? `
                            <aside class="side-rail">
                                ${secondary.map(art => `
                                    <div class="boxed-story">
                                        ${art.image_url ? `<img src="${art.image_url}" alt="${art.headline}" loading="lazy" />` : ''}
                                        <h2 class="boxed-headline">
                                            <a href="#/article/${art.slug}">${art.headline}</a>
                                        </h2>
                                        <p class="boxed-body">
                                            ${this.getExcerpt(art.body, 420)}
                                        </p>
                                        <a href="#/article/${art.slug}" class="read-full-report-link" style="font-size:11px;">Read more →</a>
                                    </div>
                                `).join('')}
                            </aside>
                        ` : ''}
                    </div>
                </article>

                <!-- ── CONTINUATION SCROLL (newspaper page continuation) ── -->
                ${this.renderContinuationScroll(continuation)}

                <!-- ── VIDEO CLIPPINGS SECTION ── -->
                ${this.renderInterviewsSection()}
            `;
        }

        renderEditorDeskSection(settings) {
            const name = settings.editor_name || 'SYED WAJID';
            const title = settings.editor_title || 'Executive Editor';
            const photoUrl = 'assets/syed_wajid.jpg';
            const defaultBio = `is a seasoned and veteran journalist with an experience of more than two decades. Writing with a flair and passion; crime and politics have been his forte. He has written more than 15000 pieces comprising articles, reports, features and editorials in the past 25 years.

Syed Wajid popularly known as Sufi, is a PIB accredited journalist who has contributed to various media houses including The Hindu, Times of India, Hindustan Times, National Herald, Uday India, Loksatya and Face Group.

He has been working as an executive editor for Delhi News Live, an English daily.

Besides, he has been editing several other english magazines and periodicals as well.`;

            const bioRaw = settings.editor_bio || defaultBio;
            const bioParas = bioRaw.split(/\n\n+/).filter(p => p.trim());
            const igUrl = (settings.editor_instagram && settings.editor_instagram !== 'https://instagram.com')
                ? settings.editor_instagram
                : 'https://www.instagram.com/sufijourno?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==';
            const twUrl = (settings.editor_twitter && settings.editor_twitter !== 'https://twitter.com')
                ? settings.editor_twitter
                : 'https://x.com/journo_sufi?s=20';
            const fbUrl = (settings.editor_facebook && settings.editor_facebook !== 'https://facebook.com')
                ? settings.editor_facebook
                : 'https://www.facebook.com/sufijourno';
            const blogUrl = (settings.editor_blog && settings.editor_blog !== 'https://blogspot.com')
                ? settings.editor_blog
                : 'https://sufijourno.blogspot.com/';

            return `
                <div class="editor-desk-section">
                    <div class="editor-desk-header">
                        <span class="iv-section-rule"></span>
                        <h2 class="iv-section-title">FROM THE EDITOR'S DESK</h2>
                        <span class="iv-section-rule"></span>
                    </div>
                    <div class="editor-desk-card">
                        <div class="editor-desk-avatar">
                            <img src="${photoUrl}" alt="${name}" loading="eager" />
                        </div>
                        <div class="editor-desk-info">
                            <h3 class="editor-desk-name">${name}</h3>
                            <p class="editor-desk-role">${title} · Delhi News Live</p>
                            <div class="editor-desk-bio-body">
                                ${bioParas.map(p => `<p class="editor-desk-bio-p">${p.trim().replace(/\n/g, '<br>')}</p>`).join('')}
                            </div>
                            <div class="editor-desk-socials">
                                <a href="${igUrl}" target="_blank" rel="noopener noreferrer" class="editor-social-link editor-social-ig" aria-label="Syed Wajid Instagram Profile">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    Instagram
                                </a>
                                <a href="${twUrl}" target="_blank" rel="noopener noreferrer" class="editor-social-link editor-social-tw" aria-label="Syed Wajid Twitter Profile">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    Twitter / X
                                </a>
                                <a href="${fbUrl}" target="_blank" rel="noopener noreferrer" class="editor-social-link editor-social-fb" aria-label="Syed Wajid Facebook Profile">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    Facebook
                                </a>
                                <a href="${blogUrl}" target="_blank" rel="noopener noreferrer" class="editor-social-link editor-social-blog" aria-label="Syed Wajid Blog">
                                    BLOG
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        /* ═══════════════════════════════════════════════════════════════
         * VIDEO CLIPPINGS — PUBLIC SECTION
         * ═══════════════════════════════════════════════════════════════ */

        /**
         * Helper: convert a YouTube/Vimeo watch URL to embed URL.
         * Also returns uploaded video DataURLs unchanged.
         */
        normalizeVideoUrl(url) {
            if (!url) return '';
            // Already an embed or data URL
            if (url.includes('/embed/') || url.startsWith('data:') || url.includes('player.vimeo.com')) return url;
            // YouTube: watch?v=ID or youtu.be/ID
            const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/);
            if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
            // Vimeo: vimeo.com/ID
            const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
            if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
            return url;
        }

        renderVideoMedia(clip) {
            const rawUrl = clip.videoUrl || clip.video_url || '';
            const embedUrl = this.normalizeVideoUrl(rawUrl);

            // 1. YouTube or Vimeo Embed
            if (embedUrl && (embedUrl.includes('youtube.com/embed/') || embedUrl.includes('player.vimeo.com/video/'))) {
                return `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" title="${clip.title}"></iframe>`;
            }

            // 2. Direct / Uploaded Video (Data URL, Blob, MP4, WebM, MOV, etc.)
            if (rawUrl) {
                return `
                    <video controls playsinline preload="metadata" poster="${clip.thumbnail || ''}" style="width: 100%; height: 100%; object-fit: contain; background: #000;" title="${clip.title}">
                        <source src="${rawUrl}">
                        Your browser does not support HTML5 video playback.
                    </video>
                `;
            }

            // 3. Fallback to thumbnail or placeholder
            if (clip.thumbnail) {
                return `<img src="${clip.thumbnail}" alt="${clip.title}" class="iv-thumb" />`;
            }

            return `<div class="iv-no-video">&#9654; No preview available</div>`;
        }

        renderInterviewsSection() {
            const visible = window.DNLDataStore.getInterviewsVisible();
            const clips   = window.DNLDataStore.getInterviews();

            if (!visible || clips.length === 0) return '';

            return `
                <div class="iv-section">
                    <div class="iv-section-header">
                        <span class="iv-section-rule"></span>
                        <h2 class="iv-section-title">&#9654; ON CAMERA — VIDEO CLIPPINGS</h2>
                        <span class="iv-section-rule"></span>
                    </div>
                    <div class="iv-grid">
                        ${clips.map(clip => `
                            <div class="iv-card">
                                <div class="iv-video-wrapper">
                                    ${this.renderVideoMedia(clip)}
                                </div>
                                <div class="iv-card-body">
                                    <p class="iv-tag">INTERVIEW</p>
                                    <h3 class="iv-title">${clip.title}</h3>
                                    ${clip.guest ? `<p class="iv-guest">Guest: <strong>${clip.guest}</strong></p>` : ''}
                                    ${clip.description ? `<p class="iv-desc">${clip.description}</p>` : ''}
                                    ${clip.date ? `<p class="iv-date">${clip.date}</p>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        /* Standalone route: /interviews */
        renderInterviewsPage() {
            const visible = window.DNLDataStore.getInterviewsVisible();
            const clips   = window.DNLDataStore.getInterviews();

            if (!visible) {
                return `
                    <div style="padding: 4rem 0; text-align: center;">
                        <h1 style="font-family: var(--font-poster); font-size: 36px; text-transform: uppercase;">Video Clippings</h1>
                        <p style="font-family: var(--font-serifhead); font-style: italic; color: var(--color-stone); margin-top: 1rem;">This section is currently not on air.</p>
                        <a href="#/" class="back-link">← Return to Front Page</a>
                    </div>
                `;
            }

            if (clips.length === 0) {
                return `
                    <div style="padding: 4rem 0; text-align: center;">
                        <h1 style="font-family: var(--font-poster); font-size: 36px; text-transform: uppercase;">Video Clippings</h1>
                        <p style="font-family: var(--font-serifhead); font-style: italic; color: var(--color-stone); margin-top: 1rem;">No interview clips published yet.</p>
                        <a href="#/" class="back-link">← Return to Front Page</a>
                    </div>
                `;
            }

            return `
                <div style="margin-top: 1rem;">
                    <div style="border-bottom: 2px solid var(--color-ink); padding-bottom: 0.5rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: baseline;">
                        <h1 style="font-family: var(--font-poster); font-size: 38px; text-transform: uppercase; line-height: 1;">&#9654; Video Clippings</h1>
                        <span style="font-family: var(--font-condensed); font-size: 13px; text-transform: uppercase; color: var(--color-stone); letter-spacing: 0.14em;">${clips.length} Clips</span>
                    </div>
                    <div class="iv-grid">
                        ${clips.map(clip => `
                            <div class="iv-card">
                                <div class="iv-video-wrapper">
                                    ${this.renderVideoMedia(clip)}
                                </div>
                                <div class="iv-card-body">
                                    <p class="iv-tag">INTERVIEW</p>
                                    <h3 class="iv-title">${clip.title}</h3>
                                    ${clip.guest ? `<p class="iv-guest">Guest: <strong>${clip.guest}</strong></p>` : ''}
                                    ${clip.description ? `<p class="iv-desc">${clip.description}</p>` : ''}
                                    ${clip.date ? `<p class="iv-date">${clip.date}</p>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <p style="margin-top: 1.5rem;"><a href="#/" class="back-link">← Return to Front Page</a></p>
                </div>
            `;
        }

        formatDisplayDate(dateStr) {
            if (!dateStr) return '';
            try {
                const parts = dateStr.split('-');
                if (parts.length === 3) {
                    const year = parts[0];
                    const monthIdx = parseInt(parts[1], 10) - 1;
                    const day = parseInt(parts[2], 10);
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    if (months[monthIdx]) {
                        return `${day < 10 ? '0' + day : day} ${months[monthIdx]} ${year}`;
                    }
                }
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) {
                    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                }
            } catch (e) {}
            return dateStr;
        }

        /* Standalone route: /gallery or /archive */
        renderGalleryPage() {
            const clippings = window.DNLDataStore.getClippings();

            return `
                <div class="gallery-page-container">
                    <div style="border-bottom: 2px solid var(--color-ink); padding-bottom: 0.5rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <span style="font-family: var(--font-condensed); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; color: var(--color-brandred);">Front-Page Archive</span>
                            <h1 style="font-family: var(--font-poster); font-size: 38px; text-transform: uppercase; line-height: 1.08; margin-top: 0.2rem;">Gallery / Archive</h1>
                            <p style="font-family: var(--font-serifhead); font-style: italic; color: var(--color-stone); font-size: 14px; margin-top: 0.25rem;">
                                Scanned front-page editions, special broadsheet print issues, and newspaper clippings.
                            </p>
                        </div>
                        <span style="font-family: var(--font-condensed); font-size: 13px; text-transform: uppercase; color: var(--color-stone); letter-spacing: 0.14em;">
                            ${clippings.length} ${clippings.length === 1 ? 'Clipping' : 'Clippings'}
                        </span>
                    </div>

                    ${clippings.length === 0 ? `
                        <div style="padding: 4rem 1.5rem; text-align: center; border: 1px dashed var(--color-rule); background: var(--color-tint); margin-bottom: 2rem;">
                            <h2 style="font-family: var(--font-poster); font-size: 26px; text-transform: uppercase;">No Archival Clippings Yet</h2>
                            <p style="font-family: var(--font-serifhead); font-style: italic; color: var(--color-stone); margin-top: 0.5rem; font-size: 15px;">
                                Scanned front-page newspaper editions will be exhibited here once uploaded from the Newsroom desk.
                            </p>
                            <a href="#/" class="back-link" style="margin-top: 1.25rem;">← Return to Front Page</a>
                        </div>
                    ` : `
                        <div class="gallery-grid">
                            ${clippings.map(clip => `
                                <div class="clipping-card" data-clipping-id="${this.escapeHtml(clip.id)}" role="button" tabindex="0" aria-label="Open clipping edition of ${this.formatDisplayDate(clip.editionDate)}">
                                    <div class="clipping-thumb-wrap">
                                        <img src="${this.escapeHtml(clip.imageUrl)}" alt="${this.escapeHtml(clip.caption || 'Delhi News Live front page scan')}" class="clipping-thumb" loading="lazy" />
                                        <div class="clipping-overlay-badge">🔍 Expand</div>
                                    </div>
                                    <div class="clipping-card-footer">
                                        <span class="clipping-date-badge">EDITION: ${this.formatDisplayDate(clip.editionDate)}</span>
                                        ${clip.caption ? `<p class="clipping-caption">${this.escapeHtml(clip.caption)}</p>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <p style="margin-top: 1.75rem;"><a href="#/" class="back-link">← Return to Front Page</a></p>
                    `}
                </div>

                <!-- Full-Size Lightbox Modal -->
                <div id="clippingLightbox" class="clipping-lightbox-overlay" style="display: none;" role="dialog" aria-modal="true">
                    <div class="clipping-lightbox-backdrop" id="clippingLightboxBackdrop"></div>
                    <div class="clipping-lightbox-container">
                        <div class="clipping-lightbox-header">
                            <div>
                                <span class="clipping-lightbox-date" id="lbClippingDate"></span>
                                <h3 class="clipping-lightbox-title" id="lbClippingCaption"></h3>
                            </div>
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                <a id="lbClippingExtLink" href="#" target="_blank" rel="noopener" class="clipping-lightbox-ext-btn">Open Original ↗</a>
                                <button type="button" id="lbClippingCloseBtn" class="clipping-lightbox-close-btn" aria-label="Close Lightbox">✕ Close</button>
                            </div>
                        </div>
                        <div class="clipping-lightbox-body">
                            <img id="lbClippingImg" src="" alt="Full size clipping" class="clipping-lightbox-img" />
                        </div>
                    </div>
                </div>
            `;
        }

        /**
         * Builds the newspaper continuation section below the front-page lead.
         * Groups articles into rows based on their `placement` value:
         *   col3  → 3 stories side-by-side (full-width, 3 hairline columns)
         *   col2  → 2 stories side-by-side (2/3 + 1/3 split)
         *   col1  → 1 column brief / sidebar
         * Any unknown placement falls into col3.
         *
         * Articles are consumed sequentially by sort_order.
         */
        renderContinuationScroll(articles) {
            if (!articles || articles.length === 0) return '';

            let html = `<div class="continuation-scroll">`;
            html += `<div class="continuation-rule-top"></div>`;

            // Chunk articles into display rows
            const rows = this.chunkArticlesIntoRows(articles);

            rows.forEach((row, rowIdx) => {
                if (row.type === 'col3') {
                    html += this.renderRow3Col(row.items, rowIdx);
                } else if (row.type === 'col2') {
                    html += this.renderRow2Col(row.items, rowIdx);
                } else {
                    html += this.renderRow1Col(row.items[0], rowIdx);
                }
            });

            html += `</div>`;
            return html;
        }

        /**
         * Groups articles into sequential display rows.
         * Three col3 articles → one row of 3 columns.
         * A col2 article + one col1 → one row.
         * Lone col1 articles → paired if possible.
         */
        chunkArticlesIntoRows(articles) {
            const rows = [];
            let i = 0;

            while (i < articles.length) {
                const art = articles[i];
                const placement = art.placement || 'col3';

                if (placement === 'col3' || placement === 'standard') {
                    // Collect up to 3 consecutive col3/standard articles
                    const gathered = [art];
                    let j = i + 1;
                    while (j < articles.length &&
                           (articles[j].placement === 'col3' || articles[j].placement === 'standard') &&
                           gathered.length < 3) {
                        gathered.push(articles[j]);
                        j++;
                    }
                    i = j;

                    // Apply column_pin: arrange gathered articles into a 3-slot grid.
                    // Slots: [left=0, centre=1, right=2].
                    // Pinned articles claim their slot first; auto articles fill remaining slots in order.
                    const slots = [null, null, null];
                    const pinMap = { left: 0, centre: 1, center: 1, right: 2 };
                    const autos = [];
                    for (const a of gathered) {
                        const pin = (a.column_pin || 'auto').toLowerCase();
                        if (pin !== 'auto' && pinMap[pin] !== undefined) {
                            const slotIdx = pinMap[pin];
                            // If slot already claimed, demote to auto
                            if (!slots[slotIdx]) {
                                slots[slotIdx] = a;
                            } else {
                                autos.push(a);
                            }
                        } else {
                            autos.push(a);
                        }
                    }
                    // Fill empty slots with auto articles
                    for (let s = 0; s < 3; s++) {
                        if (!slots[s] && autos.length > 0) {
                            slots[s] = autos.shift();
                        }
                    }
                    // Trim trailing nulls (if < 3 articles in this batch)
                    const group = slots.filter(Boolean);
                    rows.push({ type: 'col3', items: group });

                } else if (placement === 'col2') {
                    // col2 takes a companion col1 if next article is col1
                    const group = [art];
                    if (i + 1 < articles.length && articles[i + 1].placement === 'col1') {
                        group.push(articles[i + 1]);
                        rows.push({ type: 'col2', items: group });
                        i += 2;
                    } else {
                        rows.push({ type: 'col2', items: group });
                        i += 1;
                    }
                } else if (placement === 'col1') {
                    // Pair two col1 briefs side by side
                    const group = [art];
                    if (i + 1 < articles.length && articles[i + 1].placement === 'col1') {
                        group.push(articles[i + 1]);
                        i += 2;
                    } else {
                        i += 1;
                    }
                    rows.push({ type: 'col1', items: group });
                } else {
                    // Unknown placement → fallback to col3
                    rows.push({ type: 'col3', items: [art] });
                    i += 1;
                }
            }
            return rows;
        }

        /** 3-column broadsheet row */
        renderRow3Col(items, rowIdx) {
            return `
                <div class="cont-row cont-row-3col">
                    ${items.map((art, idx) => `
                        <div class="cont-cell ${idx === 0 ? 'cont-cell-first' : ''}">
                            ${art.section ? `<p class="cont-section-tag">${art.section.toUpperCase()}</p>` : ''}
                            ${art.image_url ? `
                                <figure class="cont-figure">
                                    <img src="${art.image_url}" alt="${art.image_caption || art.headline}" loading="lazy" />
                                    ${art.image_caption ? `<figcaption class="lead-caption">${art.image_caption}</figcaption>` : ''}
                                </figure>
                            ` : ''}
                            <h2 class="cont-headline">
                                <a href="#/article/${art.slug}">${art.headline}</a>
                            </h2>
                            ${art.standfirst ? `<p class="cont-standfirst">${art.standfirst}</p>` : ''}
                            ${art.author_name ? `<div class="byline-bar" style="margin: 0.4rem 0;"><p>${art.author_name}</p></div>` : ''}
                            <div class="cont-body">
                                ${this.renderBodyExcerpt(art.body, 3)}
                            </div>
                            <a href="#/article/${art.slug}" class="read-full-report-link" style="font-size:11px; margin-top: 0.35rem; display:inline-block;">Read full report →</a>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        /** 2-column wide story + optional 1-column brief */
        renderRow2Col(items, rowIdx) {
            const main = items[0];
            const sidebar = items[1];
            return `
                <div class="cont-row cont-row-2col">
                    <div class="cont-cell cont-cell-wide cont-cell-first">
                        ${main.section ? `<p class="cont-section-tag">${main.section.toUpperCase()}</p>` : ''}
                        ${main.image_url ? `
                            <figure class="cont-figure">
                                <img src="${main.image_url}" alt="${main.image_caption || main.headline}" loading="lazy" />
                                ${main.image_caption ? `<figcaption class="lead-caption">${main.image_caption}</figcaption>` : ''}
                            </figure>
                        ` : ''}
                        <h2 class="cont-headline" style="font-size: 28px;">${'<a href="#/article/' + main.slug + '">' + main.headline + '</a>'}</h2>
                        ${main.standfirst ? `<p class="cont-standfirst">${main.standfirst}</p>` : ''}
                        ${main.author_name ? `<div class="byline-bar" style="margin: 0.4rem 0;"><p>${main.author_name}</p></div>` : ''}
                        <div class="cont-body">
                            ${this.renderBodyExcerpt(main.body, 4)}
                        </div>
                        <a href="#/article/${main.slug}" class="read-full-report-link" style="font-size:11px; margin-top: 0.35rem; display:inline-block;">Read full report →</a>
                    </div>

                    ${sidebar ? `
                        <div class="cont-cell cont-cell-narrow">
                            ${sidebar.section ? `<p class="cont-section-tag">${sidebar.section.toUpperCase()}</p>` : ''}
                            <h2 class="cont-headline" style="font-size: 18px;">
                                <a href="#/article/${sidebar.slug}">${sidebar.headline}</a>
                            </h2>
                            ${sidebar.standfirst ? `<p class="cont-standfirst">${sidebar.standfirst}</p>` : ''}
                            <div class="cont-body">
                                ${this.renderBodyExcerpt(sidebar.body, 3)}
                            </div>
                            <a href="#/article/${sidebar.slug}" class="read-full-report-link" style="font-size:11px; margin-top: 0.35rem; display:inline-block;">Read →</a>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        /** 1-column brief row — two briefs side-by-side if available */
        renderRow1Col(items, rowIdx) {
            if (!items) return '';
            const arr = Array.isArray(items) ? items : [items];
            return `
                <div class="cont-row cont-row-briefs">
                    ${arr.map((art, idx) => `
                        <div class="cont-cell cont-brief ${idx === 0 ? 'cont-cell-first' : ''}">
                            ${art.section ? `<p class="cont-section-tag">${art.section.toUpperCase()}</p>` : ''}
                            <h3 class="cont-brief-headline">
                                <a href="#/article/${art.slug}">${art.headline}</a>
                            </h3>
                            ${art.standfirst ? `<p class="cont-standfirst" style="font-size:13px;">${art.standfirst}</p>` : ''}
                            <div class="cont-body" style="font-size: 13px;">
                                ${this.renderBodyExcerpt(art.body, 2)}
                            </div>
                            <a href="#/article/${art.slug}" class="read-full-report-link" style="font-size:11px; margin-top: 0.35rem; display:inline-block;">Read →</a>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        /* ═══════════════════════════════════════════════════════════════
         * SECTION PAGE — same broadsheet scroll for section-filtered stories
         * ═══════════════════════════════════════════════════════════════ */
        renderSectionPage(section) {
            const articles = window.DNLDataStore.getArticlesBySection(section);
            const lead = articles.find(a => a.placement === 'lead') || articles[0];
            const others = articles.filter(a => a.id !== lead?.id);

            if (articles.length === 0) {
                return `
                    <div style="padding: 4rem 0; text-align: center;">
                        <h1 class="page-header-title">${section}</h1>
                        <p style="margin-top: 1rem; font-style: italic; color: var(--color-stone);">No stories filed under ${section} today.</p>
                        <a href="#/" class="back-link">Return to the Front Page</a>
                    </div>
                `;
            }

            return `
                <div style="margin-top: 1rem;">
                    <div style="border-bottom: 2px solid var(--color-ink); padding-bottom: 0.5rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: baseline;">
                        <h1 style="font-family: var(--font-poster); font-size: 38px; text-transform: uppercase; line-height: 1;">
                            ${section}
                        </h1>
                        <span style="font-family: var(--font-condensed); font-size: 13px; text-transform: uppercase; color: var(--color-stone); letter-spacing: 0.14em;">
                            ${articles.length} Reports
                        </span>
                    </div>

                    ${lead ? `
                        <article class="lead-article" style="margin-top: 0;">
                            ${lead.image_url ? `
                                <figure class="figure-wrapper">
                                    <img src="${lead.image_url}" alt="${lead.image_caption || lead.headline}" class="lead-image" loading="eager" />
                                    ${lead.image_caption ? `<figcaption class="lead-caption">${lead.image_caption}</figcaption>` : ''}
                                </figure>
                            ` : ''}

                            <h2 class="lead-headline" style="font-size: 42px;">
                                <a href="#/article/${lead.slug}">${lead.headline}</a>
                            </h2>

                            ${lead.standfirst ? `<p class="lead-standfirst" style="font-size: 20px;">${lead.standfirst}</p>` : ''}

                            ${lead.author_name ? `
                                <div class="byline-bar" style="margin-top: 0.75rem;">
                                    <p>${lead.author_name}</p>
                                </div>
                            ` : ''}

                            <div class="newscols" style="margin-top: 0.75rem;">
                                ${this.renderArticleBodyColumns(lead.body)}
                            </div>

                            <p style="margin-top: 0.5rem;">
                                <a href="#/article/${lead.slug}" class="read-full-report-link">Read full report →</a>
                            </p>
                        </article>
                    ` : ''}

                    ${others.length > 0 ? this.renderContinuationScroll(others) : ''}
                </div>
            `;
        }

        /* ═══════════════════════════════════════════════════════════════
         * BODY HELPERS
         * ═══════════════════════════════════════════════════════════════ */
        renderArticleBodyColumns(bodyText) {
            const blocks = window.DNLDataStore.parseBody(bodyText);
            return blocks.map((b, i) => {
                if (b.type === 'head') {
                    return `<h3 class="col-head">${b.text}</h3>`;
                }
                return `<p class="${i === 0 ? 'dropcap' : ''}" style="${i > 0 ? 'text-indent: 1rem;' : ''}">${b.text}</p>`;
            }).join('');
        }

        /** Render N paragraphs of body, skipping ## heads (they appear inline) */
        renderBodyExcerpt(bodyText, maxParas) {
            const blocks = window.DNLDataStore.parseBody(bodyText);
            let paraCount = 0;
            return blocks.map((b, i) => {
                if (b.type === 'head') {
                    if (paraCount >= maxParas) return '';
                    return `<h4 class="col-head" style="font-size: 13px; margin: 0.35rem 0 0.15rem 0;">${b.text}</h4>`;
                }
                if (paraCount >= maxParas) return '';
                paraCount++;
                return `<p class="${i === 0 ? 'dropcap' : ''}" style="text-indent: ${i > 0 ? '1rem' : '0'};">${b.text}</p>`;
            }).join('');
        }

        getExcerpt(text, length) {
            if (!text) return '';
            const cleaned = text.replace(/##\s.*\n?/g, '').trim();
            return cleaned.length > length ? cleaned.slice(0, length) : cleaned;
        }

        /* ═══════════════════════════════════════════════════════════════
         * ARTICLE DETAIL PAGE
         * ═══════════════════════════════════════════════════════════════ */
        renderArticlePage(slug) {
            const article = window.DNLDataStore.getArticleBySlug(slug);

            if (!article) {
                return `
                    <div style="padding: 5rem 0; text-align: center;">
                        <h1 style="font-family: var(--font-poster); font-size: 36px; text-transform: uppercase;">Story not found</h1>
                        <a href="#/" class="back-link">Back to the front page</a>
                    </div>
                `;
            }

            // 1. Record page view count
            window.DNLDataStore.recordArticleView(article.id);

            const blocks = window.DNLDataStore.parseBody(article.body);
            const layout = article.image_layout || 'top';
            const fullUrl = window.location.origin + window.location.pathname + '#/article/' + article.slug;
            const encodedUrl = encodeURIComponent(fullUrl);
            const encodedHeadline = encodeURIComponent(article.headline);

            // 2. Related articles (3-4 from same section, most recent first)
            const allPublished = window.DNLDataStore.getPublishedArticles();
            let related = allPublished.filter(a => a.id !== article.id && a.section && article.section && a.section.toLowerCase() === article.section.toLowerCase());
            if (related.length < 3) {
                const others = allPublished.filter(a => a.id !== article.id && !related.some(r => r.id === a.id));
                related = related.concat(others);
            }
            related = related.slice(0, 4);

            const socialToolbarHtml = `
                <div class="social-share-toolbar">
                    <span class="share-label">Share Report:</span>
                    <a href="https://api.whatsapp.com/send?text=${encodedHeadline}%20${encodedUrl}" target="_blank" rel="noopener noreferrer" class="share-btn share-btn-whatsapp" aria-label="Share on WhatsApp">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        WhatsApp
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=${encodedHeadline}&url=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="share-btn share-btn-x" aria-label="Share on X">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        Twitter / X
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="share-btn share-btn-fb" aria-label="Share on Facebook">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        Facebook
                    </a>
                    <button type="button" class="share-btn share-btn-copy btn-copy-article-link" data-url="${fullUrl}">
                        🔗 Copy Link
                    </button>
                    <span class="share-copy-toast" style="display:none;">✓ Copied!</span>
                </div>
            `;

            // Figure element helper
            const figureHtml = article.image_url ? `
                <figure class="${layout === 'banner' ? 'article-hero-banner' : (layout === 'left' || layout === 'right' ? 'article-float-figure' : 'article-detail-figure')}">
                    <img src="${article.image_url}" alt="${article.image_caption || article.headline}" loading="eager" />
                    ${article.image_caption ? `<figcaption class="lead-caption">${article.image_caption}</figcaption>` : ''}
                </figure>
            ` : '';

            // Body paragraphs helper
            const bodyParagraphsHtml = blocks.map((b, i) => {
                if (b.type === 'head') {
                    return `<h3 class="col-head" style="font-size: 20px; margin: 1.5rem 0 0.5rem 0;">${b.text}</h3>`;
                }
                return `<p class="${i === 0 ? 'dropcap' : ''}">${b.text}</p>`;
            }).join('');

            // Related section HTML
            const relatedHtml = related.length > 0 ? `
                <section class="related-articles-section">
                    <h2 class="related-section-title">RELATED STORIES FROM THIS DESK</h2>
                    <div class="related-grid">
                        ${related.map(rel => `
                            <article class="related-card">
                                ${rel.image_url ? `<a href="#/article/${rel.slug}"><img src="${rel.image_url}" alt="${rel.headline}" loading="lazy" /></a>` : ''}
                                <p class="related-tag">${rel.section || 'Report'}</p>
                                <h3 class="related-headline">
                                    <a href="#/article/${rel.slug}">${rel.headline}</a>
                                </h3>
                                ${rel.author_name ? `<p class="related-byline">By ${rel.author_name}</p>` : ''}
                            </article>
                        `).join('')}
                    </div>
                </section>
            ` : '';

            return `
                <article class="article-detail-container article-layout-${layout}">
                    ${layout === 'banner' && figureHtml ? figureHtml : ''}

                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                        <p class="article-detail-tag">${article.section || 'General'}</p>
                        <span class="views-count-pill">👁️ ${article.views || 0} views</span>
                    </div>

                    <h1 class="article-detail-title">${article.headline}</h1>

                    ${article.standfirst ? `<p class="article-detail-standfirst">${article.standfirst}</p>` : ''}

                    ${article.author_name ? `
                        <p class="article-detail-byline">By ${article.author_name}</p>
                    ` : ''}

                    ${layout === 'top' && figureHtml ? figureHtml : ''}

                    ${socialToolbarHtml}

                    <div class="article-detail-body">
                        ${(layout === 'left' || layout === 'right') && figureHtml ? figureHtml : ''}
                        ${bodyParagraphsHtml}
                    </div>

                    ${(() => {
                        const galleryImages = Array.isArray(article.gallery_images) ? article.gallery_images.filter(Boolean) : [];
                        if (galleryImages.length === 0) return '';
                        return `
                            <section class="article-photo-gallery">
                                <div class="gallery-header">
                                    <span class="gallery-badge">PHOTO GALLERY</span>
                                    <h3 class="gallery-title">ADDITIONAL PHOTOGRAPHS (${galleryImages.length})</h3>
                                </div>
                                <div class="gallery-grid">
                                    ${galleryImages.map((imgUrl, idx) => `
                                        <figure class="gallery-item js-gallery-trigger" data-index="${idx}" tabindex="0" role="button" aria-label="Open photo ${idx + 1} of ${galleryImages.length} in lightbox">
                                            <img src="${imgUrl}" alt="${article.headline} - Photo ${idx + 1}" loading="lazy" />
                                            <div class="gallery-item-overlay">
                                                <span class="gallery-zoom-icon">🔍 Tap to expand</span>
                                            </div>
                                        </figure>
                                    `).join('')}
                                </div>
                            </section>
                            <div id="articleGalleryModal" class="article-gallery-lightbox-overlay" style="display: none;" role="dialog" aria-modal="true" aria-label="Photo Gallery Lightbox">
                                <div class="article-gallery-backdrop" id="articleGalleryBackdrop"></div>
                                <div class="article-gallery-modal-body">
                                    <div class="article-gallery-top-bar">
                                        <span id="articleGalleryCounter" class="article-gallery-counter">Photo 1 of ${galleryImages.length}</span>
                                        <button type="button" id="articleGalleryCloseBtn" class="article-gallery-close-btn" aria-label="Close Gallery">&times;</button>
                                    </div>
                                    <div class="article-gallery-viewer">
                                        <button type="button" id="articleGalleryPrevBtn" class="article-gallery-arrow-btn prev" aria-label="Previous Photo">&#10094;</button>
                                        <div class="article-gallery-img-wrap">
                                            <img id="articleGalleryCurrentImg" src="" alt="Full size photo" />
                                        </div>
                                        <button type="button" id="articleGalleryNextBtn" class="article-gallery-arrow-btn next" aria-label="Next Photo">&#10095;</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    })()}

                    ${socialToolbarHtml}

                    <p style="margin-top: 1.5rem;">
                        <a href="#/" class="back-link">← Return to Front Page</a>
                    </p>

                    ${relatedHtml}
                </article>
            `;
        }

        /* ═══════════════════════════════════════════════════════════════
         * SEARCH PAGE
         * ═══════════════════════════════════════════════════════════════ */
        renderSearchPage() {
            const query = this.searchQuery.trim().toLowerCase();
            const escapedQuery = this.escapeHtml(this.searchQuery);
            const allArticles = window.DNLDataStore.getPublishedArticles();
            const results = query ? allArticles.filter(art => {
                const searchStr = `${art.headline} ${art.standfirst || ''} ${art.body} ${art.section}`.toLowerCase();
                return searchStr.includes(query);
            }) : [];

            return `
                <h1 class="page-header-title">Search the archive</h1>
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Type a headline, name or keyword…"
                    value="${escapedQuery}"
                    class="search-input-field"
                    autofocus
                />

                <div class="search-results-list">
                    ${query && results.length === 0 ? `
                        <p style="font-family: var(--font-serifhead); font-style: italic; color: var(--color-stone);">No stories match "${escapedQuery}".</p>
                    ` : ''}

                    ${results.map(art => `
                        <article class="search-item">
                            <p class="section-tag">${art.section}</p>
                            <h2>
                                <a href="#/article/${art.slug}">${art.headline}</a>
                            </h2>
                            ${art.standfirst ? `<p>${art.standfirst}</p>` : ''}
                        </article>
                    `).join('')}
                </div>
            `;
        }

        /* ═══════════════════════════════════════════════════════════════
         * AUTH PAGE
         * ═══════════════════════════════════════════════════════════════ */
        renderAuthPage() {
            const session = window.DNLDataStore.getAuthSession();
            if (session) {
                this.navigate('/admin');
                return '';
            }

            return `
                <div class="auth-box">
                    <h1 class="auth-title">Newsroom login</h1>
                    <p class="auth-subtitle">Authorized editorial access for Delhi News Live.</p>

                    <form id="authForm" class="auth-form">
                        <div>
                            <span class="field-label">Editor Email</span>
                            <input type="email" id="authEmail" class="input-standard" placeholder="name@delhinewslive.co.in" autocomplete="email" required />
                        </div>
                        <div>
                            <span class="field-label">Password</span>
                            <input type="password" id="authPassword" class="input-standard" placeholder="••••••••••••" autocomplete="current-password" required minlength="6" />
                        </div>
                        <button type="submit" class="btn-primary">Sign in to Newsroom</button>
                    </form>
                </div>
            `;
        }

        /* ═══════════════════════════════════════════════════════════════
         * ADMIN / NEWSROOM DESK
         * ═══════════════════════════════════════════════════════════════ */
        renderAdminPage() {
            const session = window.DNLDataStore.getAuthSession();
            if (!session) {
                return this.renderAuthPage();
            }

            const settings  = window.DNLDataStore.getSettings();
            const articles  = window.DNLDataStore.getArticles();
            const editing   = this.editingArticle;
            const adminTab  = this.adminTab || 'stories'; // 'stories' | 'analytics' | 'interviews' | 'settings'
            const currentLayout = editing ? (editing.image_layout || 'top') : 'top';

            return `
                <div class="newsroom-header">
                    <div>
                        <h1 class="newsroom-title">Newsroom desk</h1>
                        <p style="font-family: var(--font-condensed); font-size: 12px; color: var(--color-stone); text-transform: uppercase; letter-spacing: 0.12em; margin-top: 0.2rem;">
                            Signed in as: <strong>${(session.user && session.user.email) || 'Editor'}</strong>
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button id="btnNewStory" class="btn-primary" style="width: auto; padding: 0.45rem 1rem;">+ New story</button>
                        <button id="btnSignOut" class="btn-secondary" style="width: auto; padding: 0.45rem 1rem;">Sign out</button>
                    </div>
                </div>

                <!-- Admin Tabs -->
                <div class="admin-tab-bar">
                    <button class="admin-tab-pill ${adminTab === 'stories' ? 'admin-tab-pill--active' : ''}" data-admin-tab="stories">📰 Stories</button>
                    <button class="admin-tab-pill ${adminTab === 'analytics' ? 'admin-tab-pill--active' : ''}" data-admin-tab="analytics">📊 Readership & Analytics</button>
                    <button class="admin-tab-pill ${adminTab === 'interviews' ? 'admin-tab-pill--active' : ''}" data-admin-tab="interviews">🎥 Video Clippings</button>
                    <button class="admin-tab-pill ${adminTab === 'gallery' ? 'admin-tab-pill--active' : ''}" data-admin-tab="gallery">🖼️ Gallery / Archive</button>
                    <button class="admin-tab-pill ${adminTab === 'settings' ? 'admin-tab-pill--active' : ''}" data-admin-tab="settings">⚙️ Site Settings</button>
                </div>

                <!-- ── STORIES TAB ── -->
                <div id="admin-panel-stories" style="${adminTab === 'stories' ? '' : 'display:none;'}">

                <!-- Article Editor Form -->
                ${editing ? `
                    <section class="cms-card cms-card-primary" id="articleEditorCard">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--color-ink); padding-bottom: 0.4rem; margin-bottom: 0.75rem;">
                            <h2 style="font-family: var(--font-poster); font-size: 22px; text-transform: uppercase;">
                                ${editing.id ? 'Edit Story' : 'File a New Story'}
                            </h2>
                            <span class="field-label" style="margin: 0; color: var(--color-brandred);">
                                ${editing.id ? `Editing ID: ${editing.id}` : 'Draft Story'}
                            </span>
                        </div>

                        <form id="storyForm" style="display: flex; flex-direction: column; gap: 0.85rem;">
                            <div>
                                <span class="field-label">Headline *</span>
                                <input type="text" id="storyHeadline" class="input-standard" value="${editing.headline || ''}" placeholder="E.g. METRO EXPANSION APPROVED FOR OUTER CORRIDOR" required />
                            </div>

                            <div>
                                <span class="field-label">Standfirst (Summary subtitle)</span>
                                <input type="text" id="storyStandfirst" class="input-standard" value="${editing.standfirst || ''}" placeholder="Brief introductory synopsis of the report..." />
                            </div>

                            <div class="cms-grid-2">
                                <div>
                                    <span class="field-label">Section</span>
                                    <select id="storySection" class="input-standard">
                                        ${SECTIONS.map(s => `<option value="${s}" ${editing.section === s ? 'selected' : ''}>${s}</option>`).join('')}
                                    </select>
                                </div>
                                <div>
                                    <span class="field-label">👑 Front Page Placement & Headline Prominence</span>
                                    <select id="storyPlacement" class="input-standard">
                                        <option value="lead" ${editing.placement === 'lead' ? 'selected' : ''}>👑 Front Page Lead Banner (Main Top Headline — Only 1 active story)</option>
                                        <option value="front_secondary" ${editing.placement === 'front_secondary' ? 'selected' : ''}>📰 Front Page Side Rail (Boxed story next to lead)</option>
                                        <option value="col3" ${editing.placement === 'col3' ? 'selected' : ''}>📑 Standard 3-Column Story (Main newspaper scroll)</option>
                                        <option value="col2" ${editing.placement === 'col2' ? 'selected' : ''}>📖 Wide 2-Column Feature (Main newspaper scroll)</option>
                                        <option value="col1" ${editing.placement === 'col1' ? 'selected' : ''}>📌 1-Column Brief Report (Main newspaper scroll)</option>
                                    </select>
                                    <div class="admin-lead-help-box">
                                        ⭐ <strong>Front Page Lead Banner:</strong> This makes this story the massive headline that dominates the top of Delhi News Live. Only one story can be the Lead Banner at a time. Selecting this automatically transitions the previous lead story to the newspaper scroll.
                                    </div>
                                </div>

                                <!-- Column Pin — only meaningful for col3 standard scroll stories -->
                                <div id="columnPinGroup" style="${editing.placement === 'col3' || !editing.placement ? '' : 'display:none;'}">
                                    <span class="field-label">📌 Column Position (3-Column Rows)</span>
                                    <select id="storyColumnPin" class="input-standard">
                                        <option value="auto"  ${(editing.column_pin || 'auto') === 'auto'   ? 'selected' : ''}>↔ Auto — Fill naturally in sequence</option>
                                        <option value="left"  ${(editing.column_pin || 'auto') === 'left'   ? 'selected' : ''}>◀ Left Column — Always place in left slot</option>
                                        <option value="centre" ${(editing.column_pin || 'auto') === 'centre' ? 'selected' : ''}>■ Centre Column — Always place in centre slot</option>
                                        <option value="right" ${(editing.column_pin || 'auto') === 'right'  ? 'selected' : ''}>▶ Right Column — Always place in right slot</option>
                                    </select>
                                    <p style="font-family: var(--font-condensed); font-size: 11px; color: var(--color-stone); margin-top: 0.25rem; letter-spacing: 0.08em;">Pin this story to a specific column slot within its 3-col row. Auto-fill stories fill remaining slots in sort order.</p>
                                </div>
                            </div>

                            <div class="cms-grid-2">
                                <div>
                                    <span class="field-label">Byline (Author)</span>
                                    <input type="text" id="storyAuthor" class="input-standard" value="${editing.author_name || 'SYED WAJID'}" placeholder="Reporter or Editor Name" />
                                </div>
                                <div>
                                    <span class="field-label">Slug (URL identifier)</span>
                                    <input type="text" id="storySlug" class="input-standard" value="${editing.slug || ''}" placeholder="auto-generated-from-headline" />
                                </div>
                            </div>

                            <!-- Direct Device File Upload (Main / Featured Image) -->
                            <div style="border: 2px dashed var(--color-ink); padding: 1rem; background-color: var(--color-tint);">
                                <span class="field-label" style="font-size: 13px; color: var(--color-ink); margin-bottom: 0.35rem;">
                                    📷 Main / Featured Photograph (Upload from Device)
                                </span>
                                <input type="file" id="storyImageFile" accept="image/*" class="input-standard" style="background: white; padding: 0.5rem; cursor: pointer;" />

                                <div id="imagePreviewContainer" style="margin-top: 0.75rem; ${editing.image_url ? 'display: block;' : 'display: none;'}">
                                    <p class="field-label">Selected Main Photo Preview:</p>
                                    <div style="position: relative; display: inline-block; max-width: 100%;">
                                        <img id="imagePreview" src="${editing.image_url || ''}" alt="Preview" style="max-height: 220px; width: auto; max-width: 100%; object-fit: cover; border: 1px solid var(--color-rule); display: block;" />
                                        <button type="button" id="btnRemoveMainImage" class="btn-remove-gallery-img" style="top: 6px; right: 6px; width: 26px; height: 26px; font-size: 16px;" title="Remove main photograph">&times;</button>
                                    </div>
                                </div>

                                <input type="hidden" id="storyImage" value="${editing.image_url || ''}" />
                            </div>

                            <!-- Additional Gallery Photos (Multi-Upload) -->
                            <div class="cms-gallery-manager">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                                    <div>
                                        <span class="field-label" style="font-size: 13px; font-weight: 700; color: var(--color-ink); margin: 0;">
                                            🖼️ Additional Photos / Story Gallery (Optional)
                                        </span>
                                        <p style="font-size: 11px; color: var(--color-stone); margin: 2px 0 0 0; font-family: var(--font-headline);">
                                            Select multiple photos to attach a responsive photo gallery to this story.
                                        </p>
                                    </div>
                                    <span id="galleryCountBadge" class="gallery-count-badge">
                                        ${(editing.gallery_images || []).length} photos attached
                                    </span>
                                </div>

                                <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                                    <label for="storyGalleryFiles" class="btn-action-primary" style="margin: 0; padding: 0.4rem 0.85rem; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                                        <span>➕ Select Photos</span>
                                        <input type="file" id="storyGalleryFiles" accept="image/*" multiple style="display: none;" />
                                    </label>
                                    <span id="galleryUploadStatus" style="font-size: 12px; color: var(--color-stone); font-style: italic;"></span>
                                </div>

                                <div id="galleryThumbnailsContainer" class="gallery-thumbnails-grid">
                                    ${(editing.gallery_images || []).map((imgUrl, index) => `
                                        <div class="gallery-thumb-item" data-index="${index}">
                                            <img src="${imgUrl}" alt="Gallery photo ${index + 1}" />
                                            <button type="button" class="btn-remove-gallery-img" data-index="${index}" title="Remove photo">&times;</button>
                                        </div>
                                    `).join('')}
                                </div>
                                <input type="hidden" id="storyGalleryData" value='${JSON.stringify(editing.gallery_images || [])}' />
                            </div>

                            <!-- Visual Layout Picker -->
                            <div>
                                <span class="field-label">Article Image & Text Arrangement Style</span>
                                <div class="layout-picker-grid">
                                    <label class="layout-picker-card ${currentLayout === 'top' ? 'active' : ''}">
                                        <input type="radio" name="storyImageLayout" value="top" ${currentLayout === 'top' ? 'checked' : ''} />
                                        <div class="layout-preview-box">
                                            <div class="layout-mock-img"></div>
                                            <div class="layout-mock-line"></div>
                                            <div class="layout-mock-line"></div>
                                            <div class="layout-mock-line"></div>
                                        </div>
                                        <span class="layout-title">Image Top</span>
                                        <span class="layout-desc">Standard column view</span>
                                    </label>

                                    <label class="layout-picker-card ${currentLayout === 'left' ? 'active' : ''}">
                                        <input type="radio" name="storyImageLayout" value="left" ${currentLayout === 'left' ? 'checked' : ''} />
                                        <div class="layout-preview-box">
                                            <div class="layout-mock-img float-left"></div>
                                            <div class="layout-mock-line"></div>
                                            <div class="layout-mock-line"></div>
                                            <div class="layout-mock-line"></div>
                                            <div class="layout-mock-line"></div>
                                        </div>
                                        <span class="layout-title">Image Left</span>
                                        <span class="layout-desc">Text wraps right</span>
                                    </label>

                                    <label class="layout-picker-card ${currentLayout === 'right' ? 'active' : ''}">
                                        <input type="radio" name="storyImageLayout" value="right" ${currentLayout === 'right' ? 'checked' : ''} />
                                        <div class="layout-preview-box">
                                            <div class="layout-mock-img float-right"></div>
                                            <div class="layout-mock-line"></div>
                                            <div class="layout-mock-line"></div>
                                            <div class="layout-mock-line"></div>
                                            <div class="layout-mock-line"></div>
                                        </div>
                                        <span class="layout-title">Image Right</span>
                                        <span class="layout-desc">Text wraps left</span>
                                    </label>

                                    <label class="layout-picker-card ${currentLayout === 'banner' ? 'active' : ''}">
                                        <input type="radio" name="storyImageLayout" value="banner" ${currentLayout === 'banner' ? 'checked' : ''} />
                                        <div class="layout-preview-box">
                                            <div class="layout-mock-banner"></div>
                                            <div class="layout-mock-head"></div>
                                            <div class="layout-mock-cols">
                                                <div></div><div></div>
                                            </div>
                                        </div>
                                        <span class="layout-title">Hero Banner</span>
                                        <span class="layout-desc">Full-bleed header</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <span class="field-label">Photo Caption</span>
                                <input type="text" id="storyCaption" class="input-standard" value="${editing.image_caption || ''}" placeholder="Explain what is shown in the photograph..." />
                            </div>

                            <div>
                                <span class="field-label">Body copy — blank line between paragraphs, "## " for subheads</span>
                                <textarea id="storyBody" rows="12" class="input-standard" style="resize: vertical;" placeholder="Write story text here...">${editing.body || ''}</textarea>
                            </div>

                            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin: 0.35rem 0;">
                                <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-condensed); text-transform: uppercase; font-size: 13px; letter-spacing: 0.14em; cursor: pointer;">
                                    <input type="checkbox" id="storyPublished" ${editing.published !== false ? 'checked' : ''} />
                                    Publish to live newspaper
                                </label>

                                <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-condensed); text-transform: uppercase; font-size: 13px; letter-spacing: 0.14em; cursor: pointer; color: var(--color-brandred); font-weight: 700;">
                                    <input type="checkbox" id="storyIsBreaking" ${editing.is_breaking ? 'checked' : ''} />
                                    ⚡ Mark as Active Breaking News Headline
                                </label>
                            </div>

                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                <button type="submit" class="btn-primary" style="width: auto; padding: 0.6rem 1.5rem;">Save story</button>
                                <button type="button" id="btnCancelStory" class="btn-secondary" style="width: auto; padding: 0.6rem 1.5rem;">Cancel</button>
                            </div>
                        </form>
                    </section>
                ` : ''}

                <!-- All Stories List -->
                <section style="margin-top: 1.5rem;">
                    <h2 style="font-family: var(--font-poster); font-size: 22px; text-transform: uppercase; border-bottom: 2px solid var(--color-ink); padding-bottom: 0.25rem;">
                        All stories in the newspaper (${articles.length})
                    </h2>

                    <div style="margin-top: 0.5rem;">
                        ${articles.map((art, artIdx) => {
                            const isLead = (art.placement || '').toString().trim().toLowerCase() === 'lead';
                            const pinLabel = art.column_pin && art.column_pin !== 'auto' ? ` · 📌 ${art.column_pin.charAt(0).toUpperCase() + art.column_pin.slice(1)} col` : '';
                            return `
                            <div class="story-table-row ${isLead ? 'story-table-row--lead' : ''}">
                                <!-- Reorder arrows -->
                                <div style="display: flex; flex-direction: column; gap: 2px; margin-right: 0.5rem; flex-shrink: 0;">
                                    <button class="btn-reorder-story" data-id="${art.id}" data-dir="up"
                                        title="Move story up"
                                        style="background: none; border: 1px solid var(--color-rule); border-radius: 3px; padding: 2px 6px; font-size: 12px; cursor: pointer; line-height: 1; color: var(--color-ink); ${artIdx === 0 ? 'opacity: 0.25; pointer-events: none;' : ''}">▲</button>
                                    <button class="btn-reorder-story" data-id="${art.id}" data-dir="down"
                                        title="Move story down"
                                        style="background: none; border: 1px solid var(--color-rule); border-radius: 3px; padding: 2px 6px; font-size: 12px; cursor: pointer; line-height: 1; color: var(--color-ink); ${artIdx === articles.length - 1 ? 'opacity: 0.25; pointer-events: none;' : ''}">▼</button>
                                </div>
                                <div style="flex: 1; min-width: 260px;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem; flex-wrap: wrap;">
                                        ${isLead ? `<span class="badge-lead-banner">👑 LEAD BANNER</span>` : ''}
                                        ${art.is_breaking ? `<span class="breaking-status-badge">⚡ BREAKING</span>` : ''}
                                        <span style="font-family: var(--font-condensed); font-size: 10px; color: var(--color-stone); background: var(--color-tint); border: 1px solid var(--color-rule); border-radius: 3px; padding: 1px 5px; letter-spacing: 0.06em;">#${art.sort_order || 0}</span>
                                        <p style="font-family: var(--font-serifhead); font-weight: 700; font-size: 16px;">${art.headline}</p>
                                    </div>
                                    <p style="font-family: var(--font-condensed); font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-stone);">
                                        ${art.section} · ${isLead ? '<strong style="color: #b45309;">Front Page Lead</strong>' : (art.placement || 'col3')}${pinLabel} · Layout: <strong>${art.image_layout || 'top'}</strong> · By: <strong>${art.author_name || 'SYED WAJID'}</strong> · 👁️ ${art.views || 0} views · ${art.published ? 'Published' : 'Draft'}
                                    </p>
                                </div>
                                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">
                                    ${!isLead ? `
                                        <button class="btn-make-lead btn-set-lead" data-id="${art.id}" style="font-size: 11px; padding: 0.35rem 0.6rem;">
                                            👑 Make Lead
                                        </button>
                                    ` : ''}
                                    <button class="btn-secondary btn-toggle-breaking" data-id="${art.id}" data-breaking="${art.is_breaking ? 'true' : 'false'}" style="font-size: 11px; padding: 0.35rem 0.6rem;">
                                        ${art.is_breaking ? 'Unset Breaking' : 'Set Breaking'}
                                    </button>
                                    <button class="btn-secondary btn-edit-story" data-id="${art.id}">Edit</button>
                                    <button class="btn-danger btn-delete-story" data-id="${art.id}">Delete</button>
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </section>

                </div><!-- /admin-panel-stories -->

                <!-- ── READERSHIP & ANALYTICS TAB ── -->
                <div id="admin-panel-analytics" style="${adminTab === 'analytics' ? '' : 'display:none;'}">
                    <section class="cms-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <h2 style="font-family: var(--font-poster); font-size: 22px; text-transform: uppercase;">
                                📊 Article Readership & Views
                            </h2>
                            <span style="font-family: var(--font-condensed); font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-stone);">
                                Total Tracked Stories: <strong>${articles.length}</strong>
                            </span>
                        </div>
                        <p style="font-family: var(--font-serifhead); font-size: 13px; font-style: italic; color: var(--color-stone); margin-bottom: 1rem;">
                            Track total page reads across the digital broadsheet edition.
                        </p>

                        <table class="analytics-table">
                            <thead>
                                <tr>
                                    <th style="width: 45px;">#</th>
                                    <th>Headline</th>
                                    <th>Section</th>
                                    <th>Author</th>
                                    <th>Layout</th>
                                    <th>Views</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).map((art, idx) => `
                                    <tr>
                                        <td><strong>#${idx + 1}</strong></td>
                                        <td>
                                            <a href="#/article/${art.slug}" target="_blank" style="font-weight: 700; color: var(--color-ink); text-decoration: underline;">
                                                ${art.headline}
                                            </a>
                                            ${art.is_breaking ? ` <span class="breaking-status-badge">BREAKING</span>` : ''}
                                        </td>
                                        <td><span style="font-family: var(--font-condensed); font-size: 12px; text-transform: uppercase;">${art.section}</span></td>
                                        <td><span style="font-family: var(--font-serifhead); font-size: 13px;">${art.author_name || 'SYED WAJID'}</span></td>
                                        <td><span style="font-family: var(--font-condensed); font-size: 11px; text-transform: uppercase;">${art.image_layout || 'top'}</span></td>
                                        <td><span class="views-count-pill">👁️ ${(art.views || 0).toLocaleString()}</span></td>
                                        <td>
                                            <span style="font-family: var(--font-condensed); font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${art.published ? '#059669' : '#d97706'};">
                                                ${art.published ? 'Live' : 'Draft'}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </section>
                </div>

                <!-- ── SITE SETTINGS TAB ── -->
                <div id="admin-panel-settings" style="${adminTab === 'settings' ? '' : 'display:none;'}">
                <section class="cms-card">
                    <h2 class="field-label" style="font-size: 16px; margin-bottom: 0.5rem; text-transform: uppercase;">Front page furniture</h2>
                    <div class="cms-grid-2" style="margin-top: 0.5rem;">
                        <div>
                            <span class="field-label">Paper Name</span>
                            <input type="text" id="setting_paper_name" class="input-standard" value="${settings.paper_name || ''}" />
                        </div>
                        <div>
                            <span class="field-label">Tagline</span>
                            <input type="text" id="setting_tagline" class="input-standard" value="${settings.tagline || ''}" />
                        </div>
                        <div>
                            <span class="field-label">Edition Line</span>
                            <input type="text" id="setting_edition_line" class="input-standard" value="${settings.edition_line || ''}" />
                        </div>
                        <div>
                            <span class="field-label">Website Line</span>
                            <input type="text" id="setting_website_line" class="input-standard" value="${settings.website_line || ''}" />
                        </div>
                        <div>
                            <span class="field-label">RNI Registration Line</span>
                            <input type="text" id="setting_rni_line" class="input-standard" value="${settings.rni_line || 'RNI : DELENG2016/66892'}" placeholder="RNI : DELENG2016/66892" />
                        </div>
                        <div>
                            <span class="field-label">Masthead Date Display Mode</span>
                            <select id="setting_date_mode" class="input-standard">
                                <option value="auto" ${settings.date_mode !== 'manual' ? 'selected' : ''}>Auto-update daily (Dynamic live date)</option>
                                <option value="manual" ${settings.date_mode === 'manual' ? 'selected' : ''}>Manual Custom Date (Fixed override)</option>
                            </select>
                        </div>
                        <div id="customDateContainer" style="${settings.date_mode === 'manual' ? '' : 'display: none;'}">
                            <span class="field-label">Custom Date String (Override)</span>
                            <input type="text" id="setting_custom_date" class="input-standard" value="${settings.custom_date || ''}" placeholder="e.g. New Delhi, Monday, 15 August 2026" />
                            <p style="font-size: 11px; font-style: italic; color: var(--color-stone); margin-top: 0.2rem;">Leave blank or switch to 'Auto-update daily' for today's dynamic date.</p>
                        </div>
                        <div>
                            <span class="field-label">Masthead Logo (Upload From Device)</span>
                            <input type="file" id="setting_masthead_file" accept="image/*" class="input-standard" style="padding: 0.35rem;" />
                            <input type="hidden" id="setting_masthead_url" value="${settings.masthead_url || ''}" />
                        </div>
                    </div>

                    <h2 class="field-label" style="font-size: 16px; margin-top: 1.5rem; margin-bottom: 0.5rem; text-transform: uppercase; border-top: 1px solid var(--color-rule); padding-top: 1rem;">
                        Editor-in-Chief Profile & Social Links
                    </h2>
                    <div class="cms-grid-2">
                        <div>
                            <span class="field-label">Editor / Owner Full Name</span>
                            <input type="text" id="setting_editor_name" class="input-standard" value="${settings.editor_name || 'SYED WAJID'}" />
                        </div>
                        <div>
                            <span class="field-label">Title / Role</span>
                            <input type="text" id="setting_editor_title" class="input-standard" value="${settings.editor_title || 'Editor-in-Chief & Founder'}" />
                        </div>
                    </div>
                    <div class="cms-grid-4" style="margin-top: 0.65rem;">
                        <div>
                            <span class="field-label">Instagram Profile URL</span>
                            <input type="url" id="setting_editor_instagram" class="input-standard" value="${(settings.editor_instagram && settings.editor_instagram !== 'https://instagram.com') ? settings.editor_instagram : 'https://www.instagram.com/sufijourno?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=='}" placeholder="https://instagram.com/sufijourno" />
                        </div>
                        <div>
                            <span class="field-label">Twitter / X Profile URL</span>
                            <input type="url" id="setting_editor_twitter" class="input-standard" value="${(settings.editor_twitter && settings.editor_twitter !== 'https://twitter.com') ? settings.editor_twitter : 'https://x.com/journo_sufi?s=20'}" placeholder="https://x.com/journo_sufi" />
                        </div>
                        <div>
                            <span class="field-label">Facebook Profile URL</span>
                            <input type="url" id="setting_editor_facebook" class="input-standard" value="${(settings.editor_facebook && settings.editor_facebook !== 'https://facebook.com') ? settings.editor_facebook : 'https://www.facebook.com/sufijourno'}" placeholder="https://www.facebook.com/sufijourno" />
                        </div>
                        <div>
                            <span class="field-label">Blog URL</span>
                            <input type="url" id="setting_editor_blog" class="input-standard" value="${(settings.editor_blog && settings.editor_blog !== 'https://blogspot.com') ? settings.editor_blog : 'https://sufijourno.blogspot.com/'}" placeholder="https://sufijourno.blogspot.com/" />
                        </div>
                    </div>
                    <div style="margin-top: 0.75rem;">
                        <span class="field-label">Editor Bio Quote</span>
                        <textarea id="setting_editor_bio" class="input-standard" rows="3">${settings.editor_bio || ''}</textarea>
                    </div>

                    <button id="btnSaveSettings" class="btn-secondary" style="margin-top: 1rem; width: auto; padding: 0.6rem 1.5rem;">Update Site Settings</button>
                </section>
                </div><!-- /admin-panel-settings -->

                <!-- ── VIDEO CLIPPINGS TAB ── -->
                ${this.renderAdminInterviewsTab(adminTab)}
            `;
        }

        /* ═══════════════════════════════════════════════════════════════
         * ADMIN — VIDEO CLIPPINGS TAB
         * ═══════════════════════════════════════════════════════════════ */
        renderAdminInterviewsTab(adminTab) {
            const clips   = window.DNLDataStore.getInterviews();
            const visible = window.DNLDataStore.getInterviewsVisible();

            return `
                <div id="admin-panel-interviews" style="${adminTab === 'interviews' ? '' : 'display:none;'}">
                    <section class="cms-card cms-card-primary" style="margin-top: 1rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                            <h2 style="font-family: var(--font-poster); font-size: 22px; text-transform: uppercase; line-height: 1;">&#9654; Video Clippings Manager</h2>
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                                <span style="font-family: var(--font-condensed); font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-stone);">Section visible on site:</span>
                                <button id="btnToggleInterviewsVisible"
                                    class="${visible ? 'btn-primary' : 'btn-secondary'}"
                                    style="width: auto; padding: 0.35rem 1rem; font-size: 13px;">
                                    ${visible ? '👁️ ON — Click to Hide' : '🚫 OFF — Click to Show'}
                                </button>
                                ${clips.length > 0 ? `
                                    <button id="btnClearAllInterviews" class="btn-danger" style="padding: 0.35rem 0.8rem; font-size: 12px;">⚠️ Remove All Clips</button>
                                ` : ''}
                            </div>
                        </div>
                        <p style="font-family: var(--font-serifhead); font-size: 13px; font-style: italic; color: var(--color-stone); margin-top: 0.5rem;">
                            ${visible
                                ? `Section is <strong>live on the website</strong>. ${clips.length === 0 ? 'Add clips below — the section will appear once you publish the first clip.' : `${clips.length} clip${clips.length !== 1 ? 's' : ''} published.`}`
                                : 'Section is <strong>hidden from the website</strong>. Toggle above to make it live again.'}
                        </p>
                    </section>

                    <!-- ADD NEW CLIP FORM -->
                    <section class="cms-card" style="margin-top: 1rem;">
                        <h2 class="field-label" style="font-size: 14px; margin-bottom: 0.75rem;">&#43; Upload New Interview Clip</h2>

                        <div class="cms-grid-2" style="gap: 0.65rem;">
                            <div>
                                <span class="field-label">Interview Title <span style="color: var(--color-brandred);">*</span></span>
                                <input type="text" id="ivTitle" class="input-standard" placeholder="e.g. EXCLUSIVE: Delhi's Water Crisis Explained"/>
                            </div>
                            <div>
                                <span class="field-label">Guest / Interviewee Name</span>
                                <input type="text" id="ivGuest" class="input-standard" placeholder="e.g. Dr. Arjun Mehta, Water Expert"/>
                            </div>
                        </div>

                        <div style="margin-top: 0.65rem;">
                            <span class="field-label">Short Description (shown below the video)</span>
                            <textarea id="ivDesc" class="input-standard" rows="2" placeholder="A brief 1-2 sentence summary of what was discussed..."></textarea>
                        </div>

                        <!-- Video Source: URL or File -->
                        <div style="margin-top: 0.75rem; border: 1px solid var(--color-rule); padding: 0.85rem;">
                            <p style="font-family: var(--font-condensed); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 0.5rem;">Video Source — choose one:</p>

                            <div class="cms-grid-2" style="gap: 0.5rem; align-items: start;">
                                <div>
                                    <span class="field-label">Option A — Video Link (YouTube / Vimeo)</span>
                                    <input type="url" id="ivUrl" class="input-standard" placeholder="https://www.youtube.com/watch?v=..."/>
                                    <p style="font-size: 11px; font-style: italic; color: var(--color-stone); margin-top: 0.2rem;">Paste a YouTube or Vimeo link — it will embed automatically.</p>
                                </div>
                                <div>
                                    <span class="field-label">Option B — Upload from Your Device</span>
                                    <input type="file" id="ivFile" accept="video/*" class="input-standard" style="padding: 0.35rem;" />
                                    <p style="font-size: 11px; font-style: italic; color: var(--color-stone); margin-top: 0.2rem;">MP4, MOV, WEBM. Saved in browser — use YouTube for larger files.</p>
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 0.65rem;">
                            <span class="field-label">Thumbnail Image (optional — used if video is a file upload)</span>
                            <div class="cms-grid-2" style="gap: 0.5rem;">
                                <div>
                                    <span class="field-label" style="font-size: 10px;">Paste image URL</span>
                                    <input type="url" id="ivThumbUrl" class="input-standard" placeholder="https://images.unsplash.com/..."/>
                                </div>
                                <div>
                                    <span class="field-label" style="font-size: 10px;">Or upload from device</span>
                                    <input type="file" id="ivThumbFile" accept="image/*" class="input-standard" style="padding: 0.35rem;" />
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem;">
                            <button id="btnSaveInterview" class="btn-primary" style="width: auto; padding: 0.55rem 1.5rem;">&#43; Publish Clip</button>
                        </div>
                    </section>

                    <!-- EXISTING CLIPS -->
                    <section style="margin-top: 1.25rem;">
                        <h2 style="font-family: var(--font-poster); font-size: 20px; text-transform: uppercase; border-bottom: 2px solid var(--color-ink); padding-bottom: 0.25rem; margin-bottom: 0.75rem;">
                            Published Clips (${clips.length})
                        </h2>

                        ${clips.length === 0
                            ? `<p style="font-family: var(--font-serifhead); font-style: italic; color: var(--color-stone);">No clips yet. Use the form above to add your first interview.</p>`
                            : clips.map(clip => `
                                <div class="story-table-row" style="gap: 0.75rem;">
                                    <div style="flex-shrink: 0; width: 100px; height: 64px; background: #000; overflow: hidden;">
                                        ${clip.thumbnail
                                            ? `<img src="${clip.thumbnail}" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block;"/>`
                                            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#666;font-size:22px;">&#9654;</div>`}
                                    </div>
                                    <div style="flex: 1; min-width: 0;">
                                        <p style="font-family: var(--font-serifhead); font-weight: 700; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${clip.title}</p>
                                        ${clip.guest ? `<p style="font-family: var(--font-condensed); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-stone);">Guest: ${clip.guest}</p>` : ''}
                                        <p style="font-family: var(--font-condensed); font-size: 11px; color: var(--color-stone);">${clip.date || ''}</p>
                                    </div>
                                    <button class="btn-danger btn-delete-interview" data-iv-id="${clip.id}" style="flex-shrink: 0;">🗑️ Remove</button>
                                </div>
                            `).join('')
                        }
                    </section>
                </div>

                <!-- ── GALLERY / ARCHIVE TAB ── -->
                <div id="admin-panel-gallery" style="${adminTab === 'gallery' ? '' : 'display:none;'}">
                    <section class="cms-card cms-card-primary">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--color-ink); padding-bottom: 0.4rem; margin-bottom: 0.75rem;">
                            <h2 style="font-family: var(--font-poster); font-size: 22px; text-transform: uppercase;">
                                🖼️ Upload Front-Page Clipping
                            </h2>
                            <span class="field-label" style="margin: 0; color: var(--color-stone);">
                                Edition Archive Desk
                            </span>
                        </div>

                        <form id="clippingUploadForm" style="display: flex; flex-direction: column; gap: 0.85rem;">
                            <!-- File Upload Box -->
                            <div>
                                <span class="field-label">Front-Page Clipping Image *</span>
                                <div style="border: 2px dashed var(--color-rule); background: var(--color-tint); padding: 1.25rem; text-align: center; cursor: pointer;" id="clippingDropZone">
                                    <input type="file" id="clippingFileInput" accept="image/*" style="display: none;" />
                                    <button type="button" class="btn-secondary" id="btnBrowseClipping" style="width: auto; padding: 0.4rem 1rem; margin: 0 auto 0.5rem auto;">📁 Choose Clipping Image</button>
                                    <p style="font-family: var(--font-serifhead); font-size: 12px; color: var(--color-stone);">JPG, PNG, or WEBP scanned newspaper front pages. High resolution recommended.</p>
                                    <input type="text" id="clippingImageUrl" class="input-standard" placeholder="Or paste external image URL here..." style="margin-top: 0.65rem; font-size: 13px;" />
                                </div>
                                <div id="clippingPreviewWrap" style="display: none; margin-top: 0.75rem; text-align: center;">
                                    <img id="clippingPreviewImg" src="" alt="Clipping preview" style="max-height: 220px; margin: 0 auto; border: 1px solid var(--color-ink); box-shadow: 0 2px 8px rgba(0,0,0,0.15);" />
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 1rem;">
                                <div>
                                    <span class="field-label">Edition Date *</span>
                                    <input type="date" id="clippingDate" class="input-standard" value="${new Date().toISOString().split('T')[0]}" required />
                                </div>
                                <div>
                                    <span class="field-label">Optional Caption / Edition Title</span>
                                    <input type="text" id="clippingCaption" class="input-standard" placeholder="E.g. Front-Page Lead on Geneva Climate Summit" />
                                </div>
                            </div>

                            <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
                                <button type="submit" id="btnSaveClipping" class="btn-primary" style="width: auto; padding: 0.6rem 1.75rem; font-size: 15px;">
                                    ✓ Upload & Publish to Archive
                                </button>
                            </div>
                        </form>
                    </section>

                    <!-- Existing Clippings Management List -->
                    <section class="cms-card" style="margin-top: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid var(--color-ink); padding-bottom: 0.4rem; margin-bottom: 0.85rem;">
                            <h2 style="font-family: var(--font-poster); font-size: 20px; text-transform: uppercase;">
                                Archived Clippings (${window.DNLDataStore.getClippings().length})
                            </h2>
                            <span class="field-label" style="color: var(--color-stone); font-size: 12px;">Sorted most recent first</span>
                        </div>

                        ${window.DNLDataStore.getClippings().length === 0 ? `
                            <p style="font-family: var(--font-serifhead); font-style: italic; color: var(--color-stone); padding: 1.5rem 0; text-align: center;">
                                No clippings uploaded yet. Use the form above to add your first front-page scan.
                            </p>
                        ` : `
                            <div class="clipping-admin-list">
                                ${window.DNLDataStore.getClippings().map(c => `
                                    <div class="clipping-admin-row">
                                        <img src="${this.escapeHtml(c.imageUrl)}" alt="Thumb" class="clipping-admin-thumb" />
                                        <div class="clipping-admin-info">
                                            <strong style="font-family: var(--font-serifhead); font-size: 15px; display: block;">
                                                Edition: ${this.formatDisplayDate(c.editionDate)}
                                            </strong>
                                            ${c.caption ? `<p style="font-size: 13px; color: var(--color-ink); margin-top: 0.2rem;">${this.escapeHtml(c.caption)}</p>` : ''}
                                            <span style="font-family: var(--font-condensed); font-size: 11px; color: var(--color-stone); text-transform: uppercase;">
                                                Uploaded: ${new Date(c.created_at || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                                            <a href="${this.escapeHtml(c.imageUrl)}" target="_blank" class="btn-secondary" style="width: auto; padding: 0.35rem 0.75rem; font-size: 12px;">View</a>
                                            <button class="btn-secondary btnDeleteClipping" data-clip-id="${c.id}" style="width: auto; padding: 0.35rem 0.75rem; font-size: 12px; color: var(--color-brandred); border-color: var(--color-brandred);">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </section>
                </div>
            `;
        }

        /* ═══════════════════════════════════════════════════════════════
         * SHARED CHROME
         * ═══════════════════════════════════════════════════════════════ */
        renderCalibrationDots() {
            return `
                <div class="calibration-dots-strip">
                    ${[0, 1, 2, 3].map(() => `
                        <div class="dot-cluster">
                            ${CALIBRATION_COLORS.map(c => `<span class="reg-dot" style="background-color: ${c};"></span>`).join('')}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        renderFooter() {
            return `
                <footer class="footer-credits">
                    <p>
                        Published by DNL Media. All rights reserved.
                    </p>
                </footer>
            `;
        }

        render404Page() {
            return `
                <div style="padding: 5rem 0; text-align: center;">
                    <h1 style="font-family: var(--font-poster); font-size: 64px; text-transform: uppercase;">404</h1>
                    <h2 style="font-family: var(--font-condensed); font-size: 20px; text-transform: uppercase;">Page Not Found</h2>
                    <a href="#/" class="back-link">Return to the Front Page</a>
                </div>
            `;
        }

        /* ═══════════════════════════════════════════════════════════════
         * EVENT LISTENERS
         * ═══════════════════════════════════════════════════════════════ */
        attachEventListeners() {
            // Search Input
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.searchQuery = e.target.value;
                    const query = this.searchQuery.trim().toLowerCase();
                    const allArticles = window.DNLDataStore.getPublishedArticles();
                    const results = query ? allArticles.filter(art => {
                        const searchStr = `${art.headline} ${art.standfirst || ''} ${art.body} ${art.section}`.toLowerCase();
                        return searchStr.includes(query);
                    }) : [];

                    const resultsContainer = document.querySelector('.search-results-list');
                    if (resultsContainer) {
                        resultsContainer.innerHTML = `
                            ${query && results.length === 0 ? `
                                <p style="font-family: var(--font-serifhead); font-style: italic; color: var(--color-stone);">No stories match "${this.searchQuery}".</p>
                            ` : ''}

                            ${results.map(art => `
                                <article class="search-item">
                                    <p class="section-tag">${art.section}</p>
                                    <h2>
                                        <a href="#/article/${art.slug}">${art.headline}</a>
                                    </h2>
                                    ${art.standfirst ? `<p>${art.standfirst}</p>` : ''}
                                </article>
                            `).join('')}
                        `;
                    }
                });
            }

            // Copy Link Share Buttons
            document.querySelectorAll('.btn-copy-article-link').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const url = btn.getAttribute('data-url') || window.location.href;
                    try {
                        await navigator.clipboard.writeText(url);
                        const toast = btn.parentElement ? btn.parentElement.querySelector('.share-copy-toast') : null;
                        if (toast) {
                            toast.style.display = 'inline-block';
                            setTimeout(() => { toast.style.display = 'none'; }, 2000);
                        } else {
                            alert('Link copied to clipboard!');
                        }
                    } catch (err) {
                        prompt('Copy this link:', url);
                    }
                });
            });

            // Article Photo Gallery Lightbox Handlers
            const galleryModal = document.getElementById('articleGalleryModal');
            if (galleryModal) {
                const galleryItems = Array.from(document.querySelectorAll('.js-gallery-trigger'));
                const modalImg = document.getElementById('articleGalleryCurrentImg');
                const counterEl = document.getElementById('articleGalleryCounter');
                const prevBtn = document.getElementById('articleGalleryPrevBtn');
                const nextBtn = document.getElementById('articleGalleryNextBtn');
                const closeBtn = document.getElementById('articleGalleryCloseBtn');
                const backdrop = document.getElementById('articleGalleryBackdrop');

                let currentIndex = 0;
                const total = galleryItems.length;

                const showGalleryPhoto = (idx) => {
                    if (total === 0) return;
                    currentIndex = (idx + total) % total;
                    const trigger = galleryItems[currentIndex];
                    const img = trigger ? trigger.querySelector('img') : null;
                    if (img && modalImg) {
                        modalImg.src = img.src;
                        modalImg.alt = img.alt || `Photo ${currentIndex + 1}`;
                    }
                    if (counterEl) {
                        counterEl.innerText = `Photo ${currentIndex + 1} of ${total}`;
                    }
                };

                const openGalleryModal = (startIdx) => {
                    showGalleryPhoto(startIdx);
                    galleryModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                };

                const closeGalleryModal = () => {
                    galleryModal.style.display = 'none';
                    document.body.style.overflow = '';
                };

                galleryItems.forEach(item => {
                    item.addEventListener('click', () => {
                        const idx = parseInt(item.getAttribute('data-index'), 10) || 0;
                        openGalleryModal(idx);
                    });
                    item.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            const idx = parseInt(item.getAttribute('data-index'), 10) || 0;
                            openGalleryModal(idx);
                        }
                    });
                });

                if (closeBtn) closeBtn.addEventListener('click', closeGalleryModal);
                if (backdrop) backdrop.addEventListener('click', closeGalleryModal);
                if (prevBtn) prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showGalleryPhoto(currentIndex - 1);
                });
                if (nextBtn) nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showGalleryPhoto(currentIndex + 1);
                });

                // Keyboard controls for photo gallery modal
                if (this._galleryKeyHandler) {
                    window.removeEventListener('keydown', this._galleryKeyHandler);
                }
                this._galleryKeyHandler = (e) => {
                    if (galleryModal.style.display === 'none') return;
                    if (e.key === 'Escape') {
                        closeGalleryModal();
                    } else if (e.key === 'ArrowLeft') {
                        showGalleryPhoto(currentIndex - 1);
                    } else if (e.key === 'ArrowRight') {
                        showGalleryPhoto(currentIndex + 1);
                    }
                };
                window.addEventListener('keydown', this._galleryKeyHandler);
            }

            // Layout Picker Radio Card Selection
            document.querySelectorAll('input[name="storyImageLayout"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    document.querySelectorAll('.layout-picker-card').forEach(c => c.classList.remove('active'));
                    const card = radio.closest('.layout-picker-card');
                    if (card) card.classList.add('active');
                });
            });

            document.querySelectorAll('.layout-picker-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const radio = card.querySelector('input[type="radio"]');
                    if (radio) {
                        radio.checked = true;
                        document.querySelectorAll('.layout-picker-card').forEach(c => c.classList.remove('active'));
                        card.classList.add('active');
                    }
                });
            });

            // Auth Login Form
            const authForm = document.getElementById('authForm');
            if (authForm) {
                authForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const submitBtn = authForm.querySelector('button[type="submit"]');
                    const origText = submitBtn ? submitBtn.innerText : '';
                    if (submitBtn) {
                        submitBtn.innerText = 'Signing in...';
                        submitBtn.disabled = true;
                    }

                    const email = document.getElementById('authEmail').value;
                    const pass = document.getElementById('authPassword').value;

                    try {
                        await window.DNLDataStore.login(email, pass);
                        this.render();
                    } catch (err) {
                        alert('Login failed: ' + (err.message || err));
                    } finally {
                        if (submitBtn) {
                            submitBtn.innerText = origText;
                            submitBtn.disabled = false;
                        }
                    }
                });
            }

            // Sign Out
            const btnSignOut = document.getElementById('btnSignOut');
            if (btnSignOut) {
                btnSignOut.addEventListener('click', async () => {
                    await window.DNLDataStore.logout();
                    this.navigate('/');
                });
            }

            // New Story
            const btnNewStory = document.getElementById('btnNewStory');
            if (btnNewStory) {
                btnNewStory.addEventListener('click', () => {
                    this.editingArticle = {
                        headline: '',
                        standfirst: '',
                        section: 'Nation',
                        placement: 'col3',
                        author_name: 'SYED WAJID',
                        slug: '',
                        image_url: '',
                        image_caption: '',
                        image_layout: 'top',
                        gallery_images: [],
                        is_breaking: false,
                        views: 0,
                        body: '',
                        published: true
                    };
                    this.render();
                    const editor = document.getElementById('articleEditorCard');
                    if (editor) editor.scrollIntoView({ behavior: 'smooth' });
                });
            }

            // Cancel Story
            const btnCancelStory = document.getElementById('btnCancelStory');
            if (btnCancelStory) {
                btnCancelStory.addEventListener('click', () => {
                    this.editingArticle = null;
                    this.render();
                });
            }

            // Device Image Upload for Story (Main Image)
            const storyImageFile = document.getElementById('storyImageFile');
            const btnRemoveMainImage = document.getElementById('btnRemoveMainImage');
            if (btnRemoveMainImage) {
                btnRemoveMainImage.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (storyImageFile) storyImageFile.value = '';
                    const urlInput = document.getElementById('storyImage');
                    if (urlInput) urlInput.value = '';
                    const preview = document.getElementById('imagePreview');
                    if (preview) preview.src = '';
                    const previewContainer = document.getElementById('imagePreviewContainer');
                    if (previewContainer) previewContainer.style.display = 'none';
                    if (this.editingArticle) {
                        this.editingArticle.image_url = '';
                    }
                });
            }

            if (storyImageFile) {
                storyImageFile.addEventListener('change', async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                        if (!file.type.startsWith('image/')) {
                            alert('Please select a valid image file (JPG, PNG, WebP, GIF).');
                            storyImageFile.value = '';
                            return;
                        }
                        if (file.size > 8 * 1024 * 1024) {
                            alert('Image file size exceeds 8MB limit. Please choose a smaller photo.');
                            storyImageFile.value = '';
                            return;
                        }
                        const preview = document.getElementById('imagePreview');
                        const previewContainer = document.getElementById('imagePreviewContainer');
                        const urlInput = document.getElementById('storyImage');
                        if (urlInput) urlInput.value = 'Uploading to Supabase Storage...';

                        const uploadedUrl = await window.DNLDataStore.uploadMediaFile(file, 'articles');
                        if (urlInput) urlInput.value = uploadedUrl;
                        if (preview && previewContainer) {
                            preview.src = uploadedUrl;
                            previewContainer.style.display = 'block';
                        }
                        if (this.editingArticle) {
                            this.editingArticle.image_url = uploadedUrl;
                        }
                    }
                });
            }

            // Device Multi-Image Gallery Upload for Story
            const storyGalleryFiles = document.getElementById('storyGalleryFiles');
            const wireGalleryRemoveButtons = () => {
                document.querySelectorAll('.btn-remove-gallery-img').forEach(btn => {
                    btn.onclick = (ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        const idx = parseInt(btn.getAttribute('data-index'), 10);
                        const hiddenInput = document.getElementById('storyGalleryData');
                        const container = document.getElementById('galleryThumbnailsContainer');
                        const countBadge = document.getElementById('galleryCountBadge');
                        let currentGallery = [];
                        try {
                            currentGallery = JSON.parse(hiddenInput?.value || '[]');
                        } catch (err) {
                            currentGallery = [];
                        }
                        if (idx >= 0 && idx < currentGallery.length) {
                            currentGallery.splice(idx, 1);
                        }
                        if (hiddenInput) hiddenInput.value = JSON.stringify(currentGallery);
                        if (this.editingArticle) {
                            this.editingArticle.gallery_images = currentGallery;
                        }
                        if (countBadge) countBadge.innerText = `${currentGallery.length} photos attached`;
                        if (container) {
                            container.innerHTML = currentGallery.map((imgUrl, index) => `
                                <div class="gallery-thumb-item" data-index="${index}">
                                    <img src="${imgUrl}" alt="Gallery photo ${index + 1}" />
                                    <button type="button" class="btn-remove-gallery-img" data-index="${index}" title="Remove photo">&times;</button>
                                </div>
                            `).join('');
                            wireGalleryRemoveButtons();
                        }
                    };
                });
            };

            if (storyGalleryFiles) {
                wireGalleryRemoveButtons();

                storyGalleryFiles.addEventListener('change', async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;

                    const statusEl = document.getElementById('galleryUploadStatus');
                    const container = document.getElementById('galleryThumbnailsContainer');
                    const hiddenInput = document.getElementById('storyGalleryData');
                    const countBadge = document.getElementById('galleryCountBadge');

                    let currentGallery = [];
                    try {
                        currentGallery = JSON.parse(hiddenInput?.value || '[]');
                    } catch (err) {
                        currentGallery = [];
                    }

                    if (statusEl) statusEl.innerText = `Uploading 0 of ${files.length} photos...`;

                    let addedCount = 0;
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        if (!file.type || !file.type.startsWith('image/')) continue;
                        if (file.size > 8 * 1024 * 1024) {
                            alert(`Photo "${file.name}" exceeds 8MB limit and was skipped.`);
                            continue;
                        }
                        if (statusEl) statusEl.innerText = `Uploading photo ${i + 1} of ${files.length}...`;
                        try {
                            const uploadedUrl = await window.DNLDataStore.uploadMediaFile(file, 'articles');
                            if (uploadedUrl) {
                                currentGallery.push(uploadedUrl);
                                addedCount++;
                            }
                        } catch (upErr) {
                            console.warn('Gallery upload error for file:', file.name, upErr);
                        }
                    }

                    if (statusEl) {
                        statusEl.innerText = addedCount > 0 ? `✓ ${addedCount} photo(s) added.` : '';
                        setTimeout(() => {
                            const sEl = document.getElementById('galleryUploadStatus');
                            if (sEl) sEl.innerText = '';
                        }, 3500);
                    }

                    if (hiddenInput) hiddenInput.value = JSON.stringify(currentGallery);
                    if (this.editingArticle) {
                        this.editingArticle.gallery_images = currentGallery;
                    }
                    if (countBadge) countBadge.innerText = `${currentGallery.length} photos attached`;
                    if (container) {
                        container.innerHTML = currentGallery.map((imgUrl, index) => `
                            <div class="gallery-thumb-item" data-index="${index}">
                                <img src="${imgUrl}" alt="Gallery photo ${index + 1}" />
                                <button type="button" class="btn-remove-gallery-img" data-index="${index}" title="Remove photo">&times;</button>
                            </div>
                        `).join('');
                        wireGalleryRemoveButtons();
                    }

                    storyGalleryFiles.value = '';
                });
            }

            // Masthead Logo Upload
            const mastheadFile = document.getElementById('setting_masthead_file');
            if (mastheadFile) {
                mastheadFile.addEventListener('change', async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                        if (!file.type.startsWith('image/')) {
                            alert('Please select a valid image file for masthead logo.');
                            mastheadFile.value = '';
                            return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                            alert('Logo image exceeds 5MB limit.');
                            mastheadFile.value = '';
                            return;
                        }
                        const uploadedUrl = await window.DNLDataStore.uploadMediaFile(file, 'branding');
                        document.getElementById('setting_masthead_url').value = uploadedUrl;
                    }
                });
            }

            // Headline → Slug auto-gen
            const storyHeadlineInput = document.getElementById('storyHeadline');
            const storySlugInput = document.getElementById('storySlug');
            if (storyHeadlineInput && storySlugInput) {
                storyHeadlineInput.addEventListener('input', (e) => {
                    if (!this.editingArticle || !this.editingArticle.id) {
                        storySlugInput.value = window.DNLDataStore.slugify(e.target.value);
                    }
                });
            }

            // Save Story
            const storyForm = document.getElementById('storyForm');
            if (storyForm) {
                storyForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const submitBtn = storyForm.querySelector('button[type="submit"]');
                    const origBtnText = submitBtn ? submitBtn.innerText : 'Save story';

                    const imgUrl = document.getElementById('storyImage')?.value || '';
                    if (imgUrl === 'Uploading to Supabase Storage...') {
                        alert('Your photo is still processing/uploading. Please wait a moment before saving.');
                        return;
                    }

                    const galleryStatus = document.getElementById('galleryUploadStatus');
                    if (galleryStatus && galleryStatus.innerText.includes('Uploading')) {
                        alert('Gallery photos are still uploading. Please wait a moment before saving.');
                        return;
                    }

                    if (submitBtn) {
                        submitBtn.innerText = 'Publishing story...';
                        submitBtn.disabled = true;
                    }

                    const selectedLayoutRadio = document.querySelector('input[name="storyImageLayout"]:checked');
                    const selectedLayout = selectedLayoutRadio ? selectedLayoutRadio.value : 'top';

                    const selectedPlacement = document.getElementById('storyPlacement').value;
                    const columnPinEl = document.getElementById('storyColumnPin');
                    const selectedColumnPin = (selectedPlacement === 'col3' && columnPinEl) ? columnPinEl.value : 'auto';

                    let galleryImages = [];
                    try {
                        const rawGallery = document.getElementById('storyGalleryData')?.value;
                        galleryImages = rawGallery ? JSON.parse(rawGallery) : [];
                    } catch (e) {
                        galleryImages = [];
                    }
                    if (!Array.isArray(galleryImages)) galleryImages = [];

                    const updated = {
                        ...this.editingArticle,
                        headline: document.getElementById('storyHeadline').value,
                        standfirst: document.getElementById('storyStandfirst').value,
                        section: document.getElementById('storySection').value,
                        placement: selectedPlacement,
                        column_pin: selectedColumnPin,
                        author_name: document.getElementById('storyAuthor').value || 'SYED WAJID',
                        slug: document.getElementById('storySlug').value || window.DNLDataStore.slugify(document.getElementById('storyHeadline').value),
                        image_url: imgUrl,
                        image_caption: document.getElementById('storyCaption').value,
                        image_layout: selectedLayout,
                        gallery_images: galleryImages,
                        is_breaking: document.getElementById('storyIsBreaking') ? document.getElementById('storyIsBreaking').checked : false,
                        body: document.getElementById('storyBody').value,
                        published: document.getElementById('storyPublished').checked
                    };

                    try {
                        await window.DNLDataStore.saveArticle(updated);
                        this.editingArticle = null;
                        this.render();
                        this.showToast(`✓ Story "${updated.headline}" saved and published!`);
                    } catch (saveErr) {
                        const errMsg = saveErr.message || String(saveErr);
                        if (errMsg.toLowerCase().includes('row-level security') || errMsg.toLowerCase().includes('policy')) {
                            this.showToast('Login session expired. Please sign out and log in again.', 'error');
                        } else {
                            this.showToast('Could not save story: ' + errMsg, 'error');
                        }
                    } finally {
                        if (submitBtn) {
                            submitBtn.innerText = origBtnText;
                            submitBtn.disabled = false;
                        }
                    }
                });
            }

            // Set as Lead Banner Button in Story List
            document.querySelectorAll('.btn-set-lead').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    const art = window.DNLDataStore.getArticles().find(a => a.id === id);
                    if (art) {
                        if (confirm(`Make "${art.headline}" the Front Page Lead Banner?\n(The previous lead story will be automatically moved to the standard newspaper scroll)`)) {
                            btn.innerText = 'Updating...';
                            btn.disabled = true;
                            let supabaseWarn = null;
                            try {
                                await window.DNLDataStore.saveArticle({ ...art, placement: 'lead' });
                            } catch (err) {
                                // saveArticle already wrote to localStorage before throwing.
                                // Log the Supabase error but do not abort — show the updated list.
                                supabaseWarn = err.message || String(err);
                                console.warn('⚠️ Make Lead: Supabase sync warning (local save succeeded):', supabaseWarn);
                            }
                            // Always re-render so admin sees the correct state
                            this.render();
                            if (supabaseWarn) {
                                console.warn('Make Lead set locally. Supabase sync note:', supabaseWarn);
                            }
                        }
                    }
                });
            });

            // Edit Story Buttons
            document.querySelectorAll('.btn-edit-story').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const art = window.DNLDataStore.getArticles().find(a => a.id === id);
                    if (art) {
                        this.editingArticle = { ...art };
                        this.render();
                        const editor = document.getElementById('articleEditorCard');
                        if (editor) editor.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            // Delete Story Buttons
            document.querySelectorAll('.btn-delete-story').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    const art = window.DNLDataStore.getArticles().find(a => a.id === id);
                    if (confirm(`Spike (delete) story: "${art?.headline}"?`)) {
                        await window.DNLDataStore.deleteArticle(id);
                        this.render();
                    }
                });
            });

            // Reorder (↑/↓) Buttons in Story List
            document.querySelectorAll('.btn-reorder-story').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    const dir = btn.getAttribute('data-dir');
                    btn.style.opacity = '0.4';
                    btn.disabled = true;
                    await window.DNLDataStore.reorderArticle(id, dir);
                    this.render();
                });
            });

            // Show/hide Column Pin when Placement changes in the editor form
            const placementSel = document.getElementById('storyPlacement');
            const colPinGroup  = document.getElementById('columnPinGroup');
            if (placementSel && colPinGroup) {
                placementSel.addEventListener('change', () => {
                    colPinGroup.style.display = placementSel.value === 'col3' ? '' : 'none';
                });
            }

            // Toggle Breaking News Button in Story List
            document.querySelectorAll('.btn-toggle-breaking').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id');
                    const isBreaking = btn.getAttribute('data-breaking') === 'true';
                    await window.DNLDataStore.setBreakingArticle(id, !isBreaking);
                    this.render();
                });
            });

            // Date mode select toggle
            const settingDateMode = document.getElementById('setting_date_mode');
            if (settingDateMode) {
                settingDateMode.addEventListener('change', (e) => {
                    const customDateBox = document.getElementById('customDateContainer');
                    if (customDateBox) {
                        customDateBox.style.display = e.target.value === 'manual' ? 'block' : 'none';
                    }
                });
            }

            // Save Settings
            const btnSaveSettings = document.getElementById('btnSaveSettings');
            if (btnSaveSettings) {
                btnSaveSettings.addEventListener('click', async () => {
                    const newSettings = {
                        paper_name: document.getElementById('setting_paper_name').value,
                        tagline: document.getElementById('setting_tagline').value,
                        edition_line: document.getElementById('setting_edition_line').value,
                        website_line: document.getElementById('setting_website_line').value,
                        rni_line: document.getElementById('setting_rni_line').value,
                        date_mode: document.getElementById('setting_date_mode') ? document.getElementById('setting_date_mode').value : 'auto',
                        custom_date: document.getElementById('setting_custom_date') ? document.getElementById('setting_custom_date').value : '',
                        masthead_url: document.getElementById('setting_masthead_url').value,
                        editor_name: document.getElementById('setting_editor_name').value,
                        editor_title: document.getElementById('setting_editor_title').value,
                        editor_bio: document.getElementById('setting_editor_bio').value,
                        editor_instagram: document.getElementById('setting_editor_instagram').value,
                        editor_twitter: document.getElementById('setting_editor_twitter').value,
                        editor_facebook: document.getElementById('setting_editor_facebook').value,
                        editor_blog: document.getElementById('setting_editor_blog').value
                    };
                    btnSaveSettings.innerText = 'Updating...';
                    await window.DNLDataStore.updateSettings(newSettings);
                    alert('Front page furniture, masthead settings, and editor profile updated successfully!');
                    this.render();
                });
            }

            /* ── Admin Tab Pills ── */
            document.querySelectorAll('[data-admin-tab]').forEach(pill => {
                pill.addEventListener('click', () => {
                    this.adminTab = pill.getAttribute('data-admin-tab');
                    this.render();
                });
            });

            /* ── Interview: Toggle section visibility ── */
            const btnToggleIV = document.getElementById('btnToggleInterviewsVisible');
            if (btnToggleIV) {
                btnToggleIV.addEventListener('click', async () => {
                    const current = window.DNLDataStore.getInterviewsVisible();
                    await window.DNLDataStore.setInterviewsVisible(!current);
                    this.render();
                });
            }

            /* ── Interview: Remove All ── */
            const btnClearAll = document.getElementById('btnClearAllInterviews');
            if (btnClearAll) {
                btnClearAll.addEventListener('click', async () => {
                    if (confirm('Remove ALL interview clips from the website? This cannot be undone.')) {
                        await window.DNLDataStore.clearAllInterviews();
                        this.render();
                    }
                });
            }

            /* ── Interview: Delete single clip ── */
            document.querySelectorAll('.btn-delete-interview').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const ivId = btn.getAttribute('data-iv-id');
                    if (confirm('Remove this interview clip?')) {
                        await window.DNLDataStore.deleteInterview(ivId);
                        this.render();
                    }
                });
            });

            /* ── Interview: Thumbnail file upload ── */
            const ivThumbFile = document.getElementById('ivThumbFile');
            if (ivThumbFile) {
                ivThumbFile.addEventListener('change', async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                        if (!file.type.startsWith('image/')) {
                            alert('Please select a valid image file for interview thumbnail.');
                            ivThumbFile.value = '';
                            return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                            alert('Thumbnail file size exceeds 5MB limit.');
                            ivThumbFile.value = '';
                            return;
                        }
                        const urlField = document.getElementById('ivThumbUrl');
                        if (urlField) urlField.value = 'Uploading thumbnail to Supabase Storage...';
                        const uploadedThumb = await window.DNLDataStore.uploadMediaFile(file, 'thumbnails');
                        if (urlField) urlField.value = uploadedThumb;
                    }
                });
            }

            /* ── Interview: Save new clip ── */
            const btnSaveIV = document.getElementById('btnSaveInterview');
            if (btnSaveIV) {
                btnSaveIV.addEventListener('click', async () => {
                    const title = (document.getElementById('ivTitle').value || '').trim();
                    if (!title) {
                        alert('Please enter an interview title before publishing.');
                        return;
                    }

                    const ivFile = document.getElementById('ivFile');
                    const file   = ivFile && ivFile.files && ivFile.files[0];
                    if (file) {
                        if (!file.type.startsWith('video/')) {
                            alert('Please select a valid video file (MP4, WebM, MOV, OGG).');
                            return;
                        }
                        if (file.size > 50 * 1024 * 1024) {
                            alert('Video file size exceeds 50MB limit. For longer video broadcasts, please paste a YouTube or Vimeo URL.');
                            return;
                        }
                    }

                    btnSaveIV.innerText = 'Uploading to Supabase Storage...';
                    btnSaveIV.disabled = true;

                    const guest       = (document.getElementById('ivGuest').value || '').trim();
                    const desc        = (document.getElementById('ivDesc').value || '').trim();
                    const urlInput    = (document.getElementById('ivUrl').value || '').trim();
                    const thumbUrl    = (document.getElementById('ivThumbUrl').value || '').trim();

                    let finalVideoUrl = urlInput;
                    if (file) {
                        finalVideoUrl = await window.DNLDataStore.uploadMediaFile(file, 'videos');
                    }

                    await window.DNLDataStore.saveInterview({
                        title,
                        guest,
                        description: desc,
                        videoUrl: finalVideoUrl || '',
                        thumbnail: thumbUrl || '',
                        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    });

                    alert('Interview clip uploaded and published successfully to Supabase Storage & Database!');
                    this.adminTab = 'interviews';
                    this.render();
                });
            }

            /* ═══════════════════════════════════════════════════════════════
             * GALLERY / ARCHIVE PUBLIC & ADMIN EVENT LISTENERS
             * ═══════════════════════════════════════════════════════════════ */

            // 1. Lightbox Open
            document.querySelectorAll('.clipping-card').forEach(card => {
                const openModal = () => {
                    const id = card.getAttribute('data-clipping-id');
                    const clips = window.DNLDataStore.getClippings();
                    const clip = clips.find(c => c.id === id);
                    if (!clip) return;

                    const overlay = document.getElementById('clippingLightbox');
                    const img = document.getElementById('lbClippingImg');
                    const date = document.getElementById('lbClippingDate');
                    const caption = document.getElementById('lbClippingCaption');
                    const extLink = document.getElementById('lbClippingExtLink');

                    if (overlay && img) {
                        img.src = clip.imageUrl;
                        if (date) date.innerText = `Edition: ${this.formatDisplayDate(clip.editionDate)}`;
                        if (caption) caption.innerText = clip.caption || '';
                        if (extLink) extLink.href = clip.imageUrl;
                        overlay.style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                    }
                };

                card.addEventListener('click', openModal);
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal();
                    }
                });
            });

            // 2. Lightbox Close
            const closeLightbox = () => {
                const overlay = document.getElementById('clippingLightbox');
                if (overlay) {
                    overlay.style.display = 'none';
                    document.body.style.overflow = '';
                }
            };

            const lbCloseBtn = document.getElementById('lbClippingCloseBtn');
            if (lbCloseBtn) lbCloseBtn.addEventListener('click', closeLightbox);

            const lbBackdrop = document.getElementById('clippingLightboxBackdrop');
            if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);

            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeLightbox();
                }
            });

            // 3. Admin Clipping File Selection & Live Preview
            const clipFileInput = document.getElementById('clippingFileInput');
            const btnBrowseClip = document.getElementById('btnBrowseClipping');
            const clipDropZone = document.getElementById('clippingDropZone');
            const clipUrlInput = document.getElementById('clippingImageUrl');
            const clipPreviewWrap = document.getElementById('clippingPreviewWrap');
            const clipPreviewImg = document.getElementById('clippingPreviewImg');

            if (btnBrowseClip && clipFileInput) {
                btnBrowseClip.addEventListener('click', (e) => {
                    e.stopPropagation();
                    clipFileInput.click();
                });
            }

            if (clipDropZone && clipFileInput) {
                clipDropZone.addEventListener('click', (e) => {
                    if (e.target === clipUrlInput) return;
                    clipFileInput.click();
                });
            }

            if (clipFileInput) {
                clipFileInput.addEventListener('change', async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                        if (!file.type.startsWith('image/')) {
                            alert('Please select a valid image file (JPG, PNG, or WEBP).');
                            clipFileInput.value = '';
                            return;
                        }
                        if (file.size > 25 * 1024 * 1024) {
                            alert('File size exceeds 25MB limit.');
                            clipFileInput.value = '';
                            return;
                        }

                        // Instant preview
                        const reader = new FileReader();
                        reader.onload = (re) => {
                            if (clipPreviewImg && clipPreviewWrap) {
                                clipPreviewImg.src = re.target.result;
                                clipPreviewWrap.style.display = 'block';
                            }
                        };
                        reader.readAsDataURL(file);

                        if (clipUrlInput) clipUrlInput.value = 'Uploading to Supabase Storage...';

                        try {
                            const uploadedUrl = await window.DNLDataStore.uploadMediaFile(file, 'clippings');
                            if (clipUrlInput) clipUrlInput.value = uploadedUrl;
                            if (clipPreviewImg) clipPreviewImg.src = uploadedUrl;
                        } catch (uploadErr) {
                            console.warn('Upload error:', uploadErr);
                            if (clipUrlInput) clipUrlInput.value = '';
                        }
                    }
                });
            }

            if (clipUrlInput) {
                clipUrlInput.addEventListener('input', () => {
                    const url = clipUrlInput.value.trim();
                    if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image/'))) {
                        if (clipPreviewImg && clipPreviewWrap) {
                            clipPreviewImg.src = url;
                            clipPreviewWrap.style.display = 'block';
                        }
                    }
                });
            }

            // 4. Admin Save Clipping Form Submission
            const clipForm = document.getElementById('clippingUploadForm');
            if (clipForm) {
                clipForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const url = (clipUrlInput ? clipUrlInput.value : '').trim();
                    if (!url) {
                        alert('Please choose or enter a clipping image.');
                        return;
                    }
                    if (url === 'Uploading to Supabase Storage...') {
                        alert('Image is still uploading to storage. Please wait a moment.');
                        return;
                    }

                    const date = (document.getElementById('clippingDate')?.value || '').trim();
                    if (!date) {
                        alert('Please select an edition date.');
                        return;
                    }
                    const caption = (document.getElementById('clippingCaption')?.value || '').trim();

                    const submitBtn = document.getElementById('btnSaveClipping');
                    if (submitBtn) {
                        submitBtn.innerText = 'Publishing...';
                        submitBtn.disabled = true;
                    }

                    try {
                        await window.DNLDataStore.saveClipping({
                            imageUrl: url,
                            editionDate: date,
                            caption
                        });
                        this.adminTab = 'gallery';
                        this.render();
                        this.showToast(`✓ Clipping for edition ${this.formatDisplayDate(date)} published to archive!`);
                    } catch (saveErr) {
                        alert('Error saving clipping: ' + (saveErr.message || saveErr));
                    } finally {
                        if (submitBtn) {
                            submitBtn.innerText = '✓ Upload & Publish to Archive';
                            submitBtn.disabled = false;
                        }
                    }
                });
            }

            // 5. Admin Delete Clipping
            document.querySelectorAll('.btnDeleteClipping').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-clip-id');
                    if (!id) return;
                    if (confirm('Are you sure you want to delete this clipping from the archive? This cannot be undone.')) {
                        await window.DNLDataStore.deleteClipping(id);
                        this.adminTab = 'gallery';
                        this.render();
                        this.showToast('✓ Clipping removed from archive.');
                    }
                });
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.dnlApp = new DNLApp();
    });
})();

