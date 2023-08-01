import { Box, Button, Icon, Text, Spinner } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { FaUpload } from 'react-icons/fa';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onUploadClick = () => {
    inputFile.current?.click();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      onFileSelect(file);
      setFileName(file.name);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="between"
      bg="white"
      borderRadius="6px"
      border="1px solid #E4E6E7"
      py={'10px'}
      px={'20px'}
      onClick={onUploadClick}
      _hover={{ bg: '' }}
      cursor="pointer"
    >
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />

      <Box
        boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
        justifyContent={'center'}
        alignItems={'center'}
        display={'flex'}
      >
        {isLoading ? (
          <Spinner color="black" />
        ) : (
          <Icon color="#9A9DA2" as={FaUpload} />
        )}
        <Text ml="10px" color="#9A9DA2" fontSize={'14px'}>
          {fileName || 'Upload a file'}
        </Text>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Box
          border={4}
          borderColor="#9A9DA2"
          borderRadius="full"
          position="absolute"
          inset={0}
        />
      </Box>
    </Box>
  );
};

export default FileUpload;
