import { BellIcon, SmallCloseIcon } from '@chakra-ui/icons';

export const MathModeInfoTip = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-4">
      <div className="absolute top-0 right-0">
        <button
          onClick={onClose}
          className="m-2 bg-[#207DF7] rounded-full h-[25px] w-[30px] text-white"
          aria-label="Close"
        >
          <SmallCloseIcon />
        </button>
      </div>
      <div className="flex items-center mb-2">
        <BellIcon className="w-5 h-5 text-[#207DF7] mr-2" />
        <h4 className="text-base font-semibold">Math Mode Disclaimer</h4>
      </div>
      <p className="text-gray-600 text-sm">
        Math mode (with 100% accuracy) is currently in Beta!
      </p>
      <p className="text-gray-600 text-sm mt-1">
        AI Tutor is still pretty good at math but we'll notify you when the
        upgrade is out.
      </p>
    </div>
  );
};
