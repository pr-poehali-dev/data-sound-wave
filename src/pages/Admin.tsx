import * as React from "react"
import { Link } from "react-router-dom"
import { Battery, ArrowLeft, Plus } from "lucide-react"
import { LoginScreen } from "./admin/LoginScreen"
import { ProductTable } from "./admin/ProductTable"
import { ProductModal } from "./admin/ProductModal"
import { ContactsTab } from "./admin/ContactsTab"
import { EmailSettingsTab } from "./admin/EmailSettingsTab"
import { ADMIN_URL, ADMIN_TOKEN, Product, emptyForm } from "./admin/types"
import { cn } from "@/lib/utils"

type Tab = "products" | "contacts" | "email"

const TABS: { key: Tab; label: string }[] = [
  { key: "contacts", label: "Заявки" },
  { key: "products", label: "Товары" },
  { key: "email", label: "Email-уведомления" },
]

export default function Admin() {
  const [authed, setAuthed] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [showPass, setShowPass] = React.useState(false)
  const [authError, setAuthError] = React.useState("")
  const [tab, setTab] = React.useState<Tab>("contacts")

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
        const r = await fetch(`${ADMIN_URL}?action=upload-image`, {
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
      const url = editId ? `${ADMIN_URL}?id=${editId}` : ADMIN_URL
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
    await fetch(`${ADMIN_URL}?id=${id}`, {
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
    setImagePreview(URL.createObjectURL(file))
  }

  function handleRemoveImage() {
    setImageFile(null)
    setImagePreview("")
    setForm(f => ({ ...f, image_url: "" }))
  }

  if (!authed) {
    return (
      <LoginScreen
        password={password}
        setPassword={setPassword}
        showPass={showPass}
        setShowPass={setShowPass}
        authError={authError}
        onLogin={handleLogin}
      />
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
          {tab === "products" && (
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
            >
              <Plus className="size-4" />
              Добавить товар
            </button>
          )}
        </div>

        {/* Вкладки */}
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-0 border-b border-orange-50 -mb-px">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); if (t.key === "products") fetchProducts() }}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  tab === t.key
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Контент */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {tab === "contacts" && <ContactsTab />}

        {tab === "products" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Товары каталога</h1>
              <span className="text-sm text-muted-foreground">{products.length} товаров</span>
            </div>
            <ProductTable
              products={products}
              loading={loading}
              deleting={deleting}
              onOpenNew={openNew}
              onOpenEdit={openEdit}
              onDelete={handleDelete}
              embedded
            />
          </>
        )}

        {tab === "email" && <EmailSettingsTab />}
      </div>

      {modalOpen && (
        <ProductModal
          editId={editId}
          form={form}
          setForm={setForm}
          imagePreview={imagePreview}
          uploadingImg={uploadingImg}
          saving={saving}
          error={error}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
        />
      )}
    </div>
  )
}