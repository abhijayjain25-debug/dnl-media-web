/**
 * Delhi News Live - Non-Technical Jargon-Free Admin Controller
 * Intuitive CMS designed for simple operation without technical jargon.
 */

class DNLAdmin {
    constructor() {
        this.currentTab = 'articles';
        this.editingArticleId = null;
        this.autoSaveTimer = null;
        this.dynamicPhotoBlocks = [];
        this.dynamicHighlightBoxes = [];
        this.currentUploadedImageSrc = 'assets/newspaper_frontpage.jpg';
        
        this.init();
    }

    init() {
        const setup = () => {
            this.setupTabNavigation();
            this.setupFormListeners();
            this.renderArticlesTable();
            this.populateReportersDropdown();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
    }

    // Switch between Admin Tabs
    setupTabNavigation() {
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
        });

        document.querySelectorAll('.admin-view-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `tab_${tabName}`);
        });

        if (tabName === 'newspaper_upload') {
            this.renderNewspaperUploadTab();
        } else if (tabName === 'articles') {
            this.renderArticlesTable();
        } else if (tabName === 'editor') {
            if (!this.editingArticleId) {
                this.resetArticleForm();
            }
            this.populateReportersDropdown();
        } else if (tabName === 'interviews') {
            this.renderInterviewsList();
        } else if (tabName === 'owner') {
            this.loadOwnerProfileForm();
        } else if (tabName === 'reporters') {
            this.renderReportersList();
        }
    }

    renderDashboard() {
        this.switchTab('articles');
    }

    // Block Reordering Helper (Move Up / Down)
    moveBlockUp(btn) {
        const item = btn.closest('.dynamic-block-item');
        if (item && item.previousElementSibling) {
            item.parentNode.insertBefore(item, item.previousElementSibling);
            this.triggerAutoSave();
        }
    }

    moveBlockDown(btn) {
        const item = btn.closest('.dynamic-block-item');
        if (item && item.nextElementSibling) {
            item.parentNode.insertBefore(item.nextElementSibling, item);
            this.triggerAutoSave();
        }
    }

    // Repeatable Dynamic Blocks: Inline Photos with Alignment & Reordering
    addPhotoBlock(photoUrl = '', caption = '', alignment = 'full') {
        const id = 'photo_' + Date.now() + Math.random().toString(36).substr(2, 4);
        const container = document.getElementById('dynamicPhotosContainer');
        if (!container) return;

        const blockEl = document.createElement('div');
        blockEl.className = 'dynamic-block-item';
        blockEl.id = id;
        blockEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #E5E7EB; padding-bottom:6px;">
                <div style="font-weight:700; font-size:0.85rem; color:#111827; display:flex; align-items:center; gap:6px;">
                    <span>📷 Inline Article Photo & Caption</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                    <button type="button" class="btn-reorder-action" onclick="window.dnlAdmin.moveBlockUp(this)" title="Move block higher">⬆️ Move Up</button>
                    <button type="button" class="btn-reorder-action" onclick="window.dnlAdmin.moveBlockDown(this)" title="Move block lower">⬇️ Move Down</button>
                    <button type="button" class="btn-remove-dynamic" onclick="document.getElementById('${id}').remove()">✕ Remove</button>
                </div>
            </div>
            <div style="display:grid; grid-template-columns: 1.5fr 1.5fr 1fr; gap:12px; align-items:end;">
                <div>
                    <label style="font-size:0.75rem; color:#4B5563; font-weight:700;">Image Web Address / URL:</label>
                    <input type="text" class="input-standard photo-url-field" value="${photoUrl}" placeholder="https://images.unsplash.com/...">
                </div>
                <div>
                    <label style="font-size:0.75rem; color:#4B5563; font-weight:700;">Photo Caption (Under Image):</label>
                    <input type="text" class="input-standard photo-caption-field" value="${caption}" placeholder="Scene caption or speaker quote...">
                </div>
                <div>
                    <label style="font-size:0.75rem; color:#4B5563; font-weight:700;">Text Flow Alignment:</label>
                    <select class="select-standard photo-align-field">
                        <option value="full" ${alignment === 'full' ? 'selected' : ''}>Full Width</option>
                        <option value="left" ${alignment === 'left' ? 'selected' : ''}>Wrap Left</option>
                        <option value="right" ${alignment === 'right' ? 'selected' : ''}>Wrap Right</option>
                    </select>
                </div>
            </div>
        `;
        container.appendChild(blockEl);
        this.triggerAutoSave();
    }

    // Repeatable Dynamic Blocks: Highlight Summary Boxes with Reordering
    addHighlightBox(title = '', content = '') {
        const id = 'hl_' + Date.now() + Math.random().toString(36).substr(2, 4);
        const container = document.getElementById('dynamicHighlightContainer');
        if (!container) return;

        const blockEl = document.createElement('div');
        blockEl.className = 'dynamic-block-item';
        blockEl.id = id;
        blockEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #CBD5E1; padding-bottom:6px;">
                <div style="font-weight:700; font-size:0.85rem; color:#C41820; display:flex; align-items:center; gap:6px;">
                    <span>📌 Tinted Highlight / Key-Takeaway Summary Box</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                    <button type="button" class="btn-reorder-action" onclick="window.dnlAdmin.moveBlockUp(this)" title="Move block higher">⬆️ Move Up</button>
                    <button type="button" class="btn-reorder-action" onclick="window.dnlAdmin.moveBlockDown(this)" title="Move block lower">⬇️ Move Down</button>
                    <button type="button" class="btn-remove-dynamic" onclick="document.getElementById('${id}').remove()">✕ Remove</button>
                </div>
            </div>
            <div style="margin-bottom:8px;">
                <label style="font-size:0.75rem; color:#4B5563; font-weight:700;">Box Headline (Bold Uppercase):</label>
                <input type="text" class="input-standard hl-title-field" value="${title}" placeholder="E.G. KEY TAKEAWAYS OR CRITICAL HIGHLIGHTS">
            </div>
            <div>
                <label style="font-size:0.75rem; color:#4B5563; font-weight:700;">Summary Paragraph:</label>
                <textarea class="input-standard hl-content-field" rows="3" placeholder="A concise 2-3 sentence summary for readers skimming the page...">${content}</textarea>
            </div>
        `;
        container.appendChild(blockEl);
        this.triggerAutoSave();
    }

    // TAB 0: 1-CLICK NEWSPAPER PICTURE UPLOADER
    renderNewspaperUploadTab() {
        const currentEdition = DNLDatabase.getCurrentEdition();
        if (currentEdition) {
            const previewImg = document.getElementById('newspaperPreviewImage');
            const dateInput = document.getElementById('editionDateInput');
            const headlineInput = document.getElementById('editionHeadlineInput');
            const subheadInput = document.getElementById('editionSubheadInput');
            const modeSelect = document.getElementById('editionViewModeSelect');
            const audioInput = document.getElementById('editionAudioInput');

            if (previewImg && currentEdition.imageUrl) {
                previewImg.src = currentEdition.imageUrl;
                this.currentUploadedImageSrc = currentEdition.imageUrl;
            }
            if (dateInput && currentEdition.date) dateInput.value = currentEdition.date;
            if (headlineInput && currentEdition.title) headlineInput.value = currentEdition.title;
            if (subheadInput && currentEdition.subheadline) subheadInput.value = currentEdition.subheadline;
            if (modeSelect && currentEdition.viewMode) modeSelect.value = currentEdition.viewMode;
            if (audioInput && currentEdition.audioSummary) audioInput.value = currentEdition.audioSummary;
        }

        this.renderEditionsTable();
    }

    handleImageFileSelect(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const statusBadge = document.getElementById('previewStatusBadge');
        if (statusBadge) {
            statusBadge.innerText = 'Processing...';
            statusBadge.style.background = '#e6a700';
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const rawDataUrl = event.target.result;
            const img = new Image();
            img.onload = () => {
                const MAX_DIM = 2400;
                let { width, height } = img;

                if (width > MAX_DIM || height > MAX_DIM) {
                    const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                const compressed = canvas.toDataURL('image/jpeg', 0.92);
                this.currentUploadedImageSrc = compressed;
                const previewImg = document.getElementById('newspaperPreviewImage');
                if (previewImg) {
                    previewImg.src = compressed;
                }
                if (statusBadge) {
                    const kb = Math.round(compressed.length * 0.75 / 1024);
                    statusBadge.innerText = `✓ Ready (${kb} KB)`;
                    statusBadge.style.background = '#28a745';
                }
            };
            img.onerror = () => {
                this.currentUploadedImageSrc = rawDataUrl;
                const previewImg = document.getElementById('newspaperPreviewImage');
                if (previewImg) previewImg.src = rawDataUrl;
                if (statusBadge) {
                    statusBadge.innerText = 'Loaded';
                    statusBadge.style.background = '#28a745';
                }
            };
            img.src = rawDataUrl;
        };
        reader.readAsDataURL(file);
    }

    handleImageUrlInput(url) {
        if (!url) return;
        this.currentUploadedImageSrc = url;
        const previewImg = document.getElementById('newspaperPreviewImage');
        if (previewImg) {
            previewImg.src = url;
        }
    }

    loadSampleBroadsheet() {
        this.currentUploadedImageSrc = 'assets/newspaper_frontpage.jpg';
        const previewImg = document.getElementById('newspaperPreviewImage');
        if (previewImg) previewImg.src = 'assets/newspaper_frontpage.jpg';
        
        const dateInput = document.getElementById('editionDateInput');
        const headlineInput = document.getElementById('editionHeadlineInput');
        const subheadInput = document.getElementById('editionSubheadInput');
        const audioInput = document.getElementById('editionAudioInput');

        if (dateInput) dateInput.value = 'Monday, 27 July 2026';
        if (headlineInput) headlineInput.value = 'A LEADERLESS MOVEMENT FORCED THE GOVERNMENT TO BEND';
        if (subheadInput) subheadInput.value = "GOVERNMENT MISERABLY FAILED TO TERRORIZE THE CHARGED GENZ WITH ITS RELIGIOUS TRUMP CARD AND 'HINDU IN DANGER' NARRATIVE.";
        if (audioInput) audioInput.value = "New Delhi, Monday 27 July 2026. Delhi News Live National English Daily. Main Headline: A LEADERLESS MOVEMENT FORCED THE GOVERNMENT TO BEND. Government miserably failed to terrorize the charged Gen Z with its religious trump card and 'Hindu in danger' narrative. By Syed Wajid. The CJP has kind of won the battle pitched well but Delhi is still a long way with tougher fights in the offing.";

        alert('Sample 27 July Broadsheet loaded into the editor! Click "Publish" to set it live.');
    }

    saveNewspaperEdition() {
        const date = document.getElementById('editionDateInput').value.trim() || 'Monday, 27 July 2026';
        const headline = document.getElementById('editionHeadlineInput').value.trim() || 'A LEADERLESS MOVEMENT FORCED THE GOVERNMENT TO BEND';
        const subhead = document.getElementById('editionSubheadInput').value.trim();
        const viewMode = document.getElementById('editionViewModeSelect').value;
        const audioSummary = document.getElementById('editionAudioInput').value.trim();
        const imageUrl = this.currentUploadedImageSrc || 'assets/newspaper_frontpage.jpg';

        const editionData = {
            id: 'edition-' + Date.now(),
            isCurrent: true,
            title: headline,
            subheadline: subhead,
            date: date,
            editionName: 'National English Daily | Metro City Edition',
            rniNumber: 'DELENG2016/66892',
            websiteUrl: 'www.delhinewslive.co.in',
            imageUrl: imageUrl,
            viewMode: viewMode,
            audioSummary: audioSummary,
            uploadedAt: new Date().toISOString()
        };

        DNLDatabase.saveEdition(editionData);

        const lead = DNLDatabase.getLeadArticle();
        if (lead) {
            lead.headline = headline;
            lead.subheadline = subhead;
            lead.date = date;
            DNLDatabase.saveArticle(lead);
        }

        localStorage.setItem('dnl_frontpage_view', viewMode === 'interactive_broadsheet' ? 'broadsheet' : 'digital');
        this.renderEditionsTable();
        alert('🎉 SUCCESS! The full newspaper broadsheet has been published to the website!');
    }

    renderEditionsTable() {
        const tbody = document.getElementById('adminEditionsTableBody');
        if (!tbody) return;

        const editions = DNLDatabase.getEditions();
        if (editions.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#666;">No newspaper editions saved yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = editions.map(ed => `
            <tr>
                <td style="width: 70px;">
                    <img src="${ed.imageUrl}" alt="" style="width: 55px; height: 75px; object-fit: cover; border: 1px solid #111; border-radius: 2px;">
                </td>
                <td>
                    <strong>${ed.date}</strong><br>
                    <span style="font-size:0.75rem; color:#666;">${ed.editionName || 'National Edition'}</span>
                </td>
                <td>
                    <div style="font-weight:700; font-size:0.9rem;">${ed.title}</div>
                </td>
                <td>
                    ${ed.isCurrent 
                        ? '<span class="status-badge status-lead" style="background:#28a745; color:#fff;">★ LIVE ON FRONT PAGE</span>' 
                        : '<span class="status-badge status-draft">ARCHIVED</span>'}
                </td>
                <td>
                    <div style="display:flex; gap:6px;">
                        ${!ed.isCurrent ? `
                            <button class="action-icon-btn btn-lead-action" onclick="window.dnlAdmin.setFrontPageEdition('${ed.id}')" title="Set as Front Page">
                                ⭐ Set Live
                            </button>
                        ` : ''}
                        <button class="action-icon-btn btn-delete-action" onclick="window.dnlAdmin.deleteEdition('${ed.id}')" title="Delete Edition">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    setFrontPageEdition(id) {
        DNLDatabase.setCurrentEdition(id);
        const ed = DNLDatabase.getCurrentEdition();
        if (ed && ed.viewMode) {
            localStorage.setItem('dnl_frontpage_view', ed.viewMode === 'interactive_broadsheet' ? 'broadsheet' : 'digital');
        }
        this.renderNewspaperUploadTab();
        alert('⭐ Edition is now LIVE on the front page!');
    }

    deleteEdition(id) {
        if (!confirm('Are you sure you want to delete this edition from archives?')) return;
        DNLDatabase.deleteEdition(id);
        this.renderNewspaperUploadTab();
    }

    // TAB 1: ARTICLES DASHBOARD TABLE
    renderArticlesTable() {
        const articles = DNLDatabase.getArticles();
        const tbody = document.getElementById('adminArticlesTableBody');
        const countPublished = articles.filter(a => a.status === 'published').length;
        const countDrafts = articles.filter(a => a.status === 'draft').length;

        const statPub = document.getElementById('statPublishedCount');
        const statDraft = document.getElementById('statDraftsCount');
        const statTotal = document.getElementById('statTotalArticles');
        if (statPub) statPub.innerText = countPublished;
        if (statDraft) statDraft.innerText = countDrafts;
        if (statTotal) statTotal.innerText = articles.length;

        if (!tbody) return;

        if (articles.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#6B7280;">No articles written yet. Click <strong>"+ New Article"</strong> to create your first dispatch!</td></tr>`;
            return;
        }

        tbody.innerHTML = articles.map(art => {
            const reporter = DNLDatabase.getReporterById(art.reporterId);
            const isLead = art.isLead;
            return `
                <tr>
                    <td style="width: 60px;">
                        <img src="${art.heroImage}" alt="" style="width: 50px; height: 38px; object-fit: cover; border-radius: 4px;">
                    </td>
                    <td>
                        <div class="table-article-title">${art.headline}</div>
                        <span style="font-size:0.75rem; color:#6B7280;">${art.category} • ${art.date || 'July 2026'}</span>
                    </td>
                    <td>${reporter ? reporter.name : 'Staff Reporter'}</td>
                    <td>
                        ${isLead ? '<span class="status-badge status-lead">★ FRONT PAGE LEAD</span>' : ''}
                        <span class="status-badge ${art.status === 'published' ? 'status-published' : 'status-draft'}">
                            ${art.status === 'published' ? 'Live Online' : 'Draft'}
                        </span>
                    </td>
                    <td>
                        <div style="display:flex; gap:6px;">
                            <button class="btn-secondary-action" style="padding:4px 10px; font-size:0.8rem;" onclick="window.dnlAdmin.editArticle('${art.id}')">
                                ✏️ Edit
                            </button>
                            <button class="btn-secondary-action" style="padding:4px 10px; font-size:0.8rem;" onclick="window.dnlAdmin.previewArticleById('${art.id}')">
                                👁️ Preview
                            </button>
                            ${!isLead && art.status === 'published' ? `
                                <button class="btn-secondary-action" style="padding:4px 10px; font-size:0.8rem; color:#C41820;" onclick="window.dnlAdmin.setAsLeadArticle('${art.id}')" title="Make this the top front-page story">
                                    ★ Make Lead
                                </button>
                            ` : ''}
                            <button class="btn-secondary-action" style="padding:4px 8px; font-size:0.8rem; color:#DC2626;" onclick="window.dnlAdmin.deleteArticle('${art.id}')" title="Delete">
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    setAsLeadArticle(id) {
        const article = DNLDatabase.getArticleById(id);
        if (article) {
            article.isLead = true;
            DNLDatabase.saveArticle(article);
            this.renderArticlesTable();
            alert(`"${article.headline}" is now the Front Page Lead story!`);
        }
    }

    deleteArticle(id) {
        if (confirm('Are you sure you want to delete this article? This cannot be undone.')) {
            DNLDatabase.deleteArticle(id);
            this.renderArticlesTable();
        }
    }

    // TAB 2: ARTICLE BUILDER & STEP-BY-STEP FORM
    populateReportersDropdown(selectedId) {
        const select = document.getElementById('articleAuthorSelect');
        if (!select) return;
        const reporters = DNLDatabase.getReporters();
        select.innerHTML = reporters.map(r => `
            <option value="${r.id}" ${r.id === selectedId ? 'selected' : ''}>
                ${r.name} (${r.role || 'Reporter'}) - ${r.email}
            </option>
        `).join('');
    }

    setupFormListeners() {
        const headlineInput = document.getElementById('formHeadline');
        const slugInput = document.getElementById('formSlug');
        if (headlineInput && slugInput) {
            headlineInput.addEventListener('input', (e) => {
                if (!this.editingArticleId) {
                    slugInput.value = e.target.value
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .substring(0, 70);
                }
                this.triggerAutoSave();
            });
        }

        const fileInput = document.getElementById('heroImageFileInput');
        const urlInput = document.getElementById('formHeroImageUrl');
        const previewBox = document.getElementById('heroImagePreviewBox');
        const previewImg = document.getElementById('heroImagePreviewImg');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        urlInput.value = event.target.result;
                        previewImg.src = event.target.result;
                        previewBox.style.display = 'block';
                        this.triggerAutoSave();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (urlInput) {
            urlInput.addEventListener('input', (e) => {
                if (e.target.value) {
                    previewImg.src = e.target.value;
                    previewBox.style.display = 'block';
                }
            });
        }
    }

    formatDoc(cmd, value = null) {
        document.execCommand(cmd, false, value);
        const editor = document.getElementById('formBodyEditor');
        if (editor) editor.focus();
        this.triggerAutoSave();
    }

    insertSubheading() {
        const text = prompt('Enter sub-heading title for this section:');
        if (text) {
            this.formatDoc('insertHTML', `<div class="article-subheading-block">### ${text.toUpperCase()}</div><p></p>`);
        }
    }

    insertLink() {
        const url = prompt('Enter the link destination URL (e.g. https://...):');
        if (url) {
            this.formatDoc('createLink', url);
        }
    }

    editArticle(id) {
        const article = DNLDatabase.getArticleById(id);
        if (!article) return;

        this.editingArticleId = article.id;
        this.switchTab('editor');

        document.getElementById('editorPageTitle').innerText = 'Edit Newspaper Dispatch';
        document.getElementById('formCategory').value = article.category || 'Metro City';
        document.getElementById('formHeadline').value = article.headline || '';
        document.getElementById('formSubheadline').value = article.subheadline || '';
        document.getElementById('formHeroImageUrl').value = article.heroImage || '';
        document.getElementById('formHeroCaption').value = article.heroCaption || '';
        document.getElementById('formSlug').value = article.slug || '';
        document.getElementById('formIsLead').checked = !!article.isLead;

        const previewBox = document.getElementById('heroImagePreviewBox');
        const previewImg = document.getElementById('heroImagePreviewImg');
        if (article.heroImage && previewBox && previewImg) {
            previewImg.src = article.heroImage;
            previewBox.style.display = 'block';
        }

        this.populateReportersDropdown(article.reporterId);

        const bodyEditor = document.getElementById('formBodyEditor');
        if (bodyEditor) {
            const paragraphs = Array.isArray(article.bodyParagraphs) 
                ? article.bodyParagraphs 
                : (article.body ? article.body.split('\n\n') : []);
            
            bodyEditor.innerHTML = paragraphs.map(p => {
                if (p.startsWith('### ')) {
                    return `<div class="article-subheading-block">${p}</div>`;
                }
                return `<p>${p}</p>`;
            }).join('');
        }

        const photosContainer = document.getElementById('dynamicPhotosContainer');
        photosContainer.innerHTML = '';
        if (article.inlinePhotos && article.inlinePhotos.length > 0) {
            article.inlinePhotos.forEach(p => this.addPhotoBlock(p.url, p.caption, p.alignment || 'full'));
        }

        const hlContainer = document.getElementById('dynamicHighlightContainer');
        hlContainer.innerHTML = '';
        if (article.highlightBox && article.highlightBox.title) {
            this.addHighlightBox(article.highlightBox.title, article.highlightBox.content);
        }
    }

    resetArticleForm() {
        this.editingArticleId = null;
        document.getElementById('editorPageTitle').innerText = 'Write New Article';
        document.getElementById('formCategory').value = 'Metro City';
        document.getElementById('formHeadline').value = '';
        document.getElementById('formSubheadline').value = '';
        document.getElementById('formHeroImageUrl').value = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80';
        document.getElementById('formHeroCaption').value = '';
        document.getElementById('formSlug').value = '';
        document.getElementById('formIsLead').checked = false;

        const previewBox = document.getElementById('heroImagePreviewBox');
        const previewImg = document.getElementById('heroImagePreviewImg');
        if (previewBox && previewImg) {
            previewImg.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80';
            previewBox.style.display = 'block';
        }

        const bodyEditor = document.getElementById('formBodyEditor');
        if (bodyEditor) {
            bodyEditor.innerHTML = '<p>Start typing your report here...</p>';
        }

        document.getElementById('dynamicPhotosContainer').innerHTML = '';
        document.getElementById('dynamicHighlightContainer').innerHTML = '';
    }

    getFormData(status = 'published') {
        const category = document.getElementById('formCategory').value;
        const headline = document.getElementById('formHeadline').value.trim() || 'UNTITLED DISPATCH';
        const subheadline = document.getElementById('formSubheadline').value.trim();
        const heroImage = document.getElementById('formHeroImageUrl').value || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80';
        const heroCaption = document.getElementById('formHeroCaption').value;
        const reporterId = document.getElementById('articleAuthorSelect').value;
        const slug = document.getElementById('formSlug').value || headline.toLowerCase().replace(/\s+/g, '-');
        const isLead = document.getElementById('formIsLead').checked;

        const bodyEditor = document.getElementById('formBodyEditor');
        const rawHtml = bodyEditor ? bodyEditor.innerHTML : '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = rawHtml;
        const bodyParagraphs = [];
        tempDiv.childNodes.forEach(node => {
            const text = node.textContent.trim();
            if (text.length > 0) {
                bodyParagraphs.push(text);
            }
        });

        const inlinePhotos = [];
        document.querySelectorAll('#dynamicPhotosContainer .dynamic-block-item').forEach(block => {
            const urlField = block.querySelector('.photo-url-field');
            const captionField = block.querySelector('.photo-caption-field');
            const alignField = block.querySelector('.photo-align-field');
            const url = urlField ? urlField.value : '';
            const caption = captionField ? captionField.value : '';
            const alignment = alignField ? alignField.value : 'full';
            if (url) {
                inlinePhotos.push({ url, caption, alignment });
            }
        });

        let highlightBox = null;
        const hlBlock = document.querySelector('#dynamicHighlightContainer .dynamic-block-item');
        if (hlBlock) {
            const titleField = hlBlock.querySelector('.hl-title-field');
            const contentField = hlBlock.querySelector('.hl-content-field');
            const title = titleField ? titleField.value : '';
            const content = contentField ? contentField.value : '';
            if (title || content) {
                highlightBox = { title, content };
            }
        }

        return {
            id: this.editingArticleId || ('art-' + Date.now()),
            slug,
            headline,
            subheadline,
            kicker: category.toUpperCase(),
            category,
            heroImage,
            heroCaption,
            reporterId,
            bodyParagraphs: bodyParagraphs.length > 0 ? bodyParagraphs : ['Detailed article report in progress...'],
            inlinePhotos,
            highlightBox,
            isLead,
            status,
            date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
            readTime: `${Math.max(2, Math.ceil(bodyParagraphs.join(' ').split(' ').length / 150))} min read`
        };
    }

    saveArticle(status = 'published') {
        const articleData = this.getFormData(status);
        DNLDatabase.saveArticle(articleData);
        alert(status === 'published' ? '🎉 Article published live on Delhi News Live!' : '💾 Draft successfully saved.');
        this.renderArticlesTable();
        this.switchTab('articles');
    }

    triggerAutoSave() {
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            const indicator = document.getElementById('autoSaveIndicator');
            if (indicator) {
                const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                indicator.innerHTML = `✓ Auto-saved at ${now}`;
            }
        }, 1200);
    }

    // Real-Time Live Preview Modal
    openLivePreview() {
        const article = this.getFormData('published');
        const modal = document.getElementById('livePreviewModal');
        const container = document.getElementById('livePreviewContentContainer');
        const reporter = DNLDatabase.getReporterById(article.reporterId);

        if (!modal || !container) return;

        container.innerHTML = `
            <div class="paper-sheet-container" style="padding: 24px; max-width: 960px; margin: 0 auto; background: #fff;">
                <div class="section-kicker-bar exact-kicker-bar">
                    <div class="kicker-title"><span>★</span> ${article.kicker || 'METRO CITY'}</div>
                    <span style="font-size:0.8rem; font-weight:700; color:#fff;">www.delhinewslive.co.in</span>
                </div>
                <div class="reference-hero-image-box" style="margin:16px 0;">
                    <img src="${article.heroImage}" alt="${article.headline}" style="width:100%; max-height:400px; object-fit:cover;">
                </div>
                <h1 class="reference-main-headline" style="font-size: 2.5rem; margin-bottom:8px;">${article.headline}</h1>
                <div class="reference-subheadline-deck" style="margin-bottom:18px;">${article.subheadline}</div>
                <div class="reference-five-column-grid" style="grid-template-columns: 240px 1fr 200px;">
                    <div class="ref-col-1">
                        <div class="ref-author-card">
                            <img src="${reporter ? reporter.avatar : ''}" alt="" class="ref-author-photo">
                            <div class="ref-author-name">${reporter ? reporter.name : 'Staff Reporter'}</div>
                            <div class="ref-author-email">${reporter ? reporter.email : 'contact@delhinewslive.co.in'}</div>
                        </div>
                        <div class="ref-col-text">
                            ${window.dnlApp ? window.dnlApp.renderFirstColParagraphs(article) : ''}
                        </div>
                    </div>
                    <div class="ref-middle-area">
                        ${window.dnlApp ? window.dnlApp.renderMiddleArea(article) : ''}
                    </div>
                    <div class="ref-col-5">
                        <div class="bs-sidebar-section-label">MORE DISPATCHES</div>
                        ${DNLDatabase.getArticles().slice(0, 3).map(a => `
                            <div style="font-size:0.8rem; font-weight:700; margin-bottom:8px;">${a.headline}</div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLivePreview() {
        const modal = document.getElementById('livePreviewModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    previewArticleById(id) {
        this.editArticle(id);
        this.openLivePreview();
    }

    // TAB 3: INTERVIEW CLIPS MANAGER
    renderInterviewsList() {
        const list = DNLDatabase.getInterviews();
        const container = document.getElementById('interviewsManagerList');
        if (!container) return;

        container.innerHTML = list.map(item => `
            <div style="background:#fff; border:1px solid #E5E7EB; border-radius:8px; padding:16px; margin-bottom:12px; display:flex; gap:16px; align-items:center;">
                <img src="${item.thumbnail}" alt="" style="width:100px; height:65px; object-fit:cover; border-radius:4px;">
                <div style="flex:1;">
                    <div style="font-weight:700; font-size:1rem; color:#111827;">${item.title}</div>
                    <div style="font-size:0.8rem; color:#6B7280;">Guest: <strong>${item.guest}</strong> • Duration: ${item.duration}</div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn-secondary-action" onclick="window.dnlAdmin.deleteInterview('${item.id}')">🗑️ Remove</button>
                </div>
            </div>
        `).join('');
    }

    saveNewInterview() {
        const title = document.getElementById('newInterviewTitle').value.trim();
        const guest = document.getElementById('newInterviewGuest').value.trim();
        const videoUrl = document.getElementById('newInterviewUrl').value.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
        const thumbnail = document.getElementById('newInterviewThumb').value.trim() || 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80';
        const description = document.getElementById('newInterviewDesc').value.trim();

        if (!title) {
            alert('Please enter an Interview Title.');
            return;
        }

        DNLDatabase.saveInterview({
            title,
            guest,
            videoUrl,
            thumbnail,
            description,
            duration: '12:30',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            published: true
        });

        alert('Video Interview uploaded and published to homepage!');
        document.getElementById('newInterviewTitle').value = '';
        document.getElementById('newInterviewGuest').value = '';
        document.getElementById('newInterviewDesc').value = '';
        this.renderInterviewsList();
    }

    deleteInterview(id) {
        if (confirm('Delete this video interview?')) {
            DNLDatabase.deleteInterview(id);
            this.renderInterviewsList();
        }
    }

    // TAB 4: OWNER PROFILE EDITOR ("From the Editor's Desk")
    loadOwnerProfileForm() {
        const profile = DNLDatabase.getEditorProfile();
        document.getElementById('ownerNameInput').value = profile.name || '';
        document.getElementById('ownerTitleInput').value = profile.title || '';
        document.getElementById('ownerPhotoInput').value = profile.photo || '';
        document.getElementById('ownerBioInput').value = profile.bio || '';
        document.getElementById('ownerBadgeInput').value = profile.badge || 'FROM THE EDITOR\'S DESK';

        const previewImg = document.getElementById('ownerPhotoPreview');
        if (previewImg) previewImg.src = profile.photo;
    }

    saveOwnerProfile() {
        const name = document.getElementById('ownerNameInput').value.trim();
        const title = document.getElementById('ownerTitleInput').value.trim();
        const photo = document.getElementById('ownerPhotoInput').value.trim();
        const bio = document.getElementById('ownerBioInput').value.trim();
        const badge = document.getElementById('ownerBadgeInput').value.trim();

        DNLDatabase.saveEditorProfile({ name, title, photo, bio, badge });
        alert('Editor profile updated successfully on the homepage!');
    }

    // TAB 5: REPORTERS DIRECTORY
    renderReportersList() {
        const reporters = DNLDatabase.getReporters();
        const container = document.getElementById('reportersGridContainer');
        if (!container) return;

        container.innerHTML = reporters.map(r => `
            <div style="background:#fff; border:1px solid #E5E7EB; border-radius:8px; padding:16px; display:flex; gap:14px; align-items:center;">
                <img src="${r.avatar}" alt="" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid #C41820;">
                <div>
                    <div style="font-weight:700; color:#111827; font-size:1rem;">${r.name}</div>
                    <div style="font-size:0.8rem; color:#2563EB; font-weight:600;">${r.role}</div>
                    <div style="font-size:0.75rem; color:#6B7280;">${r.email}</div>
                </div>
            </div>
        `).join('');
    }

    addNewReporter() {
        const name = prompt('Enter Reporter Full Name (e.g. SYED WAJID):');
        if (!name) return;
        const email = prompt('Enter Reporter Email / Handle (e.g. sufijourno@gmail.com):');
        const role = prompt('Enter Role / Beat (e.g. Senior Political Correspondent):');
        const avatar = prompt('Enter Photo URL (or leave blank for default avatar):') || 
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

        DNLDatabase.saveReporter({
            name: name.toUpperCase(),
            email: email || 'reporter@delhinewslive.co.in',
            role: role || 'Correspondent',
            avatar
        });

        alert('New Reporter profile added!');
        this.renderReportersList();
        this.populateReportersDropdown();
    }
}

// Instantiate Admin Controller
window.dnlAdmin = new DNLAdmin();
