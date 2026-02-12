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

      {/* Pop-up Box */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border p-8 max-w-md w-full relative shadow-2xl">
            <button 
              onClick={() => {setIsOpen(false); setStatus("idle")}}
              className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-serif mb-6 text-center">Subscribe to Updates</h3>
            
            {status === "success" ? (
              <p className="text-center py-8 text-green-600 font-medium">
                Thank you! We&apos;ll get back to you soon.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1">Name</label>
                  <input required name="name" type="text" className="w-full bg-transparent border border-border p-2 focus:outline-none focus:border-foreground transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1">Email</label>
                  <input required name="email" type="email" className="w-full bg-transparent border border-border p-2 focus:outline-none focus:border-foreground transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1">Message</label>
                  <textarea required name="message" rows={3} className="w-full bg-transparent border border-border p-2 focus:outline-none focus:border-foreground transition-colors" />
                </div>
                
                <div className="flex items-start gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="gdpr" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 accent-foreground"
                    required
                  />
                  <label htmlFor="gdpr" className="text-[10px] leading-tight text-foreground/70 uppercase tracking-tighter">
                    I agree to the processing of my personal data in accordance with the 
                    <a href="https://drive.google.com/file/d/1W136Szxs5c9KH9lsam6NfP4K_0k4aQH-/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="underline ml-1">Privacy Policy</a>.
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={!agreed || status === "sending"}
                  className="w-full bg-foreground text-background py-3 mt-4 text-xs uppercase tracking-[0.2em] font-bold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  {status === "sending" ? "Sending..." : "Send"}
                </button>
                {status === "error" && <p className="text-red-500 text-[10px] text-center uppercase tracking-widest mt-2">Error! Please try again later.</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
