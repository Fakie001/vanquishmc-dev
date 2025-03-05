export function StoreBanner() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl"
        style={{
          backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teszew.png-OtR7DXELVu5bqCwgn5adAJzbW4fY5E.webp)`,
          backgroundPosition: "center 65%",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1F1A29]/80 via-[#1F1A29]/60 to-[#1F1A29]/40 rounded-2xl" />

      {/* Content */}
      <div className="container relative py-8 md:py-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-transparent bg-clip-text">
            VanquishMC Store
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Support the server and enjoy exclusive perks—permanent purchases for passionate players.
          </p>

          {/* Refund Policy Notice */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
            <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M12 16H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-gray-300">All sales are final. No refunds or exchanges.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

