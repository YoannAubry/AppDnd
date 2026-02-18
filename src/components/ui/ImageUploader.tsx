"use client"
import { useState, useRef } from "react"
import { uploadImageAction } from "@/app/actions/upload"

interface ImageUploaderProps {
  name: string
  defaultValue?: string | null
  label?: string
}

export function ImageUploader({ name, defaultValue, label = "Image" }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Champ caché pour stocker l'URL finale qui sera envoyée au formulaire parent
  // C'est l'astuce pour que ça marche avec tes formulaires existants sans tout réécrire
  const [finalUrl, setFinalUrl] = useState(defaultValue || "")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview locale immédiate
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setUploading(true)

    try {
      // Envoi au serveur
      const formData = new FormData()
      formData.append("file", file)
      
      const serverUrl = await uploadImageAction(formData)
      
      // Succès : on met à jour l'URL finale (celle qui sera sauvée en BDD)
      setFinalUrl(serverUrl)
    } catch (err) {
      console.error("Upload failed", err)
      alert("Erreur lors de l'upload")
      setPreview(defaultValue || null) // Rollback
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-[var(--text-muted)] uppercase tracking-wide">{label}</label>
      
      {/* Input caché pour le formulaire parent */}
      <input type="hidden" name={name} value={finalUrl} />

      <div 
        className="relative w-full h-48 bg-[var(--bg-input)] border-2 border-dashed border-[var(--border-main)] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent-primary)] transition overflow-hidden group"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="w-full h-full object-contain" />
        ) : (
          <div className="text-center p-4">
            <span className="text-4xl block mb-2">📷</span>
            <span className="text-xs text-[var(--text-muted)]">Cliquez pour ajouter une image</span>
          </div>
        )}

        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <span className="text-white font-bold text-sm">Changer l'image</span>
        </div>

        {/* Loader */}
        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  )
}