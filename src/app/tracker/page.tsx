"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { StatusList } from "@/components/tracker/StatusIcon"
import { HealthBar } from "@/components/tracker/HealthBar"
import { useCombatTracker } from "@/hooks/useCombatTracker"
import { Modal } from "@/components/ui/Modal"
import { StatBlock } from "@/components/ui/StatBlock"
import { calculateDamage, calculateHeal, sortCombatants, calculateNextTurn } from "@/lib/combat"
import { searchEntities, getEntityById } from "@/app/actions/getters"


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
  const [selectedFighter, setSelectedFighter] = useState<any>(null)
  
  // État pour afficher la recherche sur mobile
  const [showAddPanel, setShowAddPanel] = useState(false)

  // --- LOGIQUE (Identique) ---
  const nextTurn = () => {
    const { index, newRound } = calculateNextTurn(turnIndex, combatants.length)
    setTurnIndex(index)
    if (newRound) setRound(r => r + 1)
  }

  const handleSort = () => {
    const sorted = sortCombatants(combatants as any)
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

  const addCombatant = (template: any, type: 'monster' | 'player' | 'npc') => {
    let hp = 10, maxHp = 10, ac = 10, initBonus = 0;

    if (template._type === 'player') {
      hp = template.hpMax || 10; maxHp = hp; ac = template.ac || 10; initBonus = template.initBonus || 0;
    } else if (template._type === 'monster') {
      const parsedHp = parseInt(template.stats?.hp) || 10;
      hp = parsedHp; maxHp = parsedHp; ac = template.stats?.ac || 10;
      const dex = template.stats?.attributes?.dex || 10;
      initBonus = Math.floor((dex - 10) / 2);
    } else if (template._type === 'npc') {
      if (template.combatType === 'custom' && template.customStats) {
        hp = parseInt(template.customStats.hp) || 10; maxHp = hp; ac = template.customStats.ac || 10;
      } else if (template.combatType === 'template' && template.monsterTemplate) {
        const mStats = template.monsterTemplate.stats;
        hp = parseInt(mStats?.hp) || 10; maxHp = hp; ac = mStats?.ac || 10;
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
      hp: hp, hpMax: maxHp, ac: ac, conditions: [], avatar: template.image
    };

    setCombatants([...combatants, newFighter]);
    setSearchQuery("");
    setSearchResults([]);
    setShowAddPanel(false); // Fermer le panneau mobile après ajout
  };

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      // Appel à l'action serveur
      const results = await searchEntities(searchQuery)
      setSearchResults(results)
      setIsSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const openFighterDetails = async (fighter: Combatant) => {
    if (!fighter.sanityId) return;
    setSelectedFighter({ loading: true, name: fighter.name });
    const fullData = await getEntityById(fighter.sanityId, fighter.type);
    setSelectedFighter(fullData);
  }

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-2 md:p-8 flex flex-col md:flex-row gap-6 relative">
      
      {/* COLONNE GAUCHE : LISTE */}
      <div className="flex-1">
        
        {/* BARRE D'OUTILS MOBILE RESPONSIVE */}
        <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-main)] mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg sticky top-16 z-20">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="text-center">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Round</span>
              <div className="text-2xl font-bold text-[var(--text-main)]">{round}</div>
            </div>
            <button onClick={nextTurn} className="theme-btn-primary flex-1 sm:flex-none text-center shadow-lg transform active:scale-95 transition">
              Tour Suivant ➜
            </button>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleSort} className="bg-[var(--bg-input)] hover:bg-[var(--bg-main)] border border-[var(--border-main)] px-3 py-2 rounded text-sm transition flex-1 sm:flex-none text-center">
              ⚡ Trier
            </button>
            <button onClick={() => { if(confirm('Tout vider ?')) setCombatants([]) ; setRound(1) ; setTurnIndex(0) }} className="bg-red-900/20 hover:bg-red-900/40 border border-red-900/30 px-3 py-2 rounded text-sm text-red-400 transition">
              🗑️
            </button>
          </div>
        </div>

        {/* LISTE DES COMBATTANTS */}
        <div className="space-y-3 pb-20 md:pb-0">
          {combatants.map((c, index) => (
            <div 
              key={c.id} 
              className={`
                relative p-3 md:p-4 rounded-lg border-2 transition-all duration-300
                ${index === turnIndex ? 'border-[var(--accent-primary)] bg-[var(--bg-card)] shadow-lg scale-[1.01] z-10' : 'border-[var(--border-main)] bg-[var(--bg-card)] opacity-90'}
                ${c.hp === 0 ? 'opacity-50 grayscale' : ''}
              `}
            >
              {/* LAYOUT MOBILE : Flex-col / Desktop : Flex-row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                
                {/* LIGNE 1 MOBILE : INIT + NOM + BOUTONS */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                   {/* INIT */}
                   <div className="flex flex-col items-center">
                    <span className="text-[8px] text-[var(--text-muted)] font-bold">INIT</span>
                    <input 
                      type="number" 
                      value={c.initiative} 
                      onChange={(e) => updateCombatant(c.id, { initiative: parseInt(e.target.value) || 0 })}
                      className="w-10 h-10 text-center bg-[var(--bg-input)] border border-[var(--border-main)] rounded font-bold text-lg focus:border-[var(--accent-primary)] outline-none"
                    />
                  </div>

                  {/* NOM */}
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
                        className="text-xs opacity-30 hover:opacity-100" title="Changer de camp"
                      >
                        🔄
                      </button>
                    </div>
                    {/* Infos Desktop seulement ici pour gagner place mobile */}
                    <div className="hidden sm:flex items-center gap-4 text-sm text-[var(--text-muted)] mt-1">
                       <span className="whitespace-nowrap">🛡️ {c.ac}</span>
                    </div>
                  </div>

                  {/* BOUTON DELETE (Mobile : en haut à droite) */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm("Retirer ?")) removeCombatant(c.id); }}
                    className="sm:hidden text-[var(--text-muted)] hover:text-red-500 p-2"
                  >
                    ✖
                  </button>
                </div>

                {/* LIGNE 2 MOBILE (STATS) */}
                <div className="w-full sm:flex-1">
                   {/* CA & STATUTS (Visible Mobile) */}
                   <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)] mb-2 sm:mb-0">
                      <span className="sm:hidden flex items-center gap-1">🛡️ {c.ac}</span>
                      <select 
                        className="bg-[var(--bg-input)] text-xs border border-[var(--border-main)] rounded px-1 py-0.5 outline-none focus:border-[var(--accent-primary)] w-full sm:w-auto"
                        onChange={(e) => {
                          if(e.target.value && !c.conditions.includes(e.target.value)) 
                            updateCombatant(c.id, { conditions: [...c.conditions, e.target.value] })
                          e.target.value = ""
                        }}
                      >
                        <option value="">+ État</option>
                        <option value="blinded">Aveuglé</option>
                        <option value="charmed">Charmé</option>
                        {/* ... autres ... */}
                      </select>
                   </div>
                   <StatusList 
                      conditions={c.conditions} 
                      onRemove={(cond: string) => updateCombatant(c.id, { conditions: c.conditions.filter((x: string) => x !== cond) })} 
                    />
                </div>

                {/* LIGNE 3 MOBILE : PV */}
                <div className="w-full sm:w-36 flex flex-col gap-1 border-t sm:border-t-0 border-[var(--border-main)] pt-2 sm:pt-0">
                  <div className="flex justify-between text-sm font-bold items-center">
                    <span className={c.hp < c.hpMax / 2 ? 'text-red-500' : 'text-green-500'}>{c.hp}</span>
                    <span className="text-[var(--text-muted)] text-xs">/ {c.hpMax}</span>
                    {/* Delete Desktop */}
                    <button onClick={() => removeCombatant(c.id)} className="hidden sm:block ml-2 text-[var(--text-muted)] hover:text-red-500">✖</button>
                  </div>
                  
                  <HealthBar current={c.hp} max={c.hpMax} />
                  
                  <div className="flex gap-1 mt-1">
                    <button onClick={() => damageCombatant(c.id, 1)} className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 text-xs rounded py-1">-1</button>
                    <button onClick={() => damageCombatant(c.id, 5)} className="flex-1 bg-red-900/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 text-xs rounded py-1">-5</button>
                    <button onClick={() => healCombatant(c.id, 5)} className="flex-1 bg-green-900/20 hover:bg-green-900/40 text-green-400 border border-green-900/30 text-xs rounded py-1">+5</button>
                  </div>
                </div>

              </div>
            </div>
          ))}
          
          {combatants.length === 0 && (
            <div className="text-center py-20 text-[var(--text-muted)] border-2 border-dashed border-[var(--border-main)] rounded-xl opacity-50">
              Le champ de bataille est vide...
            </div>
          )}
        </div>
      </div>

      {/* BOUTON FLOTTANT MOBILE (POUR OUVRIR LA RECHERCHE) */}
      <button 
        onClick={() => setShowAddPanel(!showAddPanel)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[var(--accent-primary)] text-[var(--accent-text)] rounded-full shadow-2xl flex items-center justify-center text-3xl font-bold z-30 transition-transform hover:scale-110"
      >
        {showAddPanel ? '✕' : '+'}
      </button>

      {/* COLONNE DROITE : AJOUTER (Responsive : Tiroir sur mobile, Colonne sur Desktop) */}
      <div className={`
        fixed md:sticky md:top-24 top-0 right-0 h-full md:h-fit w-80 md:w-80 
        bg-[var(--bg-card)] md:bg-[var(--bg-card)] 
        border-l md:border border-[var(--border-main)] md:rounded-xl 
        p-4 shadow-2xl md:shadow-xl z-40 transition-transform duration-300
        ${showAddPanel ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="flex justify-between items-center mb-4 border-b border-[var(--border-main)] pb-2">
          <h3 className="font-bold text-[var(--text-muted)] uppercase text-sm tracking-wider">Ajouter</h3>
          <button onClick={() => setShowAddPanel(false)} className="md:hidden text-[var(--text-muted)] text-xl">✕</button>
        </div>
        
        <input 
          type="text" 
          placeholder="Rechercher..." 
          className="theme-input w-full mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus={showAddPanel}
        />

        {isSearching && <p className="text-center text-[var(--text-muted)] text-sm animate-pulse">Recherche...</p>}

        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {searchResults.map((result: any) => (
            <div 
              key={result._id} 
              onClick={() => addCombatant(result, result._type as any)}
              className="flex items-center gap-3 p-2 hover:bg-[var(--bg-input)] rounded cursor-pointer border border-transparent hover:border-[var(--border-main)] transition group"
            >
              <div className="w-8 h-8 bg-[var(--bg-input)] rounded-full flex items-center justify-center text-lg overflow-hidden shrink-0 border border-[var(--border-main)]">
                {result.image ? <img src={result.image} className="w-full h-full object-cover"/> : (result._type === 'player' ? '🛡️' : result._type === 'npc' ? '👤' : '👾')}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm truncate group-hover:text-[var(--accent-primary)] transition">{result.name}</div>
                <div className="text-[10px] text-[var(--text-muted)] capitalize">{result._type === 'npc' ? 'PNJ' : result._type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OVERLAY MOBILE POUR FERMER LE PANEL */}
      {showAddPanel && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setShowAddPanel(false)}></div>
      )}

      {/* MODALE FICHE TECHNIQUE */}
      <Modal 
        isOpen={!!selectedFighter} 
        onClose={() => setSelectedFighter(null)}
        title={selectedFighter?.name || "Chargement..."}
      >
        {selectedFighter?.loading ? (
          <div className="p-10 text-center text-[var(--text-muted)] animate-pulse">Chargement des données... 🔮</div>
        ) : (
          <StatBlock data={selectedFighter} />
        )}
      </Modal>

    </div>
  )
}