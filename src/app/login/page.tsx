"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-red rounded-none flex items-center justify-center mx-auto mb-4">
            <span className="font-display font-bold text-white text-3xl">N</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-white uppercase">Admin Panel</h1>
          <p className="text-white/50 text-sm mt-1">Norte Automotores</p>
        </div>

        <form onSubmit={handleLogin} className="bg-brand-dark-2 rounded-none p-8 space-y-4">
          <div>
            <label className="text-sm font-semibold text-white/70 block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-dark border border-white/10 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-white/70 block mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-dark border border-white/10 text-white rounded-none px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 rounded-none transition-colors disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
