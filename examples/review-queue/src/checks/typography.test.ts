import { describe, expect, it } from "vitest"
import { applyEdits } from "./text"
import { arabicPunctuationEdits, frenchSpacingEdits } from "./typography"

const NBSP = " "
const NARROW = " "

const fixFrench = (text: string) => applyEdits(text, frenchSpacingEdits(text))
const fixArabic = (text: string) => applyEdits(text, arabicPunctuationEdits(text))

describe("frenchSpacingEdits", () => {
  it("replaces a breaking space before ; ! ? with a narrow no-break space", () => {
    expect(fixFrench("Vraiment ? Oui ! Enfin ; presque")).toBe(`Vraiment${NARROW}? Oui${NARROW}! Enfin${NARROW}; presque`)
  })

  it("adds the space when it is missing", () => {
    expect(fixFrench("Bonjour!")).toBe(`Bonjour${NARROW}!`)
  })

  it("uses a full no-break space before a colon", () => {
    expect(fixFrench("Le résultat : rien")).toBe(`Le résultat${NBSP}: rien`)
  })

  it("spaces a run of marks once", () => {
    expect(fixFrench("Quoi ?!")).toBe(`Quoi${NARROW}?!`)
  })

  it("adds no-break spaces inside guillemets", () => {
    expect(fixFrench("Il a dit «oui» puis « non ».")).toBe(`Il a dit «${NBSP}oui${NBSP}» puis «${NBSP}non${NBSP}».`)
    expect(fixFrench("« Vraiment ? »")).toBe(`«${NBSP}Vraiment${NARROW}?${NBSP}»`)
  })

  it("leaves times, URLs and emoticons alone", () => {
    for (const text of ["Rendez-vous à 10:30", "Voir https://acme.test/?", "Parfait :)"]) {
      expect(frenchSpacingEdits(text)).toEqual([])
    }
  })

  it("finds nothing left to fix in its own output", () => {
    const fixed = fixFrench("Prêt ? Voici le plan : «simple» et rapide !")
    expect(frenchSpacingEdits(fixed)).toEqual([])
  })
})

describe("arabicPunctuationEdits", () => {
  it("replaces Latin marks next to Arabic text", () => {
    expect(fixArabic("مرحباً, كيف الحال?")).toBe("مرحباً، كيف الحال؟")
    expect(fixArabic("أولاً; ثانياً")).toBe("أولاً؛ ثانياً")
  })

  it("replaces a mark between a Latin word and Arabic text", () => {
    expect(fixArabic("نستخدم API, وهي سريعة")).toBe("نستخدم API، وهي سريعة")
  })

  it("looks past merge fields, which are replaced at send time", () => {
    expect(fixArabic("مرحباً {{first_name}}, شكراً")).toBe("مرحباً {{first_name}}، شكراً")
  })

  it("leaves Latin phrases, URLs and numbers alone", () => {
    for (const text of ["قال: Hello, world ثم غادر", "زوروا https://acme.test/pricing?plan=pro اليوم", "السعر 1,000 دولار"]) {
      expect(arabicPunctuationEdits(text)).toEqual([])
    }
  })
})
