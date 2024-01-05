import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BlockMath, InlineMath } from 'react-katex';
import rehypePrism from 'rehype-prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import './index.css';
import 'katex/dist/katex.min.css';

interface CustomComponents {
  math: ({ node, inline }: { node: any; inline: boolean }) => JSX.Element;
  inlineMath: ({ node, inline }: { node: any; inline: boolean }) => JSX.Element;
  // Add more custom components if needed
}

interface ICustomMarkdownView {
  source: string;
  keywords?: string[]; // Ensure this is always an array or undefined
  handleSendMessage?: any;
  handleSendKeyword?: any;
}

const CustomMarkdownView = ({
  source,
  keywords = [], // Default to an empty array if not provided
  handleSendKeyword
}: ICustomMarkdownView) => {
  const [renderedSource, setRenderedSource] = useState<string>('');

  useEffect(() => {
    let modifiedSource = source;

    // Check if keywords is an array before attempting to use forEach
    if (Array.isArray(keywords)) {
      keywords.forEach((keyword, index) => {
        modifiedSource = modifiedSource.replace(
          new RegExp(keyword, 'g'),
          `<button class="clickable-keyword" data-keyword="${keyword}" data-index="${index}">${keyword}</button>`
        );
      });
    }

    setRenderedSource(modifiedSource);
  }, [source, keywords]);

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

  const onKeywordClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const keyword = event.currentTarget.dataset.keyword;
    if (handleSendKeyword && keyword) {
      handleSendKeyword(event, keyword);
    }
  };

  return (
    <ReactMarkdown
      className="custom_markdown"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypePrism]}
      components={{
        ...components,
        button: (props: any) => (
          <button {...props} onClick={onKeywordClick}>
            {props.children}
          </button>
        )
      }}
      children={renderedSource}
    />
  );
};

export default CustomMarkdownView;
