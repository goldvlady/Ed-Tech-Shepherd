import React, { useEffect, useState } from 'react';
// import { BlockMath, InlineMath } from 'react-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import './index.css';
import 'katex/dist/katex.min.css';
import { MemoizedReactMarkdown } from './memoized-react-markdown';
import { CodeBlock } from './code-block';

interface CustomComponents {
  button: any;
  // Add more custom components if needed
  p?: any;
  code?: any;
  ul?: any;
  ol?: any;
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

  console.log('[source veerbal]', { source });

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
    button: (props: any) => (
      <button {...props} onClick={(e) => onKeywordClick(e, props.children)} />
    ),
    code: ({ node, inline, className, children, ...props }) => {
      if (children.length) {
        if (children[0] == '▍') {
          return <span className="mt-1 cursor-default animate-pulse">▍</span>;
        }

        children[0] = (children[0] as string).replace('`▍`', '▍');
      }

      const match = /language-(\w+)/.exec(className || '');

      if (inline) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }

      return (
        <CodeBlock
          key={Math.random()}
          language={(match && match[1]) || ''}
          value={String(children).replace(/\n$/, '')}
          {...props}
        />
      );
    },
    ul: ({ children }) => (
      <ul className="list-disc list-inside my-6 ml-6 [&>li]:mt-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside my-6 ml-6 [&>li]:mt-2">
        {children}
      </ol>
    ),
    p: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
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
    <MemoizedReactMarkdown
      className="memoized-react-markdown prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 rounded-xl px-3 py-2 transition-all max-w-[75ch] place-self-start shadow-sm"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={components}
    >
      {source}
    </MemoizedReactMarkdown>
  );
};

export default CustomMarkdownView;
