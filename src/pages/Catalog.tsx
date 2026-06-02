import * as React from "react"
import { Link } from "react-router-dom"
import { Battery, X, SlidersHorizontal, Search, ArrowLeft, ArrowRight } from "lucide-react"
import Icon from "@/components/ui/icon"
import { cn } from "@/lib/utils"

const CATALOG_URL = "https://functions.poehali.dev/81dc9c88-f410-477c-a4ec-21371f33869b"

const CATEGORIES = [
  { value: "", label: "Все категории" },
  { value: "battery_lead", label: "Свинцово-кислотные АКБ" },
  { value: "battery_lithium", label: "Литиевые / LFP АКБ" },
  { value: "charger", label: "Зарядные устройства" },
  { value: "equipment", label: "Складская техника" },
]

const VOLTAGES = [
  { value: "", label: "Любое напряжение" },
  { value: "24", label: "24В" },
  { value: "48", label: "48В" },
  { value: "80", label: "80В" },
]

const CONDITIONS = [
  { value: "", label: "Любое состояние" },
  { value: "new", label: "Новый" },
  { value: "restored", label: "Восстановленный" },
]

const CATEGORY_LABELS: Record<string, string> = {
  battery_lead: "Свинцово-кислотный",
  battery_lithium: "Литиевый / LFP",
  charger: "Зарядное устройство",
  equipment: "Складская техника",
}

const CONDITION_LABELS: Record<string, string> = {
  new: "Новый",
  restored: "Восстановленный",
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

function formatPrice(n: number) {
  return n.toLocaleString("ru-RU") + " ₽"
}

export default function Catalog() {
  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [voltage, setVoltage] = React.useState("")
  const [condition, setCondition] = React.useState("")
  const [inStock, setInStock] = React.useState(false)
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [debouncedSearch, setDebouncedSearch] = React.useState("")

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  React.useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (voltage) params.set("voltage", voltage)
    if (condition) params.set("condition", condition)
    if (inStock) params.set("in_stock", "true")
    if (debouncedSearch) params.set("search", debouncedSearch)

    fetch(`${CATALOG_URL}?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category, voltage, condition, inStock, debouncedSearch])

  const hasFilters = category || voltage || condition || inStock || debouncedSearch

  function resetFilters() {
    setCategory("")
    setVoltage("")
    setCondition("")
    setInStock(false)
    setSearch("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Шапка */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-orange-100">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-orange-500 transition-colors">
            <ArrowLeft className="size-4" />
            <span className="text-sm hidden sm:inline">На главную</span>
          </Link>
          <div className="flex items-center gap-2 flex-1 justify-center sm:justify-start">
            <div className="bg-orange-500 rounded-lg p-1.5">
              <Battery className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">Аккумофф</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Каталог товаров</h1>
          <p className="text-muted-foreground text-sm">Аккумуляторы, зарядные устройства и складская техника</p>
        </div>

        {/* Поиск + кнопка фильтров */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors",
              filtersOpen || hasFilters
                ? "bg-orange-500 text-white border-orange-500"
                : "border-input bg-background hover:border-orange-300"
            )}
          >
            <SlidersHorizontal className="size-4" />
            <span>Фильтры</span>
            {hasFilters && <span className="bg-white text-orange-500 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">!</span>}
          </button>
        </div>

        {/* Панель фильтров */}
        {filtersOpen && (
          <div className="bg-muted/50 rounded-2xl border border-orange-100 p-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Категория</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Напряжение</label>
                <select
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {VOLTAGES.map((v) => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Состояние</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col justify-between">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Наличие</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm">Только в наличии</span>
                </label>
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="mt-4 text-sm text-orange-500 hover:underline flex items-center gap-1"
              >
                <X className="size-3" />
                Сбросить все фильтры
              </button>
            )}
          </div>
        )}

        {/* Счётчик результатов */}
        {!loading && (
          <p className="text-sm text-muted-foreground mb-4">
            {products.length === 0 ? "Ничего не найдено" : `Найдено: ${products.length} товаров`}
          </p>
        )}

        {/* Карточки товаров */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-orange-100 bg-card overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-5 bg-muted rounded w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="PackageSearch" size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground">По вашему запросу ничего не найдено</p>
            {hasFilters && (
              <button onClick={resetFilters} className="mt-3 text-orange-500 hover:underline text-sm">
                Сбросить фильтры
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/catalog/${p.id}`}
                className="rounded-2xl border border-orange-100 hover:border-orange-300 bg-card overflow-hidden transition-all hover:shadow-lg hover:shadow-orange-500/10 group flex flex-col"
              >
                {/* Фото */}
                <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 overflow-hidden relative">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Battery className="size-12 text-orange-300" />
                    </div>
                  )}
                  {/* Бейджи */}
                  <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                    {!p.in_stock && (
                      <span className="bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">Нет в наличии</span>
                    )}
                    {p.condition === "restored" && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Восстановленный</span>
                    )}
                  </div>
                </div>

                {/* Инфо */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="text-xs bg-orange-50 dark:bg-orange-950 text-orange-600 px-2 py-0.5 rounded-full border border-orange-100">
                      {CATEGORY_LABELS[p.category] || p.category}
                    </span>
                    {p.voltage && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{p.voltage}В</span>
                    )}
                    {p.capacity && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{p.capacity}Ah</span>
                    )}
                  </div>

                  <h3 className="font-semibold text-sm leading-snug mb-1 line-clamp-2">{p.name}</h3>
                  {p.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-orange-500 font-bold text-base">от {formatPrice(p.price_from)}</span>
                      {p.price_to && (
                        <span className="text-xs text-muted-foreground ml-1">до {formatPrice(p.price_to)}</span>
                      )}
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="mt-3 w-full py-2 rounded-xl bg-orange-500 text-white text-sm font-medium text-center group-hover:bg-orange-600 transition-colors">
                    Подробнее
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}