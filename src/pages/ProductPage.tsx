import * as React from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Battery, ArrowLeft, Phone, CheckCircle, Tag, Zap, Package, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { ContactModal } from "@/components/landing/ContactModal"

const CATALOG_URL = "https://functions.poehali.dev/81dc9c88-f410-477c-a4ec-21371f33869b"

const CATEGORY_LABELS: Record<string, string> = {
  battery_lead: "Свинцово-кислотный АКБ",
  battery_lithium: "Литиевый / LFP АКБ",
  charger: "Зарядное устройство",
  equipment: "Складская техника",
}

const CONDITION_LABELS: Record<string, string> = {
  new: "Новый",
  restored: "Восстановленный",
}

const CATEGORY_FEATURES: Record<string, string[]> = {
  battery_lead: [
    "Тяговый тип — для промышленной техники",
    "Совместим с большинством зарядных устройств",
    "Гарантия на восстановленные батареи",
    "Доставка и монтаж включены",
  ],
  battery_lithium: [
    "Срок службы 20–30 лет без замены",
    "5 лет без потери ёмкости",
    "Встроенная BMS-защита",
    "Быстрая зарядка за 2–3 часа",
  ],
  charger: [
    "Автоматический алгоритм зарядки",
    "Защита от переполюсовки и перегрева",
    "Совместим с несколькими типами батарей",
    "Промышленный класс надёжности",
  ],
  equipment: [
    "Полная комплектация с АКБ",
    "Гарантийное обслуживание",
    "Обучение персонала включено",
    "Запасные части в наличии",
  ],
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

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = React.useState<Product | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)
  const [modalOpen, setModalOpen] = React.useState(false)

  React.useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return }
    setLoading(true)
    fetch(CATALOG_URL)
      .then(r => r.json())
      .then(d => {
        const found = (d.products || []).find((p: Product) => p.id === Number(id))
        if (found) setProduct(found)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-orange-100">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ArrowLeft className="size-4" />
              <span className="text-sm hidden sm:inline">Каталог</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 rounded-lg p-1.5">
                <Battery className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">Аккумофф</span>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square rounded-2xl bg-muted animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded-xl animate-pulse w-3/4" />
              <div className="h-5 bg-muted rounded-xl animate-pulse w-1/2" />
              <div className="h-12 bg-muted rounded-xl animate-pulse w-1/3 mt-6" />
              <div className="h-10 bg-muted rounded-xl animate-pulse mt-4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <Battery className="size-16 text-orange-200" />
        <h1 className="text-2xl font-bold">Товар не найден</h1>
        <p className="text-muted-foreground text-sm">Возможно, он был удалён или ссылка устарела</p>
        <Link to="/catalog" className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  const features = CATEGORY_FEATURES[product.category] || []

  return (
    <div className="min-h-screen bg-background">
      {/* Шапка */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-orange-100">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm hidden sm:inline">Назад</span>
          </button>
          <Link to="/catalog" className="flex items-center gap-2 flex-1 sm:flex-none">
            <div className="bg-orange-500 rounded-lg p-1.5">
              <Battery className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">Аккумофф</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Хлебные крошки */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-orange-500 transition-colors">Главная</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-orange-500 transition-colors">Каталог</Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Фото */}
          <div>
            <div className="aspect-square rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 overflow-hidden flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Battery className="size-24 text-orange-300" />
              )}
            </div>

            {/* Бейджи под фото */}
            <div className="flex flex-wrap gap-2 mt-4">
              {!product.in_stock && (
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-medium">
                  Нет в наличии
                </span>
              )}
              {product.in_stock && (
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-medium flex items-center gap-1">
                  <CheckCircle className="size-3" />
                  В наличии
                </span>
              )}
              {product.condition === "restored" && (
                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200 text-xs font-medium">
                  Восстановленный
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                {CATEGORY_LABELS[product.category] || product.category}
              </span>
            </div>
          </div>

          {/* Информация */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold leading-tight mb-2">{product.name}</h1>

            {/* Характеристики */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.voltage && (
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100 text-sm font-medium">
                  <Zap className="size-3.5 text-orange-500" />
                  {product.voltage}В
                </span>
              )}
              {product.capacity && (
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100 text-sm font-medium">
                  <Package className="size-3.5 text-orange-500" />
                  {product.capacity} Ah
                </span>
              )}
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100 text-sm font-medium">
                <Tag className="size-3.5 text-orange-500" />
                {CONDITION_LABELS[product.condition] || product.condition}
              </span>
            </div>

            {/* Описание */}
            {product.description && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {product.description}
              </p>
            )}

            {/* Цена */}
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-1">Цена</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-orange-500">
                  от {formatPrice(product.price_from)}
                </span>
                {product.price_to && (
                  <span className="text-muted-foreground text-base">
                    до {formatPrice(product.price_to)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Точная цена зависит от комплектации. Уточните у менеджера.
              </p>
            </div>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                onClick={() => setModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
              >
                <ShoppingCart className="size-4" />
                Узнать цену и заказать
              </button>
              <a
                href="tel:+74951234567"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-orange-200 hover:border-orange-400 hover:text-orange-500 font-medium transition-colors text-sm"
              >
                <Phone className="size-4" />
                Позвонить
              </a>
            </div>
          </div>
        </div>

        {/* Преимущества категории */}
        {features.length > 0 && (
          <div className="mt-10 border-t border-orange-100 pt-8">
            <h2 className="text-xl font-semibold mb-4">Почему выбирают этот товар</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-orange-100 bg-orange-50/30">
                  <CheckCircle className="size-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Похожие товары — ссылка обратно */}
        <div className="mt-10 border-t border-orange-100 pt-8 text-center">
          <p className="text-muted-foreground text-sm mb-4">Смотрите также другие товары в нашем каталоге</p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-orange-200 hover:border-orange-400 hover:text-orange-500 font-medium transition-colors text-sm"
          >
            <ArrowLeft className="size-4" />
            Весь каталог
          </Link>
        </div>
      </div>

      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Заказать: ${product.name}`}
        source="product_page"
      />
    </div>
  )
}
