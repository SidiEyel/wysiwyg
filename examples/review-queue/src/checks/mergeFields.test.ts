import { describe, expect, it } from "vitest"
import { findUnknownMergeFields } from "./mergeFields"

const KNOWN = ["first_name", "company"]

describe("findUnknownMergeFields", () => {
  it("accepts known fields, with or without inner spaces", () => {
    expect(findUnknownMergeFields("Hi {{first_name}} at {{ company }}", KNOWN)).toEqual([])
  })

  it("reports an unknown field with its position", () => {
    expect(findUnknownMergeFields("Hi {{role}}", KNOWN)).toEqual([{ name: "role", from: 3, to: 11, suggestion: undefined }])
  })

  it("suggests the known field a typo most likely meant", () => {
    const [finding] = findUnknownMergeFields("Hi {{frist_name}},", KNOWN)
    expect(finding.suggestion).toBe("first_name")
  })

  it("ignores single braces", () => {
    expect(findUnknownMergeFields("Use {curly} braces", KNOWN)).toEqual([])
  })
})
