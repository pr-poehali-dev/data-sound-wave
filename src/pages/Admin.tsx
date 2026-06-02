import * as React from "react"
import { LoginScreen } from "./admin/LoginScreen"
import { ProductTable } from "./admin/ProductTable"
import { ProductModal } from "./admin/ProductModal"
import { ADMIN_URL, ADMIN_TOKEN, Product, emptyForm } from "./admin/types"

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
    <>
      <ProductTable
        products={products}
        loading={loading}
        deleting={deleting}
        onOpenNew={openNew}
        onOpenEdit={openEdit}
        onDelete={handleDelete}
      />
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
    </>
  )
}
