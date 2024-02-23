import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { cn } from '../../../../../../../../../../../../library/utils';

function OcclusionWorkSpace({
  imageURI,
  items,
  mode,
  setItems
}: {
  imageURI: string;
  items: any[];
  mode: 'draggable' | 'resizable';
  setItems: (items: any[]) => void;
}) {
  return (
    <div
      className="workspace w-[714px] h-[475px] shrink-0 relative"
      style={{
        backgroundImage: `url(${imageURI})`,
        backgroundSize: '100% 100%'
      }}
    >
      {items.map((item, index) => (
        <Draggable
          disabled={mode !== 'draggable'}
          key={item.order}
          bounds="parent"
          defaultPosition={item.position}
          onDrag={(e, ui) => {
            const newItems = [...items];
            newItems[index] = {
              ...newItems[index],
              position: {
                ...newItems[index].position,
                x: ui.x,
                y: ui.y
              }
            };
            setItems(newItems);
          }}
        >
          <ResizableBox
            width={item.position.width}
            height={item.position.height}
            minConstraints={[30, 30]}
            style={{
              position: 'relative',
              border: '1px solid black'
            }}
            onResize={(e, { size }) => {
              const newItems = [...items];
              newItems[index] = {
                ...newItems[index],
                position: {
                  ...newItems[index].position,
                  width: size.width,
                  height: size.height
                }
              };
              setItems(newItems);
            }}
            handle={
              <div
                className={cn(
                  'w-[10px] h-[10px] bg-red-500 absolute bottom-0 right-0 cursor-se-resize',
                  mode === 'resizable' ? 'block' : 'hidden'
                )}
              />
            }
          >
            <div
              style={{
                width: `${item.position.width}px`,
                height: `${item.position.height}px`,
                cursor: mode === 'draggable' ? 'move' : 'auto'
              }}
              className="inline-block margin-0 bg-[#BAD7FD] text-black text-center"
            ></div>
          </ResizableBox>
        </Draggable>
      ))}
    </div>
  );
}

export default OcclusionWorkSpace;
