import React from 'react';
import { plans } from '../helpers/plans';
import { cn } from '../library/utils';
import useUserStore from '../state/userStore';
import { User } from '../types';
import { Dialog, DialogClose, DialogContent, DialogTitle } from './ui/dialog';
import { capitalize } from '../helpers';
type BillingModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const BillingModal = ({ open, setOpen }: BillingModalProps) => {
  const user = useUserStore((state) => state.user);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent className="bg-white w-screen max-w-[80vw]">
        <DialogTitle className="text-lg text-center">
          Subscribe to Shepherd
        </DialogTitle>

        <PriceCards user={user} />
      </DialogContent>
    </Dialog>
  );
};

function PriceCards({ user }: { user: User }) {
  return (
    <div className="flex gap-3">
      {plans.map((plan) => (
        <div
          className="p-3 flex flex-col shadow shadow-black/20 border border-black/5 w-auto h-[295px]"
          key={plan.price}
        >
          <h4 className="text-sm tracking-tight font-medium">
            {plan.recurrence === 'one-off'
              ? 'Basic'
              : capitalize(plan.recurrence + 'ly')}
          </h4>
          <h2 className="text-lg tracking-tight mt-4 mb-2 font-semibold ">
            {plan.price === 0 ? (
              'Free'
            ) : (
              <span className="flex items-center text-md  gap-0.5">
                <span>${plan.price}</span>
                <span className="font-normal text-gray-500 text-xs">
                  /{capitalize(plan.recurrence)}
                </span>
              </span>
            )}
          </h2>
          <div className="flex flex-col  text-sm  gap-1.5">
            <div className="flex justify-start items-start gap-1">
              <Check />
              Up to {plan.tier === 'free' ? 20 : 100} flashcards
            </div>
            <div className="flex items-start justify-start gap-1">
              <Check />
              Up to {plan.tier === 'free' ? 20 : 100} quizzes
            </div>
            <div className="flex items-start justify-start whitespace-break-spaces gap-1">
              <Check />
              Up to {plan.tier === 'free' ? 20 : 100} messages with AI tutor
            </div>
            <div className="flex items-start justify-start whitespace-break-spaces gap-1">
              <Check />
              Up to {plan.tier === 'free' ? 20 : 100} messages with Docchat
            </div>
          </div>
          <button
            onClick={() =>
              (window.location.href = `${plan.paymentLink}?prefilled_email=${user.email}`)
            }
            className={cn(
              'mt-1.5 p-2 text-sm rounded-md border border-black/10 bg-white',
              plan.recurrence === 'semester' && 'bg-blue-500 text-white'
            )}
          >
            {user.stripeSubscription?.hasAccess &&
            user.stripeSubscription?.priceId === plan.priceId
              ? 'Subscribed'
              : plan.tier === 'free'
              ? 'Downgrade to Free'
              : 'Subscribe Now'}
          </button>
        </div>
      ))}
    </div>
  );
}

const Check = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z"
      fill="green"
      fill-rule="evenodd"
      clip-rule="evenodd"
    ></path>
  </svg>
);
export default BillingModal;
