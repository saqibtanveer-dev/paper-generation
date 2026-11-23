import { useEffect, useRef } from "react";
import { useQuestionsContext, type QuestionContextType } from "../context/questions";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { renderAsync } from "docx-preview";
import { LongQuestion, McqQuestion, ShortQuestion } from "./doc-components";
import { QUESTION_TYPES } from "../lib/globalContants";

const RenderMyDoc = () => {
  const { questions } = useQuestionsContext();

  const previewRef = useRef(null);

  useEffect(() => {
    async function generatePreview() {
      const docChildren: Array<Paragraph | Table> = [
        new Paragraph({
          text: "Computer Science Question Paper",
          heading: HeadingLevel.HEADING_4,
          alignment: "center",
        }),
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
                      text: "Name: _________________",
                    }),
                  ],
                }),
                 new TableCell({
                  children: [
                    new Paragraph({
                      alignment: "right",
                      text: "Date: _________",
                    }),
                  ],
                }),
              ],
            }),
          ]
        }),
      ];

      questions.forEach((q: QuestionContextType, idx) => {
        switch (q.type) {
          case QUESTION_TYPES.mcqsQuestion:
            docChildren.push(...McqQuestion({ q, idx }))
            break;
          case QUESTION_TYPES.shortQuestion:
            docChildren.push(ShortQuestion({q, idx}));
            break;
          case QUESTION_TYPES.longQuestion:
            docChildren.push(LongQuestion({ q, idx }));
            break;
          default:
            break;
        }
      });

      const doc = new Document({
        sections: [
          {
            properties: {
            page: {
              margin: {
                top: 720, // 1 inch
                right: 720, // 1 inch
                bottom: 720, // 1 inch
                left: 720, // 1 inch
              }
            }
          },
            children: docChildren,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);

      if (previewRef.current) {
        //@ts-ignore
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

  return (
    <div
      style={{
        height: "100%",
        overflow: "auto",
        background: "#ddd",
        padding: "20px",
        width: "fit-content"
      }}
    >
      <div style={{width: "fit-content"}} ref={previewRef}></div>
    </div>
  );
};

export default RenderMyDoc;
