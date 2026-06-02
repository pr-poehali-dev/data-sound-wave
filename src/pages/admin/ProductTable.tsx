import * as React from "react"
import { Link } from "react-router-dom"
import { Battery, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Product, CATEGORY_LABELS, formatPrice } from "./types"

interface ProductTableProps {
  products: Product[]
  loading: boolean
  deleting: number | null
  onOpenNew: () => void
  onOpenEdit: (p: Product) => void
  onDelete: (id: number) => void
}

export function ProductTable({
  products,
  loading,
  deleting,
  onOpenNew,
  onOpenEdit,
  onDelete,
}: ProductTableProps) {
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
            onClick={onOpenNew}
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
            <button
              onClick={onOpenNew}
              className="px-6 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
            >
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
                      {p.voltage && (
                        <div className="text-xs text-muted-foreground">
                          {p.voltage}В{p.capacity ? ` / ${p.capacity}Ah` : ""}
                        </div>
                      )}
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
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          p.in_stock
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-red-50 text-red-600 border border-red-100",
                        )}
                      >
                        {p.in_stock ? "В наличии" : "Нет"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => onOpenEdit(p)}
                          className="p-2 rounded-lg hover:bg-orange-50 text-muted-foreground hover:text-orange-500 transition-colors"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => onDelete(p.id)}
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
    </div>
  )
}
