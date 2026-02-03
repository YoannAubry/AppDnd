export default {
  name: 'player',
  title: 'Joueurs (PJ)',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom Perso', type: 'string' },
    { name: 'playerName', title: 'Nom Joueur', type: 'string' },
    { name: 'avatar', title: 'Avatar', type: 'image' },
    { name: 'race', title: 'Race', type: 'string' },
    { name: 'class', title: 'Classe', type: 'string' },
    { name: 'level', title: 'Niveau', type: 'number' },
    { name: 'hpMax', title: 'PV Max', type: 'number' },
    { name: 'ac', title: 'CA', type: 'number' },
    { name: 'initBonus', title: 'Init Bonus', type: 'number' },
    { name: 'pp', title: 'Perception Passive', type: 'number' },
    { name: 'spellSaveDC', title: 'DD Sort', type: 'number' },
    { name: 'inventory', title: 'Inventaire', type: 'array', of: [{ type: 'reference', to: [{ type: 'item' }] }] }
  ]
}
