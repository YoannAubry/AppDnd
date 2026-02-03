export default {
  name: 'item',
  title: 'Objets',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string' },
    { name: 'image', title: 'Image', type: 'image' },
    { name: 'type', title: 'Type', type: 'string', options: { list: ['Arme', 'Armure', 'Potion', 'Merveilleux', 'Quête', 'Trésor'] } },
    { name: 'rarity', title: 'Rareté', type: 'string', options: { list: ['Commun', 'Peu Commun', 'Rare', 'Très Rare', 'Légendaire'] } },
    { name: 'isMagic', title: 'Magique ?', type: 'boolean' },
    { name: 'attunement', title: 'Harmonisation ?', type: 'boolean' },
    { name: 'value', title: 'Valeur', type: 'string' },
    { name: 'description', title: 'Description', type: 'array', of: [{type: 'block'}] }
  ]
}
