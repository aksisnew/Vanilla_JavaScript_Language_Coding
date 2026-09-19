/**
 * Modular Sidebar Controller
 */
export class Sidebar {
  constructor(containerElement, dbService) {
    this.dock = containerElement;
    this.db = dbService;
    this.initCursorFollower();
  }

  /**
   * Tracks cursor position to feed CSS variables for the ambient spotlight
   */
  initCursorFollower() {
    this.dock.addEventListener('mousemove', (event) => {
      const rect = this.dock.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Update CSS variables asynchronously via animation frame
      requestAnimationFrame(() => {
        this.dock.style.setProperty('--cursor-x', `${x}px`);
        this.dock.style.setProperty('--cursor-y', `${y}px`);
      });
    });
  }

  /**
   * Asynchronously loads notes from IndexedDB and renders them
   */
  async loadNotes() {
    try {
      const notes = await this.db.getAllNotes();
      this.renderNotes(notes);
    } catch (error) {
      console.error('Async load notes failed:', error);
    }
  }

  renderNotes(notes) {
    const listContainer = this.dock.querySelector('.sidebar-list');
    listContainer.innerHTML = notes
      .map(
        (note) => `
        <div class="sidebar-note-card" data-id="${note.id}">
          <span class="sidebar-note-title">${note.title || 'Untitled'}</span>
          <p class="sidebar-note-preview">${note.content || 'Empty note...'}</p>
          <span class="sidebar-note-date">${new Date(note.updatedAt).toLocaleDateString()}</span>
          <button class="sidebar-note-delete" title="Delete note">×</button>
        </div>
      `
      )
      .join('');
  }
}
