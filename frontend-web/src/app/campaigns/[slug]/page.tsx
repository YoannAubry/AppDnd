import { client, urlFor } from "../../../lib/sanity"
import Link from "next/link"
import { ActView } from "../../../components/campaign/ActView" 
import { AdminToolbar } from "../../../components/ui/adminToolbar"


// GROQ Query : On va chercher la campagne ET on "déroule" les références (Lieux -> PNJ -> Monstres)
async function getCampaign(slug: string) {
  return await client.fetch(`
    *[_type == "campaign" && slug.current == $slug][0]{
      title,
      level,
      synopsis,
      image,
      acts[]{
        _key,
        title,
        summary,
        locations[]->{
          name,
          description,
          npcs[]->{ name, role, faction->{name} },
          monsters[]->{ name, "slug": slug.current, "cr": stats.challenge }
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
      <h1 className="text-2xl mb-4">Campagne introuvable 🤷‍♂️</h1>
      <Link href="/campaigns" className="text-purple-400 hover:underline">Retour à la bibliothèque</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fdf1dc] text-slate-900 font-serif pb-20">
      
      {/* HEADER HERO */}
      <div className="relative h-[40vh] bg-slate-900 overflow-hidden shadow-2xl">
        {campaign.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={urlFor(campaign.image).width(1200).url()} 
            className="w-full h-full object-cover opacity-60"
            alt="Cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#fdf1dc] via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-center md:text-left">
          <div className="max-w-5xl mx-auto">
            <span className="bg-[#7a200d] text-[#fdf1dc] px-3 py-1 rounded text-sm font-sans font-bold shadow mb-4 inline-block">
              NIVEAU {campaign.level}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 drop-shadow-sm mb-2" style={{textShadow: "2px 2px 0px #eecfa1"}}>{campaign.title}</h1>
          </div>
        </div>

        <Link href="/campaigns" className="absolute top-6 left-6 bg-black/30 hover:bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm transition font-sans text-sm font-bold flex items-center gap-2">
          ← Retour
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 mt-8">
        
        {/* SYNOPSIS */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-[#eecfa1] mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#7a200d]"></div>
          <h2 className="text-xl font-bold text-[#7a200d] mb-3 uppercase tracking-widest font-sans">Synopsis</h2>
          <p className="text-lg leading-relaxed text-slate-700 italic font-serif">
            "{campaign.synopsis}"
          </p>
        </div>

        {/* ACTES */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-widest font-sans border-b border-slate-300 pb-2 mb-8">
            Déroulement de l'aventure
          </h2>
          
          {campaign.acts?.map((act: any, i: number) => (
            <ActView key={act._key || i} act={act} index={i} />
          ))}

          {(!campaign.acts || campaign.acts.length === 0) && (
            <p className="text-center text-slate-500 py-10">Cette aventure est encore une page blanche...</p>
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