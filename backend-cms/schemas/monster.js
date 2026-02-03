export default {
  name: 'monster',
  title: 'Bestiaire',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string' },
    { name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'name' } },
    { name: 'image', title: 'Image', type: 'image' },
    { name: 'type', title: 'Type', type: 'string' },
    { name: 'stats', title: 'Statistiques', type: 'statBlock' }
  ]
}
