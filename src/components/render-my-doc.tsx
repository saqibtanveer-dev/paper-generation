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
  Header,
} from "docx";
import { renderAsync } from "docx-preview";
import { LongQuestion, McqQuestion, ShortQuestion } from "./doc-components";
import { QUESTION_TYPES } from "../lib/globalContants";
import { useMetaDataContext } from "../context/use-metadata-context";
import { saveAs } from "file-saver";
import { FaDownload } from "react-icons/fa";
import { TextWatermark } from "docx/watermarks";

const RenderMyDoc = () => {
  let { questions } = useQuestionsContext();
  const mcqs = questions.filter((q) => q.type === QUESTION_TYPES.mcqsQuestion);
  const short = questions.filter((q) => q.type === QUESTION_TYPES.shortQuestion);
  const long = questions.filter((q) => q.type === QUESTION_TYPES.longQuestion);
  questions = [...short ,...mcqs]
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
        new Paragraph({ spacing: { after: 200 } }),
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          alignment: "left",

          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: {
              style: BorderStyle.NONE,
              size: 0,
              color: "auto",
            },
            insideVertical: {
              style: BorderStyle.NONE,
              size: 0,
              color: "auto",
            },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: "left",
                      text: metaData?.time ? `Time: ${metaData.time}` : "",
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: "right",
                      text: metaData?.marks ? `Marks: ${metaData.marks}` : "",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
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
            headers: {
              default: new Header({
                children: [
                  new Paragraph({
                    children: [
                      new TextWatermark({
                        text: "FAITH HORIZON",
                        font: "Arial",
                        color: "D9D9D9",
                        opacity: 0.25,
                        bold: true,
                        layout: "diagonal",
                      }),
                    ],
                  }),
                ],
              }),
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

        const watermarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 794 1123"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" transform="rotate(-45 397 561.5)" fill="#D9D9D9" fill-opacity="0.6" font-family="Arial,sans-serif" font-size="68" font-weight="700">FAITH HORIZON</text></svg>`;
        const watermarkBackground = `url("data:image/svg+xml,${encodeURIComponent(watermarkSvg)}")`;

        previewRef.current
          .querySelectorAll<HTMLElement>("section.docx-preview")
          .forEach((page) => {
            page.style.backgroundImage = watermarkBackground;
            page.style.backgroundPosition = "center";
            page.style.backgroundRepeat = "no-repeat";
            page.style.backgroundSize = "100% 100%";
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
