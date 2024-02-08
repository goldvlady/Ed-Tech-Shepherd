import { Tag } from '@chakra-ui/tag';

function Chip({ title }: { title: string }) {
  return (
    <Tag
      size="lg"
      variant="outline"
      borderRadius="full"
      _hover={{ bg: '#EBECF0' }}
      style={{
        boxShadow: 'inset 0 0 0px 1px #EBECF0',
        color: '#6E7682',
        padding: '10px',
        cursor: 'pointer'
      }}
      className="hover:shadow-lg transition duration-300 ease-in-out"
    >
      {title}
    </Tag>
  );
}

export default Chip;
