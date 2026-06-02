import * as React from "react"
import { Battery, Zap, RefreshCw, Recycle } from "lucide-react"
import { Link } from "react-router-dom"
import { Button, Card, CardHeader, CardContent, CardDecorator } from "./shared"

// ─── FeaturesSection (Преимущества) ─────────────────────────────────────────

export const FeaturesSection = () => (
  <section id="about" className="bg-muted/50 py-16 md:py-32 dark:bg-transparent">
    <div className="mx-auto max-w-5xl px-6">
      <div className="text-center">
        <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
          Почему выбирают <span className="text-orange-500">Аккумофф</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          16 лет работаем с промышленными аккумуляторами — знаем каждый нюанс восстановления и эксплуатации.
        </p>
      </div>
      <Card className="mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 border-orange-200 *:text-center md:mt-16 md:max-w-full md:grid-cols-3 md:divide-x md:divide-y-0">
        <div className="group shadow-zinc-950/5">
          <CardHeader className="pb-3">
            <CardDecorator>
              <Zap className="size-6 text-orange-500" aria-hidden />
            </CardDecorator>
            <h3 className="mt-6 font-medium">Ионно-резонансное восстановление</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Мощная технология восстановления свинцовых аккумуляторов с остаточной ёмкостью до 85%. Батарея снова работает как новая.
            </p>
          </CardContent>
        </div>

        <div className="group shadow-zinc-950/5">
          <CardHeader className="pb-3">
            <CardDecorator>
              <Battery className="size-6 text-orange-500" aria-hidden />
            </CardDecorator>
            <h3 className="mt-6 font-medium">Литий на 20–30 лет</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Поставляем литиевые АКБ мирового качества: 5 лет без потери ёмкости, срок службы — 20–30 лет при гарантии качества.
            </p>
          </CardContent>
        </div>

        <div className="group shadow-zinc-950/5">
          <CardHeader className="pb-3">
            <CardDecorator>
              <RefreshCw className="size-6 text-orange-500" aria-hidden />
            </CardDecorator>
            <h3 className="mt-6 font-medium">Обратный выкуп и Trade-in</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Выкупаем батареи в течение гарантийного срока и принимаем старые по Trade-in — выгоднее аренды в несколько раз.
            </p>
          </CardContent>
        </div>
      </Card>
    </div>
  </section>
)

// ─── CatalogSection ──────────────────────────────────────────────────────────

export const CatalogSection = () => (
  <section id="catalog" className="py-16 md:py-32">
    <div className="mx-auto max-w-6xl px-6">
      <div className="text-center mb-12">
        <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
          Каталог <span className="text-orange-500">товаров</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Широкий ассортимент для любой складской техники. Средние рыночные цены.
        </p>
      </div>

      {/* Свинцово-кислотные */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-orange-500 rounded-full inline-block"></span>
          Свинцово-кислотные тяговые аккумуляторы
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "АКБ 24В 210Ah (тяговый)", desc: "Для электропогрузчиков до 1.5т, стандартные габариты", price: "от 28 000 ₽" },
            { name: "АКБ 48В 400Ah (тяговый)", desc: "Для погрузчиков 2–3т и ричтраков, усиленный корпус", price: "от 65 000 ₽" },
            { name: "АКБ 80В 500Ah (тяговый)", desc: "Для тяжёлых погрузчиков и тягачей от 3т", price: "от 95 000 ₽" },
            { name: "Восстановленный АКБ 24В", desc: "Ёмкость до 85% после ионно-резонансного восстановления", price: "от 12 000 ₽" },
            { name: "Восстановленный АКБ 48В", desc: "Ёмкость до 85%, гарантия на восстановление", price: "от 28 000 ₽" },
            { name: "Скупка АКБ б/у", desc: "Принимаем отработанные свинцовые аккумуляторы", price: "до 5 000 ₽" },
          ].map((item, i) => (
            <Card key={i} className="border-orange-100 hover:border-orange-300 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm leading-snug">{item.name}</h4>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-bold">{item.price}</span>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                    Заказать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Литиевые */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-orange-500 rounded-full inline-block"></span>
          Литиевые / LFP аккумуляторы
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "LFP 24В 200Ah Li-Ion", desc: "Литий железо фосфат, срок службы 20–30 лет, BMS в комплекте", price: "от 85 000 ₽" },
            { name: "LFP 48В 300Ah Li-Ion", desc: "Для погрузчиков 2–3т, быстрая зарядка за 2 часа", price: "от 145 000 ₽" },
            { name: "LFP 80В 400Ah Li-Ion", desc: "Тяжёлая серия для крупной складской техники", price: "от 220 000 ₽" },
          ].map((item, i) => (
            <Card key={i} className="border-orange-100 hover:border-orange-300 transition-colors">
              <CardHeader className="pb-2">
                <h4 className="font-medium text-sm leading-snug">{item.name}</h4>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-bold">{item.price}</span>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                    Заказать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Зарядные устройства */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-orange-500 rounded-full inline-block"></span>
          Зарядные устройства
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Зарядник 24В 30А (свинец)", desc: "Автоматическое зарядное для свинцовых АКБ, таймер", price: "от 12 000 ₽" },
            { name: "Зарядник 48В 50А (свинец)", desc: "Промышленное зарядное, защита от переполюсовки", price: "от 22 000 ₽" },
            { name: "Зарядник 48В 30А (литий)", desc: "Совместим с LFP и Li-Ion, CC/CV алгоритм", price: "от 18 000 ₽" },
            { name: "Зарядник 80В 60А (свинец)", desc: "Для тяжёлых аккумуляторов, кабель в комплекте", price: "от 35 000 ₽" },
            { name: "Скупка зарядников б/у", desc: "Принимаем рабочие и неисправные зарядные устройства", price: "до 8 000 ₽" },
          ].map((item, i) => (
            <Card key={i} className="border-orange-100 hover:border-orange-300 transition-colors">
              <CardHeader className="pb-2">
                <h4 className="font-medium text-sm leading-snug">{item.name}</h4>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-bold">{item.price}</span>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                    Заказать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Складская техника */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-orange-500 rounded-full inline-block"></span>
          Складская техника
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Электропогрузчик 1.5т", desc: "Тяговый аккумулятор 24В в комплекте, пробег до 8 часов", price: "от 480 000 ₽" },
            { name: "Электрический штабелёр 1т", desc: "Подъём до 3.5м, АКБ 24В, компактные размеры", price: "от 180 000 ₽" },
            { name: "ЭПТ-тележка 2т", desc: "Электрическая подъёмная тележка, горизонтальный транспорт", price: "от 95 000 ₽" },
          ].map((item, i) => (
            <Card key={i} className="border-orange-100 hover:border-orange-300 transition-colors">
              <CardHeader className="pb-2">
                <h4 className="font-medium text-sm leading-snug">{item.name}</h4>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-bold">{item.price}</span>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                    Заказать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <Link to="/catalog">
          <Button size="lg" className="rounded-xl px-8 bg-orange-500 hover:bg-orange-600 text-white">
            Смотреть весь каталог
          </Button>
        </Link>
      </div>
    </div>
  </section>
)

// ─── ServicesSection ─────────────────────────────────────────────────────────

export const ServicesSection = () => (
  <section id="services" className="bg-muted/50 py-16 md:py-32 dark:bg-transparent">
    <div className="mx-auto max-w-6xl px-6">
      <div className="text-center mb-12">
        <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
          Наши <span className="text-orange-500">услуги</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Полный цикл работы с аккумуляторами — от диагностики до утилизации.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: <Zap className="size-8 text-orange-500" />,
            title: "Ремонт и восстановление АКБ",
            desc: "Диагностика, десульфатация, ионно-резонансное восстановление свинцово-кислотных аккумуляторов. Остаточная ёмкость до 85%.",
            price: "от 3 500 ₽",
          },
          {
            icon: <Battery className="size-8 text-orange-500" />,
            title: "Обратный выкуп батарей",
            desc: "Программа выкупа накопителей в течение гарантийного срока. Выгоднее аренды такой же батареи в несколько раз.",
            price: "по договору",
          },
          {
            icon: <Recycle className="size-8 text-orange-500" />,
            title: "Trade-in старых аккумуляторов",
            desc: "Сдайте старый аккумулятор и получите скидку на новый. Экологичная утилизация с заботой об окружающей среде.",
            price: "скидка до 20%",
          },
          {
            icon: <RefreshCw className="size-8 text-orange-500" />,
            title: "Диагностика и техобслуживание",
            desc: "Проверим состояние аккумулятора, дадим рекомендации по эксплуатации и продлим срок службы вашей батареи.",
            price: "от 1 500 ₽",
          },
        ].map((service, i) => (
          <Card key={i} className="border-orange-100 hover:border-orange-300 transition-colors">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-3 flex-shrink-0">
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <span className="text-orange-500 font-bold text-sm">{service.price}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{service.desc}</p>
              <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white" size="sm">
                Узнать подробнее
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
)

// ─── AboutSection ─────────────────────────────────────────────────────────────

export const AboutSection = () => (
  <section className="py-16 md:py-32">
    <div className="mx-auto max-w-5xl px-6">
      <div className="text-center mb-12">
        <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
          О <span className="text-orange-500">компании</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: "16 лет восстановления АКБ",
            text: "Наша компания занимается восстановлением свинцовых аккумуляторов уже 16 лет. Благодаря мощной ионно-резонансной технологии наши восстановленные батареи имеют большую остаточную ёмкость — до 85%.",
          },
          {
            title: "Литиевые АКБ мирового уровня",
            text: "Мы поставляем литиевые аккумуляторы с гарантией качества мирового уровня. Батарея работает как новая 5 лет без потери ёмкости, а прослужит ещё 20–30 лет.",
          },
          {
            title: "Программа обратного выкупа",
            text: "Мы нацелены на долгосрочное сотрудничество и предлагаем программу выкупа накопителей в течение гарантийного срока — это обеспечивает выгоду приобретения батареи в несколько раз по сравнению с арендой.",
          },
          {
            title: "Trade-in — экология и выгода",
            text: "Наша программа Trade-in поможет вам утилизировать старые аккумуляторы, заботясь об окружающей среде и переходя на современные, более экологичные технологии.",
          },
        ].map((item, i) => (
          <div key={i} className="border border-orange-100 rounded-xl p-6 hover:border-orange-300 transition-colors">
            <h3 className="font-semibold text-lg mb-3 text-orange-500">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── CtaSection ───────────────────────────────────────────────────────────────

export const CtaSection = () => (
  <section id="contact" className="bg-muted/50 py-16 md:py-24 dark:bg-transparent">
    <div className="mx-auto max-w-3xl px-6 text-center">
      <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-4">
        Нужна помощь с выбором <span className="text-orange-500">аккумулятора?</span>
      </h2>
      <p className="text-muted-foreground mb-8">
        Расскажите о вашей технике — подберём подходящий вариант, рассчитаем стоимость и доставим в удобное время.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <div className="bg-orange-500/10 rounded-[14px] border border-orange-200 p-0.5">
          <Button size="lg" className="rounded-xl px-8 text-base bg-orange-500 hover:bg-orange-600 text-white">
            Получить консультацию
          </Button>
        </div>
        <Button size="lg" variant="outline" className="rounded-xl px-8 border-orange-200 hover:text-orange-500">
          Рассчитать стоимость
        </Button>
      </div>
    </div>
  </section>
)
