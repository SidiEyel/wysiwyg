import type { Channel, Lane, Lang, Status } from "./types"

/** The interface is available in the same languages as the drafts. */
export type Locale = Lang

export const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "fr", label: "Français" },
  { id: "ar", label: "العربية" },
]

const en = {
  appTitle: "Review queue",
  appSubtitle: "AI drafts waiting for your approval",
  interfaceLanguage: "Interface language",
  progress: "{done} of {total} reviewed",

  laneAll: "All",
  laneOutreach: "Outreach",
  laneAds: "Ads",
  lanePosts: "Posts",

  channelEmail: "Cold email",
  channelGoogleSearch: "Google Search ad",
  channelLinkedin: "LinkedIn ad",
  channelBlog: "Blog post",

  langEn: "English",
  langFr: "French",
  langAr: "Arabic",

  statusPending: "Pending",
  statusApproved: "Approved",
  statusChangesRequested: "Changes requested",

  fieldSubject: "Subject",
  fieldBody: "Body",
  fieldHeadline: "Headline",
  fieldDescription: "Description",
  fieldIntro: "Introductory text",
  fieldTitle: "Title",
  fieldMetaDescription: "Meta description",

  audience: "Audience",
  edited: "Edited",
  restore: "Restore AI draft",
  back: "Back to queue",

  checks: "Checks",
  checksPassed: "All checks passed",
  blocking: "Blocking",
  ruleFrSpacing: "No-break space missing before punctuation",
  ruleArPunctuation: "Latin punctuation in Arabic text",
  ruleMergeField: "Unknown merge field",
  ruleLengthHard: "Over the {max}-character limit",
  ruleLengthSoft: "May be cut off after {max} characters",
  fix: "Fix",
  useField: "Use {field}",

  approve: "Approve",
  requestChanges: "Request changes",
  blockedHint: "Resolve the blocking checks to approve",
  noteLabel: "Note for the agent",
  notePlaceholder: "What should change in the next draft?",
  sendBack: "Send back",
  cancel: "Cancel",
  reopen: "Reopen",
  noteSent: "Your note",

  emptyLane: "No drafts in this lane.",
  allReviewed: "Queue cleared. Every draft has been reviewed.",

  footerBuiltWith: "Built with",
  footerSource: "Source",
  footerFictional: "Sample data is fictional.",
  reset: "Reset demo",
}

export type MessageKey = keyof typeof en

const fr: Record<MessageKey, string> = {
  appTitle: "File de validation",
  appSubtitle: "Brouillons rédigés par l'IA en attente de votre validation",
  interfaceLanguage: "Langue de l'interface",
  progress: "{done} sur {total} traités",

  laneAll: "Tous",
  laneOutreach: "Prospection",
  laneAds: "Publicités",
  lanePosts: "Articles",

  channelEmail: "E-mail de prospection",
  channelGoogleSearch: "Annonce Google Search",
  channelLinkedin: "Publicité LinkedIn",
  channelBlog: "Article de blog",

  langEn: "Anglais",
  langFr: "Français",
  langAr: "Arabe",

  statusPending: "En attente",
  statusApproved: "Approuvé",
  statusChangesRequested: "Modifications demandées",

  fieldSubject: "Objet",
  fieldBody: "Contenu",
  fieldHeadline: "Titre",
  fieldDescription: "Description",
  fieldIntro: "Texte d'introduction",
  fieldTitle: "Titre",
  fieldMetaDescription: "Méta-description",

  audience: "Audience",
  edited: "Modifié",
  restore: "Rétablir le brouillon de l'IA",
  back: "Retour à la file",

  checks: "Vérifications",
  checksPassed: "Toutes les vérifications sont passées",
  blocking: "Bloquant",
  ruleFrSpacing: "Espace insécable manquante avant la ponctuation",
  ruleArPunctuation: "Ponctuation latine dans un texte arabe",
  ruleMergeField: "Champ de fusion inconnu",
  ruleLengthHard: "Limite de {max} caractères dépassée",
  ruleLengthSoft: "Risque de coupure au-delà de {max} caractères",
  fix: "Corriger",
  useField: "Utiliser {field}",

  approve: "Approuver",
  requestChanges: "Demander des modifications",
  blockedHint: "Corrigez les vérifications bloquantes pour approuver",
  noteLabel: "Note pour l'agent",
  notePlaceholder: "Que faut-il changer dans le prochain brouillon ?",
  sendBack: "Renvoyer",
  cancel: "Annuler",
  reopen: "Rouvrir",
  noteSent: "Votre note",

  emptyLane: "Aucun brouillon dans cette file.",
  allReviewed: "File vidée. Tous les brouillons ont été traités.",

  footerBuiltWith: "Réalisé avec",
  footerSource: "Code source",
  footerFictional: "Les données d'exemple sont fictives.",
  reset: "Réinitialiser la démo",
}

const ar: Record<MessageKey, string> = {
  appTitle: "قائمة المراجعة",
  appSubtitle: "مسودات كتبها الذكاء الاصطناعي بانتظار موافقتك",
  interfaceLanguage: "لغة الواجهة",
  progress: "تمت مراجعة {done} من {total}",

  laneAll: "الكل",
  laneOutreach: "المراسلات",
  laneAds: "الإعلانات",
  lanePosts: "المقالات",

  channelEmail: "رسالة تعريفية",
  channelGoogleSearch: "إعلان على بحث Google",
  channelLinkedin: "إعلان على LinkedIn",
  channelBlog: "مقال للمدونة",

  langEn: "الإنجليزية",
  langFr: "الفرنسية",
  langAr: "العربية",

  statusPending: "قيد الانتظار",
  statusApproved: "تمت الموافقة",
  statusChangesRequested: "طُلبت تعديلات",

  fieldSubject: "الموضوع",
  fieldBody: "النص",
  fieldHeadline: "العنوان الرئيسي",
  fieldDescription: "الوصف",
  fieldIntro: "النص التمهيدي",
  fieldTitle: "العنوان",
  fieldMetaDescription: "الوصف التعريفي",

  audience: "الجمهور المستهدف",
  edited: "معدَّلة",
  restore: "استعادة مسودة الذكاء الاصطناعي",
  back: "العودة إلى القائمة",

  checks: "الفحوصات",
  checksPassed: "اجتازت المسودة جميع الفحوصات",
  blocking: "مانع",
  ruleFrSpacing: "مسافة غير منقسمة ناقصة قبل علامة الترقيم",
  ruleArPunctuation: "علامات ترقيم لاتينية في نص عربي",
  ruleMergeField: "حقل دمج غير معروف",
  ruleLengthHard: "تجاوز الحد الأقصى ({max} حرفاً)",
  ruleLengthSoft: "قد يُقتطع النص بعد {max} حرفاً",
  fix: "إصلاح",
  useField: "استخدام {field}",

  approve: "موافقة",
  requestChanges: "طلب تعديلات",
  blockedHint: "عالج الفحوصات المانعة لتتمكن من الموافقة",
  noteLabel: "ملاحظة للوكيل",
  notePlaceholder: "ما الذي يجب تغييره في المسودة القادمة؟",
  sendBack: "إعادة للتعديل",
  cancel: "إلغاء",
  reopen: "إعادة الفتح",
  noteSent: "ملاحظتك",

  emptyLane: "لا توجد مسودات في هذه القائمة.",
  allReviewed: "اكتملت المراجعة. تمت معالجة جميع المسودات.",

  footerBuiltWith: "مبني باستخدام",
  footerSource: "الشيفرة المصدرية",
  footerFictional: "بيانات العرض خيالية.",
  reset: "إعادة ضبط العرض",
}

const MESSAGES: Record<Locale, Record<MessageKey, string>> = { en, fr, ar }

export type Translate = (key: MessageKey, params?: Record<string, string | number>) => string

export function createTranslator(locale: Locale): Translate {
  return (key, params = {}) =>
    MESSAGES[locale][key].replace(/\{(\w+)\}/g, (placeholder, name: string) =>
      name in params ? String(params[name]) : placeholder,
    )
}

export function detectLocale(): Locale {
  const preferred = navigator.language.slice(0, 2)
  return LOCALES.find((locale) => locale.id === preferred)?.id ?? "en"
}

/** "12 minutes ago", in the interface language. */
export function formatAge(minutes: number, locale: Locale): string {
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "always" })
  return minutes < 60 ? format.format(-minutes, "minute") : format.format(-Math.round(minutes / 60), "hour")
}

export const LANE_LABEL: Record<Lane | "all", MessageKey> = {
  all: "laneAll",
  outreach: "laneOutreach",
  ads: "laneAds",
  posts: "lanePosts",
}

export const CHANNEL_LABEL: Record<Channel, MessageKey> = {
  email: "channelEmail",
  googleSearch: "channelGoogleSearch",
  linkedin: "channelLinkedin",
  blog: "channelBlog",
}

export const LANG_LABEL: Record<Lang, MessageKey> = {
  en: "langEn",
  fr: "langFr",
  ar: "langAr",
}

export const STATUS_LABEL: Record<Status, MessageKey> = {
  pending: "statusPending",
  approved: "statusApproved",
  changesRequested: "statusChangesRequested",
}

export const FIELD_LABEL: Record<string, MessageKey> = {
  subject: "fieldSubject",
  body: "fieldBody",
  headline: "fieldHeadline",
  description: "fieldDescription",
  intro: "fieldIntro",
  title: "fieldTitle",
  metaDescription: "fieldMetaDescription",
}
