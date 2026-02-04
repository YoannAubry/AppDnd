import { client, urlFor } from "@/lib/sanity"
import Link from "next/link"
import { ActView } from "@/components/campaign/ActView"
import { AdminToolbar } from "@/components/ui/adminToolbar"

async function getCampaign(slug: string) {
  return await client.fetch(`
    *[_type == "campaign" && slug.current == $slug][0]{
      _id, title, level, synopsis, image,
      acts[]{
        _key, title, summary,
        locations[]->{
          _id, name, image, description,
          npcs[]->{ _id, name, role, image, faction->{name} },
          monsters[]->{ _id, name, image, "slug": slug.current, "cr": stats.challenge }
        }
      }
    }
  `, { slug })
}

export default async function CampaignDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const campaign = await getCampaign(params.slug)

  if (!campaign) return (
    <div className="p-20 text-center">
      <h1 className="text-2xl mb-4 text-[var(--text-muted)]">Campagne introuvable 🤷‍♂️</h1>
      <Link href="/campaigns" className="text-[var(--accent-primary)] hover:underline">Retour à la bibliothèque</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-serif pb-20">
      
      {/* HEADER HERO */}
      <div className="relative h-[40vh] bg-black overflow-hidden shadow-2xl border-b-4 border-[var(--border-accent)]">
        {campaign.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={urlFor(campaign.image).width(1200).url()} 
            className="w-full h-full object-cover opacity-60"
            alt="Cover"
          />
        )}
        {/* Dégradé noir pour la lisibilité du titre */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-center md:text-left">
          <div className="max-w-5xl mx-auto">
            <span className="bg-[var(--accent-primary)] text-[var(--bg-main)] px-3 py-1 rounded text-sm font-sans font-bold shadow mb-4 inline-block">
              NIVEAU {campaign.level}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-2 tracking-wide">{campaign.title}</h1>
          </div>
        </div>

        <Link href="/campaigns" className="absolute top-6 left-6 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm transition font-sans text-sm font-bold border border-white/10 flex items-center gap-2">
          ← Retour
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 mt-8">
        
        {/* SYNOPSIS */}
        <div className="bg-[var(--bg-card)] p-8 rounded-lg shadow-md border border-[var(--border-main)] mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent-primary)]"></div>
          <h2 className="text-xl font-bold text-[var(--accent-primary)] mb-3 uppercase tracking-widest font-sans">Synopsis</h2>
          <p className="text-lg leading-relaxed text-[var(--text-main)] italic font-serif opacity-90">
            "{campaign.synopsis}"
          </p>
        </div>

        {/* ACTES */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-muted)] uppercase tracking-widest font-sans border-b border-[var(--border-main)] pb-2 mb-8">
            Déroulement de l'aventure
          </h2>
          
          {campaign.acts?.map((act: any, i: number) => (
            <ActView key={act._key || i} act={act} index={i} />
          ))}

          {(!campaign.acts || campaign.acts.length === 0) && (
            <p className="text-center text-[var(--text-muted)] py-10 italic">Cette aventure est encore une page blanche...</p>
          )}
        </div>

      </div>

      <AdminToolbar 
        id={campaign._id} 
        editUrl={`/campaigns/${params.slug}/edit`} 
        type="campaign" 
      />
    </div>
  )
}