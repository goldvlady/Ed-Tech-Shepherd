function ExternalSources() {
  return (
    <div className="w-full h-full bg-white cc">
      <div className="px-[1.8rem] w-full">
        <div className="title">
          <h5 className="text-center text-[1rem] text-[#585F68] font-medium">
            Shepherd Supports
          </h5>
        </div>
        <div className="icons w-[19rem] h-[2.5rem] mx-auto flex justify-between mt-[1rem]">
          <Icon />
          <Icon />
          <Icon />
          <Icon />
        </div>
        <div className="input mt-[2.1rem] w-full flex gap-[1rem]">
          <input
            type="text"
            placeholder="Enter URL"
            className="w-full h-[2.1rem] border-none rounded-full px-[1rem] text-[#585F68] text-[0.87rem] bg-[#F8F8F9] outline-none ring-0"
          />
          <button className="w-[4.8rem] h-[2.1rem] bg-[#F8F8F9] text-[#585F68] font-medium rounded-full text-[0.87rem]">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

const Icon = () => {
  return (
    <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-[#F8F8F9]"></div>
  );
};

export default ExternalSources;
