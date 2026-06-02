import * as React from "react"
import { Battery, Upload, X } from "lucide-react"
import { CATEGORIES, CONDITIONS } from "./types"

type FormState = {
  name: string
  category: string
  subcategory: string
  voltage: string
  capacity: string
  price_from: string
  price_to: string
  description: string
  condition: string
  image_url: string
  in_stock: boolean
}

interface ProductModalProps {
  editId: number | null
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  imagePreview: string
  uploadingImg: boolean
  saving: boolean
  error: string
  onClose: () => void
  onSave: () => void
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
}

export function ProductModal({
  editId,
  form,
  setForm,
  imagePreview,
  uploadingImg,
  saving,
  error,
  onClose,
  onSave,
  onImageChange,
  onRemoveImage,
}: ProductModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-background rounded-2xl border border-orange-100 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="sticky top-0 bg-background px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <h2 className="font-bold text-lg">{editId ? "Редактировать товар" : "Новый товар"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
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
                  <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                </label>
                <p className="text-xs text-muted-foreground mt-2">JPG, PNG, WebP до 5 МБ</p>
                {imagePreview && (
                  <button
                    onClick={onRemoveImage}
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
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Состояние</label>
              <select
                value={form.condition}
                onChange={(e) => setForm(f => ({ ...f, condition: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
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

        {/* Кнопки */}
        <div className="sticky bottom-0 bg-background px-6 py-4 border-t border-orange-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-input text-sm font-medium hover:bg-muted transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onSave}
            disabled={saving || uploadingImg}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            {saving ? "Сохраняю..." : editId ? "Сохранить" : "Добавить"}
          </button>
        </div>
      </div>
    </div>
  )
}
