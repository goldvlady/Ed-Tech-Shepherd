import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { Select } from '@chakra-ui/react';
import { ConversationHistory } from '../../../../../../types';

function SearchBar({
  conversations,
  handleSubjectFilter,
  handleKeywordFilter
}: {
  conversations: ConversationHistory[];
  handleSubjectFilter: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleKeywordFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const uniqueSubjects = [
    ...new Set(
      conversations
        .filter((item) => Boolean(item.subject))
        .map((item) => item.subject || null)
    )
  ];
  return (
    <div className="w-full h-[30px] flex gap-2 my-4 items-center">
      <div>
        <InputGroup className="max-h-[30px] overflow-hidden flex items-center">
          <InputLeftElement pointerEvents="none" className="max-h-[30px] ">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            rounded="full"
            className="max-h-[30px]"
            onChange={handleKeywordFilter}
          />
        </InputGroup>
      </div>
      <div>
        <Select
          className="p-0 max-w-20 max-h-[30px]"
          size={'sm'}
          rounded={'full'}
          defaultValue={''}
          onChange={handleSubjectFilter}
        >
          <option value="">All</option>
          {uniqueSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

export default SearchBar;
