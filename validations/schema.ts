import { z } from "zod"

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, { message: "日付は必須です" }),
  amount: z.number()
    .min(0, { message: "金額は0以上で入力してください" })
    .refine((val) => Number.isInteger(val), { message: "金額は整数で入力してください" }),
  content: z.string()
    .min(1, { message: "内容を入力してください" })
    .max(50, { message: "内容は50文字以内にしてください" }),
  category: z.enum(["食費", "日用品", "住居費", "交際費", "娯楽", "交通費", "給与", "副収入", "お小遣い", ""])
    .superRefine((val, ctx) => {
      // 空文字を選択している場合はメッセージを表示する
      if (val === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "カテゴリを選択してください",
        });
      }
    }),
});

export type Schema = z.infer<typeof transactionSchema> 