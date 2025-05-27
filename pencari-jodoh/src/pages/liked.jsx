import { createSignal, For } from 'solid-js';
import '../css/liked_page.css';

const BackIconPlaceholder = () => <span>[Back]</span>;
const UserIconPlaceholder = () => <span>[User]</span>;
const ItemIconPlaceholder = () => <span class="item-icon-placeholder">[Item Icon]</span>;

function LikedItemCard(props) {
    return (
        <div class="liked-item-card">
            <ItemIconPlaceholder />
        </div>
    );
}

function LikedPage() {
    const [likedItems, setLikedItems] = createSignal([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' },
    ]);

    const [currentPage, setCurrentPage] = createSignal(1);
    const totalPages = 3;

    const handleGoBack = () => {
        console.log("Go back clicked");
    };

    const handleProfileClick = () => {
        console.log("Profile icon clicked");
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        console.log("Page changed to:", pageNumber);
    };

    return (
        <div class="liked-page-overall-background">
            <header class="liked-page-header">
                <button class="icon-button back-button" aria-label="Go back" onClick={handleGoBack}>
                    <BackIconPlaceholder />
                </button>
                <div class="profile-icon-container" onClick={handleProfileClick} role="button" tabindex="0">
                    <UserIconPlaceholder />
                </div>
            </header>
            <main class="liked-page-main-content">
                <div id="likedItemsContainer">
                    <div class="items-grid">
                        <For each={likedItems()} fallback={<div>No liked items yet.</div>}>
                            {(item) => <LikedItemCard item={item} />}
                        </For>
                    </div>
                    <nav class="pagination" aria-label="Page navigation">
                        <For each={Array.from({ length: totalPages }, (_, i) => i + 1)}>
                            {(pageNumber) => (
                                <button
                                    class="page-button"
                                    classList={{ active: currentPage() === pageNumber }}
                                    onClick={() => handlePageChange(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            )}
                        </For>
                    </nav>
                </div>
            </main>
        </div>
    );
}

export default LikedPage;
