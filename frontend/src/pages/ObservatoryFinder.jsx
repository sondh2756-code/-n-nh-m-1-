import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { observatoriesApi } from "../api/client";
import { Loading, ErrorMessage } from "../components/Feedback";

const DEFAULT_LOCATION = { lat: 21.0285, lng: 105.8542 };

export default function ObservatoryFinder() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [observatories, setObservatories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredObservatories = observatories.filter((observatory) =>
    [
      observatory.name,
      observatory.address,
      observatory.weatherDependency ? "ngoai troi" : "trong nha",
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery),
  );
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}&z=10&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
      );
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await observatoriesApi.getNearby(
          location.lat,
          location.lng,
          500,
        );
        setObservatories(res.observatories || []);
      } catch (err) {
        setError(err.message || "Không tải được danh sách đài quan sát");
      } finally {
        setLoading(false);
      }
    })();
  }, [location]);

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row gap-gutter h-[calc(100vh-160px)]">
        <div className="w-full md:w-3/5 h-64 md:h-full relative glass-card rounded-xl flex-shrink-0 overflow-hidden bg-surface-container-lowest">
          <iframe
            title="Bản đồ Google Maps các đài quan sát"
            src={googleMapsEmbedUrl}
            className="absolute inset-0 w-full h-full border-0 grayscale-[0.35] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute top-6 left-6 glass-card px-4 py-2 rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[18px]">
              public
            </span>
            <div className="font-label-caps text-label-caps text-on-surface-variant">
              {observatories.length} ĐÀI QUAN SÁT
            </div>
          </div>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-on-surface shadow-lg border border-primary/40 hover:bg-primary hover:text-on-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              open_in_new
            </span>
            Mở Google Maps
          </a>
        </div>

        {/* List */}
        <div className="w-full md:w-2/5 h-full overflow-y-auto">
          <div className="mb-4">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
              Nearby Observatories
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Khám phá vị trí quan sát tối ưu gần bạn.
            </p>
            <label className="relative block">
              <span className="sr-only">Tìm đài quan sát</span>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-[20px]">
                search
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tìm theo tên hoặc địa chỉ..."
                className="w-full bg-surface-container-lowest border-b border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant"
              />
            </label>
          </div>

          {loading && <Loading label="Đang tìm đài quan sát..." />}
          {error && <ErrorMessage message={error} />}

          {!loading && !error && (
            <div className="flex flex-col gap-4">
              {filteredObservatories.map((obs) => (
                <div
                  key={obs._id}
                  className="glass-card rounded-xl p-6 flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                        {obs.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="material-symbols-outlined text-tertiary text-[16px] filled">
                          star
                        </span>
                        <span className="font-body-md text-body-md text-on-surface">
                          {obs.rating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container-highest px-2 py-1 rounded">
                      <span className="material-symbols-outlined text-primary text-[14px]">
                        near_me
                      </span>
                      <span className="font-label-caps text-label-caps text-primary">
                        {obs.distanceKm?.toFixed(1)} km
                      </span>
                    </div>
                  </div>
                  {obs.address && (
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {obs.address}
                    </p>
                  )}
                  <div className="flex gap-3 mt-2">
                    <span className="px-2 py-1 bg-secondary-container/20 text-secondary-fixed rounded text-[10px] font-label-caps font-medium border border-secondary-container/30">
                      {obs.weatherDependency ? "NGOAI TROI" : "TRONG NHA"}
                    </span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${obs.latitude},${obs.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-label-caps font-medium text-primary border border-primary/30 hover:bg-primary/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        directions
                      </span>
                      Chỉ đường
                    </a>
                  </div>
                </div>
              ))}
              {filteredObservatories.length === 0 && (
                <p className="text-on-surface-variant text-center py-8">
                  {searchQuery.trim()
                    ? "Không tìm thấy đài quan sát phù hợp."
                    : "Không tìm thấy đài quan sát nào trong bán kính 500km."}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
