import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { skyEventsApi } from "../api/client";
import { ErrorMessage, Loading } from "../components/Feedback";

export default function SkyEvents() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      setError(null);
      try {
        const response = await skyEventsApi.list({
          from: new Date().toISOString().slice(0, 10),
        });
        setEvents(response.events || []);
      } catch (err) {
        setError(err.message || "Không tải được danh sách sự kiện bầu trời");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return events.filter((event) =>
      [event.eventName, event.description, event.visibilityRegion]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [events, query]);

  return (
    <MainLayout>
      <header className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-label-caps text-label-caps text-primary mb-2">
            LỊCH THIÊN VĂN
          </p>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-3">
            Sự kiện bầu trời
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Theo dõi những hiện tượng thiên văn đáng chú ý và thời điểm quan sát
            tốt nhất.
          </p>
        </div>
        <label className="relative block w-full md:w-80">
          <span className="sr-only">Tìm kiếm sự kiện bầu trời</span>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">
            search
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm sự kiện..."
            className="w-full bg-surface-container-lowest border-b border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface outline-none focus:border-primary placeholder:text-on-surface-variant"
          />
        </label>
      </header>

      {loading && <Loading label="Đang tải sự kiện bầu trời..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {filteredEvents.map((event) => (
            <article
              key={event._id}
              className="glass-card rounded-xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 text-primary">
                  <span className="material-symbols-outlined text-3xl">
                    event
                  </span>
                  <time className="font-label-caps text-label-caps">
                    {new Date(event.date).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <span className="rounded-full border border-primary/30 px-3 py-1 text-xs text-primary">
                  {event.visibilityRegion || "Toàn cầu"}
                </span>
              </div>
              <div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
                  {event.eventName}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {event.description || "Chưa có mô tả cho sự kiện này."}
                </p>
              </div>
            </article>
          ))}
          {filteredEvents.length === 0 && (
            <p className="text-on-surface-variant col-span-full text-center py-16">
              {query.trim()
                ? "Không tìm thấy sự kiện phù hợp."
                : "Chưa có sự kiện sắp tới."}
            </p>
          )}
        </section>
      )}
    </MainLayout>
  );
}
