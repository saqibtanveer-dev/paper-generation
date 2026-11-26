import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import type { MCQQuestionContextType, QuestionContextType } from "../context/questions";

export const ShortQuestion = ({q, idx}: {q: QuestionContextType, idx: number}) => {
    return (
        new Paragraph({
            alignment: "left",
            children: [
              new TextRun({ text: `${idx + 1}. ${q.statement}`, bold: true }),
            ],
            spacing: { before: 200, after: 100 },
          })
    )
}

export const LongQuestion = ({q, idx}: {q: QuestionContextType, idx: number}) => {
    return (
        new Paragraph({
            alignment: "left",
            children: [
              new TextRun({ text: `${idx + 1}. ${q.statement}`, bold: true }),
            ],
            spacing: { before: 200, after: 100 },
          })
    )
}

export const McqQuestion = ({q, idx}: {q: MCQQuestionContextType, idx: number}) => {
  console.log("options are: ", q.options)
    return (
    [
        new Paragraph({
        alignment: "left",
        children: [
          new TextRun({ text: `${idx + 1}. ${q.statement}`, bold: true }),
        ],
        spacing: { before: 200, after: 100 },
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
          },
          rows: [
            new TableRow({
              children: q.options.map((option: string, optionIdx: number) => {
                return new TableCell({
                  width: {
                    size: 100 / q.options.length,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      text: `${String.fromCharCode(9424 + optionIdx)}. ${option}`,
                    }),
                  ],
                });
              }),
            }),
          ],
        }),
    ]
  )
}