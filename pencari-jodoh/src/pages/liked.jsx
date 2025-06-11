    import { onMount,createSignal, For } from 'solid-js';
    import { useNavigate } from '@solidjs/router';
    import Header from './header';
    import '../css/liked_page.css';

/*     const BackIconPlaceholder = () => <span>[Back]</span>;
    const UserIconPlaceholder = () => <span>[User]</span>; */


    //menampilkan data untuk masing masing liked user
    function LikedItemCard(props) {
    const { item: LikedUser, onClick } = props;
    return (
        <div class="liked-item-card" onClick={() => onClick(LikedUser)}>
        <img src={LikedUser.profile_picture} class="item-icon-image"/>
        <div class="liked-item-info">
            <h3>{LikedUser.nama}</h3>
            <p>{LikedUser.bio}</p>
            <p>{LikedUser.nama_kota}</p>
        </div>
        </div>
    );
    }


    function LikedPage() {
    //membuat signal
    const [likedUsers, setLikedUsers] = createSignal([]);
    const [currentPage, setCurrentPage] = createSignal(1);
    const [totalPages, setTotalPages] = createSignal(1);
    const [error, setError] = createSignal(null);
    const userPerPage = 4;
    
    //ini mengambil userId dari localStorage(untuk id liking_user)
    const userId = localStorage.getItem('userId');
    //id buat melakukan testing
    const userIdTest=8;
    const nav = useNavigate();

    onMount(async () => {
        try {
                //melakukan fetch untuk mengambil data
            const response = await fetch(`http://localhost:3001/user/getLikedUsers`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                //akan mengirimkan liking_user_id untuk nantinya digunakan di database
                body: JSON.stringify({ liking_user_id: userIdTest }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Gagal mengambil data');

            //mengisi data dari server 
            setLikedUsers(data.liked_users || []);
            setTotalPages(Math.ceil((data.liked_users || []).length / userPerPage));
        } catch (err) {
        setError(err.message);
        }
    });
        
        //untuk pindah ke dashboard
        const handleGoHome = () => {
            nav('/dashboard');
        };
        //untuk pindah ke halaman profile
        const handleProfileClick = () => {
            nav('/profile');
        };
        //untuk mengubah halaman paginasi
        const handlePageChange = (pageNumber) => {
            setCurrentPage(pageNumber);
            console.log("Page changed to:", pageNumber);
        };

        //melakukan paginasi
        const paginatedUsers = () => {
        const startIndex = (currentPage() - 1) * userPerPage;
        const endIndex = startIndex + userPerPage;
        return likedUsers().slice(startIndex, endIndex);
        };


        return (
            <div class="liked-page-overall-background">
                <Header/>
                <main class="liked-page-main-content">
                    <div id="likedItemsContainer">
                        <div class="items-grid">
                            {/* iterasi data berdasarkan paginatedUsers */}
                            <For each={paginatedUsers()} fallback={<div>No liked yet.</div>}>
                                {/* untuk setiap item maka akan di card(dijadikan 1 frame) */}
                                {(item) => <LikedItemCard item={item} onClick={handleProfileClick}/>}
                            </For>
                        </div>
                        <nav class="pagination" aria-label="Page navigation">
                            {/* membuat tombol sebanyak totalPages */}
                            <For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
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
