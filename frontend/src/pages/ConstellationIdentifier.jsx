import { useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { stargazingApi } from "../api/client";
import { Loading } from "../components/Feedback";

export default function ConstellationIdentifier() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  async function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const response = await stargazingApi.identifyConstellation(file);
      setResult(response);
    } catch (err) {
      setError(err.message || "Không nhận diện được ảnh");
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragOver(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  const confidencePercent = result ? Math.round(result.confidence * 100) : 0;

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <section
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`glass-panel rounded-xl p-6 flex flex-col items-center justify-center min-h-[240px] text-center border-dashed border-2 cursor-pointer transition-colors ${dragOver ? "border-primary" : "border-outline-variant"}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-primary">
                cloud_upload
              </span>
            </div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">
              Upload Starfield
            </h3>
            <p className="text-on-surface-variant font-body-md text-body-md mb-4">
              Kéo thả hoặc bấm để chọn ảnh bầu trời đêm
            </p>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps uppercase"
            >
              Browse Files
            </button>
          </section>

          <section className="glass-panel rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                Analysis Engine
              </h3>
              <span className="font-label-caps text-label-caps px-3 py-1 rounded-full border border-primary/30 text-primary">
                {loading ? "ANALYZING" : "READY"}
              </span>
            </div>
            {loading && <Loading label="Đang phân tích ảnh..." />}
            {error && (
              <p className="text-error font-label-caps text-label-caps">
                {error}
              </p>
            )}
            {result && !loading && (
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-surface-container-highest stroke-current"
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="44"
                      strokeWidth="6"
                    />
                    <circle
                      className="text-primary stroke-current progress-ring__circle"
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="44"
                      strokeDasharray="276.46"
                      strokeDashoffset={
                        276.46 - (confidencePercent / 100) * 276.46
                      }
                      strokeLinecap="round"
                      strokeWidth="6"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                      {confidencePercent}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    ĐÃ NHẬN DIỆN
                  </span>
                  <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                    {result.constellation}
                  </span>
                </div>
              </div>
            )}
            {!result && !loading && !error && (
              <p className="text-on-surface-variant font-body-md text-body-md">
                Tải ảnh lên để bắt đầu phân tích.
              </p>
            )}
          </section>
        </div>
        <div className="lg:col-span-7 glass-panel rounded-xl overflow-hidden relative min-h-[400px] flex items-center justify-center border border-white/10">
          {preview ? (
            <img
              src={preview}
              alt="Ảnh đã tải lên"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-6xl opacity-30">
                nightlight
              </span>
              <p className="font-label-caps text-label-caps">
                Chưa có ảnh nào được tải lên
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
