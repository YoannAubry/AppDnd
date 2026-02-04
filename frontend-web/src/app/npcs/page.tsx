import { NPC } from "@/types"
import { client, urlFor } from "../../lib/sanity"
import Link from "next/link"

async function getNPCs() {
  return await client.fetch(`*[_type == "npc"] | order(name asc) {
    _id, name, role, image, faction->{name}
  }`)
}

export default async function NPCsPage() {
  const npcs = await getNPCs()

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-background text-[var(--text-main)]">
      <div className="flex justify-between items-end mb-8 border-b border-[var(--border-main)] pb-6">
        <h1 className="text-4xl font-bold text-blue-400">👤 Personnages (PNJ)</h1>
        <Link href="/npcs/new" className="bg-green-600 hover:bg-green-500 text-[var(--text-main)] px-4 py-2 rounded-lg font-bold">
          + Nouveau
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {npcs.map((npc: NPC) => (
          <Link href={`/npcs/${npc._id}`} key={npc._id}>
            <div className="theme-card border border-[var(--border-main)] rounded-xl p-4 flex items-center gap-4 hover:border-blue-500 transition cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-input overflow-hidden border border-[var(--border-main)]">
                {npc.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={urlFor(npc.image).width(200).url()} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-main)]">{npc.name}</h3>
                <p className="text-sm text-[var(--text-muted)]">{npc.role}</p>
                {npc.faction && <span className="text-xs text-blue-400">{npc.faction.name}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}