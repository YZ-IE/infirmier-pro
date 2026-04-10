import { useState } from 'react';
import { isFav, toggleFav } from '../../favorites.js';

export default function StarButton({ mod, toolId, label, icon, color, onFavChange }) {
  const [fav, setFav] = useState(() => isFav(mod, toolId));

  function handleToggle(e) {
    e.stopPropagation();
    toggleFav({ mod, toolId, label, icon, color });
    setFav(f => !f);
    if (onFavChange) onFavChange();
  }

  return (
    <button onClick={handleToggle} style={{
      background: 'none', border: 'none',
      color: fav ? '#fbbf24' : '#334155',
      fontSize: 16, cursor: 'pointer',
      padding: '2px 4px', lineHeight: 1,
      flexShrink: 0,
    }} title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
      {fav ? '⭐' : '☆'}
    </button>
  );
}
