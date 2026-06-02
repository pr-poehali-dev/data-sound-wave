import * as React from "react"
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { GridMotion } from "@/components/ui/grid-motion"
import { cn } from "@/lib/utils"
import { Button, AnimatedGroup, Logo, transitionVariants } from "./shared"

// ─── Menu items ─────────────────────────────────────────────────────────────

const menuItems = [
  { name: "Каталог", href: "/catalog" },
  { name: "Услуги", href: "#services" },
  { name: "О компании", href: "#about" },
  { name: "Контакты", href: "#contact" },
]

// ─── HeroHeader ─────────────────────────────────────────────────────────────

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
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

// ─── gridItems ──────────────────────────────────────────────────────────────

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

// ─── HeroSection ─────────────────────────────────────────────────────────────

export const HeroSection = () => (
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
            <Link key={2} to="/catalog">
              <Button size="lg" variant="ghost" className="h-10.5 rounded-xl px-5 hover:text-orange-500">
                <span className="text-nowrap">Смотреть каталог</span>
              </Button>
            </Link>
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

        {/* Типы техники */}
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
)
