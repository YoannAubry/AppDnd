"use client"
import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Location { _id: string, name: string }
interface Act { id: string, title: string, summary: string, locationIds: string[] }

function SortableActItem({ act, index, allLocations, onUpdate, onRemove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: act.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const toggleLocation = (locId: string) => {
    const currentIds = act.locationIds || []
    const newIds = currentIds.includes(locId) 
      ? currentIds.filter((id:string) => id !== locId)
      : [...currentIds, locId]
    onUpdate(index, 'locationIds', newIds)
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-lg p-4 relative group mb-4 shadow-sm">
      
      <div {...attributes} {...listeners} className="absolute top-4 left-4 text-[var(--text-muted)] cursor-grab hover:text-[var(--text-main)] p-1 text-xl select-none" title="Déplacer">
        ↕
      </div>

      <button type="button" onClick={() => onRemove(act.id)} className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-red-500 font-bold px-2 text-xl">×</button>
      
      <div className="ml-10 grid gap-3 mb-4">
        <input 
          value={act.title} 
          onChange={(e) => onUpdate(index, 'title', e.target.value)}
          className="bg-transparent border-b border-[var(--border-main)] font-bold text-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)] w-full placeholder-[var(--text-muted)]"
          placeholder={`Titre de l'Acte ${index + 1}`}
        />
        <textarea 
          value={act.summary}
          onChange={(e) => onUpdate(index, 'summary', e.target.value)}
          className="bg-[var(--bg-input)] border border-[var(--border-main)] rounded p-2 text-sm text-[var(--text-main)] h-20 w-full resize-none placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
          placeholder="Résumé rapide de ce qui se passe..."
        />
      </div>

      <div className="ml-10">
        <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-2 block">Lieux visités</label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {allLocations.map((loc:any) => (
            <button
              key={loc._id}
              type="button"
              onClick={() => toggleLocation(loc._id)}
              className={`text-xs px-2 py-1 rounded border transition ${
                act.locationIds?.includes(loc._id) 
                  ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-text)]' 
                  : 'bg-[var(--bg-input)] border-[var(--border-main)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
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

export function ActsEditor({ initialActs, allLocations }: { initialActs: any[], allLocations: Location[] }) {
  const [acts, setActs] = useState<Act[]>(
    initialActs.map(a => ({
      ...a, 
      id: a._key || Math.random().toString(36),
      locationIds: a.locations?.map((l:any) => l._ref || l._id) || []
    }))
  )
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

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
  const removeAct = (id: string) => setActs(acts.filter(a => a.id !== id))
  const updateAct = (index: number, field: keyof Act, value: any) => {
    const newActs = [...acts]; // @ts-ignore
    newActs[index][field] = value;
    setActs(newActs)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-[var(--border-main)] pb-2">
        <h3 className="text-lg font-bold text-[var(--text-main)] uppercase tracking-wide">Structure de l'histoire</h3>
        <button type="button" onClick={addAct} className="bg-[var(--bg-input)] hover:bg-[var(--bg-card)] text-[var(--accent-primary)] px-3 py-1 rounded text-sm font-bold border border-[var(--border-main)] transition">
          + Ajouter un Acte
        </button>
      </div>

      <input type="hidden" name="acts" value={JSON.stringify(acts)} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={acts.map(a => a.id)} strategy={verticalListSortingStrategy}>
          {acts.map((act, index) => (
            <SortableActItem key={act.id} act={act} index={index} allLocations={allLocations} onUpdate={updateAct} onRemove={removeAct} />
          ))}
        </SortableContext>
      </DndContext>
      
      {acts.length === 0 && <p className="text-center text-[var(--text-muted)] italic py-4">L'histoire est encore vide.</p>}
    </div>
  )
}