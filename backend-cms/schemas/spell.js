export default {
  name: 'spell',
  title: 'Sorts',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string' },
    { name: 'level', title: 'Niveau', type: 'number' },
    { name: 'school', title: 'École', type: 'string' },
    { name: 'castingTime', title: 'Incantation', type: 'string' },
    { name: 'range', title: 'Portée', type: 'string' },
    { name: 'components', title: 'Composantes', type: 'string' },
    { name: 'duration', title: 'Durée', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' }
  ]
}
