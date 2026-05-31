import { z } from "zod";

export const quickSearchSchema = z.object({
  query: z.string().min(2, "Vui lòng nhập ít nhất 2 ký tự"),
});

export type QuickSearchFormValues = z.infer<typeof quickSearchSchema>;
