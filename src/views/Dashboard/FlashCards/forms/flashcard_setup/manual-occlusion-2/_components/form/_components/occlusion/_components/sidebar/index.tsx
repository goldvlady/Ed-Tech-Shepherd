import { cn } from '../../../../../../../../../../../../library/utils';

function Sidebar({
  mode,
  setMode,
  addItem
}: {
  mode: 'draggable' | 'resizable' | 'text' | 'preview';
  setMode: (mode: 'draggable' | 'resizable') => void;
  addItem: () => void;
}) {
  return (
    <div className="sidebar">
      <div className="shadow-lg flex flex-col gap-4 p-2 rounded-md">
        <div
          onClick={() => setMode('resizable')}
          className={cn(
            'w-10 h-10  text-xs border flex justify-center items-center rounded-sm cursor-pointer hover:scale-110 transition-transform',
            {
              'bg-blue-600 text-white': mode === 'resizable'
            }
          )}
        >
          Crop
        </div>
        <div
          onClick={() => addItem()}
          className={cn(
            'w-10 h-10  text-xs border flex justify-center items-center rounded-sm cursor-pointer hover:scale-110 transition-transform'
          )}
        >
          Add
        </div>
        <div
          onClick={() => setMode('draggable')}
          className={cn(
            'w-10 h-10  text-xs border flex justify-center items-center rounded-sm cursor-pointer hover:scale-110 transition-transform',
            {
              'bg-blue-600 text-white': mode === 'draggable'
            }
          )}
        >
          Drag
        </div>
        <div
          onClick={() => console.log('Text')}
          className={cn(
            'w-10 h-10  text-xs border flex justify-center items-center rounded-sm cursor-pointer hover:scale-110 transition-transform'
          )}
        >
          Text
        </div>
        <div
          onClick={() => console.log('Preview')}
          className={cn(
            'w-10 h-10  text-xs border flex justify-center items-center rounded-sm cursor-pointer hover:scale-110 transition-transform'
          )}
        >
          Preview
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
