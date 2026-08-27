import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";

export default function SignIn() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signin(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-surface">
        <div className="absolute inset-0 star-field opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container rounded-full mix-blend-screen filter blur-[120px] opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-container rounded-full mix-blend-screen filter blur-[120px] opacity-20" />
      </div>

      <main className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">
        <div className="luminous-card rounded-xl p-8 flex flex-col gap-8">
          <div className="text-center flex flex-col gap-2">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">
              CosmoVision
            </h1>
            <p className="text-on-surface-variant text-sm">
              Explore the universe, powered by AI
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label
                className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                htmlFor="username"
              >
                Username / Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  mail
                </span>
                <input
                  id="username"
                  className="luminous-input w-full pl-10 pr-4 py-3 rounded-t-lg"
                  placeholder="astronomer@deepspace.net"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  lock
                </span>
                <input
                  id="password"
                  className="luminous-input w-full pl-10 pr-10 py-3 rounded-t-lg"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <p className="text-error text-sm font-label-caps text-label-caps">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-3 rounded-lg font-headline-lg text-[16px] mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
              <span className="material-symbols-outlined">rocket_launch</span>
            </button>
          </form>

          <div className="mt-2 text-center">
            <p className="text-on-surface-variant font-body-md text-sm">
              Chưa có tài khoản?
              <Link
                to="/signup"
                className="text-primary hover:text-secondary font-semibold transition-colors ml-1 border-b border-primary/30 hover:border-secondary"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
