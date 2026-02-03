#!/bin/bash

# Création des dossiers
mkdir -p schemas/objects

echo "📂 Création de l'architecture des données..."

# 1. OBJET: BLOC DE STATS
cat <<EOT > schemas/objects/statBlock.js
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
EOT

# 2. DOCUMENT: MONSTRE
cat <<EOT > schemas/monster.js
export default {
  name: 'monster',
  title: 'Bestiaire',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string' },
    { name: 'image', title: 'Image', type: 'image' },
    { name: 'type', title: 'Type', type: 'string' },
    { name: 'stats', title: 'Statistiques', type: 'statBlock' }
  ]
}
EOT

# 3. DOCUMENT: JOUEUR
cat <<EOT > schemas/player.js
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
EOT

# 4. DOCUMENT: OBJET
cat <<EOT > schemas/item.js
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
EOT

# 5. DOCUMENT: SORT
cat <<EOT > schemas/spell.js
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
EOT

# 6. DOCUMENT: FACTION
cat <<EOT > schemas/faction.js
export default {
  name: 'faction',
  title: 'Factions',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string' },
    { name: 'image', title: 'Emblème', type: 'image' },
    { name: 'description', title: 'Description', type: 'text' }
  ]
}
EOT

# 7. DOCUMENT: PNJ
cat <<EOT > schemas/npc.js
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
    { name: 'inventory', title: 'Inventaire', type: 'array', of: [{type: 'reference', to: [{type: 'item'}]}] },
    { name: 'spells', title: 'Sorts', type: 'array', of: [{type: 'reference', to: [{type: 'spell'}]}] }
  ]
}
EOT

# 8. DOCUMENT: LIEU
cat <<EOT > schemas/location.js
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
EOT

# 9. DOCUMENT: CAMPAGNE
cat <<EOT > schemas/campaign.js
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
EOT

# 10. INDEX
cat <<EOT > schemas/index.js
import statBlock from './objects/statBlock'
import monster from './monster'
import player from './player'
import item from './item'
import spell from './spell'
import faction from './faction'
import npc from './npc'
import location from './location'
import campaign from './campaign'

export const schemaTypes = [statBlock, monster, player, item, spell, faction, npc, location, campaign]
EOT

echo "✅ Schémas générés !"
