import './index.css';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const CustomMarkdownView: React.FC<{ source: string }> = ({ source }) => {
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
