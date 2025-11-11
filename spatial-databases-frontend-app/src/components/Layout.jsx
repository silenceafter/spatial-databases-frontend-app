// src/components/Layout.jsx
import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Главная</Link>
        <Link to="/about" style={{ marginRight: '1rem' }}>О нас</Link>
        <Link to="/profile">Профиль</Link>
      </nav>
      <main>
        <Outlet /> {/* Здесь рендерятся дочерние страницы */}
      </main>
      <footer style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
        © 2025 Мой проект
      </footer>
    </div>
  );
}