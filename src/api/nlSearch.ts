import type { UnifiedLemPayload, NlFilterResult } from '../types/lem'

/**
 * Mock NL query parser: returns structured filters to drive equipment pins,
 * alert highlighting, and cert/role filters. Supports queries like
 * "electricians with expiring OSHA certs" or "idle dozers on Site B".
 */
export function parseNlQuery(query: string, _payload: UnifiedLemPayload): NlFilterResult | null {
  const q = query.trim().toLowerCase()
  if (!q) return null

  const result: NlFilterResult = {}

  // Idle equipment / dozers / excavators / Site B
  const idleMatch = /\bidle\b/.test(q)
  const dozerMatch = /\bdozer(s)?\b/.test(q)
  const excavatorMatch = /\bexcavator(s)?\b/.test(q)
  const siteBMatch = /\bsite\s*b\b/.test(q)
  const siteAMatch = /\bsite\s*a\b/.test(q)

  if (idleMatch || dozerMatch || excavatorMatch || siteBMatch || siteAMatch) {
    result.equipmentFilter = {}
    if (idleMatch) result.equipmentFilter.idleOnly = true
    if (dozerMatch) result.equipmentFilter.type = 'Dozer'
    else if (excavatorMatch) result.equipmentFilter.type = 'Excavator'
    if (siteBMatch) result.equipmentFilter.site = 'Site B'
    else if (siteAMatch) result.equipmentFilter.site = 'Site A'
  }

  // OSHA / certs / electricians (highlight compliance alerts)
  const certMatch = /\b(osha|cert(s)?|expiring)\b/.test(q)
  const electricianMatch = /\belectrician(s)?\b/.test(q)
  const operatorMatch = /\boperator(s)?\b/.test(q)

  if (certMatch || electricianMatch || operatorMatch) {
    result.alertHighlightIds = ['risk_002']
    if (electricianMatch) result.certOrRoleFilter = 'electrician'
    else if (operatorMatch) result.certOrRoleFilter = 'operator'
  }

  if (Object.keys(result).length === 0) return null
  return result
}
