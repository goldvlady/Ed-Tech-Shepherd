function Thumbnail({ data }: { data: any }) {
  return (
    <div className="border h-[10.31rem] w-[10.31rem] rounded-[10px] bg-white">
      {data.collection_name}
    </div>
  );
}

export default Thumbnail;
