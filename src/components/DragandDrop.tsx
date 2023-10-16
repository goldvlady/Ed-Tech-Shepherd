import { Box, Text, Icon, BoxProps, Spinner } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiUpload, FiTrash2 } from 'react-icons/fi';

interface DragAndDropProps extends BoxProps {
  accept?: string; // Specify the file types to allow
  boxStyles?: BoxProps;
  supportingText?: string;
  isLoading?: boolean;
  file?: File | string | undefined;
  onDelete?: () => void; // Callback function when file is deleted
  onFileUpload: (file: File) => void; // Callback function when a file is uploaded
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  accept,
  supportingText,
  onFileUpload,
  file,
  onDelete,
  isLoading = false,
  ...rest
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSelected, setFileSelected] = useState(false); // Added state for file selection

  const handleDelete = () => {
    setFileSelected(false);
    setFileName(''); // Clear the selected file name
    if (onDelete) onDelete();
  };

  useEffect(() => {
    if (file) {
      const fileName =
        typeof file === 'object'
          ? file.name
          : decodeURIComponent(new URL(file).pathname).split('/').pop();
      setFileSelected(true);
      setFileName(fileName as string); // Set the selected file name
    }

    if (!file && (fileSelected || fileName)) {
      setFileSelected(false);
      setFileName(''); // Set the selected file name
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && accept && file.type.match(accept)) {
      onFileUpload(file);
      setFileSelected(true); // Set fileSelected to true when a file is uploaded
      setFileName(file.name); // Set the selected file name
    }
  };

  const handleClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = accept || '';
    fileInput.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onFileUpload(files[0]);
        setFileSelected(true); // Set fileSelected to true when a file is uploaded
        setFileName(files[0].name); // Set the selected file name
      }
    };
    fileInput.click();
  };

  return (
    <Box
      width="100%"
      border="2px dashed #E4E5E7"
      borderRadius={5}
      minHeight={'100px'}
      padding="30px"
      textAlign="center"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      bg={isDragging || fileSelected ? '#F0F6FE' : 'transparent'} // Set background color based on isDragging and fileSelected states
      cursor="pointer"
      {...rest}
    >
      <>
        {isLoading ? (
          <Spinner size="lg" color="blue.500" />
        ) : (
          <>
            {!fileSelected && (
              <Icon as={FiUpload} boxSize={8} color="gray.500" />
            )}
            {fileSelected && (
              <Icon
                as={FiTrash2}
                boxSize={8}
                color="red.500"
                onClick={handleDelete}
              />
            )}
          </>
        )}
        <Text fontSize="base" mt={3} fontWeight="500">
          Drag file here to upload or choose file
        </Text>
        <Text fontSize="sm" color="gray.500" mt={2}>
          {supportingText ? supportingText : 'Supports PDF formats'}
        </Text>
        <Box color="blue.500">{fileName ? fileName : ''}</Box>
      </>
    </Box>
  );
};

export default DragAndDrop;
