import React from 'react'

export default function TestDesignPage() {
  return (
    <div className="min-h-screen p-8 space-y-12">
      
      {/* OPTION 1 : DARK FANTASY */}
      <section className="bg-background p-8 rounded-xl border border-[var(--border-main)]">
        <h2 className="text-white text-sm mb-4 uppercase tracking-widest opacity-50">Option 1 : Dark Fantasy</h2>
        
        <div className="max-w-sm theme-card border border-[var(--border-main)] rounded-xl overflow-hidden shadow-2xl hover:shadow-purple-900/20 transition group">
          <div className="h-32 bg-gradient-to-b from-purple-900/50 to-slate-900 relative">
            <span className="absolute top-2 right-2 bg-black/60 text-purple-300 text-xs px-2 py-1 rounded backdrop-blur border border-accent/30">CR 5</span>
          </div>
          <div className="p-5">
            <h3 className="text-2xl font-serif text-white group-hover:text-[var(--accent-primary)] transition">Dragon d'Ombre</h3>
            <p className="text-[var(--text-muted)] text-sm mt-1 mb-4">Dragon (Grande taille), Chaotique Mauvais</p>
            <div className="flex gap-2">
              <span className="text-xs font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-900/50">PV 120</span>
              <span className="text-xs font-bold text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-900/50">CA 18</span>
            </div>
          </div>
        </div>
      </section>


      {/* OPTION 2 : PARCHEMIN (OLD SCHOOL) */}
      <section className="bg-[#f0e6d2] p-8 rounded-xl border-4 border-[#5c4b37]">
        <h2 className="text-[#5c4b37] text-sm mb-4 uppercase tracking-widest opacity-70 font-serif">Option 2 : Parchemin</h2>
        
        <div className="max-w-sm bg-[#fdf1dc] border-2 border-[#7a200d] rounded shadow-[4px_4px_0px_rgba(0,0,0,0.2)] relative">
          <div className="h-32 border-b-2 border-[#7a200d] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
             <span className="absolute top-0 right-0 bg-[#7a200d] text-[#fdf1dc] text-xs font-serif font-bold px-3 py-1">CR 5</span>
          </div>
          <div className="p-5 font-serif">
            <h3 className="text-2xl font-bold text-[#2c3e50] tracking-tight border-b border-[#2c3e50] pb-2 mb-2">Dragon d'Ombre</h3>
            <p className="text-[#5c4b37] text-sm italic mb-4">La créature rôde dans les ténèbres...</p>
            <div className="flex gap-3 text-sm font-bold text-[#7a200d]">
              <span>❤️ PV 120</span>
              <span>🛡️ CA 18</span>
            </div>
          </div>
        </div>
      </section>


      {/* OPTION 3 : MODERN VTT */}
      <section className="bg-zinc-100 p-8 rounded-xl border border-zinc-200">
        <h2 className="text-zinc-500 text-sm mb-4 uppercase tracking-widest font-bold">Option 3 : Moderne</h2>
        
        <div className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden border border-zinc-100 hover:shadow-xl transition-shadow">
          <div className="h-32 bg-indigo-600 relative">
             <div className="absolute -bottom-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-md border-2 border-indigo-100">🐉</div>
          </div>
          <div className="pt-8 px-6 pb-6">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-zinc-900">Dragon d'Ombre</h3>
                <span className="bg-zinc-100 text-zinc-600 text-xs font-bold px-2 py-1 rounded-full">CR 5</span>
            </div>
            <p className="text-zinc-500 text-sm mt-1 mb-4">Dragon • Grande taille</p>
            
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 text-green-700 text-center py-2 rounded-lg text-sm font-bold">120 PV</div>
                <div className="bg-indigo-50 text-indigo-700 text-center py-2 rounded-lg text-sm font-bold">18 CA</div>
            </div>
          </div>
        </div>
      </section>


      {/* OPTION 4 : CYBERPUNK */}
      <section className="bg-black p-8 rounded-xl border border-cyan-900">
        <h2 className="text-cyan-500 text-sm mb-4 uppercase tracking-widest font-mono">Option 4 : Cyberpunk</h2>
        
        <div className="max-w-sm bg-black border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] relative group">
          {/* Scanlines effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>
          
          <div className="h-32 bg-gray-900 relative border-b border-cyan-500/50">
             <span className="absolute bottom-2 right-2 text-pink-500 font-mono text-xs animate-pulse">CR_05</span>
          </div>
          <div className="p-5 font-mono relative z-10">
            <h3 className="text-xl font-bold text-cyan-400 uppercase tracking-tighter">DRAGON_OMBRE_V2</h3>
            <p className="text-gray-500 text-xs mt-1 mb-4"> ENTITY_TYPE: DRAGON</p>
            <div className="flex gap-4">
              <span className="text-pink-500 border border-pink-500 px-2 py-0.5 text-xs">HP:120</span>
              <span className="text-cyan-500 border border-cyan-500 px-2 py-0.5 text-xs">AC:18</span>
            </div>
          </div>
        </div>
      </section>


      {/* OPTION 5 : MINIMALISTE */}
      <section className="bg-white p-8 rounded-xl border border-gray-100">
        <h2 className="text-black text-sm mb-4 font-medium">Option 5 : Minimaliste</h2>
        
        <div className="max-w-sm p-6 border border-gray-200 rounded-lg hover:border-black transition duration-300 cursor-pointer">
          <div className="flex justify-between items-start mb-4">
             <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
             <span className="text-xs text-gray-400">CR 5</span>
          </div>
          <h3 className="text-lg font-semibold text-black mb-1">Dragon d'Ombre</h3>
          <p className="text-gray-500 text-sm mb-6">Grande taille</p>
          
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-sm">
             <div>
               <span className="block text-gray-400 text-xs">Points de vie</span>
               <span className="font-medium">120</span>
             </div>
             <div>
               <span className="block text-gray-400 text-xs">Armure</span>
               <span className="font-medium">18</span>
             </div>
          </div>
        </div>
      </section>


      {/* OPTION 6 : GRIMOIRE */}
      <section className="bg-[#3e2723] p-8 rounded-xl border-4 border-[#5d4037]">
        <h2 className="text-[#d7ccc8] text-sm mb-4 uppercase tracking-widest font-serif opacity-80">Option 6 : Grimoire</h2>
        
        <div className="max-w-sm bg-[#5d4037] rounded-lg shadow-xl overflow-hidden border border-[#795548]">
          <div className="h-2 bg-[#ffb300]"></div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-2xl font-serif text-[#ffecb3]">Dragon d'Ombre</h3>
               <div className="w-8 h-8 rounded-full border-2 border-[#ffb300] flex items-center justify-center text-[#ffb300] text-xs font-bold">5</div>
            </div>
            
            <div className="bg-[#3e2723] p-4 rounded text-[#d7ccc8] text-sm font-serif italic border border-[#4e342e]">
              "Une créature née des ténèbres éternelles..."
            </div>
            
            <div className="mt-4 flex justify-between text-[#ffecb3] font-serif">
               <span>PV <strong className="text-white">120</strong></span>
               <span>CA <strong className="text-white">18</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* OPTION 7 : GLASSMORPHISM */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-8 rounded-xl">
        <h2 className="text-white/80 text-sm mb-4 font-light">Option 7 : Ether</h2>
        
        <div className="max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden p-6 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 shadow-lg"></div>
            <div>
              <h3 className="text-xl font-bold tracking-wide">Dragon d'Ombre</h3>
              <span className="text-xs text-white/60">Créature Légendaire</span>
            </div>
          </div>
          
          <div className="flex justify-between bg-black/20 rounded-lg p-3 backdrop-blur-sm border border-white/5">
             <div className="text-center">
               <span className="block text-xs text-white/50 mb-1">SANTE</span>
               <span className="text-lg font-bold text-green-300">120</span>
             </div>
             <div className="w-px bg-white/10"></div>
             <div className="text-center">
               <span className="block text-xs text-white/50 mb-1">ARMURE</span>
               <span className="text-lg font-bold text-blue-300">18</span>
             </div>
             <div className="w-px bg-white/10"></div>
             <div className="text-center">
               <span className="block text-xs text-white/50 mb-1">DANGER</span>
               <span className="text-lg font-bold text-red-300">5</span>
             </div>
          </div>
        </div>
      </section>


      {/* OPTION 8 : PIXEL ART */}
      <section className="bg-[#2c2137] p-8 rounded-xl font-mono">
        <h2 className="text-white text-sm mb-4">Option 8 : Rétro</h2>
        
        <div className="max-w-sm bg-[#4a3b59] border-4 border-white p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]">
          <div className="bg-[#8b9bb4] h-32 border-2 border-white mb-2 flex items-center justify-center">
            👾
          </div>
          <div className="bg-[#2c2137] border-2 border-white p-4 text-white">
            <h3 className="text-lg uppercase tracking-widest mb-2 text-yellow-300">Dragon Ombre</h3>
            <div className="w-full bg-red-900 h-4 border border-white mb-1">
              <div className="bg-red-500 h-full w-[80%]"></div>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span>PV: 120/120</span>
              <span>DEF: 18</span>
            </div>
          </div>
        </div>
      </section>


      {/* OPTION 9 : TACTICAL */}
      <section className="bg-gray-900 p-8 rounded-xl border border-gray-800">
        <h2 className="text-green-500 text-sm mb-4 font-mono">Option 9 : Tactical</h2>
        
        <div className="max-w-sm border border-green-800 bg-gray-950 p-1 relative">
          {/* Coins tactiques */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500"></div>

          <div className="p-4 flex justify-between items-center border-b border-green-900/50 mb-2">
            <span className="text-green-500 font-mono text-sm">TARGET_ID: A-01</span>
            <span className="text-green-700 text-xs">ONLINE</span>
          </div>

          <div className="p-4">
            <h3 className="text-white font-mono text-xl mb-4 tracking-wider">DRAGON_OMBRE</h3>
            
            <div className="grid grid-cols-2 gap-px bg-green-900/30 border border-green-900">
              <div className="bg-gray-900 p-2 text-center">
                <span className="text-gray-500 text-xs block">VITALITY</span>
                <span className="text-green-400 font-mono">120</span>
              </div>
              <div className="bg-gray-900 p-2 text-center">
                <span className="text-gray-500 text-xs block">ARMOR</span>
                <span className="text-green-400 font-mono">18</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}