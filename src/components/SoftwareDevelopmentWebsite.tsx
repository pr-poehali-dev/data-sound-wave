import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight, ChevronRight, Menu, X, Battery, Zap, RefreshCw, Recycle } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { GridMotion } from "./ui/grid-motion"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

function AnimatedGroup({
  children,
  className,
  variants,
}: {
  children: React.ReactNode
  className?: string
  variants?: {
    container?: Variants
    item?: Variants
  }
}) {
  const containerVariants = variants?.container || defaultContainerVariants
  const itemVariants = variants?.item || defaultItemVariants

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className={cn(className)}>
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

const menuItems = [
  { name: "Каталог", href: "#catalog" },
  { name: "Услуги", href: "#services" },
  { name: "О компании", href: "#about" },
  { name: "Контакты", href: "#contact" },
]

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header>
      <nav data-state={menuState && "active"} className="fixed z-20 w-full px-2 group">
        <div
          className={cn(
            "mx-auto mt-1 max-w-4xl px-4 transition-all duration-300 lg:px-8",
            isScrolled && "bg-background/50 max-w-3xl rounded-2xl border backdrop-blur-lg lg:px-4",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-0">
            <div className="flex w-full justify-between lg:w-auto">
              <a href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </a>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Закрыть меню" : "Открыть меню"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      <span>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  size="sm"
                  className={cn(
                    isScrolled
                      ? "lg:inline-flex bg-orange-500 hover:bg-orange-600 text-white"
                      : "hidden bg-orange-500 hover:bg-orange-600 text-white",
                  )}
                >
                  <span>Получить консультацию</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="bg-orange-500 rounded-lg p-2">
        <Battery className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold">АккумТех</span>
    </div>
  )
}

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div
    aria-hidden
    className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
  >
    <div className="absolute inset-0 [--border:black] dark:[--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-orange-200">
      {children}
    </div>
  </div>
)

export default function SoftwareDevelopmentWebsite() {
  const gridItems = [
    "https://cdn.poehali.dev/templates/landing-page/fluid-gradient.jpg",
    "https://cdn.poehali.dev/templates/landing-page/vr-experience.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-whiteboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/human-ai.jpg",
    "https://cdn.poehali.dev/templates/landing-page/digital-eye.jpg",
    "https://cdn.poehali.dev/templates/landing-page/robot.jpg",
    "https://cdn.poehali.dev/templates/landing-page/purple-flow.jpg",
    "https://cdn.poehali.dev/templates/landing-page/data-beam.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-keyboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/fiber-optic.jpg",
    "https://cdn.poehali.dev/templates/landing-page/fluid-gradient.jpg",
    "https://cdn.poehali.dev/templates/landing-page/vr-experience.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-whiteboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/human-ai.jpg",
    "https://cdn.poehali.dev/templates/landing-page/digital-eye.jpg",
    "https://cdn.poehali.dev/templates/landing-page/robot.jpg",
    "https://cdn.poehali.dev/templates/landing-page/purple-flow.jpg",
    "https://cdn.poehali.dev/templates/landing-page/data-beam.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-keyboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/fiber-optic.jpg",
    "https://cdn.poehali.dev/templates/landing-page/fluid-gradient.jpg",
    "https://cdn.poehali.dev/templates/landing-page/vr-experience.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-whiteboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/human-ai.jpg",
    "https://cdn.poehali.dev/templates/landing-page/digital-eye.jpg",
    "https://cdn.poehali.dev/templates/landing-page/robot.jpg",
  ]

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(25,100%,50%,.08)_0,hsla(25,100%,45%,.02)_50%,hsla(25,100%,40%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(25,100%,50%,.06)_0,hsla(25,100%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        </div>

        {/* HERO */}
        <section>
          <div className="relative pt-24 md:pt-36">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
            />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <a
                    href="#about"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                  >
                    <span className="text-foreground text-sm">16 лет на рынке промышленных аккумуляторов</span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </a>

                  <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                    Аккумуляторы и зарядка для{" "}
                    <span className="inline-block text-orange-500 text-6xl md:text-7xl xl:text-[5.25rem] font-semibold">
                      складской техники
                    </span>
                  </h1>
                  <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                    Продажа, скупка и восстановление свинцово-кислотных и литиевых аккумуляторов. Зарядные устройства и складская техника. Ионно-резонансная технология восстановления с остаточной ёмкостью до 85%.
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div key={1} className="bg-orange-500/10 rounded-[14px] border border-orange-200 p-0.5">
                    <Button size="lg" className="rounded-xl px-5 text-base bg-orange-500 hover:bg-orange-600 text-white">
                      <span className="text-nowrap">Получить консультацию</span>
                    </Button>
                  </div>
                  <Button key={2} size="lg" variant="ghost" className="h-10.5 rounded-xl px-5 hover:text-orange-500">
                    <span className="text-nowrap">Смотреть каталог</span>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div
                  aria-hidden
                  className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-orange-200 p-4 shadow-lg shadow-orange-500/15 ring-1">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 aspect-[15/8] relative rounded-2xl border border-orange-200 overflow-hidden">
                    <GridMotion items={gridItems} gradientColor="rgba(249, 115, 22, 0.1)" className="h-full w-full" />
                  </div>
                </div>
              </div>

              {/* Партнёры/клиенты */}
              <section className="bg-background pb-16 pt-16 md:pb-32">
                <div className="group relative m-auto max-w-5xl px-6">
                  <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                    <a href="#contact" className="block text-sm duration-150 hover:opacity-75 text-orange-500">
                      <span>Оставить заявку</span>
                      <ChevronRight className="ml-1 inline-block size-3" />
                    </a>
                  </div>
                  <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                    <div className="flex col-span-2 sm:col-span-1">
                      <span className="mx-auto text-sm font-semibold text-muted-foreground opacity-60 self-center text-center">Электропогрузчики</span>
                    </div>
                    <div className="flex col-span-2 sm:col-span-1">
                      <span className="mx-auto text-sm font-semibold text-muted-foreground opacity-60 self-center text-center">Штабелёры</span>
                    </div>
                    <div className="flex col-span-2 sm:col-span-1">
                      <span className="mx-auto text-sm font-semibold text-muted-foreground opacity-60 self-center text-center">Тележки ЭПТ</span>
                    </div>
                    <div className="flex col-span-2 sm:col-span-1">
                      <span className="mx-auto text-sm font-semibold text-muted-foreground opacity-60 self-center text-center">Тягачи</span>
                    </div>
                    <div className="flex col-span-2 sm:col-span-1">
                      <span className="mx-auto text-sm font-semibold text-muted-foreground opacity-60 self-center text-center">Ричтраки</span>
                    </div>
                    <div className="flex col-span-2 sm:col-span-1">
                      <span className="mx-auto text-sm font-semibold text-muted-foreground opacity-60 self-center text-center">ПЭТ-тележки</span>
                    </div>
                    <div className="flex col-span-2 sm:col-span-1">
                      <span className="mx-auto text-sm font-semibold text-muted-foreground opacity-60 self-center text-center">Комплектовщики</span>
                    </div>
                    <div className="flex col-span-2 sm:col-span-1">
                      <span className="mx-auto text-sm font-semibold text-muted-foreground opacity-60 self-center text-center">Ножничные подъёмники</span>
                    </div>
                  </div>
                </div>
              </section>
            </AnimatedGroup>
          </div>
        </section>

        {/* ПРЕИМУЩЕСТВА */}
        <section id="about" className="bg-muted/50 py-16 md:py-32 dark:bg-transparent">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                Почему выбирают <span className="text-orange-500">АккумТех</span>
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

        {/* КАТАЛОГ */}
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
          </div>
        </section>

        {/* УСЛУГИ */}
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

        {/* О КОМПАНИИ */}
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

        {/* CTA */}
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
      </main>

      <footer className="bg-background border-t border-orange-200">
        <div className="mx-auto max-w-7xl py-16 px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <Logo />
              <p className="text-sm text-muted-foreground max-w-xs">
                Продажа, скупка и восстановление промышленных аккумуляторов. 16 лет на рынке складской техники.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Каталог */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Каталог</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#catalog" className="hover:text-orange-500 transition-colors">Свинцово-кислотные АКБ</a></li>
                <li><a href="#catalog" className="hover:text-orange-500 transition-colors">Литиевые / LFP АКБ</a></li>
                <li><a href="#catalog" className="hover:text-orange-500 transition-colors">Зарядные устройства</a></li>
                <li><a href="#catalog" className="hover:text-orange-500 transition-colors">Складская техника</a></li>
              </ul>
            </div>

            {/* Услуги */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Услуги</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#services" className="hover:text-orange-500 transition-colors">Ремонт и восстановление АКБ</a></li>
                <li><a href="#services" className="hover:text-orange-500 transition-colors">Обратный выкуп</a></li>
                <li><a href="#services" className="hover:text-orange-500 transition-colors">Trade-in</a></li>
                <li><a href="#services" className="hover:text-orange-500 transition-colors">Диагностика</a></li>
              </ul>
            </div>

            {/* Контакты */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Контакты</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="break-all">info@akkumtech.ru</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+7 (495) 123-45-67</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Москва, Складской пер., 12</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-orange-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-sm text-muted-foreground">© 2026 АккумТех. Все права защищены.</div>
              <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2 text-sm">
                <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                  Политика конфиденциальности
                </a>
                <a href="#" className="text-muted-foreground hover:text-orange-500 transition-colors">
                  Условия использования
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
