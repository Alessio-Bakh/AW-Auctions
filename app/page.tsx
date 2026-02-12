import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import NewsSection from "@/components/news-section"
import Footer from "@/components/footer"
import RevealWrapper from "@/components/reveal-wrapper"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <RevealWrapper>
          <HeroSection />
        </RevealWrapper>

        <RevealWrapper delay={200}>
          <NewsSection />
        </RevealWrapper>
      </main>

      <RevealWrapper delay={100}>
        <Footer />
      </RevealWrapper>
    </div>
  )
}
