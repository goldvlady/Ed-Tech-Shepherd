import { SelectedNoteModal } from '../../../components';
import { getPDFHighlight, postPDFHighlight } from '../../../services/AI';
import { Spinner } from './Spinner';
import { testHighlights as _testHighlights } from './test-highlights';
import { useToast } from '@chakra-ui/react';
import { HandRaisedIcon } from '@heroicons/react/20/solid';
import { useEffect, useState, useCallback } from 'react';
import type { IHighlight, NewHighlight } from 'react-pdf-highlighter';
import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight
} from 'react-pdf-highlighter';

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

const TempPDFViewer = ({
  pdfLink,
  name,
  documentId,
  setLoading,
  setHightlightedText
}: {
  pdfLink: URL;
  name: string;
  documentId?: string;
  setLoading?: any;
  setHightlightedText?: any;
}) => {
  const [highlights, setHighlights] = useState<Array<IHighlight>>([]);
  const [url, setUrl] = useState(pdfLink);
  const [popUpNotesModal, setPopUpNotesModal] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setUrl(pdfLink);
  }, [pdfLink]);

  const resetHighlights = () => {
    setHighlights([]);
  };

  let scrollViewerTo = (highlight: any) => {
    // we will fill this in later;
  };

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
      scrollViewerTo(highlight);
    }
  };

  useEffect(() => {
    if (window)
      window.addEventListener('hashchange', scrollToHighlightFromHash, false);
  }, []);

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const addHighlight = (highlight: NewHighlight) => {
    setHighlights([{ ...highlight, id: getNextId() }, ...highlights]);
  };

  const handleHighlight = useCallback(async () => {
    try {
      const response = await postPDFHighlight({
        documentId,
        highlight: {
          name: highlights[0]?.content?.text
        }
      });
      if ([200].includes(response.status)) {
        toast({
          title: 'Hightlighted words saved successfully',
          position: 'top-right',
          status: 'success',
          isClosable: true
        });

        const getHighlight = async () => {
          setLoading(true);
          const response = await getPDFHighlight({ documentId });
          setHightlightedText(response);
          setLoading(false);
        };
        getHighlight();
      }
    } catch (error) {
      toast({
        title: 'Unable to process this request.Please try again later',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  }, [documentId, highlights[0]?.content?.text]);

  const updateHighlight = (
    highlightId: string,
    position: object,
    content: object
  ) => {
    const updated = highlights.map((highlight) => {
      const {
        id,
        position: originalPosition,
        content: originalContent,
        ...rest
      } = highlight;

      if (id === highlightId) {
        return {
          id,
          position: { ...originalPosition, ...position },
          content: { ...originalContent, ...content },
          ...rest
        };
      } else return highlight;
    });

    setHighlights(updated);
  };

  useEffect(() => {
    !!highlights.length && handleHighlight();
  }, [highlights]);

  return (
    <>
      <div
        style={{ display: 'flex', position: 'fixed' }}
        className="lg:col-span-6 flex-auto h-full w-1/2"
      >
        <div
          style={{
            height: '100vh',
            width: '87%',
            position: 'relative'
          }}
        >
          <div
            className="absolute z-10 font-bold max-h-max max-w-max text-sm p-2 bg-green-100 rounded-xl m-1 hover:text-blue-600 hover:cursor-pointer hover:bg-yellow-100"
            onClick={() => setPopUpNotesModal(true)}
          >
            {name}
          </div>
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
                  scrollViewerTo = scrollTo;

                  scrollToHighlightFromHash();
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
                      addHighlight({ content, position, comment });

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
                        updateHighlight(
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
      {popUpNotesModal && (
        <SelectedNoteModal
          show={popUpNotesModal}
          setShow={setPopUpNotesModal}
          setShowHelp={() => null}
        />
      )}
    </>
  );
};

export default TempPDFViewer;
