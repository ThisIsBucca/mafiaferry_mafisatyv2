function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#313338]">
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/10 via-[#5865F2]/10 to-[#5865F2]/10 blur-3xl"></div>
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 tracking-tight relative">
          <span className="text-[#5865F2] drop-shadow-[0_0_15px_rgba(88,101,242,0.3)]">Hello</span>{' '}
          <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Bucca</span>
        </h1>
        <p className="text-xl text-[#B5BAC1]/80 font-medium tracking-wider">Welcome to Discord</p>
      </div>
    </div>
  )
}

export default App
