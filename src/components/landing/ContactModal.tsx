import * as React from "react"
import { X, Phone, User, MessageSquare, CheckCircle } from "lucide-react"

const CONTACT_URL = "https://functions.poehali.dev/46117aba-3651-4b65-b8f3-55ca731c11a1"

interface ContactModalProps {
  open: boolean
  onClose: () => void
  title?: string
  source?: string
}

type Step = "form" | "success"

export function ContactModal({
  open,
  onClose,
  title = "Получить консультацию",
  source = "website",
}: ContactModalProps) {
  const [step, setStep] = React.useState<Step>("form")
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [error, setError] = React.useState("")
  const [sending, setSending] = React.useState(false)

  // Сброс при открытии
  React.useEffect(() => {
    if (open) {
      setStep("form")
      setName("")
      setPhone("")
      setMessage("")
      setError("")
      setSending(false)
    }
  }, [open])

  // Закрытие по Escape
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError("Введите ваше имя"); return }
    if (!phone.trim()) { setError("Введите номер телефона"); return }
    setSending(true)
    setError("")
    try {
      const r = await fetch(CONTACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), message: message.trim(), source }),
      })
      const d = await r.json()
      if (!d.ok) { setError(d.error || "Ошибка отправки"); return }
      setStep("success")
    } catch {
      setError("Не удалось отправить заявку. Попробуйте позже.")
    } finally {
      setSending(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-background rounded-2xl border border-orange-100 shadow-2xl w-full max-w-md">
        {/* Заголовок */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100">
          <h2 className="font-bold text-lg">
            {step === "success" ? "Заявка отправлена!" : title}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Успех */}
        {step === "success" ? (
          <div className="px-6 py-10 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="size-14 text-orange-500" />
            </div>
            <p className="font-semibold text-lg mb-2">Спасибо, {name}!</p>
            <p className="text-muted-foreground text-sm mb-6">
              Мы получили вашу заявку и свяжемся с вами в ближайшее время.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            >
              Закрыть
            </button>
          </div>
        ) : (
          /* Форма */
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Расскажите о вашей технике — подберём подходящий вариант и перезвоним.
            </p>

            {/* Имя */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Ваше имя *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Телефон */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Телефон *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Сообщение */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Вопрос или комментарий</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Тип техники, напряжение АКБ, объём задачи..."
                  rows={3}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors disabled:opacity-60 text-sm"
            >
              {sending ? "Отправляю..." : "Отправить заявку"}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
