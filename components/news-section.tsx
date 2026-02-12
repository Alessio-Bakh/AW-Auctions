"use client"

import { useState } from "react"

export default function NewsSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

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
      } else {
        setStatus("error")
      }
    } catch (error) {
      setStatus("error")
    }
  }

  return (
    <section className="px-6 lg:px-8 py-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="bg-card flex flex-col items-center justify-center min-h-[120px] md:min-h-[160px] p-8 border border-border">
          <h2 className="text-2xl md:text-3xl font-serif text-card-foreground text-center">
            News / Stories / Updates
          </h2>
          <button 
            onClick={() => setIsOpen(true)}
            className="mt-4 text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Be the first to know
          </button>
        </div>
      </div>

      {/* Pop-up Box - Fixed layer issues */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop - darkens everything including footer/header */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Modal content */}
          <div className="bg-background border border-border p-6 md:p-10 max-w-md w-full relative shadow-2xl z-[10000] my-auto">
            <button 
              onClick={() => {setIsOpen(false); setStatus("idle")}}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground text-xl"
            >
              ✕
            </button>
            
            <h3 className="text-xl md:text-2xl font-serif mb-8 text-center uppercase tracking-tight">Subscribe to Updates</h3>
            
            {status === "success" ? (
              <div className="text-center py-10">
                <p className="text-green-600 font-medium mb-4">Thank you!</p>
                <p className="text-sm opacity-70 uppercase tracking-widest">We&apos;ll get back to you soon.</p>
                <button 
                   onClick={() => setIsOpen(false)}
                   className="mt-8 text-xs underline underline-offset-4 uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-1.5 opacity-60">Name</label>
                  <input required name="name" type="text" className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-foreground transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-1.5 opacity-60">Email</label>
                  <input required name="email" type="email" className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-foreground transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-1.5 opacity-60">Message</label>
                  <textarea required name="message" rows={3} className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-foreground transition-colors resize-none" />
                </div>
                
                <div className="flex items-start gap-4 pt-4">
                  <div className="flex items-center h-5">
                    <input 
                      type="checkbox" 
                      id="gdpr" 
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 accent-foreground cursor-pointer"
                      required
                    />
                  </div>
                  <label htmlFor="gdpr" className="text-[10px] leading-relaxed text-foreground/70 uppercase tracking-wider cursor-pointer">
                    I agree to the processing of my personal data in accordance with the 
                    <a href="https://drive.google.com/file/d/1W136Szxs5c9KH9lsam6NfP4K_0k4aQH-/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="underline ml-1 hover:text-foreground">Privacy Policy</a>.
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={!agreed || status === "sending"}
                  className="w-full bg-foreground text-background py-4 mt-6 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-foreground/90 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  {status === "sending" ? "Processing..." : "Send Request"}
                </button>
                {status === "error" && (
                  <p className="text-red-500 text-[9px] text-center uppercase tracking-widest mt-4">
                    Connection error. Please try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
