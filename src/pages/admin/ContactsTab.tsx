import * as React from "react"
import { Trash2, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const CONTACTS_URL = "https://functions.poehali.dev/517274c0-56cb-4301-9c48-8e71128a0e25"
const ADMIN_TOKEN = "akkumoff-admin-2026"

interface Contact {
  id: number
  name: string
  phone: string
  message: string | null
  source: string
  status: string
  created_at: string
}

const STATUS_OPTIONS = [
  { value: "new", label: "Новая", color: "bg-blue-50 text-blue-700 border-blue-100" },
  { value: "in_progress", label: "В работе", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  { value: "closed", label: "Закрыта", color: "bg-green-50 text-green-700 border-green-100" },
]

const SOURCE_LABELS: Record<string, string> = {
  website: "Сайт",
  cta: "CTA-блок",
  hero: "Главный баннер",
  navbar: "Навбар",
  services: "Услуги",
  catalog_card: "Каталог",
}

function statusInfo(value: string) {
  return STATUS_OPTIONS.find(s => s.value === value) || STATUS_OPTIONS[0]
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
  } catch { return iso }
}

export function ContactsTab() {
  const [contacts, setContacts] = React.useState<Contact[]>([])
  const [loading, setLoading] = React.useState(true)
  const [openId, setOpenId] = React.useState<number | null>(null)
  const [updatingId, setUpdatingId] = React.useState<number | null>(null)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)
  const [filter, setFilter] = React.useState("all")

  async function fetchContacts() {
    setLoading(true)
    const r = await fetch(`${CONTACTS_URL}?resource=contacts`, { headers: { "X-Admin-Token": ADMIN_TOKEN } })
    const d = await r.json()
    setContacts(d.contacts || [])
    setLoading(false)
  }

  React.useEffect(() => { fetchContacts() }, [])

  async function changeStatus(id: number, status: string) {
    setUpdatingId(id)
    await fetch(`${CONTACTS_URL}?resource=contacts&action=status&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
      body: JSON.stringify({ status }),
    })
    setUpdatingId(null)
    fetchContacts()
  }

  async function deleteContact(id: number) {
    if (!confirm("Удалить заявку?")) return
    setDeletingId(id)
    await fetch(`${CONTACTS_URL}?resource=contacts&id=${id}`, {
      method: "DELETE",
      headers: { "X-Admin-Token": ADMIN_TOKEN },
    })
    setDeletingId(null)
    fetchContacts()
  }

  const filtered = filter === "all" ? contacts : contacts.filter(c => c.status === filter)

  const counts = {
    all: contacts.length,
    new: contacts.filter(c => c.status === "new").length,
    in_progress: contacts.filter(c => c.status === "in_progress").length,
    closed: contacts.filter(c => c.status === "closed").length,
  }

  return (
    <div>
      {/* Фильтры */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all", label: "Все" },
          { key: "new", label: "Новые" },
          { key: "in_progress", label: "В работе" },
          { key: "closed", label: "Закрытые" },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
              filter === f.key
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-background border-input hover:border-orange-300 text-muted-foreground"
            )}
          >
            {f.label}
            <span className={cn(
              "ml-1.5 text-xs rounded-full px-1.5 py-0.5",
              filter === f.key ? "bg-white/20" : "bg-muted"
            )}>
              {counts[f.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          {filter === "all" ? "Заявок пока нет" : "Заявок с таким статусом нет"}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(c => {
            const st = statusInfo(c.status)
            const isOpen = openId === c.id
            return (
              <div key={c.id} className="rounded-xl border border-orange-100 hover:border-orange-200 transition-colors bg-card overflow-hidden">
                {/* Строка */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                  onClick={() => setOpenId(isOpen ? null : c.id)}
                >
                  {/* Статус-бейдж */}
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium border flex-shrink-0", st.color)}>
                    {st.label}
                  </span>

                  {/* Имя и телефон */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{c.name}</span>
                      <span className="text-orange-500 text-sm font-mono">{c.phone}</span>
                    </div>
                    {c.message && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{c.message}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:inline">{formatDate(c.created_at)}</span>
                    <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                  </div>
                </div>

                {/* Раскрытая панель */}
                {isOpen && (
                  <div className="border-t border-orange-50 px-4 py-3 bg-muted/30 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Источник</p>
                        <p className="font-medium">{SOURCE_LABELS[c.source] || c.source}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Дата</p>
                        <p className="font-medium">{formatDate(c.created_at)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-0.5">Сообщение</p>
                        <p className="font-medium">{c.message || "—"}</p>
                      </div>
                    </div>

                    {/* Действия */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs text-muted-foreground">Статус:</span>
                      {STATUS_OPTIONS.map(s => (
                        <button
                          key={s.value}
                          disabled={c.status === s.value || updatingId === c.id}
                          onClick={() => changeStatus(c.id, s.value)}
                          className={cn(
                            "text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors disabled:opacity-50",
                            c.status === s.value
                              ? s.color + " cursor-default"
                              : "bg-background border-input hover:border-orange-300"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                      <button
                        onClick={() => deleteContact(c.id)}
                        disabled={deletingId === c.id}
                        className="ml-auto p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
