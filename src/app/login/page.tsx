"use client";

import { Alert, Button, Input } from "@/components/ui";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Введите логин и пароль");
      return;
    }
    if (!twoFactorCode.trim()) {
      setError("Введите код из приложения для входа");
      return;
    }
    setLoading(true);
    try {
      const ok = login(username.trim(), password, twoFactorCode.trim());
      if (ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Не удалось войти. Проверьте логин, пароль и код из приложения.");
      }
    } catch {
      setError("Что-то пошло не так. Попробуйте ещё раз через пару секунд.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-[400px] rounded-2xl border border-border/50 bg-card p-8 shadow-soft">
        <div className="mb-8 text-center">
          <h1 className="text-h1 text-foreground">FunTime HelpDesk</h1>
          <p className="mt-2 text-meta text-muted-foreground">
            Войдите в рабочее место поддержки
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-2">
            <label htmlFor="username" className="text-caption text-muted-foreground">
              Логин
            </label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите логин"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-caption text-muted-foreground">
              Пароль
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="2fa" className="text-caption text-muted-foreground">
              Код 2FA
            </label>
            <Input
              id="2fa"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Код из приложения"
              maxLength={6}
            />
          </div>
          {error && (
            <Alert variant="error">{error}</Alert>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Вход…" : "Войти"}
          </Button>
        </form>
        <p className="mt-6 text-center text-caption text-muted-foreground">
          Создание пользователей доступно только администраторам.
        </p>
      </div>
    </div>
  );
}
