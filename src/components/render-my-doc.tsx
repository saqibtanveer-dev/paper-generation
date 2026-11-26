import { useEffect, useRef } from "react";
import { useQuestionsContext } from "../context/use-questions-context";
import type { QuestionContextType } from "../context/questions";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  TextRun,
} from "docx";
import { renderAsync } from "docx-preview";
import { LongQuestion, McqQuestion, ShortQuestion } from "./doc-components";
import { QUESTION_TYPES } from "../lib/globalContants";
import { useMetaDataContext } from "../context/use-metadata-context";
import { saveAs } from "file-saver";
import { FaDownload } from "react-icons/fa";

const RenderMyDoc = () => {
  const { questions } = useQuestionsContext();
  const { metaData } = useMetaDataContext();

  const previewRef = useRef<HTMLDivElement>(null);

  // @ts-ignore
  let doc;

  useEffect(() => {
    async function generatePreview() {
      const docChildren: Array<Paragraph | Table> = [
        new Paragraph({
          children: [
            new TextRun({
              text: metaData?.title || "Your Papers Title Here",
              size: 34, // Font size in half-points: 32 = 16pt
              color: "000000", // Hexadecimal font color
              bold: true,
              italics: false,
              font: "Times New Roman",
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          alignment: "center",
        }),
        // new Table({
        //   width: {
        //     size: 100,
        //     type: WidthType.PERCENTAGE,
        //   },
        //   alignment: "left",
        //   borders: {
        //     top: { style: BorderStyle.NONE, size: 0, color: "auto" },
        //     bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
        //     left: { style: BorderStyle.NONE, size: 0, color: "auto" },
        //     right: { style: BorderStyle.NONE, size: 0, color: "auto" },
        //     insideHorizontal: {
        //       style: BorderStyle.NONE,
        //       size: 0,
        //       color: "auto",
        //     },
        //     insideVertical: {
        //       style: BorderStyle.NONE,
        //       size: 0,
        //       color: "auto",
        //     },
        //   },
        //   rows: [
        //     new TableRow({
        //       children: [
        //         new TableCell({
        //           children: [
        //             new Paragraph({
        //               alignment: "left",
        //               text: "Name: _________________",
        //             }),
        //           ],
        //         }),
        //         new TableCell({
        //           children: [
        //             new Paragraph({
        //               alignment: "right",
        //               text: "Date: _________",
        //             }),
        //           ],
        //         }),
        //       ],
        //     }),
        //   ],
        // }),
      ];

      questions.forEach((q: QuestionContextType, idx) => {
        switch (q.type) {
          case QUESTION_TYPES.mcqsQuestion:
            docChildren.push(...McqQuestion({ q, idx }));
            break;
          case QUESTION_TYPES.shortQuestion:
            docChildren.push(ShortQuestion({ q, idx }));
            break;
          case QUESTION_TYPES.longQuestion:
            docChildren.push(LongQuestion({ q, idx }));
            break;
          default:
            break;
        }
      });

      doc = new Document({
        styles: {
          default: {
            document: {
              run: {
                font: "Times New Roman",
              },
            },
          },
        },
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720, // 1 inch
                  right: 720, // 1 inch
                  bottom: 720, // 1 inch
                  left: 720, // 1 inch
                },
              },
            },
            children: docChildren,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);

      if (previewRef.current) {
        previewRef.current.innerHTML = "";

        // Render actual Word document
        await renderAsync(blob, previewRef.current, previewRef.current, {
          className: "docx-preview",
          inWrapper: true,
          breakPages: true,
        });
      }
    }

    generatePreview();
  }, [questions]);

  async function saveDoc() {
    // @ts-ignore
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "doc.docx");
  }

  return (
    <div className="">
      <div className="bg-gray-800 absolute top-10 right-10 rounded-lg">
        <button onClick={saveDoc} className="py-1 px-2">
          <FaDownload aria-label="Download document" />
        </button>
      </div>
      <div
        style={{
          marginTop: "70px",
        }}
      >
        <div style={{ width: "fit-content" }} ref={previewRef}></div>
      </div>
    </div>
  );
};

export default RenderMyDoc;
