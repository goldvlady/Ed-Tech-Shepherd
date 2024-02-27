import { ResetIcon } from '@radix-ui/react-icons';
import { Button } from '../../../../../../../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose
} from '../../../../../../../../../../components/ui/dialog';
import InteractionWindow from './_components/interaction-window';

function Occlusion({
  open,
  close,
  imageURI,
  elements,
  setElements,
  handleSubmit,
  resetForm
}: {
  open: boolean;
  close: () => void;
  imageURI: string;
  elements: any[];
  setElements: (elements: any[]) => void;
  handleSubmit: () => void;
  resetForm: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent className="bg-white p-0 flex flex-col w-[894px] max-w-4xl">
        <header className="flex p-4 justify-between">
          <div className="flex gap-1 items-center">
            <span className='px-1 py-0.5 rounded bg-[#F3F5F6] cursor-pointer'>
              <ResetIcon className="w-4 h-4 hover:scale-105" />
            </span>
            <span className='px-1 py-0.5 rounded bg-[#F3F5F6] cursor-pointer scale-x-[-1]'>
              <ResetIcon className="w-4 h-4 hover:scale-105" />
            </span>
          </div>
          <button
            className="w-[60px] flex items-center justify-center gap-1 rounded-full bg-[#F3F5F6] text-[#969CA6] text-xs'"
            onClick={() => {
              resetForm();
              close();
            }}
          >
            <span className="text-[#969CA6] text-xs">Close</span>
            <span className="text-[#969CA6] text-xs"> &times;</span>
          </button>
        </header>

        <InteractionWindow
          imageURI={imageURI}
          elements={elements}
          setElements={setElements}
        />

        <footer className="flex justify-between w-full p-4">
          <div className='text-xs opacity-50'>Resize</div>
          <Button className="bg-blue-600 text-white" onClick={handleSubmit}>
            Save
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

export default Occlusion;
