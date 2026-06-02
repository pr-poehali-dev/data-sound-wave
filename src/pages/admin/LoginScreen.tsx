import * as React from "react"
import { Link } from "react-router-dom"
import { Battery, ArrowLeft, Eye, EyeOff } from "lucide-react"

interface LoginScreenProps {
  password: string
  setPassword: (v: string) => void
  showPass: boolean
  setShowPass: (v: boolean) => void
  authError: string
  onLogin: () => void
}

export function LoginScreen({
  password,
  setPassword,
  showPass,
  setShowPass,
  authError,
  onLogin,
}: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="bg-orange-500 rounded-lg p-2">
            <Battery className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">Аккумофф</span>
        </div>
        <div className="bg-card border border-orange-100 rounded-2xl p-6 shadow-lg">
          <h1 className="text-xl font-bold mb-1">Вход в админку</h1>
          <p className="text-sm text-muted-foreground mb-5">Управление каталогом товаров</p>
          <div className="relative mb-4">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Пароль администратора"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onLogin()}
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {authError && <p className="text-sm text-red-500 mb-3">{authError}</p>}
          <button
            onClick={onLogin}
            className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
          >
            Войти
          </button>
          <Link
            to="/"
            className="mt-4 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="size-3" />
            На главную
          </Link>
        </div>
      </div>
    </div>
  )
}
