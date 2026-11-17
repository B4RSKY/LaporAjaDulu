/** Minimal privacy-aware activity audit protocol. Never log passwords, tokens, or precise GPS. */
export type AuditAction = 'LOCATION_PERMISSION_GRANTED' | 'LOCATION_PERMISSION_DENIED' | 'LOCATION_TRACKING_STARTED' | 'LOCATION_TRACKING_STOPPED' | 'REPORT_MARKER_SELECTED';

export interface AuditEvent {
  action: AuditAction;
  occurredAt: string;
  actor: 'anonymous' | 'authenticated';
  metadata?: Record<string, string | number | boolean>;
}

export function createAuditEvent(
  action: AuditAction,
  metadata?: AuditEvent['metadata'],
  actor: AuditEvent['actor'] = 'anonymous'
): AuditEvent {
  return { action, occurredAt: new Date().toISOString(), actor, metadata };
}

/** Replace this sink with the approved backend logger when the API is available. */
export function recordAuditEvent(event: AuditEvent): void {
  if (__DEV__) console.info('[AUDIT]', event);
}
