import { Sidebar } from './Sidebar';
import { Spinner } from './Spinner';
import { testHighlights as _testHighlights } from './test-highlights';
import { Component } from 'react';
import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight
} from 'react-pdf-highlighter';
import type { IHighlight, NewHighlight } from 'react-pdf-highlighter';

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

interface State {
  url: string;
  highlights: Array<IHighlight>;
}

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice('#highlight-'.length);

const resetHash = () => {
  document.location.hash = '';
};

const HighlightPopup = ({
  comment
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const PRIMARY_PDF_URL = 'https://arxiv.org/pdf/1708.08021.pdf';
const SECONDARY_PDF_URL = 'https://arxiv.org/pdf/1604.02480.pdf';

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get('url') || PRIMARY_PDF_URL;

class TempPDFViewer extends Component<object, State> {
  state = {
    url: initialUrl,
    highlights: testHighlights[initialUrl]
      ? [...testHighlights[initialUrl]]
      : []
  };

  resetHighlights = () => {
    this.setState({
      highlights: []
    });
  };

  toggleDocument = () => {
    const newUrl =
      this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    this.setState({
      url: newUrl,
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : []
    });
  };

  scrollViewerTo = (highlight: any) => {
    // we will fill this in later;
  };

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    window.addEventListener(
      'hashchange',
      this.scrollToHighlightFromHash,
      false
    );
  }

  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find((highlight) => highlight.id === id);
  }

  addHighlight(highlight: NewHighlight) {
    const { highlights } = this.state;

    this.setState({
      highlights: [{ ...highlight, id: getNextId() }, ...highlights]
    });
  }

  updateHighlight(highlightId: string, position: object, content: object) {

    this.setState({
      highlights: this.state.highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest
            }
          : h;
      })
    });
  }

  render() {
    const { url, highlights } = this.state;

    return (
      <div style={{ display: 'flex', height: '100vh', width: '100%' }} className="lg:col-span-6 flex-auto h-full">
        {/* <Sidebar
          highlights={highlights}
          resetHighlights={this.resetHighlights}
          toggleDocument={this.toggleDocument}
        /> */}
        <div
          style={{
            height: '100vh',
            width: '75vw',
            position: 'relative'
          }}
        >
          {/* @ts-ignore: this is a documented error regarding TS2786. I don't know how to fix yet (ref: https://stackoverflow.com/questions/72002300/ts2786-typescript-not-reconizing-ui-kitten-components)  */}
          <PdfLoader url={url} beforeLoad={<Spinner />}>
            {(pdfDocument) => (
              // @ts-ignore: same issue as linked above
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                // pdfScaleValue="page-width"
                scrollRef={(scrollTo) => {
                  this.scrollViewerTo = scrollTo;

                  this.scrollToHighlightFromHash();
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => (
                  // @ts-ignore: same issue as linked above
                  <Tip
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      this.addHighlight({ content, position, comment });

                      hideTipAndSelection();
                    }}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    // @ts-ignore: same issue as linked above
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                  ) : (
                    // @ts-ignore: same issue as linked above
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        this.updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                  );

                  return (
                    // @ts-ignore: same issue as linked above
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    );
  }
}

export default TempPDFViewer;
