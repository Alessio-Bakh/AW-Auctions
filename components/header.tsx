"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Globe, Menu, X, ChevronDown } from "lucide-react"

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  label: string
}

function ComingSoonModal({ isOpen, onClose, label }: ComingSoonModalProps) {
  const [phase, setPhase] = useState<"idle" | "entering" | "visible" | "leaving">("idle")

  useEffect(() => {
    if (isOpen && (phase === "idle" || phase === "leaving")) {
      setPhase("entering")
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase("visible")
        })
      })
    } else if (!isOpen && (phase === "visible" || phase === "entering")) {
      setPhase("leaving")
    }
  }, [isOpen, phase])

  const handleTransitionEnd = () => {
    if (phase === "leaving") {
      setPhase("idle")
    }
  }

  if (phase === "idle") return null

  const show = phase === "visible"

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: show ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
        transition: "background-color 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
        pointerEvents: phase === "leaving" ? "none" : "auto",
        willChange: "background-color",
      }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${label} - Coming soon`}
    >
      <div
        className="rounded bg-background/90 px-10 py-8 shadow-lg text-center"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "scale(1) translateY(0)" : "scale(0.97) translateY(4px)",
          transition: "opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
          willChange: "opacity, transform",
          backfaceVisibility: "hidden",
        }}
        onTransitionEnd={handleTransitionEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-lg font-serif text-foreground">{label}</p>
        <p className="mt-2 text-xl font-serif text-foreground">Coming soon</p>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  )
}

const navItems = [
  {
    title: "Auctions",
    items: ["Upcoming auctions", "Auctions results"],
  },
  {
    title: "Private Sales",
    items: [
      "What's available / Current selling exhibitions",
      "How it works",
      "Past exhibitions",
    ],
  },
  {
    title: "Services",
    items: [
      "Request an estimate",
      "Events & Valuation Days",
      "House sales",
      "Museum Services",
      "Charity Auctioneers",
    ],
  },
  {
    title: "Discover",
    items: [
      "Read latest stories",
      "Visit",
      "Artists & Makers",
      "Art movements",
      "Insight reports",
      "Collecting Guides",
    ],
  },
  {
    title: "How to Buy & Sell",
    items: ["Bidding", "Selling", "Condition of business", "Glossary"],
  },
]

const languages = [
  { code: "FR", label: "Fran\u00e7ais" },
  { code: "ES", label: "Espa\u00f1ol" },
  { code: "RU", label: "\u0420\u0423" },
  { code: "ZH", label: "\u4E2D\u6587" },
]

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [comingSoon, setComingSoon] = useState<string | null>(null)
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const langTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const handleDropdownEnter = (title: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setOpenDropdown(title)
  }

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }

  const handleLangEnter = () => {
    if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current)
    setLangOpen(true)
  }

  const handleLangLeave = () => {
    langTimeoutRef.current = setTimeout(() => {
      setLangOpen(false)
    }, 150)
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        {/* Main header row */}
        <div className="flex items-center justify-between px-6 lg:px-8 py-3 lg:py-4 max-w-[1280px] mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="AW Auctions"
              width={140}
              height={56}
              className="h-12 lg:h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
            {navItems.map((item) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(item.title)}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  className="text-sm xl:text-base font-semibold text-foreground hover:opacity-70 transition-opacity flex items-center gap-1"
                  type="button"
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === item.title ? null : item.title
                    )
                  }
                  aria-expanded={openDropdown === item.title}
                  aria-haspopup="true"
                >
                  {item.title}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${openDropdown === item.title ? "rotate-180" : ""}`}
                  />
                </button>

                {openDropdown === item.title && (
                  <div className="absolute top-full left-0 mt-1 bg-background border border-border shadow-md py-2 min-w-[220px] z-50">
                    <ul>
                      {item.items.map((subItem) => (
                        <li key={subItem}>
                          <button
                            type="button"
                            className="block w-full text-left px-4 py-1.5 text-sm hover:bg-secondary transition-colors"
                            style={{ color: "#000000" }}
                            onClick={() => {
                              setComingSoon(subItem)
                              setOpenDropdown(null)
                            }}
                          >
                            <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle" style={{ backgroundColor: "#000000" }} />
                            {subItem}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right section: Log in + Globe */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              type="button"
              className="text-sm xl:text-base font-semibold text-foreground hover:opacity-70 transition-opacity"
              onClick={() => setComingSoon("Log in")}
            >
              Log in
            </button>

            {/* Language globe */}
            <div
              className="relative"
              onMouseEnter={handleLangEnter}
              onMouseLeave={handleLangLeave}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-foreground hover:opacity-70 transition-opacity"
                onClick={() => setLangOpen(!langOpen)}
                aria-label="Select language"
                aria-expanded={langOpen}
                aria-haspopup="true"
              >
                <Globe className="h-5 w-5" />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-background border border-border shadow-md py-2 min-w-[140px] z-50">
                  <p className="px-4 py-1 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Languages
                  </p>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className="block w-full text-left px-4 py-1.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      onClick={() => {
                        setComingSoon(`${lang.label} version`)
                        setLangOpen(false)
                      }}
                    >
                      <span className="font-semibold mr-2">{lang.code}</span>
                      <span className="text-muted-foreground">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden flex items-center text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] z-30 bg-background overflow-y-auto lg:hidden">
          <nav className="px-6 py-6">
            {navItems.map((item) => (
              <div key={item.title} className="border-b border-border">
                <button
                  type="button"
                  className="flex items-center justify-between w-full py-4 text-base font-semibold text-foreground"
                  onClick={() =>
                    setMobileExpanded(
                      mobileExpanded === item.title ? null : item.title
                    )
                  }
                  aria-expanded={mobileExpanded === item.title}
                >
                  {item.title}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileExpanded === item.title ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileExpanded === item.title && (
                  <ul className="pb-3 pl-4">
                    {item.items.map((subItem) => (
                      <li key={subItem}>
                        <button
                          type="button"
                          className="block w-full text-left py-2 text-sm"
                          style={{ color: "#000000" }}
                          onClick={() => {
                            setComingSoon(subItem)
                            setMobileMenuOpen(false)
                          }}
                        >
                          <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle" style={{ backgroundColor: "#000000" }} />
                          {subItem}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Mobile Log in */}
            <div className="py-4 border-b border-border">
              <button
                type="button"
                className="text-base font-semibold text-foreground"
                onClick={() => {
                  setComingSoon("Log in")
                  setMobileMenuOpen(false)
                }}
              >
                Log in
              </button>
            </div>

            {/* Mobile Languages */}
            <div className="py-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">
                Languages
              </p>
              <div className="flex gap-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className="text-sm font-semibold text-foreground hover:opacity-70 transition-opacity border border-border px-3 py-1.5"
                    onClick={() => {
                      setComingSoon(`${lang.label} version`)
                      setMobileMenuOpen(false)
                    }}
                  >
                    {lang.code}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoon !== null}
        onClose={() => setComingSoon(null)}
        label={comingSoon || ""}
      />
    </>
  )
}
