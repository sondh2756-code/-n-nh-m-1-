import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { usersApi } from "../api/client";
import { useAuth } from "../api/AuthContext";
import { Loading } from "../components/Feedback";

const TOPIC_OPTIONS = [
  "Deep Sky Objects",
  "Meteor Showers",
  "Eclipses",
  "Aurora Forecasts",
  "Exoplanet Transits",
];

export default function Profile() {
  const { user, loading: authLoading, signout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const data = await usersApi.getMe();
      setProfile(data);
      setDisplayName(data.displayName || "");
      setSelectedTopics(data.preferences?.favoriteTopics || []);
    })();
  }, [user]);

  function toggleTopic(topic) {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await usersApi.updateMe({ displayName, favoriteTopics: selectedTopics });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(event) {
    event.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match");
      return;
    }

    setPasswordSaving(true);
    try {
      await usersApi.changePassword({ currentPassword, newPassword });
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setPasswordOpen(false);
        setPasswordSaved(false);
      }, 1200);
    } catch (err) {
      setPasswordError(err.message || "Password change failed");
    } finally {
      setPasswordSaving(false);
    }
  }

  if (authLoading || !profile) {
    return (
      <MainLayout>
        <Loading label="Loading profile..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-12">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
          Commander Profile
        </h1>
        <p className="text-on-surface-variant font-body-md text-body-md">
          Cấu hình thông tin cá nhân và tùy chọn quan sát của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-gutter">
        {/* Left: basic info */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-xl p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 mb-4 rounded-full border-2 border-primary bg-surface-variant flex items-center justify-center overflow-hidden">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-5xl text-primary">
                    account_circle
                  </span>
                )}
              </div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                {profile.displayName}
              </h2>
              <span className="font-label-caps text-label-caps text-on-surface-variant mt-1">
                {profile.email}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">
                  Display name
                </label>
                <input
                  className="glass-input w-full p-2 font-body-md text-body-md rounded-t"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-luminous w-full py-3 rounded-lg font-headline-lg text-body-md font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">save</span>
                {saving ? "Đang lưu..." : saved ? "Đã lưu!" : "Cập nhật hồ sơ"}
              </button>

              <button
                onClick={() => {
                  setPasswordError("");
                  setPasswordSaved(false);
                  setPasswordOpen(true);
                }}
                className="w-full py-3 rounded-lg font-headline-lg text-body-md text-primary border border-primary/30 hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">lock_reset</span>
                Đổi mật khẩu
              </button>

              <button
                onClick={async () => {
                  await signout();
                  navigate("/signin");
                }}
                className="w-full py-3 rounded-lg font-headline-lg text-body-md text-error border border-error/30 hover:bg-error/10 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Right: preferences */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary">
                visibility
              </span>
              Tần suất quan sát
            </h3>
            <p className="text-on-surface-variant font-body-md text-body-md mb-6">
              Chọn chủ đề bạn muốn ưu tiên trong các gợi ý.
            </p>
            <div className="flex flex-wrap gap-3">
              {TOPIC_OPTIONS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`chip font-label-caps text-label-caps text-on-surface px-4 py-2 rounded-full flex items-center gap-2 ${
                    selectedTopics.includes(topic) ? "active" : ""
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${selectedTopics.includes(topic) ? "bg-primary" : "bg-outline-variant"}`}
                  />
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {passwordOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !passwordSaving)
              setPasswordOpen(false);
          }}
        >
          <form
            onSubmit={handleChangePassword}
            className="glass-panel w-full max-w-md rounded-xl p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="font-label-caps text-label-caps text-primary mb-1">
                  BẢO MẬT TÀI KHOẢN
                </p>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                  Đổi mật khẩu
                </h2>
              </div>
              <button
                type="button"
                aria-label="Đóng cửa sổ đổi mật khẩu"
                onClick={() => setPasswordOpen(false)}
                disabled={passwordSaving}
                className="p-2 rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary disabled:opacity-50"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm text-on-surface-variant">
                Mật khẩu hiện tại
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="glass-input w-full mt-2 p-3 rounded-t"
                />
              </label>
              <label className="block text-sm text-on-surface-variant">
                Mật khẩu mới
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="glass-input w-full mt-2 p-3 rounded-t"
                />
              </label>
              <label className="block text-sm text-on-surface-variant">
                Xác nhận mật khẩu mới
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="glass-input w-full mt-2 p-3 rounded-t"
                />
              </label>
            </div>

            {passwordError && (
              <p className="text-error text-sm mt-4">{passwordError}</p>
            )}
            {passwordSaved && (
              <p className="text-primary text-sm mt-4">
                Đổi mật khẩu thành công.
              </p>
            )}

            <button
              type="submit"
              disabled={passwordSaving}
              className="btn-luminous w-full py-3 rounded-lg font-semibold mt-6 disabled:opacity-50"
            >
              {passwordSaving ? "Đang cập nhật..." : "Lưu mật khẩu mới"}
            </button>
          </form>
        </div>
      )}
    </MainLayout>
  );
}
