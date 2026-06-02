export const ADMIN_URL = "https://functions.poehali.dev/8e764a01-a11d-4806-b12e-93015237b823"
export const ADMIN_TOKEN = "akkumoff-admin-2026"

export const CATEGORIES = [
  { value: "battery_lead", label: "Свинцово-кислотный АКБ" },
  { value: "battery_lithium", label: "Литиевый / LFP АКБ" },
  { value: "charger", label: "Зарядное устройство" },
  { value: "equipment", label: "Складская техника" },
]

export const CONDITIONS = [
  { value: "new", label: "Новый" },
  { value: "restored", label: "Восстановленный" },
]

export const CATEGORY_LABELS: Record<string, string> = {
  battery_lead: "Свинцово-кислотный",
  battery_lithium: "Литиевый / LFP",
  charger: "Зарядное",
  equipment: "Техника",
}

export interface Product {
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

export const emptyForm = {
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

export function formatPrice(n: number) {
  return n.toLocaleString("ru-RU") + " ₽"
}
