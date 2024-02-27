import { Button } from '../../../../../../../../components/ui/button';
import {
  Dialog,
  DialogContent
} from '../../../../../../../../components/ui/dialog';

function CardSavedDialog({
  open,
  cancel,
  startStudySession
}: {
  open: boolean;
  cancel: () => void;
  startStudySession: () => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent className="bg-white">
        <Button onClick={cancel}>Later</Button>
        <Button onClick={startStudySession}>Study</Button>
      </DialogContent>
    </Dialog>
  );
}

export default CardSavedDialog;
