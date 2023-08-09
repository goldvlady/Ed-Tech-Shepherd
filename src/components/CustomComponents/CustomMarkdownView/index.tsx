import './index.css';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const CustomMarkdownView: React.FC<{
  source: string;
  key?: number;
  length?: number;
}> = ({ source, key, length }) => {
  const [displayedText, setDisplayedText] = useState('');
  const delay = 20; // Adjust this to change the speed of the "streaming" effect

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (key && length) {
        if (key === length - 1) {
          if (index < source.length) {
            setDisplayedText((prevText) => prevText + source[index]);
            index++;
          } else {
            clearInterval(interval);
          }
        }
      } else {
        setDisplayedText(source);
      }
    }, delay);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [source, key, length]);
  return (
    <ReactMarkdown
      className="custom_markdown"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypePrism]}
      children={displayedText}
    />
  );
};
export default CustomMarkdownView;
