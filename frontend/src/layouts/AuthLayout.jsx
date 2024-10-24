import { Outlet } from "react-router-dom";
const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-slate-600 h-20 flex flex-row  justify-between items-center w-full">
        <div className="ml-4">
          <a href="/" className="text-white">
            <img src="logo.png" alt="logo" className="h-14 rounded-md " />
          </a>
        </div>
        <div className="text-white text-3xl font-bold">Prueba Técnica</div>
        <nav className="     px-4 py-2 dl-menu-style">
          <ul className="et-menu">
            <li className="inline-block mx-2">
              <a href="/" className="text-white">
                Dashboard
              </a>
            </li>
            <li className="inline-block mx-2">
              <a href="/more" className="text-white">
                More
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <section className="flex-grow">
        <Outlet />
      </section>
      <footer className="mt-auto">
        <p>Footer</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
