export default {
  name: 'npc',
  title: 'PNJs',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string' },
    { name: 'image', title: 'Portrait', type: 'image' },
    { name: 'role', title: 'Rôle', type: 'string' },
    { name: 'personality', title: 'Personnalité', type: 'text', rows: 3 },
    { name: 'history', title: 'Histoire', type: 'text', rows: 4 },
    { name: 'faction', title: 'Affiliation', type: 'reference', to: [{type: 'faction'}] },
    {
      name: 'combatType',
      title: 'Gestion Combat',
      type: 'string',
      options: { list: [{title: 'Aucun', value: 'none'}, {title: 'Template', value: 'template'}, {title: 'Custom', value: 'custom'}], layout: 'radio' },
      initialValue: 'none'
    },
    { name: 'monsterTemplate', title: 'Modèle', type: 'reference', to: [{type: 'monster'}], hidden: ({document}) => document.combatType !== 'template' },
    { name: 'customStats', title: 'Stats Custom', type: 'statBlock', hidden: ({document}) => document.combatType !== 'custom' },
    {
      name: 'inventory',
      title: 'Inventaire (Texte)',
      type: 'array',
      of: [{ 
        type: 'object',
        fields: [
          {name: 'name', type: 'string', title: 'Nom'},
          {name: 'desc', type: 'string', title: 'Détail (ex: +1 CA)'}
        ]
      }]
    },
    {
      name: 'spells',
      title: 'Sorts (Texte)',
      type: 'array',
      of: [{ type: 'string' }] // Juste une liste de noms de sorts
    }
  ]
}
