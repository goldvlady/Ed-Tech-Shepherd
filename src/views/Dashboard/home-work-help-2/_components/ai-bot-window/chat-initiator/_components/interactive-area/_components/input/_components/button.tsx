const Button = ({
  disabled,
  onClick,
  title,
  ...props
}: {
  disabled: boolean;
  title?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className={`h-[28px] rounded-full bg-[#207DF7] flex gap-2 justify-center items-center transition-all px-2 whitespace-nowrap ${
        disabled ? 'cursor-not-allowed grayscale' : 'cursor-pointer'
      }`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <span className="font-medium text-white text-sm">{title}</span>
      <ArrowSVG />
    </button>
  );
};

const ArrowSVG = () => {
  return (
    <svg
      width="13"
      height="11"
      viewBox="0 0 13 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 5.36353L10 5.36353"
        stroke="white"
        stroke-width="1.52728"
        stroke-linecap="round"
      />
      <path
        d="M6.54533 9.72727L11.5739 5.70438C11.7923 5.52969 11.7923 5.19758 11.5739 5.02289L6.54533 1"
        stroke="white"
        stroke-width="1.63637"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default Button;
