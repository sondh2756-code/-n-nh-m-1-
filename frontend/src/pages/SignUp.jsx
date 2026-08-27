import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.username.length < 6) {
      setError("Username phải có ít nhất 6 ký tự");
      return;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...signupPayload } = form;
      await signup(signupPayload);
      navigate("/signin");
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-surface">
        <div className="absolute inset-0 star-field opacity-60" />
      </div>

      <main className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">
        <div className="luminous-card rounded-xl p-8 flex flex-col gap-6">
          <div className="text-center flex flex-col gap-2">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">
              Establish an outpost
            </h1>
            <p className="text-on-surface-variant text-sm">
              Tạo tài khoản CosmoVision của bạn
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="luminous-input px-4 py-3 rounded-t-lg"
                placeholder="Tên"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
              />
              <input
                className="luminous-input px-4 py-3 rounded-t-lg"
                placeholder="Họ"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
              />
            </div>
            <input
              className="luminous-input px-4 py-3 rounded-t-lg"
              placeholder="Username"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              minLength={6}
              required
            />
            <input
              className="luminous-input px-4 py-3 rounded-t-lg"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
            <input
              className="luminous-input px-4 py-3 rounded-t-lg"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              minLength={6}
              required
            />
            <input
              className="luminous-input px-4 py-3 rounded-t-lg"
              placeholder="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              minLength={6}
              required
            />

            {error && (
              <p className="text-error text-sm font-label-caps text-label-caps">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-3 rounded-lg font-headline-lg text-[16px] mt-2 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Tạo tài khoản"}
            </button>
          </form>

          <p className="text-center text-on-surface-variant font-body-md text-sm">
            Đã có tài khoản?
            <Link
              to="/signin"
              className="text-primary hover:text-secondary font-semibold transition-colors ml-1"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
