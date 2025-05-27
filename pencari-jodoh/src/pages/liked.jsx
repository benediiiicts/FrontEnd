import '../css/liked_page.css'; 

function LikedPage() {
    return (
        <>
            <div class="liked-page-overall-background">
                <header class="liked-page-header">
                    <button class="icon-button back-button" aria-label="Go back">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <div class="profile-icon-container">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                </header>
                <main class="liked-page-main-content">
                    <div id="likedItemsContainer">
                        <div class="items-grid">
                            <div class="liked-item-card">
                                <svg class="item-icon-svg" viewBox="0 0 50 50">
                                    <circle cx="25" cy="15" r="8" stroke="currentColor" stroke-width="3.5" fill="none" />
                                    <path d="M10 40 C10 30, 40 30, 40 40" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
                                </svg>
                            </div>
                            <div class="liked-item-card">
                                <svg class="item-icon-svg" viewBox="0 0 50 50">
                                    <circle cx="25" cy="15" r="8" stroke="currentColor" stroke-width="3.5" fill="none" />
                                    <path d="M10 40 C10 30, 40 30, 40 40" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
                                </svg>
                            </div>
                            <div class="liked-item-card">
                                <svg class="item-icon-svg" viewBox="0 0 50 50">
                                    <circle cx="25" cy="15" r="8" stroke="currentColor" stroke-width="3.5" fill="none" />
                                    <path d="M10 40 C10 30, 40 30, 40 40" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
                                </svg>
                            </div>
                            <div class="liked-item-card">
                                <svg class="item-icon-svg" viewBox="0 0 50 50">
                                    <circle cx="25" cy="15" r="8" stroke="currentColor" stroke-width="3.5" fill="none" />
                                    <path d="M10 40 C10 30, 40 30, 40 40" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>
                        <nav class="pagination" aria-label="Page navigation">
                            <button class="page-button active">1</button>
                            <button class="page-button">2</button>
                            <button class="page-button">3</button>
                        </nav>
                    </div>
                </main>
            </div>
        </>
    )
}
export default LikedPage