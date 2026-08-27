import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { stargazingApi } from "../api/client";
import { Loading, ErrorMessage } from "../components/Feedback";

const DEFAULT_LOCATION = {
  lat: 21.0285,
  lng: 105.8542,
  label: "Hà Nội, Việt Nam",
};

export default function Stargazing() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            label: "Vị trí của bạn",
          }),
        () => {},
      );
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await stargazingApi.getRecommendations(
          location.lat,
          location.lng,
        );
        setData(res.recommendations?.[0] || null);
      } catch (err) {
        setError(
          err.message ||
            "Không lấy được dữ liệu thời tiết. Kiểm tra OPENWEATHER_API_KEY.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [location]);

  const score = data?.score ?? 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <MainLayout>
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 mb-12">
        <div className="flex flex-col gap-2">
          <h1 className="font-display-lg text-display-lg text-on-surface">
            Tonight's Sky
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Gợi ý và điều kiện để quan sát tối ưu.
          </p>
        </div>
        <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
          <span className="material-symbols-outlined text-tertiary filled">
            location_on
          </span>
          <span className="font-label-caps text-label-caps text-on-surface">
            {location.label.toUpperCase()}
          </span>
        </div>
      </section>

      {loading && <Loading label="Đang phân tích bầu trời..." />}
      {error && <ErrorMessage message={error} />}

      {data && (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 glass-card rounded-xl p-8 flex flex-col items-center justify-center gap-6 relative overflow-hidden">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface w-full text-left self-start">
              Stargazing Score
            </h2>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg
                className="w-full h-full absolute inset-0"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60"
                  cy="60"
                  fill="none"
                  r="54"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                <circle
                  className="progress-ring__circle"
                  cx="60"
                  cy="60"
                  fill="none"
                  r="54"
                  stroke="rgb(var(--primary))"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="flex flex-col items-center z-10">
                <span className="font-display-lg text-display-lg text-primary leading-none">
                  {score}
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant mt-2">
                  OUT OF 100
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-4 flex flex-col gap-2">
                <span className="material-symbols-outlined text-primary">
                  cloud
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  CLOUD COVER
                </span>
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                  {data.cloudCoverPercent}%
                </span>
              </div>
              <div className="glass-card rounded-xl p-4 flex flex-col gap-2">
                <span className="material-symbols-outlined text-tertiary filled">
                  thermostat
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  NHIỆT ĐỘ
                </span>
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                  {data.temperature}°C
                </span>
              </div>
              <div className="glass-card rounded-xl p-4 flex flex-col gap-2">
                <span className="material-symbols-outlined text-secondary">
                  water_drop
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  THỜI TIẾT
                </span>
                <span className="font-body-md text-body-md text-on-surface capitalize">
                  {data.weatherDescription}
                </span>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 md:p-8 flex-grow flex flex-col justify-center border-l-4 border-l-tertiary relative overflow-hidden">
              <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
                Đánh giá của AI
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                {data.tip}
              </p>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
