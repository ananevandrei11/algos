import { Link, Outlet } from "@tanstack/react-router";

export function Layout() {
  return (
    <div className="layout">
      <header className="topbar">
        <span className="brand">algos</span>
        <nav>
          <Link to="/">Catalog</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
