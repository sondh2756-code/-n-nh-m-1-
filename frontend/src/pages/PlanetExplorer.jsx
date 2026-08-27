import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { planetsApi } from "../api/client";
import { Loading, ErrorMessage } from "../components/Feedback";

const FILTERS = [
  { key: "all", label: "Tất cả hành tinh" },
  { key: "hasRing", label: "Có vành đai" },
];

export default function PlanetExplorer() {
  const [planets, setPlanets] = useState([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadPlanets() {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (query.trim()) {
        res = await planetsApi.search(query.trim());
      } else if (activeFilter === "hasRing") {
        res = await planetsApi.list({ hasRing: "true" });
      } else {
        res = await planetsApi.list();
      }
      setPlanets(res.planets || []);
    } catch (err) {
      setError(err.message || "Không tải được danh sách hành tinh");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlanets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadPlanets();
  }

  return (
    <MainLayout>
      <header className="mb-10">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-3">
          Planet Explorer
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Explore the solar system and discover worlds beyond Earth.
        </p>
      </header>
      <section className="flex flex-col gap-6 mb-12">
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full max-w-3xl mx-auto"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-primary text-xl">
              search
            </span>
          </div>
          <input
            className="w-full bg-surface-container-lowest border-0 border-b border-white/10 focus:border-primary text-on-surface font-headline-lg-mobile px-12 py-4 rounded-t-lg transition-all focus:ring-0 focus:shadow-[0_4px_20px_rgba(var(--primary),0.2)] placeholder:text-surface-variant outline-none"
            placeholder="Tìm kiếm bằng ngôn ngữ tự nhiên, ví dụ: 'hành tinh có vành đai'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <div className="flex flex-wrap justify-center gap-4">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setQuery("");
                setActiveFilter(f.key);
              }}
              className={`chip font-label-caps text-label-caps px-4 py-2 rounded-full transition-colors ${
                activeFilter === f.key
                  ? "active text-primary"
                  : "text-on-surface-variant"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {loading && <Loading label="Đang tải hành tinh..." />}
      {error && <ErrorMessage message={error} onRetry={loadPlanets} />}

      {!loading && !error && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {planets.map((planet) => (
            <Link
              to={`/planets/${planet._id}`}
              key={planet._id}
              className="glass-card rounded-xl overflow-hidden flex flex-col cursor-pointer group"
            >
              <div className="h-48 relative overflow-hidden bg-surface-container-lowest flex items-center justify-center p-4">
                {planet.imageUrl ? (
                  <img
                    src={planet.imageUrl}
                    alt={planet.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <span className="material-symbols-outlined text-6xl text-primary/40">
                    public
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col gap-4">
                <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface m-0 glow-text">
                  {planet.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {planet.hasRing && (
                    <span className="font-label-caps text-label-caps bg-tertiary/10 text-tertiary px-2 py-1 rounded flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        radio_button_unchecked
                      </span>{" "}
                      Có vành đai
                    </span>
                  )}
                </div>
                <p className="text-on-surface-variant font-body-md text-body-md line-clamp-2 mt-2">
                  {planet.funFacts?.[0] || planet.atmosphere || ""}
                </p>
              </div>
            </Link>
          ))}
          {planets.length === 0 && (
            <p className="text-on-surface-variant col-span-full text-center py-16">
              Không tìm thấy hành tinh nào phù hợp.
            </p>
          )}
        </section>
      )}
    </MainLayout>
  );
}
