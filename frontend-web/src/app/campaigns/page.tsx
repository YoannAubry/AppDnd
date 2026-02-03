import { client, urlFor } from "../../lib/sanity"
import Link from "next/link"
import { Badge } from "../../components/ui/Badge"

async function getCampaigns() {
  return await client.fetch(`*[_type == "campaign"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    level,
    image,
    synopsis
  }`)
}

export default async function CampaignsIndex() {
  const campaigns = await getCampaigns()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-purple-400">📜 Mes Aventures</h1>
        <p className="text-slate-400 mb-12">Choisis ton histoire pour ce soir.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((camp: any) => (
            <Link href={`/campaigns/${camp.slug}`} key={camp._id} className="group h-full">
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-purple-500 transition shadow-lg h-full flex flex-col hover:-translate-y-1 duration-300">
                
                {/* Image */}
                <div className="h-56 bg-slate-800 relative overflow-hidden">
                  {camp.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={urlFor(camp.image).width(600).height(400).url()} 
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700 text-6xl">📚</div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-900 to-transparent opacity-90" />
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-purple-600 text-white border-none shadow-lg">Niveau {camp.level}</Badge>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-300 transition font-serif">{camp.title}</h2>
                  <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed mb-6 flex-1">
                    {camp.synopsis}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-800 flex justify-end">
                    <span className="text-purple-400 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Ouvrir le livre ➜
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
        
        {campaigns.length === 0 && (
          <div className="text-center py-20 text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
            Pas de campagne... Va dans le CMS pour créer ta première épopée !
          </div>
        )}
      </div>
    </div>
  )
}