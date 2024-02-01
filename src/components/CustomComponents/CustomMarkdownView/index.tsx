import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BlockMath, InlineMath } from 'react-katex';
import rehypePrism from '@mapbox/rehype-prism'; // Ensure correct import
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import './index.css';
import 'katex/dist/katex.min.css';

interface CustomComponents {
  math: ({ node, inline }: { node: any; inline: boolean }) => JSX.Element;
  inlineMath: ({ node, inline }: { node: any; inline: boolean }) => JSX.Element;
  button: any;
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
  keywords = [],
  handleSendKeyword
}: ICustomMarkdownView) => {
  const [renderedSource, setRenderedSource] = useState<string>('');

  useEffect(() => {
    let modifiedSource = source;
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

  // Custom components
  const components: CustomComponents = {
    math: ({ node, inline }) =>
      inline ? (
        <InlineMath math={node.value} />
      ) : (
        <BlockMath math={node.value} />
      ),
    inlineMath: ({ node }) => <InlineMath math={node.value} />,
    button: (props: any) => (
      <button {...props} onClick={(e) => onKeywordClick(e, props.children)} />
    )
  };

  const onKeywordClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    keyword: string
  ) => {
    if (handleSendKeyword) {
      handleSendKeyword(event, keyword);
    }
  };

  return (
    <ReactMarkdown
      className="custom_markdown"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, [rehypePrism, { ignoreMissing: true }]]}
      components={components}
      children={renderedSource}
    />
  );
};

export default CustomMarkdownView;
