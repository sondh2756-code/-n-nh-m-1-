import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { planetsApi } from "../api/client";
import { Loading, ErrorMessage } from "../components/Feedback";

const STAT_ICONS = {
  size: "straighten",
  atmosphere: "cloud",
  distanceFromEarth: "route",
  distanceFromSun: "route",
  temperature: "thermostat",
};

export default function PlanetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [planet, setPlanet] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await planetsApi.getById(id);
        setPlanet(data.planet);
        setRelated(data.relatedSuggestions || []);
      } catch (err) {
        setError(err.message || "Không tải được thông tin hành tinh");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <MainLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span className="font-label-caps text-label-caps">QUAY LẠI</span>
      </button>

      {loading && <Loading label="Đang tải dữ liệu hành tinh..." />}
      {error && <ErrorMessage message={error} />}

      {planet && (
        <div className="flex flex-col gap-12 md:gap-20">
          {/* Hero */}
          <section className="relative w-full flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-3/5 relative flex justify-center items-center h-[300px] md:h-[400px]">
              <div className="absolute w-[80%] h-[80%] rounded-full bg-tertiary-container/30 blur-[100px] z-0" />
              {planet.imageUrl ? (
                <img
                  src={planet.imageUrl}
                  alt={planet.name}
                  className="w-full max-w-[400px] object-contain relative z-10 drop-shadow-[0_0_40px_rgba(250,189,0,0.2)]"
                />
              ) : (
                <span className="material-symbols-outlined text-9xl text-primary/40 relative z-10">
                  public
                </span>
              )}
            </div>
            <div className="w-full md:w-2/5 flex flex-col gap-6 z-10">
              <div>
                <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
                  {planet.name}
                </h1>
                {planet.hasRing && (
                  <p className="font-body-md text-body-md text-tertiary font-medium">
                    Có hệ thống vành đai
                  </p>
                )}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {planet.atmosphere
                  ? `Khí quyển chủ yếu: ${planet.atmosphere}.`
                  : ""}
              </p>
            </div>
          </section>

          {/* Stats grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
            {[
              {
                label: "Kích thước",
                value: planet.size,
                icon: STAT_ICONS.size,
              },
              {
                label: "Khí quyển",
                value: planet.atmosphere,
                icon: STAT_ICONS.atmosphere,
              },
              {
                label: "Cách Trái Đất",
                value: planet.distanceFromEarth,
                icon: STAT_ICONS.distanceFromEarth,
              },
              {
                label: "Nhiệt độ",
                value: planet.temperature,
                icon: STAT_ICONS.temperature,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-panel p-6 rounded-xl flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 text-primary/80 mb-2">
                  <span className="material-symbols-outlined text-[20px]">
                    {stat.icon}
                  </span>
                  <span className="font-label-caps text-label-caps uppercase">
                    {stat.label}
                  </span>
                </div>
                <div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                  {stat.value || "N/A"}
                </div>
              </div>
            ))}
          </section>

          {/* AI Fun Facts */}
          {planet.funFacts?.length > 0 && (
            <section className="w-full">
              <div className="relative rounded-2xl p-6 md:p-8 overflow-hidden bg-surface-container/80 backdrop-blur-xl border border-primary-container/30 shadow-[0_4px_30px_rgba(var(--primary),0.1)]">
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <span className="material-symbols-outlined text-primary filled">
                      auto_awesome
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
                      Cosmo AI Insights
                    </h3>
                    <div className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                      {planet.funFacts.map((fact, i) => (
                        <p key={i}>{fact}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Related planets */}
          {related.length > 0 && (
            <section className="w-full flex flex-col gap-6 mb-12">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface border-b border-white/10 pb-4">
                Khám phá các hành tinh liên quan
              </h2>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-4 no-scrollbar">
                {related.map((p) => (
                  <Link
                    to={`/planets/${p._id}`}
                    key={p._id}
                    className="snap-start shrink-0 w-[240px] md:w-[280px] glass-panel rounded-xl overflow-hidden group cursor-pointer"
                  >
                    <div className="h-40 w-full relative overflow-hidden bg-surface-container-highest flex items-center justify-center">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-4xl text-primary/40">
                          public
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col gap-1">
                      <h4 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface text-[20px] leading-tight">
                        {p.name}
                      </h4>
                    </div>
                  </Link>
                ))}
                <div className="snap-start shrink-0 w-4 md:w-8" />
              </div>
            </section>
          )}
        </div>
      )}
    </MainLayout>
  );
}
