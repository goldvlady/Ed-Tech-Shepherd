import './index.css';
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const CustomMarkdownViewLLM: React.FC<{ source: string; delay?: number }> = ({
  source
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const delay = 20; // Adjust this to change the speed of the "streaming" effect
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < source.length) {
        setDisplayedText((prevContent) => prevContent + source[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [currentIndex, source, delay]);

  return (
    <ReactMarkdown
      className="custom_markdown"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypePrism]}
      children={displayedText}
    />
  );
};
export default CustomMarkdownViewLLM;
