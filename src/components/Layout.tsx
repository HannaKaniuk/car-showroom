import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="logo">
            <span className="logo__mark" aria-hidden="true" />
            Car Showroom
          </Link>
          <p className="header__tagline">Віртуальний автосалон</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <p>Дані з DummyJSON API</p>
        </div>
      </footer>
    </div>
  );
}
