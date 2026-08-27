import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { icon: "home", label: "Trang chủ", path: "/" },
  { icon: "explore", label: "Khám phá", path: "/planets" },
  { icon: "smart_toy", label: "Trợ lý AI", path: "/chat" },
  { icon: "map", label: "Bản đồ", path: "/observatories" },
  { icon: "person", label: "Cá nhân", path: "/profile" },
];

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 md:hidden bg-surface-container-low/80 backdrop-blur-md rounded-t-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={
              active
                ? "flex flex-col items-center justify-center bg-primary text-on-primary rounded-xl p-2 active:scale-90 transition-transform duration-200"
                : "flex flex-col items-center justify-center text-on-surface-variant p-2 hover:text-primary transition-all active:scale-90 duration-200"
            }
          >
            <span className="material-symbols-outlined mb-1">{item.icon}</span>
            <span className="font-label-caps text-label-caps">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
