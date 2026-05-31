"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Register State
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regGender, setRegGender] = useState("Nam");
  const [regDob, setRegDob] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const processAuthResponse = (data: any) => {
    const { access_token, role } = data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("role", role);

    const normalizedRole = role
      ? role.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "")
      : "";

    if (normalizedRole.includes("admin") || normalizedRole.includes("quantri")) {
      router.push("/admin");
    } else if (normalizedRole.includes("benh")) {
      router.push("/patient");
    } else if (normalizedRole.includes("bacsi")) {
      router.push("/doctor");
    } else if (normalizedRole.includes("nhanvien")) {
      router.push("/staff");
    } else {
      setError("Vai trò không hợp lệ: " + role);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/v1/auth/login", {
        username,
        password,
      });
      processAuthResponse(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/v1/auth/register", {
        username: regUsername,
        password: regPassword,
        email: regEmail,
        full_name: regFullName,
        phone: regPhone,
        gender: regGender,
        dob: regDob
      });
      
      setSuccess("Đăng ký thành công! Đang tự động đăng nhập...");
      const response = await axios.post("http://localhost:8000/api/v1/auth/login", {
        username: regUsername,
        password: regPassword,
      });
      setTimeout(() => processAuthResponse(response.data), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Đăng ký thất bại");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/v1/auth/google-login", {
        token: credentialResponse.credential
      });
      processAuthResponse(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Đăng nhập Google thất bại");
      setLoading(false);
    }
  };

  const renderGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      return (
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-2 mt-4">
          Đăng nhập Google chưa được cấu hình
        </div>
      );
    }
    return (
      <>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-700"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">Hoặc</span></div>
        </div>
        <div className="flex justify-center">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => setError("Đã xảy ra lỗi khi gọi Google")}
            useOneTap
            text="signin_with"
            shape="rectangular"
            width="350"
          />
        </div>
      </>
    );
  };

  const renderContent = () => (
    <div className="min-h-screen flex items-center justify-center relative bg-cover bg-center" style={{ backgroundImage: "url('/hospital-bg.jpg')" }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm"></div>
      
      {/* Back to Home Button */}
      <button 
        onClick={() => router.push("/home")}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white/80 hover:text-white bg-slate-800/40 hover:bg-slate-800/60 px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-md border border-white/10"
      >
        <span className="text-xl leading-none">&larr;</span> Quay lại Trang chủ
      </button>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg max-w-md w-full border border-transparent dark:border-slate-800 z-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">NextGen HMS</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">{isLogin ? "Đăng nhập vào hệ thống" : "Tạo tài khoản Bệnh Nhân mới"}</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}
          {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg mb-6 text-sm">{success}</div>}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên đăng nhập</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 dark:focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mật khẩu</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 dark:focus:border-blue-500" required />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mt-6">
                Đăng nhập
              </button>
              
              {renderGoogleLogin()}

              <p className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
                Chưa có tài khoản? <span onClick={() => setIsLogin(false)} className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline">Đăng ký ngay</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Họ và tên</label>
                <input type="text" value={regFullName} onChange={e => setRegFullName(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tên đăng nhập</label>
                  <input type="text" value={regUsername} onChange={e => setRegUsername(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Mật khẩu</label>
                  <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" required />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Số ĐT</label>
                  <input type="text" value={regPhone} onChange={e => setRegPhone(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Giới tính</label>
                  <select value={regGender} onChange={e => setRegGender(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày sinh</label>
                  <input type="date" value={regDob} onChange={e => setRegDob(e.target.value)} className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500" required />
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg mt-4">
                Đăng ký tài khoản
              </button>
              <p className="text-center mt-4 text-sm text-slate-600 dark:text-slate-400">
                Đã có tài khoản? <span onClick={() => setIsLogin(true)} className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline">Đăng nhập</span>
              </p>
            </form>
          )}
        </div>
      </div>
  );

  if (GOOGLE_CLIENT_ID) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {renderContent()}
      </GoogleOAuthProvider>
    );
  }

  return renderContent();
}
