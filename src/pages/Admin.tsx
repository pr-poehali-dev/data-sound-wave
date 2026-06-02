import * as React from "react"
import { Link } from "react-router-dom"
import { Battery, Plus, Pencil, Trash2, Upload, X, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

const ADMIN_URL = "https://functions.poehali.dev/8e764a01-a11d-4806-b12e-93015237b823"
const ADMIN_TOKEN = "akkumoff-admin-2026"

const CATEGORIES = [
  { value: "battery_lead", label: "Свинцово-кислотный АКБ" },
  { value: "battery_lithium", label: "Литиевый / LFP АКБ" },
  { value: "charger", label: "Зарядное устройство" },
  { value: "equipment", label: "Складская техника" },
]

const CONDITIONS = [
  { value: "new", label: "Новый" },
  { value: "restored", label: "Восстановленный" },
]

const CATEGORY_LABELS: Record<string, string> = {
  battery_lead: "Свинцово-кислотный",
  battery_lithium: "Литиевый / LFP",
  charger: "Зарядное",
  equipment: "Техника",
}

interface Product {
  id: number
  name: string
  category: string
  subcategory: string | null
  voltage: number | null
  capacity: number | null
  price_from: number
  price_to: number | null
  description: string | null
  condition: string
  image_url: string | null
  in_stock: boolean
}

const emptyForm = {
  name: "",
  category: "battery_lead",
  subcategory: "",
  voltage: "",
  capacity: "",
  price_from: "",
  price_to: "",
  description: "",
  condition: "new",
  image_url: "",
  in_stock: true,
}

function formatPrice(n: number) {
  return n.toLocaleString("ru-RU") + " ₽"
}

export default function Admin() {
  const [authed, setAuthed] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [showPass, setShowPass] = React.useState(false)
  const [authError, setAuthError] = React.useState("")

  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState<number | null>(null)

  const [modalOpen, setModalOpen] = React.useState(false)
  const [editId, setEditId] = React.useState<number | null>(null)
  const [form, setForm] = React.useState({ ...emptyForm })
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string>("")
  const [uploadingImg, setUploadingImg] = React.useState(false)
  const [error, setError] = React.useState("")

  function handleLogin() {
    if (password === ADMIN_TOKEN) {
      setAuthed(true)
      setAuthError("")
      fetchProducts()
    } else {
      setAuthError("Неверный пароль")
    }
  }

  async function fetchProducts() {
    setLoading(true)
    const r = await fetch(ADMIN_URL, { headers: { "X-Admin-Token": ADMIN_TOKEN } })
    const d = await r.json()
    setProducts(d.products || [])
    setLoading(false)
  }

  function openNew() {
    setEditId(null)
    setForm({ ...emptyForm })
    setImageFile(null)
    setImagePreview("")
    setError("")
    setModalOpen(true)
  }

  function openEdit(p: Product) {
    setEditId(p.id)
    setForm({
      name: p.name,
      category: p.category,
      subcategory: p.subcategory || "",
      voltage: p.voltage != null ? String(p.voltage) : "",
      capacity: p.capacity != null ? String(p.capacity) : "",
      price_from: String(p.price_from),
      price_to: p.price_to != null ? String(p.price_to) : "",
      description: p.description || "",
      condition: p.condition,
      image_url: p.image_url || "",
      in_stock: p.in_stock,
    })
    setImageFile(null)
    setImagePreview(p.image_url || "")
    setError("")
    setModalOpen(true)
  }

  async function uploadImage(file: File): Promise<string> {
    setUploadingImg(true)
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(",")[1]
        const r = await fetch(`${ADMIN_URL}/upload-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
          body: JSON.stringify({ image: base64, filename: file.name, content_type: file.type }),
        })
        const d = await r.json()
        setUploadingImg(false)
        if (d.url) resolve(d.url)
        else reject(new Error(d.error || "Ошибка загрузки"))
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleSave() {
    if (!form.name || !form.price_from) { setError("Заполните название и цену"); return }
    setSaving(true)
    setError("")
    try {
      let imageUrl = form.image_url
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const payload = {
        ...form,
        voltage: form.voltage ? parseInt(form.voltage) : null,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        price_from: parseInt(form.price_from),
        price_to: form.price_to ? parseInt(form.price_to) : null,
        subcategory: form.subcategory || null,
        image_url: imageUrl || null,
      }

      const url = editId ? `${ADMIN_URL}/${editId}` : ADMIN_URL
      const method = editId ? "PUT" : "POST"
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
        body: JSON.stringify(payload),
      })
      const d = await r.json()
      if (d.error) { setError(d.error); return }
      setModalOpen(false)
      fetchProducts()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить товар?")) return
    setDeleting(id)
    await fetch(`${ADMIN_URL}/${id}`, {
      method: "DELETE",
      headers: { "X-Admin-Token": ADMIN_TOKEN },
    })
    setDeleting(null)
    fetchProducts()
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  // Экран входа
  if (!authed) {
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
              onClick={handleLogin}
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            >
              Войти
            </button>
            <Link to="/" className="mt-4 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-orange-500 transition-colors">
              <ArrowLeft className="size-3" />
              На главную
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Шапка */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-orange-100">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-orange-500 transition-colors">
              <ArrowLeft className="size-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 rounded-lg p-1.5">
                <Battery className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Аккумофф</span>
              <span className="text-muted-foreground text-sm">/ Админка</span>
            </div>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
          >
            <Plus className="size-4" />
            Добавить товар
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Товары каталога</h1>
          <span className="text-sm text-muted-foreground">{products.length} товаров</span>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Товаров пока нет</p>
            <button onClick={openNew} className="px-6 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors">
              Добавить первый товар
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-orange-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Фото</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Название</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Категория</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Цена</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Наличие</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg bg-orange-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Battery className="size-5 text-orange-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium max-w-[200px]">
                      <div className="truncate">{p.name}</div>
                      {p.voltage && <div className="text-xs text-muted-foreground">{p.voltage}В{p.capacity ? ` / ${p.capacity}Ah` : ""}</div>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-100">
                        {CATEGORY_LABELS[p.category] || p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-orange-500 font-bold">
                      от {formatPrice(p.price_from)}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        p.in_stock ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                      )}>
                        {p.in_stock ? "В наличии" : "Нет"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-lg hover:bg-orange-50 text-muted-foreground hover:text-orange-500 transition-colors"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модалка добавления/редактирования */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="bg-background rounded-2xl border border-orange-100 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background px-6 py-4 border-b border-orange-100 flex items-center justify-between">
              <h2 className="font-bold text-lg">{editId ? "Редактировать товар" : "Новый товар"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Фото */}
              <div>
                <label className="text-sm font-medium mb-2 block">Фото товара</label>
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 rounded-xl bg-orange-50 border-2 border-dashed border-orange-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <Battery className="size-8 text-orange-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-orange-200 text-sm cursor-pointer hover:bg-orange-50 transition-colors w-fit">
                      <Upload className="size-4 text-orange-500" />
                      <span>{uploadingImg ? "Загружаю..." : "Загрузить фото"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG, WebP до 5 МБ</p>
                    {imagePreview && (
                      <button
                        onClick={() => { setImageFile(null); setImagePreview(""); setForm(f => ({ ...f, image_url: "" })) }}
                        className="text-xs text-red-500 hover:underline mt-1"
                      >
                        Удалить фото
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Название */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Название *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Например: АКБ 24В 210Ah свинцово-кислотный"
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Категория и состояние */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Категория *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Состояние</label>
                  <select
                    value={form.condition}
                    onChange={(e) => setForm(f => ({ ...f, condition: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Напряжение и ёмкость */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Напряжение, В</label>
                  <input
                    type="number"
                    value={form.voltage}
                    onChange={(e) => setForm(f => ({ ...f, voltage: e.target.value }))}
                    placeholder="24, 48, 80..."
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Ёмкость, Ah</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm(f => ({ ...f, capacity: e.target.value }))}
                    placeholder="200, 400..."
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Цена */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Цена от, ₽ *</label>
                  <input
                    type="number"
                    value={form.price_from}
                    onChange={(e) => setForm(f => ({ ...f, price_from: e.target.value }))}
                    placeholder="28000"
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Цена до, ₽</label>
                  <input
                    type="number"
                    value={form.price_to}
                    onChange={(e) => setForm(f => ({ ...f, price_to: e.target.value }))}
                    placeholder="35000"
                    className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Описание */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Описание</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Краткое описание товара..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>

              {/* В наличии */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.in_stock}
                  onChange={(e) => setForm(f => ({ ...f, in_stock: e.target.checked }))}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm font-medium">Товар в наличии</span>
              </label>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div className="sticky bottom-0 bg-background px-6 py-4 border-t border-orange-100 flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-input text-sm font-medium hover:bg-muted transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploadingImg}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
              >
                {saving ? "Сохраняю..." : editId ? "Сохранить" : "Добавить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}