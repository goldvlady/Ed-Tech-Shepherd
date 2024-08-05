const SourceButton = ({
  multipleSelectedDocs
}: {
  multipleSelectedDocs: any[];
}) => (
  <div className="absolute bottom-[-48px] left-0 w-full h-[48px] flex items-center justify-start gap-2 overflow-x-scroll no-scrollbar">
    {multipleSelectedDocs.map((item) => {
      return (
        <button
          key={item.id}
          className="h-[1.3rem] border border-dashed flex items-center justify-center rounded-full p-4"
        >
          <span className="whitespace-nowrap text-[#969CA6] font-[0.5rem] max-w-[6rem] truncate">
            {item.name}
          </span>
        </button>
      );
    })}
  </div>
);

export default SourceButton;
