"use client"

import { useState, useEffect } from "react"
import { client, urlFor } from "../../lib/sanity"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { StatusList } from "../../components/tracker/StatusIcon"
import { HealthBar } from "../../components/tracker/HealthBar"
import { useCombatTracker } from "../../hooks/useCombatTracker"
import { Modal } from "../../components/ui/Modal"
import { StatBlock } from "../../components/bestiary/StatBlock"

// Types locaux
type Combatant = {
  id: string
  sanityId?: string // Lien vers la fiche
  name: string
  type: 'player' | 'monster' | 'npc'
  faction: 'friendly' | 'hostile' | 'neutral'
  initiative: number
  hp: number
  hpMax: number
  ac: number
  conditions: string[]
  avatar?: any
}

export default function TrackerPage() {
  // --- 1. ÉTAT DU COMBAT (Via le Hook Persistant) ---
  const { 
    combatants, setCombatants, 
    turnIndex, setTurnIndex, 
    round, setRound,
    isLoaded 
  } = useCombatTracker()


  const [selectedFighter, setSelectedFighter] = useState<any>(null) // Pour la modale

  const openFighterDetails = async (fighter: Combatant) => {
    if (!fighter.sanityId) return; // Pas de fiche liée
    
    // On affiche un loader en attendant
    setSelectedFighter({ loading: true, name: fighter.name });
  
    // On va chercher la fiche complète
    const fullData = await client.fetch(`*[_id == $id][0]`, { id: fighter.sanityId });
    setSelectedFighter(fullData);
  }

  // --- 2. ÉTAT DE L'INTERFACE (On garde les useState ici) ---
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // --- LOGIQUE DE COMBAT ---

  const nextTurn = () => {
    if (combatants.length === 0) return
    let next = turnIndex + 1
    if (next >= combatants.length) {
      next = 0
      setRound(r => r + 1)
    }
    setTurnIndex(next)
  }

  const sortInitiative = () => {
    const sorted = [...combatants].sort((a, b) => b.initiative - a.initiative)
    setCombatants(sorted)
    setTurnIndex(0) // Reset le tour au début après un tri
  }

  const addCombatant = (template: any, type: 'monster' | 'player') => {
    // Calcul du numéro (Gobelin 1, Gobelin 2...)
    const count = combatants.filter(c => c.name.startsWith(template.name)).length
    const name = count > 0 ? `${template.name} ${count + 1}` : template.name

    let hp = 10, ac = 10;

    if (template._type === 'player') {
      hp = template.hpMax || 10;
      ac = template.ac || 10;
    } else if (template._type === 'monster') {
      hp = parseInt(template.stats?.hp || "10");
      ac = template.stats?.ac || 10;
    } else if (template._type === 'npc') {
      // PNJ : Soit stats custom, soit template monstre
      if (template.customStats) {
        hp = parseInt(template.customStats.hp || "10");
        ac = template.customStats.ac || 10;
      } else if (template.monsterTemplate) {
        hp = parseInt(template.monsterTemplate.stats?.hp || "10");
        ac = template.monsterTemplate.stats?.ac || 10;
      }
    }

    const newFighter: Combatant = {
      id: Math.random().toString(36).substr(2, 9),
      sanityId: template._id,
      name: name,
      type: type,
      faction: type === 'player' ? 'friendly' : 'hostile',
      initiative: 0, // À lancer
      hp: template.stats?.hp ? parseInt(template.stats.hp) : 10,
      hpMax: template.stats?.hp ? parseInt(template.stats.hp) : 10,
      ac: template.stats?.ac || 10,
      conditions: [],
      avatar: template.image
    }
    setCombatants([...combatants, newFighter])
    setSearchQuery("") // Fermer la recherche
  }

  const updateCombatant = (id: string, updates: Partial<Combatant>) => {
    setCombatants(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const damageCombatant = (id: string, amount: number) => {
    setCombatants(prev => prev.map(c => {
      if (c.id !== id) return c
      const newHp = Math.max(0, c.hp - amount)
      return { ...c, hp: newHp }
    }))
  }

  const healCombatant = (id: string, amount: number) => {
    setCombatants(prev => prev.map(c => {
      if (c.id !== id) return c
      const newHp = Math.min(c.hpMax, c.hp + amount)
      return { ...c, hp: newHp }
    }))
  }

  // --- RECHERCHE SANITY ---
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      // On cherche Monstres ET Joueurs
      const results = await client.fetch(`
        *[_type in ["monster", "player", "npc"] && name match $q + "*"][0...10]{
          _id, _type, name, image,
          // Monstres : stats dans un objet
          stats { hp, ac }, 
          // Joueurs : stats à la racine
          hpMax, ac, 
          // PNJ : Soit customStats (objet), soit lien vers monsterTemplate
          customStats { hp, ac },
          monsterTemplate->{ stats { hp, ac } }
        }
      `, { q: searchQuery })
      setSearchResults(results)
      setIsSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])


  // --- RENDU ---

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col md:flex-row gap-6">
      
      {/* COLONNE GAUCHE : LISTE & ACTIONS */}
      <div className="flex-1">
        
        {/* BARRE D'OUTILS */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="text-xs text-slate-500 uppercase font-bold">Round</span>
              <div className="text-2xl font-bold text-white">{round}</div>
            </div>
            <button onClick={nextTurn} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition transform hover:scale-105">
              Tour Suivant ➜
            </button>
          </div>
          
          <div className="flex gap-2">
            <button onClick={sortInitiative} className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded text-sm">
              ⚡ Trier Init.
            </button>
            <button onClick={() => setCombatants([])} className="bg-red-900/50 hover:bg-red-900 px-3 py-2 rounded text-sm text-red-200">
              🗑️ Tout vider
            </button>
          </div>
        </div>

        {/* LISTE DES COMBATTANTS */}
        <div className="space-y-3">
          {combatants.map((c, index) => (
            <div 
              key={c.id} 
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-300
                ${index === turnIndex ? 'border-purple-500 bg-slate-800 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-[1.02]' : 'border-slate-800 bg-slate-900 opacity-90'}
                ${c.hp === 0 ? 'opacity-50 grayscale' : ''}
              `}
            >
              <div className="flex items-center gap-4">
                
                {/* INIT INPUT */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-500 font-bold">INIT</span>
                  <input 
                    type="number" 
                    value={c.initiative} 
                    onChange={(e) => updateCombatant(c.id, { initiative: parseInt(e.target.value) || 0 })}
                    className="w-12 h-10 text-center bg-slate-950 border border-slate-700 rounded font-bold text-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 onClick={() => openFighterDetails(c)}
                      className={`font-bold text-lg cursor-pointer hover:underline decoration-dashed underline-offset-4 ${c.faction === 'hostile' ? 'text-red-400' : c.faction === 'friendly' ? 'text-green-400' : 'text-yellow-400'}`}
                    >
                      {c.name}
                    </h3>
                    {/* Switch Faction */}
                    <button 
                      onClick={() => updateCombatant(c.id, { faction: c.faction === 'hostile' ? 'friendly' : c.faction === 'friendly' ? 'neutral' : 'hostile' })}
                      className="text-xs opacity-30 hover:opacity-100"
                    >
                      🔄
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">🛡️ CA <input className="bg-transparent w-6 text-center border-b border-slate-700" value={c.ac} onChange={(e) => updateCombatant(c.id, { ac: parseInt(e.target.value) })} /></span>
                    
                    {/* Status */}
                    <select 
                      className="bg-slate-950 text-xs border border-slate-700 rounded px-1"
                      onChange={(e) => {
                        if(e.target.value && !c.conditions.includes(e.target.value)) 
                          updateCombatant(c.id, { conditions: [...c.conditions, e.target.value] })
                        e.target.value = ""
                      }}
                    >
                      <option value="">+ État</option>
                      <option value="blinded">Aveuglé</option>
                      <option value="charmed">Charmé</option>
                      <option value="prone">À terre</option>
                      {/* Ajoute les autres ici */}
                    </select>
                  </div>
                  
                  <StatusList conditions={c.conditions} onRemove={(cond) => updateCombatant(c.id, { conditions: c.conditions.filter((x: string) => x !== cond) })} />
                </div>

                {/* PV & DEGATS */}
                <div className="w-32 flex flex-col gap-1">
                  <div className="flex justify-between text-sm font-bold">
                    <span className={c.hp < c.hpMax / 2 ? 'text-red-500' : 'text-green-500'}>{c.hp}</span>
                    <span className="text-slate-600">/ {c.hpMax}</span>
                  </div>
                  <HealthBar current={c.hp} max={c.hpMax} />
                  
                  <div className="flex gap-1 mt-1">
                    <button onClick={() => damageCombatant(c.id, 1)} className="flex-1 bg-red-900/40 hover:bg-red-800 text-red-200 text-xs rounded py-1">-1</button>
                    <button onClick={() => damageCombatant(c.id, 5)} className="flex-1 bg-red-900/60 hover:bg-red-800 text-red-200 text-xs rounded py-1">-5</button>
                    {/* Input custom dmg pourrait aller ici */}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COLONNE DROITE : AJOUTER */}
      <div className="w-full md:w-80 bg-slate-900 p-4 rounded-xl border border-slate-800 h-fit sticky top-24">
        <h3 className="font-bold text-slate-300 mb-4 uppercase text-sm tracking-wider">Ajouter des participants</h3>
        
        <input 
          type="text" 
          placeholder="Rechercher monstre/joueur..." 
          className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg focus:border-purple-500 focus:outline-none mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isSearching && <p className="text-center text-slate-500 text-sm">Recherche...</p>}

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {searchResults.map((result: any) => (
            <div 
              key={result._id} 
              onClick={() => addCombatant(result, result._type === 'monster' ? 'monster' : 'player')}
              className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded cursor-pointer border border-transparent hover:border-slate-700 transition"
            >
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-lg overflow-hidden">
                {result.image ? <img src={urlFor(result.image).width(50).url()} className="w-full h-full object-cover"/> : (result._type === 'player' ? '👤' : '👾')}
              </div>
              <div>
                <div className="font-bold text-sm">{result.name}</div>
                <div className="text-xs text-slate-500 capitalize">{result._type}</div>
              </div>
              <div className="ml-auto text-xs font-mono text-slate-400">
                {result._type === 'monster' ? `CR ${result.stats?.challenge}` : `Niv ${result.level || '?'}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALE FICHE TECHNIQUE */}
      <Modal 
        isOpen={!!selectedFighter} 
        onClose={() => setSelectedFighter(null)}
        title={selectedFighter?.name || "Chargement..."}
      >
        {selectedFighter?.loading ? (
          <div className="p-10 text-center">Chargement des données arcaniques... 🔮</div>
        ) : (
          <StatBlock data={selectedFighter} />
        )}
      </Modal>
    </div>
  )
}