import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../../../../components/ui/select';

function ChatHistory() {
  return (
    <div className="bg-white h-full flex flex-col">
      <div className="w-[17.25rem] p-[1rem] pb-0">
        <div className="w-full h-[30px] flex gap-2 my-4 items-center">
          <div>
            <InputGroup className="max-h-[30px] overflow-hidden flex items-center">
              <InputLeftElement pointerEvents="none" className="max-h-[30px] ">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input type="text" rounded="full" className="max-h-[30px]" />
            </InputGroup>
          </div>
          <div>
            <Select
              // onValueChange={(value) => {
              //   if (value === 'all') {
              //     handleSubjectFilter('');
              //   } else {
              //     handleSubjectFilter(value);
              //   }
              // }}
              defaultValue="all"
            >
              <SelectTrigger className="w-20 max-h-[30px] rounded-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem key={1} value={'test'}>
                    Test
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="mt-[1.56rem] w-full">
        <h5 className="font-medium text-[1.25rem] text-[#212224] text-center tracking-normal">
          Chat History
        </h5>
      </div>
      <div className="history flex-1 overflow-auto mt-[1rem] pb-2">
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
      </div>
    </div>
  );
}

const HistoryItem = () => {
  return (
    <div className="w-[10.31rem] h-[10.31rem] rounded-[10px] shadow-lg mx-auto border my-[10px] relative">
      <div className='absolute w-8 h-8 rounded-full bg-red-300 top-0 right-0 m-[8px]'></div>
    </div>
  );
};

export default ChatHistory;
