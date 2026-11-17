import { ArrowLeft, CheckCircle2, GraduationCap, Loader2, Lock, Mail, User } from "lucide-react";
import { FormEvent, useState } from "react";
import { authService } from "../lib/firebase/authService";
import { AppRoute, CefrLevel } from "../types/learning";

interface AuthPageProps {
  onNavigate: (route: AppRoute) => void;
  authPromptMessage?: string | null;
}

export function AuthPage({ onNavigate, authPromptMessage }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetCefr, setTargetCefr] = useState<CefrLevel>("B2");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorText(null);

    try {
      if (mode === "login") {
        await authService.signInWithEmail({ email, password });
      } else {
        await authService.registerWithEmail({
          fullName,
          email,
          password,
          targetCefr,
        });
      }
      onNavigate("dashboard");
    } catch (err) {
      setErrorText(
        err instanceof Error ? err.message : "Đăng nhập không thành công."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setErrorText(null);
    try {
      await authService.signInWithGoogle();
      onNavigate("dashboard");
    } catch (err) {
      setErrorText(
        err instanceof Error
          ? err.message
          : "Không thể đăng nhập bằng Google."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:grid lg:grid-cols-12">
      {/* Left Navy Panel */}
      <div className="flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-8 text-white sm:px-10 lg:col-span-5 lg:px-12 lg:py-12">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("landing")}
            className="inline-flex items-center gap-2 text-sm font-medium text-sky-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Quay lại trang chủ</span>
          </button>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-sky-400 text-white shadow-lg shadow-blue-500/30">
              <GraduationCap className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold tracking-tight text-white leading-tight">
                TỰ HỌC TIẾNG ANH
              </h1>
              <p className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                PHẠM HẬU
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
            Đăng nhập để lưu trữ riêng tư hồ sơ CEFR, từ vựng đã đánh dấu, bài học hoàn
            thành, lịch sử luyện nói AI và kết quả kiểm tra phát âm.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-200">
            <p className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
              <span>Dữ liệu học tập cô lập riêng biệt theo mã tài khoản Firebase</span>
            </p>
            <p className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
              <span>Hỗ trợ đăng nhập Google và Email / Mật khẩu bảo mật</span>
            </p>
            <p className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
              <span>Đồng bộ theo thời gian thực qua Cloud Firestore</span>
            </p>
          </div>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          Bảo mật dữ liệu cá nhân theo chuẩn quyền sở hữu người dùng Firebase Authentication.
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-8 lg:col-span-7">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md shadow-blue-500/5 sm:p-8">
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorText(null);
              }}
              className={`min-h-[40px] rounded-md text-sm font-semibold transition-all ${
                mode === "login"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorText(null);
              }}
              className={`min-h-[40px] rounded-md text-sm font-semibold transition-all ${
                mode === "register"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Đăng ký
            </button>
          </div>

          <div className="mt-6">
            <h2 className="font-display text-xl font-bold text-slate-900">
              {mode === "login" ? "Đăng nhập tài khoản học viên" : "Tạo tài khoản học tập mới"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {mode === "login"
                ? "Sử dụng Google hoặc Email/Mật khẩu để đồng bộ tiến độ."
                : "Khởi tạo hồ sơ học tập riêng trên Cloud Firestore."}
            </p>
          </div>

          {authPromptMessage && (
            <div
              role="status"
              className="mt-4 rounded-lg border border-sky-200 bg-[#F4F8FF] p-3 text-xs leading-relaxed text-[#0F294A]"
            >
              {authPromptMessage}
            </div>
          )}

          {/* Primary Google Sign-In */}
          <div className="mt-5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={submitting}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1F3A] transition-colors hover:bg-slate-50 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#1D4ED8]" aria-hidden="true" />
              ) : null}
              <span>Tiếp tục với Google</span>
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            <span>hoặc dùng Email & Mật khẩu</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label
                  htmlFor="auth-fullname"
                  className="block text-sm font-medium text-slate-700"
                >
                  Họ và tên
                </label>
                <div className="relative mt-1.5">
                  <User
                    className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="auth-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Minh Anh"
                    className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 focus:border-[#1D4ED8] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-slate-700">
                Địa chỉ email
              </label>
              <div className="relative mt-1.5">
                <Mail
                  className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tenban@example.vn"
                  className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 focus:border-[#1D4ED8] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-slate-700">
                Mật khẩu
              </label>
              <div className="relative mt-1.5">
                <Lock
                  className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-slate-900 focus:border-[#1D4ED8] focus:outline-none"
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label htmlFor="auth-cefr" className="block text-sm font-medium text-slate-700">
                  Mục tiêu CEFR mong muốn
                </label>
                <select
                  id="auth-cefr"
                  value={targetCefr}
                  onChange={(e) => setTargetCefr(e.target.value as CefrLevel)}
                  className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#1D4ED8] focus:outline-none"
                >
                  <option value="A2">A2 — Giao tiếp cơ bản</option>
                  <option value="B1">B1 — Giao tiếp độc lập</option>
                  <option value="B2">B2 — Tự tin trong công việc</option>
                  <option value="C1">C1 — Thành thạo học thuật & quản lý</option>
                  <option value="C2">C2 — Sử dụng như người bản ngữ</option>
                </select>
              </div>
            )}

            {errorText && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-800"
              >
                {errorText}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              <span>
                {submitting
                  ? "Đang xác thực..."
                  : mode === "login"
                    ? "Đăng nhập bằng Email"
                    : "Đăng ký tài khoản mới"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
