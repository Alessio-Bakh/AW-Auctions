"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

export default function NewsSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [mounted, setMounted] = useState(false)

  // Нужно для корректной работы телепортации в Next.js
  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden' // Блокируем прокрутку сайта под попапом
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("sending")
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch("https://formspree.io/f/mzdaeeew", {
        method: "POST",
        body: data,
        headers: { 'Accept': 'application/json' }
      })
      if (response.ok) {
        setStatus("success")
        form.reset()
        setAgreed(false)
      } else { setStatus("error") }
    } catch { setStatus("error") }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop - темный фон на весь экран */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md" 
        onClick={() => setIsOpen(false)} 
      />
      
      {/* Контент формы */}
      <div className="bg-white border border-border p-6 md:p-10 max-w-md w-full relative shadow-2xl z-[100000] my-auto animate-in fade-in zoom-in duration-300">
        <button 
          onClick={() => {setIsOpen(false); setStatus("idle")}}
          className="absolute top-4 right-4 text-black/50 hover:text-black text-2xl p-2"
        >
          ✕
        </button>
        
        <h3 className="text-xl md:text-2xl font-serif mb-8 text-center uppercase tracking-tight text-black">Subscribe to Updates</h3>
        
        {status === "success" ? (
          <div className="text-center py-10">
            <p className="text-green-600 font-medium mb-4">Thank you!</p>
            <p className="text-sm opacity-70 uppercase tracking-widest text-black">We&apos;ll get back to you soon.</p>
            <button onClick={() => setIsOpen(false)} className="mt-8 text-xs underline uppercase tracking-widest text-black">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-black">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] mb-1.5 opacity-60">Name</label>
              <input required name="name" type="text" className="w-full bg-transparent border-b border-black/20 py-2 focus:outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] mb-1.5 opacity-60">Email</label>
              <input required name="email" type="email" className="w-full bg-transparent border-b border-black/20 py-2 focus:outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] mb-1.5 opacity-60">Message</label>
              <textarea required name="message" rows={3} className="w-full bg-transparent border-b border-black/20 py-2 focus:outline-none focus:border-black transition-colors resize-none" />
            </div>
            
            <div className="flex items-start gap-4 pt-4">
              <input 
                type="checkbox" id="gdpr" checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-black cursor-pointer" required
              />
              <label htmlFor="gdpr" className="text-[10px] leading-relaxed text-black/70 uppercase tracking-wider cursor-pointer">
                I agree to the processing of my personal data in accordance with the 
                <a href="https://drive.google.com/file/d/1W136Szxs5c9KH9lsam6NfP4K_0k4aQH-/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="underline ml-1 hover:text-black">Privacy Policy</a>.
              </label>
            </div>

            <button 
              type="submit" disabled={!agreed || status === "sending"}
              className="w-full bg-black text-white py-4 mt-6 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black/90 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              {status === "sending" ? "Processing..." : "Send Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  )

  return (
    <section className="px-6 lg:px-8 py-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="bg-card flex flex-col items-center justify-center min-h-[120px] md:min-h-[160px] p-8 border border-border">
          <h2 className="text-2xl md:text-3xl font-serif text-card-foreground text-center">
            News / Stories / Updates
          </h2>
          <button 
  onClick={() => setIsOpen(true)}
  className="mt-6 text-xs md:text-sm uppercase tracking-[0.3em] font-light border-b border-transparent hover:border-foreground transition-all duration-300 pb-1"
>
  Be the first to know
</button>
        </div>
      </div>

      {/* Вынос формы на самый верхний уровень документа */}
      {isOpen && mounted && createPortal(modalContent, document.body)}
    </section>
  )
}
