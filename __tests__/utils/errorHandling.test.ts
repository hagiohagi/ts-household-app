import { isFireStoreError } from "@/utils/errorHandling";

describe("isFireStoreError", () => {
  it("FireStoreErrorを判定すr", () => {
    const error = { code: "permission-denied", message: "Permission denied" };
    expect(isFireStoreError(error)).toBe(true);
  });

  it("codeプロパティが含まれないないエラーを判定する", () => {
    const error = { message: "Some other error" };
    expect(isFireStoreError(error)).toBe(false);
  });

  it("オブジェクト型でないエラーを判定する", () => {
    expect(isFireStoreError("string")).toBe(false);
    expect(isFireStoreError(123)).toBe(false);
    expect(isFireStoreError(null)).toBe(false);
  });
});