import { createSignal, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Header from './header';
import '../css/liked_page.css';

const BackIconPlaceholder = () => <span>[Back]</span>;
const UserIconPlaceholder = () => <span>[User]</span>;
const ItemIconPlaceholder = () => <img src="https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Ikon Item" class="item-icon-image"/>;

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

    const nav = useNavigate();
    
    const handleGoHome = () => {
        nav('/dashboard');
    };

    const handleProfileClick = () => {
        nav('/profile');
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        console.log("Page changed to:", pageNumber);
    };

    return (
        <div class="liked-page-overall-background">
            <Header/>
            <main class="liked-page-main-content">
                <div id="likedItemsContainer">
                    <div class="items-grid">
                        <For each={likedItems()} fallback={<div>No liked items yet.</div>}>
                            {(item) => <LikedItemCard item={item} onClick={handleProfileClick}/>}
                        </For>
                    </div>
                    <nav class="pagination" aria-label="Page navigation">
                        <For each={Array.from({ length: totalPages }, (_, i) => i + 1)}>
                            {(pageNumber) => (
                                <button
                                    class="page-button"
                                    classList={{ active: currentPage() === pageNumber }}
                                    onClick={() => handlePageChange(pageNumber)}>
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
