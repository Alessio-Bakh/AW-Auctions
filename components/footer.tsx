"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

function ComingSoonModal({
  isOpen,
  onClose,
  label,
}: { isOpen: boolean; onClose: () => void; label: string }) {
  const [visible, setVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true)
        })
      })
    } else {
      setVisible(false)
      const timer = setTimeout(() => setShouldRender(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!shouldRender) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
        transition: "background-color 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
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
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
          transition: "opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={() => {}}
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

const socialPlaceholders = [
  { id: 1, label: "Social 1" },
  { id: 2, label: "Social 2" },
  { id: 3, label: "Social 3" },
  { id: 4, label: "Social 4" },
  { id: 5, label: "Social 5" },
  { id: 6, label: "Social 6" },
]

const helpCenterItems = ["FAQ"]

const aboutItems = ["Team", "Departments", "Legal documents (AML, Licence, etc)"]

interface FooterDropdownProps {
  title: string
  items: string[]
  onItemClick: (item: string) => void
}

function FooterDropdown({ title, items, onItemClick }: FooterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        className="text-base font-semibold text-foreground hover:opacity-70 transition-opacity flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {title}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-background border border-border shadow-md py-2 min-w-[220px] z-50">
          <ul>
            {items.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="block w-full text-left px-4 py-1.5 text-sm hover:bg-secondary transition-colors"
                  style={{ color: "#000000" }}
                  onClick={() => {
                    onItemClick(item)
                    setIsOpen(false)
                  }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                    style={{ backgroundColor: "#000000" }}
                  />
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function Footer() {
  const [comingSoon, setComingSoon] = useState<string | null>(null)

  return (
    <>
      <footer className="border-t border-foreground px-6 lg:px-8 py-10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Follow us */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">
              Follow us
            </h3>
            <div className="grid grid-cols-3 gap-2 max-w-[120px]">
              {socialPlaceholders.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="w-9 h-9 rounded-full bg-muted-foreground/60 hover:bg-muted-foreground transition-colors"
                  aria-label={item.label}
                  onClick={() => setComingSoon(item.label)}
                />
              ))}
            </div>
          </div>

          {/* Help Center dropdown */}
          <div>
            <FooterDropdown
              title="Help Center"
              items={helpCenterItems}
              onItemClick={(item) => setComingSoon(item)}
            />
          </div>

          {/* About dropdown */}
          <div>
            <FooterDropdown
              title="About"
              items={aboutItems}
              onItemClick={(item) => setComingSoon(item)}
            />
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">
              Policies
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                "Privacy Policy",
                "Terms & Conditions",
                "AML & KYC Policy",
                "Modern Slavery Statement",
              ].map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="text-sm hover:opacity-70 transition-opacity cursor-pointer text-foreground"
                    onClick={() => setComingSoon(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      <ComingSoonModal
        isOpen={comingSoon !== null}
        onClose={() => setComingSoon(null)}
        label={comingSoon || ""}
      />
    </>
  )
}
