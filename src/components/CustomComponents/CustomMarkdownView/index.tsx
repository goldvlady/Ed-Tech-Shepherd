import './index.css';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const CustomMarkdownView: React.FC<{ source: string }> = ({ source }) => {
  const [displayedText, setDisplayedText] = useState('');
  const delay = 20; // Adjust this to change the speed of the "streaming" effect

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < source.length) {
        setDisplayedText((prevText) => prevText + source[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, delay);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [source]);
  return (
    <ReactMarkdown
      className="custom_markdown"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypePrism]}
      children={source}
    />
  );
};
export default CustomMarkdownView;
