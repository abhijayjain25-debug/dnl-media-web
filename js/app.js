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
            window.location.hash = route === '/' ? '' : route;
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

        getFormattedDate() {
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            return 'New Delhi, ' + new Date().toLocaleDateString('en-GB', options);
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
            } else if (route === '/auth') {
                mainContent = this.renderAuthPage();
            } else if (route === '/admin') {
                mainContent = this.renderAdminPage();
            } else {
                mainContent = this.render404Page();
            }

            this.appRoot.innerHTML = `
                <div class="paper-page-wrapper">
                    <main class="paper">
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
            return `
                <div class="top-meta-strip">
                    <span>${this.getFormattedDate()}</span>
                    <span class="meta-divider">|</span>
                    <span class="font-condensed" style="letter-spacing: -0.01em;">${settings.tagline || 'National English Daily'}</span>
                    <span class="meta-divider">|</span>
                    <span class="font-condensed">${settings.rni_line || 'RNI : DELENG2016/66892'}</span>
                </div>
            `;
        }

        renderMasthead(settings) {
            const logoUrl = settings.masthead_url || 'assets/logo.jpg';
            return `
                <a href="#/" class="masthead-track" aria-label="Delhi News Live Front Page">
                    <div class="masthead-marquee">
                        <img src="${logoUrl}" alt="${settings.paper_name}" class="masthead-item" />
                        <img src="${logoUrl}" alt="${settings.paper_name}" class="masthead-item" aria-hidden="true" />
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
                    <span class="website-label">${settings.website_line || 'www.delhinewslive.in'}</span>
                </div>
            `;
        }

        renderNavBar() {
            const current = this.currentRoute;
            const currentSecLower = (this.currentSection || '').toLowerCase();
            const isHome = current === '/' || current === '';
            const isSearch = current === '/search';
            const isVideos = current === '/interviews';

            return `
                <nav class="nav-bar">
                    <a href="#/" class="nav-link ${isHome ? 'active' : ''}">Front Page</a>
                    ${SECTIONS.map(s => `
                        <a href="#/section/${s.toLowerCase()}" class="nav-link ${currentSecLower === s.toLowerCase() ? 'active' : ''}">
                            ${s}
                        </a>
                    `).join('')}
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
            const articles = window.DNLDataStore.getPublishedArticles();
            const lead = articles.find(a => a.placement === 'lead') || articles[0];
            const secondary = articles.filter(a => a.placement === 'front_secondary' && a.id !== lead?.id);
            // Continuation stories: all except lead and front_secondary
            const continuation = articles.filter(a =>
                a.id !== lead?.id &&
                a.placement !== 'front_secondary' &&
                a.placement !== 'lead'
            );

            if (!lead) {
                return `<p style="padding: 4rem 0; text-align: center; font-family: var(--font-condensed); color: var(--color-stone);">Setting type on Front Page…</p>`;
            }

            return `
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
                        ${clips.map(clip => {
                            const embedUrl = this.normalizeVideoUrl(clip.videoUrl);
                            const isEmbed = embedUrl && !embedUrl.startsWith('data:');
                            return `
                                <div class="iv-card">
                                    <div class="iv-video-wrapper">
                                        ${isEmbed
                                            ? `<iframe src="${embedUrl}" frameborder="0" allowfullscreen loading="lazy" title="${clip.title}"></iframe>`
                                            : (clip.thumbnail
                                                ? `<a href="${clip.videoUrl || '#'}" target="_blank" rel="noopener"><img src="${clip.thumbnail}" alt="${clip.title}" class="iv-thumb" /></a>`
                                                : `<div class="iv-no-video">&#9654; No preview available</div>`)
                                        }
                                    </div>
                                    <div class="iv-card-body">
                                        <p class="iv-tag">INTERVIEW</p>
                                        <h3 class="iv-title">${clip.title}</h3>
                                        ${clip.guest ? `<p class="iv-guest">Guest: <strong>${clip.guest}</strong></p>` : ''}
                                        ${clip.description ? `<p class="iv-desc">${clip.description}</p>` : ''}
                                        ${clip.date ? `<p class="iv-date">${clip.date}</p>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
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
                        ${clips.map(clip => {
                            const embedUrl = this.normalizeVideoUrl(clip.videoUrl);
                            const isEmbed = embedUrl && !embedUrl.startsWith('data:');
                            return `
                                <div class="iv-card">
                                    <div class="iv-video-wrapper">
                                        ${isEmbed
                                            ? `<iframe src="${embedUrl}" frameborder="0" allowfullscreen loading="lazy" title="${clip.title}"></iframe>`
                                            : (clip.thumbnail
                                                ? `<a href="${clip.videoUrl || '#'}" target="_blank" rel="noopener"><img src="${clip.thumbnail}" alt="${clip.title}" class="iv-thumb" /></a>`
                                                : `<div class="iv-no-video">&#9654; No preview available</div>`)
                                        }
                                    </div>
                                    <div class="iv-card-body">
                                        <p class="iv-tag">INTERVIEW</p>
                                        <h3 class="iv-title">${clip.title}</h3>
                                        ${clip.guest ? `<p class="iv-guest">Guest: <strong>${clip.guest}</strong></p>` : ''}
                                        ${clip.description ? `<p class="iv-desc">${clip.description}</p>` : ''}
                                        ${clip.date ? `<p class="iv-date">${clip.date}</p>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <p style="margin-top: 1.5rem;"><a href="#/" class="back-link">← Return to Front Page</a></p>
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

                if (placement === 'col3') {
                    // Grab up to 3 col3 articles for this row
                    const group = [art];
                    let j = i + 1;
                    while (j < articles.length && (articles[j].placement === 'col3' || articles[j].placement === 'standard') && group.length < 3) {
                        group.push(articles[j]);
                        j++;
                    }
                    rows.push({ type: 'col3', items: group });
                    i = j;
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
                    // standard / fallback → treat as col3
                    const group = [art];
                    let j = i + 1;
                    while (j < articles.length && (articles[j].placement === 'col3' || articles[j].placement === 'standard') && group.length < 3) {
                        group.push(articles[j]);
                        j++;
                    }
                    rows.push({ type: 'col3', items: group });
                    i = j;
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

            const blocks = window.DNLDataStore.parseBody(article.body);

            return `
                <article class="article-detail-container">
                    <p class="article-detail-tag">${article.section || 'General'}</p>
                    <h1 class="article-detail-title">${article.headline}</h1>

                    ${article.standfirst ? `<p class="article-detail-standfirst">${article.standfirst}</p>` : ''}

                    ${article.author_name ? `
                        <p class="article-detail-byline">By ${article.author_name}</p>
                    ` : ''}

                    ${article.image_url ? `
                        <figure class="article-detail-figure">
                            <img src="${article.image_url}" alt="${article.image_caption || article.headline}" style="width: 100%; max-height: 600px; object-fit: cover;" />
                            ${article.image_caption ? `<figcaption class="lead-caption">${article.image_caption}</figcaption>` : ''}
                        </figure>
                    ` : ''}

                    <div class="article-detail-body">
                        ${blocks.map((b, i) => {
                            if (b.type === 'head') {
                                return `<h3 class="col-head" style="font-size: 20px; margin: 1.5rem 0 0.5rem 0;">${b.text}</h3>`;
                            }
                            return `<p class="${i === 0 ? 'dropcap' : ''}">${b.text}</p>`;
                        }).join('')}
                    </div>

                    <p style="margin-top: 1.5rem;">
                        <a href="#/" class="back-link">← Return to Front Page</a>
                    </p>
                </article>
            `;
        }

        /* ═══════════════════════════════════════════════════════════════
         * SEARCH PAGE
         * ═══════════════════════════════════════════════════════════════ */
        renderSearchPage() {
            const query = this.searchQuery.trim().toLowerCase();
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
                    value="${this.searchQuery}"
                    class="search-input-field"
                    autofocus
                />

                <div class="search-results-list">
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
                    <p class="auth-subtitle">For editors of Delhi News Live.</p>

                    <form id="authForm" class="auth-form">
                        <div>
                            <input type="email" id="authEmail" class="input-standard" placeholder="Email" value="editor@delhinewslive.in" required />
                        </div>
                        <div>
                            <input type="password" id="authPassword" class="input-standard" placeholder="Password" value="newsroom2026" required minlength="6" />
                        </div>
                        <button type="submit" class="btn-primary">Sign in to Newsroom</button>
                    </form>

                    <div style="margin-top: 1rem; border-top: 1px dashed var(--color-rule); padding-top: 0.75rem;">
                        <button type="button" id="quickEditorBtn" class="btn-secondary" style="width: 100%;">⚡ Quick Editor Access (1-Click Demo)</button>
                    </div>
                </div>
            `;
        }

        /* ═══════════════════════════════════════════════════════════════
         * ADMIN / NEWSROOM DESK
         * ═══════════════════════════════════════════════════════════════ */
        renderAdminPage() {
            const session = window.DNLDataStore.getAuthSession();
            if (!session) {
                this.navigate('/auth');
                return '';
            }

            const settings  = window.DNLDataStore.getSettings();
            const articles  = window.DNLDataStore.getArticles();
            const editing   = this.editingArticle;
            const adminTab  = this.adminTab || 'stories'; // 'stories' | 'interviews' | 'settings'

            return `
                <div class="newsroom-header">
                    <h1 class="newsroom-title">Newsroom desk</h1>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button id="btnNewStory" class="btn-primary" style="width: auto; padding: 0.45rem 1rem;">+ New story</button>
                        <button id="btnSignOut" class="btn-secondary" style="width: auto; padding: 0.45rem 1rem;">Sign out</button>
                    </div>
                </div>

                <!-- Admin Tabs -->
                <div class="admin-tab-bar">
                    <button class="admin-tab-pill ${adminTab === 'stories' ? 'admin-tab-pill--active' : ''}" data-admin-tab="stories">📰 Stories</button>
                    <button class="admin-tab-pill ${adminTab === 'interviews' ? 'admin-tab-pill--active' : ''}" data-admin-tab="interviews">🎥 Video Clippings</button>
                    <button class="admin-tab-pill ${adminTab === 'settings' ? 'admin-tab-pill--active' : ''}" data-admin-tab="settings">⚙️ Site Settings</button>
                </div>

                <!-- ── STORIES TAB ── -->
                <div id="admin-panel-stories" style="${adminTab === 'stories' ? '' : 'display:none;'}">
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
                            <span class="field-label">RNI Line</span>
                            <input type="text" id="setting_rni_line" class="input-standard" value="${settings.rni_line || ''}" />
                        </div>
                        <div>
                            <span class="field-label">Masthead Logo (Upload From Device)</span>
                            <input type="file" id="setting_masthead_file" accept="image/*" class="input-standard" style="padding: 0.35rem;" />
                            <input type="hidden" id="setting_masthead_url" value="${settings.masthead_url || ''}" />
                        </div>
                    </div>
                    <button id="btnSaveSettings" class="btn-secondary" style="margin-top: 0.75rem;">Update Furniture</button>
                </section>

                <!-- Article Editor Form -->
                ${editing ? `
                    <section class="cms-card cms-card-primary" id="articleEditorCard">
                        <h2 style="font-family: var(--font-poster); font-size: 22px; text-transform: uppercase;">
                            ${editing.id ? 'Edit Story' : 'File a New Story'}
                        </h2>

                        <form id="storyForm" style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.75rem;">
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
                                    <span class="field-label">Layout / Placement</span>
                                    <select id="storyPlacement" class="input-standard">
                                        <option value="lead" ${editing.placement === 'lead' ? 'selected' : ''}>Front Page Lead Banner</option>
                                        <option value="front_secondary" ${editing.placement === 'front_secondary' ? 'selected' : ''}>Front Page Boxed Story (side rail)</option>
                                        <option value="col3" ${editing.placement === 'col3' ? 'selected' : ''}>3-Column Story (continuation scroll)</option>
                                        <option value="col2" ${editing.placement === 'col2' ? 'selected' : ''}>2-Column Feature (continuation scroll)</option>
                                        <option value="col1" ${editing.placement === 'col1' ? 'selected' : ''}>1-Column Brief (continuation scroll)</option>
                                    </select>
                                </div>
                            </div>

                            <div class="cms-grid-2">
                                <div>
                                    <span class="field-label">Byline (Author)</span>
                                    <input type="text" id="storyAuthor" class="input-standard" value="${editing.author_name || 'SYED WAJID'}" />
                                </div>
                                <div>
                                    <span class="field-label">Slug (URL identifier)</span>
                                    <input type="text" id="storySlug" class="input-standard" value="${editing.slug || ''}" placeholder="auto-generated-from-headline" />
                                </div>
                            </div>

                            <!-- Direct Device File Upload -->
                            <div style="border: 2px dashed var(--color-ink); padding: 1rem; background-color: var(--color-tint);">
                                <span class="field-label" style="font-size: 13px; color: var(--color-ink); margin-bottom: 0.35rem;">
                                    📷 Story Photograph (Upload from Device / Gallery)
                                </span>
                                <input type="file" id="storyImageFile" accept="image/*" class="input-standard" style="background: white; padding: 0.5rem; cursor: pointer;" />

                                <div id="imagePreviewContainer" style="margin-top: 0.75rem; ${editing.image_url ? 'display: block;' : 'display: none;'}">
                                    <p class="field-label">Selected Photo Preview:</p>
                                    <img id="imagePreview" src="${editing.image_url || ''}" alt="Preview" style="max-height: 220px; width: auto; max-width: 100%; object-fit: cover; border: 1px solid var(--color-rule);" />
                                </div>

                                <input type="hidden" id="storyImage" value="${editing.image_url || ''}" />
                            </div>

                            <div>
                                <span class="field-label">Photo Caption</span>
                                <input type="text" id="storyCaption" class="input-standard" value="${editing.image_caption || ''}" placeholder="Explain what is shown in the photograph..." />
                            </div>

                            <div>
                                <span class="field-label">Body copy — blank line between paragraphs, "## " for subheads</span>
                                <textarea id="storyBody" rows="12" class="input-standard" style="resize: vertical;" placeholder="Write story text here...">${editing.body || ''}</textarea>
                            </div>

                            <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-condensed); text-transform: uppercase; font-size: 13px; letter-spacing: 0.14em; cursor: pointer;">
                                <input type="checkbox" id="storyPublished" ${editing.published !== false ? 'checked' : ''} />
                                Publish to the live newspaper
                            </label>

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
                        ${articles.map(art => `
                            <div class="story-table-row">
                                <div style="flex: 1; min-width: 260px;">
                                    <p style="font-family: var(--font-serifhead); font-weight: 700; font-size: 16px;">${art.headline}</p>
                                    <p style="font-family: var(--font-condensed); font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--color-stone);">
                                        ${art.section} · ${art.placement || 'col3'} · ${art.published ? 'Published' : 'Draft'}
                                    </p>
                                </div>
                                <div style="display: flex; gap: 0.5rem;">
                                    <button class="btn-secondary btn-edit-story" data-id="${art.id}">Edit</button>
                                    <button class="btn-danger btn-delete-story" data-id="${art.id}">Delete</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>

                </div><!-- /admin-panel-stories -->

                <!-- ── SITE SETTINGS TAB ── -->
                <div id="admin-panel-settings" style="${adminTab === 'settings' ? '' : 'display:none;'}">
                <section class="cms-card">
                    <h2 class="field-label">Front page furniture</h2>
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
                            <span class="field-label">RNI Line</span>
                            <input type="text" id="setting_rni_line" class="input-standard" value="${settings.rni_line || ''}" />
                        </div>
                        <div>
                            <span class="field-label">Masthead Logo (Upload From Device)</span>
                            <input type="file" id="setting_masthead_file" accept="image/*" class="input-standard" style="padding: 0.35rem;" />
                            <input type="hidden" id="setting_masthead_url" value="${settings.masthead_url || ''}" />
                        </div>
                    </div>
                    <button id="btnSaveSettings" class="btn-secondary" style="margin-top: 0.75rem;">Update Furniture</button>
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
                        Published by DNL Media. All rights reserved. ·
                        <a href="#/auth">Newsroom login</a>
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

            // Auth Login
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
                        this.navigate('/admin');
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

            const quickEditorBtn = document.getElementById('quickEditorBtn');
            if (quickEditorBtn) {
                quickEditorBtn.addEventListener('click', async () => {
                    quickEditorBtn.innerText = '⚡ Connecting to Newsroom...';
                    await window.DNLDataStore.login('editor@delhinewslive.in', 'quick');
                    this.navigate('/admin');
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

            // Device Image Upload for Story
            const storyImageFile = document.getElementById('storyImageFile');
            if (storyImageFile) {
                storyImageFile.addEventListener('change', (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (loadEvt) => {
                            const dataUrl = loadEvt.target.result;
                            document.getElementById('storyImage').value = dataUrl;
                            const preview = document.getElementById('imagePreview');
                            const previewContainer = document.getElementById('imagePreviewContainer');
                            if (preview && previewContainer) {
                                preview.src = dataUrl;
                                previewContainer.style.display = 'block';
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            // Masthead Logo Upload
            const mastheadFile = document.getElementById('setting_masthead_file');
            if (mastheadFile) {
                mastheadFile.addEventListener('change', (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (loadEvt) => {
                            document.getElementById('setting_masthead_url').value = loadEvt.target.result;
                        };
                        reader.readAsDataURL(file);
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
                    if (submitBtn) submitBtn.innerText = 'Publishing...';

                    const updated = {
                        ...this.editingArticle,
                        headline: document.getElementById('storyHeadline').value,
                        standfirst: document.getElementById('storyStandfirst').value,
                        section: document.getElementById('storySection').value,
                        placement: document.getElementById('storyPlacement').value,
                        author_name: document.getElementById('storyAuthor').value,
                        slug: document.getElementById('storySlug').value || window.DNLDataStore.slugify(document.getElementById('storyHeadline').value),
                        image_url: document.getElementById('storyImage').value,
                        image_caption: document.getElementById('storyCaption').value,
                        body: document.getElementById('storyBody').value,
                        published: document.getElementById('storyPublished').checked
                    };
                    await window.DNLDataStore.saveArticle(updated);
                    this.editingArticle = null;
                    this.render();
                });
            }

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
                        masthead_url: document.getElementById('setting_masthead_url').value
                    };
                    btnSaveSettings.innerText = 'Updating...';
                    await window.DNLDataStore.updateSettings(newSettings);
                    alert('Front page furniture updated successfully!');
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
                ivThumbFile.addEventListener('change', (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            const urlField = document.getElementById('ivThumbUrl');
                            if (urlField) urlField.value = ev.target.result;
                        };
                        reader.readAsDataURL(file);
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

                    btnSaveIV.innerText = 'Publishing...';
                    btnSaveIV.disabled = true;

                    const guest       = (document.getElementById('ivGuest').value || '').trim();
                    const desc        = (document.getElementById('ivDesc').value || '').trim();
                    const urlInput    = (document.getElementById('ivUrl').value || '').trim();
                    const thumbUrl    = (document.getElementById('ivThumbUrl').value || '').trim();

                    // Handle video file upload
                    const ivFile = document.getElementById('ivFile');
                    const file   = ivFile && ivFile.files && ivFile.files[0];

                    const finalize = async (videoUrl, thumbnailUrl) => {
                        await window.DNLDataStore.saveInterview({
                            title,
                            guest,
                            description: desc,
                            videoUrl: videoUrl || '',
                            thumbnail: thumbnailUrl || '',
                            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        });
                        alert('Interview clip published successfully to backend!');
                        this.adminTab = 'interviews';
                        this.render();
                    };

                    if (file) {
                        const reader = new FileReader();
                        reader.onload = async (ev) => await finalize(ev.target.result, thumbUrl);
                        reader.readAsDataURL(file);
                    } else {
                        await finalize(urlInput, thumbUrl);
                    }
                });
            }
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.dnlApp = new DNLApp();
    });
})();

