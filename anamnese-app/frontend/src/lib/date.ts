export function formatDateOnlyLocal(value?: string | null, language: string = 'pt-BR') {
  if (!value) return '-'
  // Expecting value as yyyy-MM-dd (from backend DateOnly or <input type="date">)
  const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(value)
  if (!m) return value
  const [, y, mm, dd] = m
  if (language.toLowerCase().startsWith('pt')) {
    return `${dd}/${mm}/${y}` // dd/MM/yyyy
  }
  return `${mm}/${dd}/${y}` // MM/dd/yyyy
}

export function formatDateTimeLocal(value?: string | null, language: string = 'pt-BR') {
  if (!value) return '-'
  try {
    const dt = new Date(value)
    return dt.toLocaleString(language)
  } catch {
    return String(value)
  }
}

