function Progress() {
  return (
    <div className="w-full flex justify-between my-6">
      <Dot />
      <Dot />
      <Dot />
    </div>
  );
}

const Dot = () => {
  return <div className="w-2 h-2 rounded-full bg-[#E0E0E0]"></div>;
};

export default Progress;
