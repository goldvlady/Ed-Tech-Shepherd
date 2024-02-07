import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { Select } from '@chakra-ui/react';

function SearchBar() {
  return (
    <div className="w-full h-[30px] flex gap-2 my-4 items-center">
      <div>
        <InputGroup className="max-h-[30px] overflow-hidden flex items-center">
          <InputLeftElement pointerEvents="none" className="max-h-[30px] ">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input type="text" rounded="full" className="max-h-[30px] " />
        </InputGroup>
      </div>
      <div>
        <Select
          placeholder=""
          className="p-0 max-w-20 max-h-[30px]"
          size={'sm'}
          rounded={'full'}
        >
          <option value="option1">All</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
          <option value="option4">Chemical Engineering</option>
        </Select>
      </div>
    </div>
  );
}

export default SearchBar;
