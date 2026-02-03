export default {
  name: 'player',
  title: 'Joueurs (PJ)',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom du Personnage', type: 'string' },
    { name: 'playerName', title: 'Nom du Joueur (IRL)', type: 'string' },
    { name: 'avatar', title: 'Avatar', type: 'image' },
    
    // Infos RP minimales
    { name: 'race', title: 'Race', type: 'string' },
    { name: 'class', title: 'Classe & Niveau', type: 'string', description: "Ex: Paladin 3" },

    // Stats Vitales (Pour le Tracker)
    { name: 'hpMax', title: 'PV Max', type: 'number' },
    { name: 'ac', title: 'Classe d\'Armure', type: 'number' },
    { name: 'initBonus', title: 'Bonus Initiative', type: 'number' }
  ]
}