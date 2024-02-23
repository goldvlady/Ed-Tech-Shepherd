import { useState } from 'react';
import Sidebar from '../sidebar';
import OcclusionWorkSpace from '../occlusion-workspace';

function InteractionWindow({ imageURI }: { imageURI: string }) {
  const [mode, setMode] = useState<'draggable' | 'resizable'>('draggable');
  const [items, setItems] = useState([]);

  const addItem = () => {
    setItems([
      ...items,
      {
        order: items.length,
        label: '',
        isRevealed: false,
        position: { x: 0, y: 42, width: 40, height: 40 }
      }
    ]);
  };

  return (
    <div className="w-full flex-1 relative flex justify-center items-center shrink-0">
      <div className="sidebar absolute left-0 h-full flex items-center">
        <Sidebar mode={mode} setMode={setMode} addItem={addItem} />
      </div>
      <OcclusionWorkSpace
        imageURI={imageURI}
        items={items}
        mode={mode}
        setItems={setItems}
      />
    </div>
  );
}

export default InteractionWindow;
