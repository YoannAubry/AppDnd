export default {
  name: 'statBlock',
  title: 'Bloc de Statistiques',
  type: 'object',
  fields: [
    { name: 'ac', title: 'Classe d Armure (CA)', type: 'number' },
    { name: 'hp', title: 'Points de Vie (PV)', type: 'string' },
    { name: 'speed', title: 'Vitesse', type: 'string' },
    {
      name: 'attributes',
      title: 'Attributs',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'str', title: 'FOR', type: 'number' }, { name: 'dex', title: 'DEX', type: 'number' },
        { name: 'con', title: 'CON', type: 'number' }, { name: 'int', title: 'INT', type: 'number' },
        { name: 'wis', title: 'SAG', type: 'number' }, { name: 'cha', title: 'CHA', type: 'number' }
      ]
    },
    { name: 'senses', title: 'Sens', type: 'string' },
    { name: 'languages', title: 'Langues', type: 'string' },
    { name: 'challenge', title: 'Challenge (CR)', type: 'string' },
    { 
      name: 'traits', 
      title: 'Traits & Capacités', 
      type: 'array', 
      of: [{ type: 'object', fields: [{name: 'name', type: 'string'}, {name: 'desc', type: 'text'}]}]
    },
    { 
      name: 'actions', 
      title: 'Actions', 
      type: 'array', 
      of: [{ type: 'object', fields: [{name: 'name', type: 'string'}, {name: 'desc', type: 'text'}]}]
    }
  ]
}
