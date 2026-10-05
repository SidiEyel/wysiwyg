import { describe, expect, it } from "vitest"
import { applyEdits, checkLength, checkText, codePointLength } from "./index"

describe("checkText", () => {
  it("runs typography rules only for their language", () => {
    const text = "Bonjour ! مرحباً, hello"
    const rules = (lang: "en" | "fr" | "ar") => checkText(text, { lang, mergeFields: [] }).map((finding) => finding.rule)

    expect(rules("en")).toEqual([])
    expect(rules("fr")).toEqual(["frSpacing"])
    expect(rules("ar")).toEqual(["arPunctuation"])
  })

  it("marks an unknown merge field as blocking and offers the fix", () => {
    const text = "Hi {{frist_name}}"
    const [finding] = checkText(text, { lang: "en", mergeFields: ["first_name"] })

    expect(finding).toMatchObject({ rule: "mergeField", blocking: true, name: "frist_name" })
    expect(finding.rule === "mergeField" && finding.edit && applyEdits(text, [finding.edit])).toBe("Hi {{first_name}}")
  })
})

describe("checkLength", () => {
  it("passes at the limit and fails one past it", () => {
    expect(checkLength(30, { max: 30, kind: "hard" })).toBeNull()
    expect(checkLength(31, { max: 30, kind: "hard" })).toEqual({ rule: "length", blocking: true, length: 31, max: 30 })
  })

  it("only blocks on hard limits", () => {
    expect(checkLength(61, { max: 60, kind: "soft" })?.blocking).toBe(false)
  })
})

describe("codePointLength", () => {
  it("counts an Arabic diacritic as its own character", () => {
    expect(codePointLength("تكلّف")).toBe(5)
  })

  it("counts an astral character once", () => {
    expect(codePointLength("a😀")).toBe(2)
  })
})

describe("applyEdits", () => {
  it("applies several edits regardless of order", () => {
    const edits = [
      { from: 0, to: 1, insert: "A" },
      { from: 4, to: 4, insert: "!" },
      { from: 2, to: 3, insert: "" },
    ]
    expect(applyEdits("abcd", edits)).toBe("Abd!")
  })
})
