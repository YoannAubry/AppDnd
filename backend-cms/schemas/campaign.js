export default {
  name: 'campaign',
  title: 'Campagnes',
  type: 'document',
  fields: [
    { name: 'title', title: 'Titre', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'image', title: 'Cover', type: 'image' },
    { name: 'level', title: 'Niveaux', type: 'string' },
    { name: 'synopsis', title: 'Synopsis', type: 'text' },
    {
      name: 'acts',
      title: 'Actes',
      type: 'array',
      of: [{
        type: 'object',
        title: 'Acte',
        fields: [
          { name: 'title', title: 'Titre Acte', type: 'string' },
          { name: 'summary', title: 'Résumé', type: 'text' },
          { name: 'locations', title: 'Lieux', type: 'array', of: [{type: 'reference', to: [{type: 'location'}]}] }
        ]
      }]
    }
  ]
}
