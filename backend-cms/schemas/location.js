export default {
  name: 'location',
  title: 'Lieux',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string' },
    { name: 'image', title: 'Illustration', type: 'image' },
    { name: 'description', title: 'Description', type: 'array', of: [{type: 'block'}] },
    { name: 'npcs', title: 'PNJs', type: 'array', of: [{type: 'reference', to: [{type: 'npc'}]}] },
    { name: 'monsters', title: 'Rencontres', type: 'array', of: [{type: 'reference', to: [{type: 'monster'}]}] }
  ]
}
