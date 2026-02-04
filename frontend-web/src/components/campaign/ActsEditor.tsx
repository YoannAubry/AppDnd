"use client"
import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Location { _id: string, name: string }
interface Act { id: string, title: string, summary: string, locationIds: string[] }

// --- SOUS-COMPOSANT : UN ACTE (Ligne déplaçable) ---
function SortableActItem({ act, index, allLocations, onUpdate, onRemove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: act.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleLocation = (locId: string) => {
    const currentIds = act.locationIds || []
    const newIds = currentIds.includes(locId) 
      ? currentIds.filter((id:string) => id !== locId)
      : [...currentIds, locId]
    onUpdate(index, 'locationIds', newIds)
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-slate-900 border border-slate-800 rounded-lg p-4 relative group mb-4 shadow-sm">
      
      {/* POIGNÉE DE DÉPLACEMENT */}
      <div {...attributes} {...listeners} className="absolute top-4 left-4 text-slate-600 cursor-grab hover:text-slate-400 p-1 text-xl select-none" title="Déplacer">
        ↕
      </div>

      <button type="button" onClick={() => onRemove(act.id)} className="absolute top-2 right-2 text-slate-600 hover:text-red-500 font-bold px-2 text-xl">
        ×
      </button>
      
      <div className="ml-10 grid gap-3 mb-4">
        <input 
          value={act.title} 
          onChange={(e) => onUpdate(index, 'title', e.target.value)}
          className="bg-transparent border-b border-slate-700 font-bold text-lg text-white focus:outline-none focus:border-purple-500 w-full placeholder-slate-600"
          placeholder={`Titre de l'Acte ${index + 1}`}
        />
        <textarea 
          value={act.summary}
          onChange={(e) => onUpdate(index, 'summary', e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-300 h-20 w-full resize-none placeholder-slate-600 focus:outline-none focus:border-purple-500"
          placeholder="Résumé rapide de ce qui se passe..."
        />
      </div>

      {/* SÉLECTION DES LIEUX (TAGS) */}
      <div className="ml-10">
        <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">Lieux visités</label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {allLocations.map((loc:any) => (
            <button
              key={loc._id}
              type="button"
              onClick={() => toggleLocation(loc._id)}
              className={`text-xs px-2 py-1 rounded border transition ${
                act.locationIds?.includes(loc._id) 
                  ? 'bg-purple-600 border-purple-500 text-white' 
                  : 'bg-slate-950 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL (LISTE) ---
export function ActsEditor({ initialActs, allLocations }: { initialActs: any[], allLocations: Location[] }) {
  // On s'assure que chaque acte a un ID unique pour le drag & drop
  const [acts, setActs] = useState<Act[]>(
    initialActs.map(a => ({
      ...a, 
      id: a._key || Math.random().toString(36), // ID stable
      locationIds: a.locations?.map((l:any) => l._ref || l._id) || [] // Extraction des IDs si on vient de Sanity
    }))
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setActs((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addAct = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setActs([...acts, { id: newId, title: "", summary: "", locationIds: [] }])
  }

  const removeAct = (id: string) => {
    setActs(acts.filter(a => a.id !== id))
  }

  const updateAct = (index: number, field: keyof Act, value: any) => {
    const newActs = [...acts]
    // @ts-ignore
    newActs[index][field] = value
    setActs(newActs)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-700 pb-2">
        <h3 className="text-lg font-bold text-slate-300 uppercase tracking-wide">Structure de l'histoire</h3>
        <button type="button" onClick={addAct} className="bg-slate-800 hover:bg-slate-700 text-green-400 px-3 py-1 rounded text-sm font-bold border border-slate-700 hover:border-green-500 transition">
          + Ajouter un Acte
        </button>
      </div>

      {/* Input caché qui sera envoyé au serveur */}
      <input type="hidden" name="acts" value={JSON.stringify(acts)} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={acts.map(a => a.id)} strategy={verticalListSortingStrategy}>
          {acts.map((act, index) => (
            <SortableActItem 
              key={act.id} 
              act={act} 
              index={index} 
              allLocations={allLocations}
              onUpdate={updateAct}
              onRemove={removeAct}
            />
          ))}
        </SortableContext>
      </DndContext>
      
      {acts.length === 0 && <p className="text-center text-slate-600 italic py-4">L'histoire est encore vide.</p>}
    </div>
  )
}