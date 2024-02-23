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
  imageURI
}: {
  open: boolean;
  close: () => void;
  imageURI: string;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent className="bg-white p-0 flex flex-col w-[894px] max-w-4xl">
        <header className="flex p-2 justify-between">
          <div className="flex gap-4 items-center">
            <span>Undo</span>
            <span>Redo</span>
          </div>
          <button onClick={close}>Close</button>
        </header>

        <InteractionWindow imageURI={imageURI} />

        <footer className="flex justify-between w-full p-2">
          <div>Resize</div>
          <Button className="bg-blue-600 text-white">Save</Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

export default Occlusion;
