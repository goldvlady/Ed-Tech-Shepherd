import './index.css';
import 'katex/dist/katex.min.css';
import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { BlockMath, InlineMath } from 'react-katex';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface CustomComponents {
  math: ({ node, inline }: { node: any; inline: boolean }) => JSX.Element;
  inlineMath: ({ node, inline }: { node: any; inline: boolean }) => JSX.Element;
  // Add more custom components if needed
}
interface ICustomMarkdownView {
  source: string;
  keywords?: string[];
  handleSendMessage?: any;
  handleSendKeyword?: any;
}
const CustomMarkdownView = ({
  source,
  keywords,
  handleSendKeyword
}: ICustomMarkdownView) => {
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

  const [update, setUpdate] = useState(0);

  // A unique placeholder for keywords
  const keywordPlaceholder = (keyword, index) => `keyword-placeholder-${index}`;

  const handleKeywordClick = (event: MouseEvent, keyword) => {
    console.log('Keyword clicked:', keyword);
    handleSendKeyword(event, keyword);
  };

  useEffect(() => {
    // After the component mounts and renders the markdown, replace placeholders with actual buttons
    keywords?.forEach((keyword, index) => {
      document
        .querySelectorAll(`#${keywordPlaceholder(keyword, index)}`)
        .forEach((element) => {
          const button = document.createElement('button');
          button.textContent = keyword;
          button.className = 'clickable-keyword';
          button.onclick = (e) => handleKeywordClick(e, keyword);
          element.replaceWith(button);
        });
    });
  }, [source, keywords, update]); // The `update` state variable is added to the dependency array

  const renderMarkdown = () => {
    let markdown = source;

    // Replace keywords with unique placeholders
    keywords?.forEach((keyword, index) => {
      if (source.includes(keyword)) {
        const placeholder = `<span id="${keywordPlaceholder(
          keyword,
          index
        )}">${keyword}</span>`;
        markdown = markdown.split(keyword).join(placeholder);
      }
    });

    return markdown;
  };

  // Use state to force re-render if needed
  const forceUpdate = () => setUpdate((prev) => prev + 1);

  return (
    <ReactMarkdown
      className="custom_markdown"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypePrism]}
      components={components as any}
      // children={source}
      children={renderMarkdown()}
    />
  );
};
export default CustomMarkdownView;
