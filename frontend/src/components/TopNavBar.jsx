import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../api/AuthContext";

const NAV_LINKS = [
  { label: "Trang chủ", path: "/" },
  { label: "Khám phá", path: "/planets" },
  { label: "Ngắm sao", path: "/stargazing" },
  { label: "Chòm sao", path: "/constellations" },
  { label: "Tin tức", path: "/news" },
  { label: "Bản đồ", path: "/observatories" },
];

export default function TopNavBar() {
  const location = useLocation();
  const { user } = useAuth();
  const [isLightMode, setIsLightMode] = useState(
    () => localStorage.getItem("cosmovision-theme") === "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", isLightMode);
    document.documentElement.style.colorScheme = isLightMode ? "light" : "dark";
    localStorage.setItem("cosmovision-theme", isLightMode ? "light" : "dark");
  }, [isLightMode]);

  return (
    <header className="w-full top-0 sticky z-50 bg-surface/70 backdrop-blur-xl border-b border-white/10 shadow-[0px_4px_24px_rgba(var(--primary),0.15)]">
      <div className="flex justify-between items-center px-margin-mobile md:px-gutter max-w-container-max mx-auto h-16">
        <Link
          to="/"
          className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight glow-text"
        >
          CosmoVision
        </Link>

        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={
                location.pathname === link.path ||
                (link.path !== "/" &&
                  location.pathname.startsWith(`${link.path}/`))
                  ? "text-primary font-bold border-b-2 border-primary py-1"
                  : "text-on-surface-variant hover:text-primary transition-colors py-1"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/chat"
            aria-label="Trò chuyện với Cosmo AI"
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold transition-all active:scale-95 ${
              location.pathname === "/chat"
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              smart_toy
            </span>
            <span className="hidden lg:inline">Trợ lý AI</span>
          </Link>
          <button
            type="button"
            aria-label={
              isLightMode
                ? "Chuyển sang giao diện tối"
                : "Chuyển sang giao diện sáng"
            }
            onClick={() => setIsLightMode((currentMode) => !currentMode)}
            className="text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all duration-300 p-2 rounded-full active:scale-95"
          >
            <span className="material-symbols-outlined">
              {isLightMode ? "dark_mode" : "light_mode"}
            </span>
          </button>
          <Link
            to={user ? "/profile" : "/signin"}
            aria-label="Tài khoản"
            className="text-primary hover:bg-primary/10 transition-all duration-300 p-2 rounded-full active:scale-95"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
