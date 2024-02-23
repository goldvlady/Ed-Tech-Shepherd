import {
  Dialog,
  DialogContent,
  DialogClose
} from '../../../../../../../../../../components/ui/dialog';

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
    <Dialog open={open}>
      <DialogContent className="bg-white">
        <DialogClose onClick={close} hidden/>
        <h1>Occlusion</h1>
        <img src={imageURI} alt="image" />
        <button onClick={close}>Close</button>
      </DialogContent>
    </Dialog>
  );
}

export default Occlusion;
