import { Button } from '../../../../../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../../../../../../../../components/ui/dialog';

function CardSavedDialog({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      <DialogHeader>
        <DialogTitle>Your card has been saved</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <Button>Later</Button>
        <Button>Study</Button>
      </DialogContent>
    </Dialog>
  );
}

export default CardSavedDialog;
