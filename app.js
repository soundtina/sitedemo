// State management for Nexora Template Gallery
let templates = [];
let currentPage = 1;
let itemsPerPage = 6;


// DOM Elements
const galleryGrid = document.getElementById('gallery-grid');
const paginationContainer = document.getElementById('pagination-container');
const resultCountEl = document.getElementById('result-count');
const itemsPerPageSelect = document.getElementById('items-per-page');

function getSlug(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.split('.')[0];
  } catch (e) {
    return 'template';
  }
}

// Utility: Clean name extraction from worker URL
function getTemplateName(url, index) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    // Extract subdomain (e.g., wispy-queen-c8b3)
    const part = host.split('.')[0];
    // Remove hash suffix (like -c8b3, -04b5 etc) if present to make it look clean
    const cleanPart = part.replace(/-[a-f0-9]{4}$/, '');
    // Capitalize and replace dashes with spaces
    return cleanPart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch (e) {
    return `Premium Template ${index + 1}`;
  }
}

// Render skeleton items for smooth transition
function renderSkeletons(count) {
  galleryGrid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-image"></div>
      <div class="skeleton-info">
        <div class="skeleton-text skeleton-title"></div>
        <div class="skeleton-text skeleton-link"></div>
        <div class="skeleton-text skeleton-meta"></div>
      </div>
    `;
    galleryGrid.appendChild(skeleton);
  }
}

// Render template cards for current page
function renderPage() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, templates.length);
  const pageItems = templates.slice(startIndex, endIndex);

  // Update total counts display
  resultCountEl.textContent = `显示第 ${startIndex + 1}-${endIndex} 个模板，共 ${templates.length} 个`;

  // First, show skeletons to provide high-fidelity visual loading state
  renderSkeletons(pageItems.length);

  // Use a slight timeout to simulate web-app loading transitions
  setTimeout(() => {
    galleryGrid.innerHTML = '';
    
    pageItems.forEach((url, i) => {
      // Calculate original index in the templates array for image source mapping
      const originalIndex = startIndex + i;
      const cardTitle = getTemplateName(url, originalIndex);
      
      const card = document.createElement('a');
      card.href = url;
      card.target = '_blank';
      card.className = 'template-card';
      
      // Zero-padded template index
      const paddedIndex = String(originalIndex + 1).padStart(2, '0');

      card.innerHTML = `
        <div class="card-indicator">模版 ${paddedIndex}</div>
        <div class="card-image-wrapper">
          <img src="./screenshots/screenshot-${getSlug(url)}.png" alt="${cardTitle}" class="card-image" style="opacity: 0; transition: opacity 0.5s ease;">
          <div class="card-overlay">
            <div class="preview-badge">
              <span>预览网站</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        </div>
        <div class="card-info">
          <div class="card-title">${cardTitle}</div>
          <div class="card-link">${url}</div>
          <div class="card-meta">
            <span class="card-tag">B2B 推荐</span>
            <span class="card-action-text">
              访问网站
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </span>
          </div>
        </div>
      `;

      galleryGrid.appendChild(card);
      
      // Image fade-in logic once asset completes loading
      const img = card.querySelector('.card-image');
      img.onload = () => {
        img.style.opacity = '1';
      };
      // Fallback for cached images
      if (img.complete) {
        img.style.opacity = '1';
      }
    });

    renderPagination();
  }, 350);
}

// Render pagination control buttons
function renderPagination() {
  const totalPages = Math.ceil(templates.length / itemsPerPage);
  paginationContainer.innerHTML = '';
  
  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }
  
  paginationContainer.style.display = 'flex';

  // Prev Button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.disabled = currentPage === 1;
  prevBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  `;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
    }
  });
  paginationContainer.appendChild(prevBtn);

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      if (currentPage !== i) {
        currentPage = i;
        renderPage();
      }
    });
    paginationContainer.appendChild(pageBtn);
  }

  // Next Button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  `;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage();
    }
  });
  paginationContainer.appendChild(nextBtn);
}

const fallbackTemplates = [
  "https://purple-morning-6b6d.zhangtong6666666.workers.dev/",
  "https://ancient-salad-359f.zhangtong6666666.workers.dev/",
  "https://holy-thunder-bbb7.zhangtong6666666.workers.dev/",
  "https://white-block-04b5.zhangtong6666666.workers.dev/",
  "https://wispy-queen-c8b3.zhangtong6666666.workers.dev/",
  "https://fragrant-frog-2045.zhangtong6666666.workers.dev/",
  "https://silent-surf-3402.zhangtong6666666.workers.dev/",
  "https://odd-bar-f960.zhangtong6666666.workers.dev/",
  "https://proud-rain-bc38.zhangtong6666666.workers.dev/",
  "https://billowing-salad-d93e.zhangtong6666666.workers.dev/",
  "https://gentle-mode-7cb7.zhangtong6666666.workers.dev/",
  "https://little-block-181d.zhangtong6666666.workers.dev/",
  "https://round-wind-cbdd.zhangtong6666666.workers.dev/",
  "https://cold-butterfly-ab6c.zhangtong6666666.workers.dev/",
  "https://rapid-river-e842.zhangtong6666666.workers.dev/"
];

// Init Setup
async function init() {
  try {
    try {
      const response = await fetch('./templates.json');
      if (response.ok) {
        templates = await response.json();
      } else {
        console.warn('Failed to load templates.json, using fallback list');
        templates = fallbackTemplates;
      }
    } catch (e) {
      console.warn('Fetch error (likely file:// protocol), using fallback list:', e);
      templates = fallbackTemplates;
    }
    
    // Setup Page-size listener
    itemsPerPageSelect.addEventListener('change', (e) => {
      itemsPerPage = parseInt(e.target.value, 10);
      currentPage = 1;
      renderPage();
    });

    renderPage();
  } catch (error) {
    console.error('Initialization failed:', error);
    galleryGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444; border: 1px dashed rgba(239, 68, 68, 0.3); border-radius: 12px; background: rgba(239, 68, 68, 0.05);">
        <h3 style="margin-bottom: 10px;">Configuration Error</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', init);
