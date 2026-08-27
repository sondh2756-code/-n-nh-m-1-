import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  skyEventsApi,
  planetsApi,
  stargazingApi,
  newsApi,
} from "../api/client";
import { Loading } from "../components/Feedback";

// Vi tri mac dinh (Ha Noi) neu trinh duyet khong cho phep lay Geolocation
const DEFAULT_LOCATION = {
  lat: 21.0285,
  lng: 105.8542,
  label: "Hà Nội, Việt Nam",
};

export default function Home() {
  const [events, setEvents] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [news, setNews] = useState([]);
  const [skyScore, setSkyScore] = useState(null);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            label: "Vị trí của bạn",
          }),
        () => {}, // giu nguyen DEFAULT_LOCATION neu bi tu choi
      );
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [eventsRes, planetsRes, skyRes] = await Promise.all([
          skyEventsApi.list({ from: new Date().toISOString().slice(0, 10) }),
          planetsApi.list({ limit: 3 }),
          stargazingApi
            .getRecommendations(location.lat, location.lng)
            .catch(() => null),
          newsApi.getSummary({ limit: 4 }).catch(() => ({ articles: [] })),
        ]);
        setEvents(eventsRes.events || []);
        setPlanets(planetsRes.planets || []);
        setSkyScore(skyRes?.recommendations?.[0] || null);
        setNews(newsRes.articles || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [location]);

  const score = skyScore?.score ?? 0;
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (score / 100) * circumference;
  const upcomingEvents = [...events]
    .filter(
      (event) =>
        event.date &&
        new Date(event.date) >= new Date(new Date().setHours(0, 0, 0, 0)),
    )
    .sort((first, second) => new Date(first.date) - new Date(second.date))
    .slice(0, 4);

  return (
    <MainLayout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
            Observation Deck
          </h1>
          <div className="flex items-center gap-2 text-on-surface-variant font-label-caps text-label-caps">
            <span className="material-symbols-outlined filled">
              location_on
            </span>
            <span>{location.label.toUpperCase()}</span>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-3xl filled">
            schedule
          </span>
          <div>
            <div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
              {now.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="font-label-caps text-label-caps text-on-surface-variant">
              {now
                .toLocaleDateString("vi-VN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
                .toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <Loading label="Đang tải dữ liệu bầu trời..." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Sky Visibility Score */}
            <div className="md:col-span-4 flex flex-col gap-gutter">
              <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden h-full min-h-[300px]">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2 w-full text-left">
                  Sky Visibility
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant w-full text-left mb-6">
                  Điều kiện khí quyển hiện tại để ngắm sao.
                </p>
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg
                    className="w-full h-full absolute inset-0"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      className="text-surface-variant stroke-current"
                      cx="60"
                      cy="60"
                      fill="transparent"
                      r="50"
                      strokeWidth="8"
                    />
                    <circle
                      className="text-primary stroke-current progress-ring__circle"
                      cx="60"
                      cy="60"
                      fill="transparent"
                      r="50"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      strokeWidth="8"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(184, 195, 255, 0.6))",
                      }}
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="font-display-lg text-display-lg text-primary glow-text">
                      {score}
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">
                      {score >= 70
                        ? "EXCELLENT"
                        : score >= 40
                          ? "MODERATE"
                          : "POOR"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts + Recommendations */}
            <div className="md:col-span-8 flex flex-col gap-gutter">
              <div className="glass-panel rounded-xl p-6 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-tertiary filled">
                        warning
                      </span>
                      <span className="font-label-caps text-label-caps text-tertiary">
                        UPCOMING EVENT
                      </span>
                    </div>
                    {events.length > 0 ? (
                      <>
                        <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                          {events[0].eventName}
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                          {new Date(events[0].date).toLocaleDateString("vi-VN")}{" "}
                          — {events[0].description}
                        </p>
                      </>
                    ) : (
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Không có sự kiện nào sắp tới.
                      </p>
                    )}
                  </div>
                  <Link
                    to="/sky-events"
                    className="bg-primary-container text-on-primary-container font-headline-lg-mobile text-[16px] font-bold px-6 py-3 rounded-lg shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all whitespace-nowrap"
                  >
                    Xem tất cả
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                  Planets You Might Like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {planets.map((planet) => (
                    <Link
                      to={`/planets/${planet._id}`}
                      key={planet._id}
                      className="glass-panel rounded-xl p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer"
                    >
                      <div className="w-20 h-20 rounded-full mb-4 shadow-[0_0_20px_rgba(250,189,0,0.2)] overflow-hidden bg-surface-variant flex items-center justify-center">
                        {planet.imageUrl ? (
                          <img
                            src={planet.imageUrl}
                            alt={planet.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-3xl text-primary">
                            public
                          </span>
                        )}
                      </div>
                      <h4 className="font-headline-lg-mobile text-[18px] text-on-surface mb-1">
                        {planet.name}
                      </h4>
                      <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface-variant/50 px-2 py-1 rounded">
                        {planet.hasRing ? "CÓ VÀNH ĐAI" : "XEM CHI TIẾT"}
                      </span>
                    </Link>
                  ))}
                  {planets.length === 0 && (
                    <p className="text-on-surface-variant col-span-3 text-center py-8">
                      Chưa có dữ liệu hành tinh — chạy `npm run seed` ở backend.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mt-gutter">
            <section className="glass-panel rounded-xl p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="font-label-caps text-label-caps text-primary mb-1">
                    LỊCH SỬ BẦU TRỜI
                  </p>
                  <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                    Sự kiện theo ngày
                  </h2>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl">
                  event
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="flex gap-3 items-start border-l-2 border-primary pl-3"
                  >
                    <time className="font-label-caps text-label-caps text-primary min-w-[82px]">
                      {new Date(event.date).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </time>
                    <div>
                      <h3 className="font-body-md text-body-md font-semibold text-on-surface">
                        {event.eventName}
                      </h3>
                      <p className="text-sm text-on-surface-variant line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
                {upcomingEvents.length === 0 && (
                  <p className="text-on-surface-variant">
                    Chưa có sự kiện sắp tới.
                  </p>
                )}
              </div>
            </section>

            <section className="glass-panel rounded-xl p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="font-label-caps text-label-caps text-primary mb-1">
                    CẬP NHẬT MỚI
                  </p>
                  <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                    Tin tức đề xuất
                  </h2>
                </div>
                <Link
                  to="/news"
                  aria-label="Xem tất cả tin tức"
                  className="text-primary hover:text-tertiary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {news.slice(0, 3).map((article) => (
                  <Link
                    key={article._id}
                    to="/news"
                    className="group border-b border-white/10 pb-3 last:border-0 last:pb-0"
                  >
                    <p className="font-label-caps text-label-caps text-tertiary mb-1">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString(
                            "vi-VN",
                          )
                        : article.sourceName || "TIN MỚI"}
                    </p>
                    <h3 className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                ))}
                {news.length === 0 && (
                  <p className="text-on-surface-variant">
                    Chưa có tin tức đề xuất.
                  </p>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </MainLayout>
  );
}
