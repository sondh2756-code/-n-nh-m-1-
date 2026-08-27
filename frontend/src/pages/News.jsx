import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { newsApi } from "../api/client";
import { Loading, ErrorMessage } from "../components/Feedback";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredArticles = articles.filter((article) =>
    [article.title, article.summary, article.sourceName]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery),
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await newsApi.getSummary({ limit: 10 });
        setArticles(res.articles || []);
      } catch (err) {
        setError(err.message || "Không tải được tin tức");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <MainLayout>
      <header className="mb-12">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-4">
          Stellar Transmissions
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Tin tức thiên văn học mới nhất, được AI tóm tắt ngắn gọn.
        </p>
        <label className="relative block max-w-xl mt-6">
          <span className="sr-only">Tìm kiếm tin tức</span>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-[20px]">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Tìm theo tiêu đề, nội dung hoặc nguồn..."
            className="w-full bg-surface-container-lowest border-b border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant"
          />
        </label>
      </header>

      {loading && <Loading label="Đang tải tin tức..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {filteredArticles.map((article) => (
            <article
              key={article._id}
              className="glass-card rounded-xl p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-label-caps text-tertiary">
                  {article.sourceName || "NGUỒN KHÔNG XÁC ĐỊNH"}
                </span>
                {article.publishedAt && (
                  <>
                    <span className="text-on-surface-variant text-sm">•</span>
                    <span className="text-on-surface-variant text-sm">
                      {new Date(article.publishedAt).toLocaleDateString(
                        "vi-VN",
                      )}
                    </span>
                  </>
                )}
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface">
                {article.title}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {article.summary}
              </p>
              {article.sourceUrl && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="luminescent-button rounded-full py-2 px-6 font-headline-lg text-body-md w-fit flex items-center gap-2 mt-2"
                >
                  Đọc thêm{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              )}
            </article>
          ))}
          {filteredArticles.length === 0 && (
            <p className="text-on-surface-variant col-span-full text-center py-16">
              {searchQuery.trim()
                ? "Không tìm thấy tin tức phù hợp."
                : "Chưa có tin tức nào — chạy `npm run seed` ở backend hoặc thêm dữ liệu."}
            </p>
          )}
        </div>
      )}
    </MainLayout>
  );
}
