import { HeroHeader, HeroSection } from "./landing/HeroSection"
import { FeaturesSection, CatalogSection, ServicesSection, AboutSection, CtaSection } from "./landing/MainSections"
import { SiteFooter } from "./landing/SiteFooter"

export default function SoftwareDevelopmentWebsite() {
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

        <HeroSection />
        <FeaturesSection />
        <CatalogSection />
        <ServicesSection />
        <AboutSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  )
}
