"use client"

import { useState, useEffect } from "react"
import { client, urlFor } from "../../lib/sanity"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { StatusList } from "../../components/tracker/StatusIcon"
import { HealthBar } from "../../components/tracker/HealthBar"
import { useCombatTracker } from "../../hooks/useCombatTracker"
import { Modal } from "../../components/ui/Modal"
import { StatBlock } from "../../components/ui/StatBlock"
import { calculateDamage, calculateHeal, sortCombatants, calculateNextTurn } from "../../lib/combat"

// Types locaux (doivent correspondre à ce que le hook et lib/combat attendent)
type Combatant = {
  id: string
  sanityId?: string 
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
  const { 
    combatants, setCombatants, 
    turnIndex, setTurnIndex, 
    round, setRound,
    isLoaded 
  } = useCombatTracker()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // État pour la modale
  const [selectedFighter, setSelectedFighter] = useState<any>(null)

  // --- LOGIQUE DE COMBAT ---

  const nextTurn = () => {
    const { index, newRound } = calculateNextTurn(turnIndex, combatants.length)
    setTurnIndex(index)
    if (newRound) setRound(r => r + 1)
  }

  const handleSort = () => {
    // Utilisation de la fonction importée + reset du tour
    const sorted = sortCombatants(combatants as any) // Cast any si interface diffère légèrement
    setCombatants(sorted as Combatant[])
    setTurnIndex(0)
  }

  const updateCombatant = (id: string, updates: Partial<Combatant>) => {
    setCombatants(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const removeCombatant = (id: string) => {
    setCombatants(prev => prev.filter(c => c.id !== id))
  }

  const damageCombatant = (id: string, amount: number) => {
    setCombatants(prev => prev.map(c => {
      if (c.id !== id) return c
      return { ...c, hp: calculateDamage(c.hp, amount) }
    }))
  }

  const healCombatant = (id: string, amount: number) => {
    setCombatants(prev => prev.map(c => {
      if (c.id !== id) return c
      return { ...c, hp: calculateHeal(c.hp, c.hpMax, amount) }
    }))
  }

  // --- LOGIQUE D'AJOUT ---

  const addCombatant = (template: any, type: 'monster' | 'player' | 'npc') => {
    let hp = 10, maxHp = 10, ac = 10, initBonus = 0;

    // Normalisation des stats selon le type
    if (template._type === 'player') {
      hp = template.hpMax || 10;
      maxHp = template.hpMax || 10;
      ac = template.ac || 10;
      initBonus = template.initBonus || 0;
    
    } else if (template._type === 'monster') {
      const parsedHp = parseInt(template.stats?.hp) || 10;
      hp = parsedHp; maxHp = parsedHp;
      ac = template.stats?.ac || 10;
      const dex = template.stats?.attributes?.dex || 10;
      initBonus = Math.floor((dex - 10) / 2);
    
    } else if (template._type === 'npc') {
      if (template.combatType === 'custom' && template.customStats) {
        hp = parseInt(template.customStats.hp) || 10;
        maxHp = hp;
        ac = template.customStats.ac || 10;
      } else if (template.combatType === 'template' && template.monsterTemplate) {
        const mStats = template.monsterTemplate.stats;
        hp = parseInt(mStats?.hp) || 10;
        maxHp = hp;
        ac = mStats?.ac || 10;
        const dex = mStats?.attributes?.dex || 10;
        initBonus = Math.floor((dex - 10) / 2);
      }
    }

    const count = combatants.filter(c => c.name.startsWith(template.name)).length;
    const name = count > 0 ? `${template.name} ${count + 1}` : template.name;

    const newFighter: Combatant = {
      id: Math.random().toString(36).substr(2, 9),
      sanityId: template._id,
      name: name,
      type: type,
      faction: type === 'player' ? 'friendly' : 'hostile',
      initiative: Math.floor(Math.random() * 20) + 1 + initBonus,
      hp: hp,
      hpMax: maxHp,
      ac: ac,
      conditions: [],
      avatar: template.image
    };

    setCombatants([...combatants, newFighter]);
    setSearchQuery("");
    setSearchResults([]);
  };

  // --- RECHERCHE SANITY ---
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      const results = await client.fetch(`
        *[_type in ["monster", "player", "npc"] && name match $q + "*"][0...10]{
          _id, _type, name, image,
          stats { hp, ac, attributes },
          hpMax, ac, initBonus,
          combatType,
          customStats { hp, ac },
          monsterTemplate->{ stats { hp, ac, attributes } }
        }
      `, { q: searchQuery })
      setSearchResults(results)
      setIsSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // --- CHARGEMENT DÉTAILS MODALE ---
  const openFighterDetails = async (fighter: Combatant) => {
    if (!fighter.sanityId) return;
    
    setSelectedFighter({ loading: true, name: fighter.name });

    const fullData = await client.fetch(`*[_id == $id][0]{
      ...,
      inventory[]->{ name, type, isMagic, rarity, description },
      spells[]->{ name, level, school, description },
      monsterTemplate->{ ..., stats }
    }`, { id: fighter.sanityId });

    setSelectedFighter(fullData);
  }

  // --- RENDU ---

  if (!isLoaded) return null; // Hydration fix

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col md:flex-row gap-6">
      
      {/* COLONNE GAUCHE : LISTE */}
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
            <button onClick={handleSort} className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded text-sm transition">
              ⚡ Trier
            </button>
            <button onClick={() => { if(confirm('Tout vider ?')) setCombatants([]) }} className="bg-red-900/50 hover:bg-red-900 px-3 py-2 rounded text-sm text-red-200 transition">
              🗑️
            </button>
          </div>
        </div>

        {/* LISTE */}
        <div className="space-y-3">
          {combatants.map((c, index) => (
            <div 
              key={c.id} 
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-300
                ${index === turnIndex ? 'border-purple-500 bg-slate-800 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-[1.02] z-10' : 'border-slate-800 bg-slate-900 opacity-90'}
                ${c.hp === 0 ? 'opacity-50 grayscale' : ''}
              `}
            >
              <div className="flex items-center gap-4">
                
                {/* INIT */}
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 
                      onClick={() => openFighterDetails(c)}
                      className={`font-bold text-lg cursor-pointer hover:underline decoration-dashed underline-offset-4 truncate ${c.faction === 'hostile' ? 'text-red-400' : c.faction === 'friendly' ? 'text-green-400' : 'text-yellow-400'}`}
                    >
                      {c.name}
                    </h3>
                    <button 
                      onClick={() => updateCombatant(c.id, { faction: c.faction === 'hostile' ? 'friendly' : c.faction === 'friendly' ? 'neutral' : 'hostile' })}
                      className="text-xs opacity-30 hover:opacity-100"
                      title="Changer de camp"
                    >
                      🔄
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mt-1">
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      🛡️ <input className="bg-transparent w-6 text-center border-b border-slate-700 focus:border-white outline-none" value={c.ac} onChange={(e) => updateCombatant(c.id, { ac: parseInt(e.target.value) })} />
                    </span>
                    
                    <select 
                      className="bg-slate-950 text-xs border border-slate-700 rounded px-1 py-0.5 outline-none focus:border-slate-500"
                      onChange={(e) => {
                        if(e.target.value && !c.conditions.includes(e.target.value)) 
                          updateCombatant(c.id, { conditions: [...c.conditions, e.target.value] })
                        e.target.value = ""
                      }}
                    >
                      <option value="">+ État</option>
                      <option value="blinded">Aveuglé</option>
                      <option value="charmed">Charmé</option>
                      <option value="frightened">Effrayé</option>
                      <option value="grappled">Agrippé</option>
                      <option value="paralyzed">Paralysé</option>
                      <option value="poisoned">Empoisonné</option>
                      <option value="prone">À terre</option>
                      <option value="restrained">Entravé</option>
                      <option value="stunned">Étourdi</option>
                      <option value="unconscious">Inconscient</option>
                    </select>
                  </div>
                  
                  <StatusList 
                    conditions={c.conditions} 
                    onRemove={(cond: string) => updateCombatant(c.id, { conditions: c.conditions.filter((x: string) => x !== cond) })} 
                  />
                </div>

                {/* PV & CONTROLES */}
                <div className="w-36 flex flex-col gap-1">
                  <div className="flex justify-between text-sm font-bold items-center">
                    <span className={c.hp < c.hpMax / 2 ? 'text-red-500' : 'text-green-500'}>{c.hp}</span>
                    <span className="text-slate-600 text-xs">/ {c.hpMax}</span>
                    
                    {/* BOUTON SUPPRIMER */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(confirm("Retirer ?")) removeCombatant(c.id); }}
                      className="ml-2 text-slate-700 hover:text-red-500 transition"
                    >
                      ✖
                    </button>
                  </div>
                  
                  <HealthBar current={c.hp} max={c.hpMax} />
                  
                  <div className="flex gap-1 mt-1">
                    <button onClick={() => damageCombatant(c.id, 1)} className="flex-1 bg-red-900/30 hover:bg-red-900/60 text-red-200 text-xs rounded py-1 transition">-1</button>
                    <button onClick={() => damageCombatant(c.id, 5)} className="flex-1 bg-red-900/50 hover:bg-red-900/80 text-red-200 text-xs rounded py-1 transition">-5</button>
                    <button onClick={() => healCombatant(c.id, 5)} className="flex-1 bg-green-900/30 hover:bg-green-900/60 text-green-200 text-xs rounded py-1 transition">+5</button>
                  </div>
                </div>

              </div>
            </div>
          ))}
          
          {combatants.length === 0 && (
            <div className="text-center py-20 text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
              Le champ de bataille est vide...
            </div>
          )}
        </div>
      </div>

      {/* COLONNE DROITE : AJOUTER */}
      <div className="w-full md:w-80 bg-slate-900 p-4 rounded-xl border border-slate-800 h-fit sticky top-24 shadow-xl">
        <h3 className="font-bold text-slate-300 mb-4 uppercase text-sm tracking-wider border-b border-slate-800 pb-2">Ajouter</h3>
        
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg focus:border-purple-500 focus:outline-none mb-4 transition"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isSearching && <p className="text-center text-slate-500 text-sm animate-pulse">Recherche...</p>}

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
          {searchResults.map((result: any) => (
            <div 
              key={result._id} 
              onClick={() => addCombatant(result, result._type as any)}
              className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded cursor-pointer border border-transparent hover:border-slate-700 transition group"
            >
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-lg overflow-hidden shrink-0">
                {result.image ? <img src={urlFor(result.image).width(50).url()} className="w-full h-full object-cover"/> : (result._type === 'player' ? '🛡️' : result._type === 'npc' ? '👤' : '👾')}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm truncate group-hover:text-purple-300 transition">{result.name}</div>
                <div className="text-[10px] text-slate-500 capitalize">{result._type === 'npc' ? 'PNJ' : result._type}</div>
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
          <div className="p-10 text-center text-slate-500 animate-pulse">Chargement des données... 🔮</div>
        ) : (
          <StatBlock data={selectedFighter} />
        )}
      </Modal>

    </div>
  )
}