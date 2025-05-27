import { createSignal, onMount } from 'solid-js';
import '../css/dashboard_page.css'; 

function DashboardPage() {
  const [users, setUsers] = createSignal([]);

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users');
      console.log('onMount: Fetch response received. Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('onMount: Server response not OK', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText || errorText}`);
      }

      const data = await response.json();
      console.log('onMount: Data received from API:', data);

      if (Array.isArray(data)) {
        setUsers([...data]);
        console.log('onMount: Users signal updated. Current users():', users());
      } else {
        console.error('onMount: Data received is not an array:', data);
      }

    } catch (err) {
      console.error('onMount: Error during fetch or data processing:', err);
    } finally {
      console.log('Fetch Completed');
    }
  });

  return (
    <div>
        <div class="header">
            <div class="left-items">
                <a href="/liked-users" class="header-item">
                <span style="font-size: 24px;">👥</span>
                Liked Users
                </a>
                <a href="/chat" class="header-item">
                <span style="font-size: 24px;">✉️</span>
                Chat
                </a>
            </div>
            <a href="/profile">
                <div class="profile-icon">
                👤
                </div>
            </a>
        </div>
    </div>
  );
}

export default DashboardPage;
