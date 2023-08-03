import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';

/**
 * Save a content as a PDF File
 *
 * @param fileName Name of the PDF file
 * @param content The content of the PDF file. Could be string or string arrays
 */
export const saveAsPDF = (
  fileName: string,
  content: string | string[],
  x = 10,
  y = 10
): boolean => {
  const doc = new jsPDF();
  doc.text(content, x, y);
  try {
    doc.save(fileName);
    return true;
  } catch (error: any) {
    // console.error(error)
    return false;
  }
};

export const saveHTMLAsPDF = async (
  fileName: string,
  content: string,
  x = 10,
  y = 10
): Promise<boolean> => {
  const doc = new jsPDF({ orientation: 'landscape' });
  const element = document.createElement('div');
  element.innerHTML = content;

  try {
    doc.html(element, {
      x,
      y,
      callback: () => {
        doc.save(fileName);
      }
    });
    return true;
  } catch (error) {
    return false;
  }
};
