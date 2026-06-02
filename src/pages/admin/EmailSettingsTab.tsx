import * as React from "react"
import { Plus, Trash2, Mail, ToggleLeft, ToggleRight, Send, Pencil, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

const CONTACTS_URL = "https://functions.poehali.dev/517274c0-56cb-4301-9c48-8e71128a0e25"
const ADMIN_TOKEN = "akkumoff-admin-2026"

interface NotifEmail {
  id: number
  email: string
  label: string | null
  active: boolean
}

export function EmailSettingsTab() {
  const [emails, setEmails] = React.useState<NotifEmail[]>([])
  const [loading, setLoading] = React.useState(true)

  // Форма добавления
  const [newEmail, setNewEmail] = React.useState("")
  const [newLabel, setNewLabel] = React.useState("")
  const [adding, setAdding] = React.useState(false)
  const [addError, setAddError] = React.useState("")

  // Редактирование label
  const [editId, setEditId] = React.useState<number | null>(null)
  const [editLabel, setEditLabel] = React.useState("")

  // Тест-письмо
  const [testEmail, setTestEmail] = React.useState("")
  const [testSending, setTestSending] = React.useState(false)
  const [testResult, setTestResult] = React.useState<{ ok: boolean; msg: string } | null>(null)

  async function fetchEmails() {
    setLoading(true)
    const r = await fetch(`${CONTACTS_URL}?resource=emails`, { headers: { "X-Admin-Token": ADMIN_TOKEN } })
    const d = await r.json()
    setEmails(d.emails || [])
    setLoading(false)
  }

  React.useEffect(() => { fetchEmails() }, [])

  async function addEmail() {
    if (!newEmail.trim()) { setAddError("Введите email"); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) { setAddError("Некорректный email"); return }
    setAdding(true); setAddError("")
    const r = await fetch(`${CONTACTS_URL}?resource=emails`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
      body: JSON.stringify({ email: newEmail.trim(), label: newLabel.trim() }),
    })
    const d = await r.json()
    setAdding(false)
    if (d.error) { setAddError(d.error); return }
    setNewEmail(""); setNewLabel("")
    fetchEmails()
  }

  async function toggleActive(e: NotifEmail) {
    await fetch(`${CONTACTS_URL}?resource=emails&id=${e.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
      body: JSON.stringify({ label: e.label, active: !e.active }),
    })
    fetchEmails()
  }

  async function saveLabel(e: NotifEmail) {
    await fetch(`${CONTACTS_URL}?resource=emails&id=${e.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
      body: JSON.stringify({ label: editLabel.trim() || null, active: e.active }),
    })
    setEditId(null)
    fetchEmails()
  }

  async function deleteEmail(id: number) {
    if (!confirm("Удалить email?")) return
    await fetch(`${CONTACTS_URL}?resource=emails&id=${id}`, {
      method: "DELETE",
      headers: { "X-Admin-Token": ADMIN_TOKEN },
    })
    fetchEmails()
  }

  async function sendTest() {
    if (!testEmail.trim()) return
    setTestSending(true); setTestResult(null)
    const r = await fetch(`${CONTACTS_URL}?resource=test-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
      body: JSON.stringify({ email: testEmail.trim() }),
    })
    const d = await r.json()
    setTestSending(false)
    setTestResult(d.ok ? { ok: true, msg: "Письмо отправлено!" } : { ok: false, msg: d.error || "Ошибка отправки" })
  }

  return (
    <div className="space-y-8 max-w-2xl">

      {/* Список получателей */}
      <div>
        <h3 className="font-semibold text-base mb-4">Email-адреса для уведомлений</h3>
        <p className="text-sm text-muted-foreground mb-4">
          На эти адреса будет отправляться письмо каждый раз, когда клиент оставит заявку на сайте.
        </p>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : emails.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-orange-200 rounded-xl text-muted-foreground text-sm">
            Нет ни одного email-адреса. Добавьте ниже.
          </div>
        ) : (
          <div className="space-y-2">
            {emails.map(e => (
              <div key={e.id} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors",
                e.active ? "border-orange-100 bg-card" : "border-input bg-muted/30 opacity-60"
              )}>
                <Mail className="size-4 text-orange-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {editId === e.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editLabel}
                        onChange={ev => setEditLabel(ev.target.value)}
                        placeholder="Название (необязательно)"
                        className="text-sm px-2 py-1 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-orange-400 w-40"
                        autoFocus
                        onKeyDown={ev => ev.key === "Enter" && saveLabel(e)}
                      />
                      <button onClick={() => saveLabel(e)} className="text-green-600 hover:text-green-700"><Check className="size-4" /></button>
                      <button onClick={() => setEditId(null)} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{e.email}</span>
                      {e.label && <span className="text-xs text-muted-foreground">({e.label})</span>}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {editId !== e.id && (
                    <button
                      onClick={() => { setEditId(e.id); setEditLabel(e.label || "") }}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-orange-500 hover:bg-orange-50 transition-colors"
                      title="Изменить название"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleActive(e)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-orange-500 transition-colors"
                    title={e.active ? "Отключить" : "Включить"}
                  >
                    {e.active
                      ? <ToggleRight className="size-5 text-orange-500" />
                      : <ToggleLeft className="size-5" />
                    }
                  </button>
                  <button
                    onClick={() => deleteEmail(e.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Форма добавления */}
        <div className="mt-4 p-4 rounded-xl border border-dashed border-orange-200 bg-orange-50/30">
          <p className="text-xs font-medium text-muted-foreground mb-3">Добавить адрес</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addEmail()}
              placeholder="email@example.com"
              className="flex-1 px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addEmail()}
              placeholder="Название (необяз.)"
              className="w-40 px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={addEmail}
              disabled={adding}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              <Plus className="size-4" />
              Добавить
            </button>
          </div>
          {addError && <p className="text-xs text-red-500 mt-2">{addError}</p>}
        </div>
      </div>

      {/* Тест SMTP */}
      <div className="border-t border-orange-100 pt-6">
        <h3 className="font-semibold text-base mb-2">Тест отправки</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Проверьте, что SMTP настроен корректно — отправьте тестовое письмо на любой адрес.
          Для работы заполните секреты: <code className="text-xs bg-muted px-1 py-0.5 rounded">SMTP_HOST</code>,{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">SMTP_PORT</code>,{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">SMTP_USER</code>,{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">SMTP_PASSWORD</code>.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={testEmail}
            onChange={e => setTestEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendTest()}
            placeholder="Куда отправить тест"
            className="flex-1 px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={sendTest}
            disabled={testSending || !testEmail.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            <Send className="size-4" />
            {testSending ? "Отправляю..." : "Отправить тест"}
          </button>
        </div>
        {testResult && (
          <p className={cn("text-sm mt-2 font-medium", testResult.ok ? "text-green-600" : "text-red-500")}>
            {testResult.msg}
          </p>
        )}
      </div>
    </div>
  )
}
