const app = document.getElementById('app');

const books = [
  {
    id: 'book1',
    title: 'Extracurricular Hero',
    cover: 'covers/hero.jpg',
    blurb: 'A teleporting teen takes on a corrupt city.',
    chapters: ['hero1.md', 'hero2.md']
  },
  {
    id: 'book2',
    title: "Martians Don't Play Football [COMING SOON]",
    cover: 'covers/martians.jpg',
    blurb: 'A Martian teen tackles small-town high school.',
    chapters: ['martian1.md']
  }
];

let selectedBook = null;
let currentChapterIndex = 0;

function renderLandingPage() {
  app.innerHTML = `
    <div class="book-grid">
      ${books.map(book => `
        <div class="book-card" onclick="openBook('${book.id}')">
          <img src="${book.cover}" alt="${book.title}">
          <div class="content">
            <h3>${book.title}</h3>
            <p>${book.blurb}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function openBook(bookId) {
  selectedBook = books.find(b => b.id === bookId);
  renderChapterList();
}

function renderChapterList() {
  app.innerHTML = `
    <div class="book-detail">
      <button onclick="renderLandingPage()">← Back to Library</button>
      <h2>${selectedBook.title}</h2>
      <img src="${selectedBook.cover}" alt="${selectedBook.title}" />
      <ul class="chapter-list">
        ${selectedBook.chapters.map((ch, i) => `
          <li><button onclick="readChapter(${i})">Chapter ${i + 1}</button></li>
        `).join('')}
      </ul>
    </div>
  `;
}

async function readChapter(index) {
  currentChapterIndex = index;
  const chapterFile = selectedBook.chapters[index];
  const response = await fetch('chapters/' + chapterFile);
  const text = await response.text();
  renderChapter(marked.parse(text));  // Convert markdown to HTML
}

function renderChapter(htmlContent) {
  app.innerHTML = `
    <div class="chapter-view">
      <button onclick="renderChapterList()">← Back to Chapters</button>
      <h2>${selectedBook.title} - Chapter ${currentChapterIndex + 1}</h2>
      <div class="chapter-content">${htmlContent}</div>
      <div class="chapter-buttons">
        <button onclick="readChapter(${currentChapterIndex - 1})" ${currentChapterIndex === 0 ? 'disabled' : ''}>Previous</button>
        <button onclick="readChapter(${currentChapterIndex + 1})" ${currentChapterIndex === selectedBook.chapters.length - 1 ? 'disabled' : ''}>Next</button>
      </div>
    </div>
  `;
}

renderLandingPage();
