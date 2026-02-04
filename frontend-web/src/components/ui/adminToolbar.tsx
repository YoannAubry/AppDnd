"use client"
import Link from "next/link"
import { deleteMonsterAction } from "../../app/actions/bestiary"
import { deleteNPCAction } from "../../app/actions/npc" 
import { deleteLocationAction } from "../../app/actions/location"

interface AdminToolbarProps {
  id: string
  editUrl: string
  type: 'monster' | 'npc' | 'location'
}

export function AdminToolbar({ id, editUrl, type }: AdminToolbarProps) {
  
  const handleDelete = async () => {
    if (confirm("⚠️ Vraiment supprimer ?")) {
      if (type === 'monster') {
        await deleteMonsterAction(id)
      } else if (type === 'npc') {
        await deleteNPCAction(id)
      } else if (type === 'location') {
        await deleteLocationAction(id)
      } 
    }
  }

  return (
    <div className="fixed bottom-8 right-8 flex gap-4 z-50">
      <Link 
        href={editUrl} 
        className="bg-blue-600 hover:bg-blue-500 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl transition hover:scale-110 hover:rotate-12 border-2 border-blue-400" 
        title="Modifier"
      >
        ✏️
      </Link>
      
      <button 
        onClick={handleDelete} 
        className="bg-red-600 hover:bg-red-500 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl transition hover:scale-110 hover:rotate-12 border-2 border-red-400" 
        title="Supprimer"
      >
        🗑️
      </button>
    </div>
  )
}