import './index.css';
import 'katex/dist/katex.min.css';
import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface CustomMarkdownViewProps {
  source: string;
}

interface CustomComponents {
  math: ({ node, inline }: { node: any; inline: boolean }) => JSX.Element;
  inlineMath: ({ node, inline }: { node: any; inline: boolean }) => JSX.Element;
  // Add more custom components if needed
}

const CustomMarkdownView: React.FC<CustomMarkdownViewProps> = ({ source }) => {
  const components: CustomComponents = {
    math: ({ node, inline }) => {
      if (inline) {
        return <InlineMath math={node.value} />;
      }
      return <BlockMath math={node.value} />;
    },
    inlineMath: ({ node, inline }) => {
      return <InlineMath math={node.value} />;
    }
  };

  return (
    <ReactMarkdown
      className="custom_markdown"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypePrism]}
      components={components as any}
      children={source}
    />
  );
};
export default CustomMarkdownView;
