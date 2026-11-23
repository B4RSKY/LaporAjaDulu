export type AuditAction =
  | 'LOCATION_PERMISSION_GRANTED'
  | 'LOCATION_PERMISSION_DENIED'
  | 'LOCATION_TRACKING_STARTED'
  | 'LOCATION_TRACKING_STOPPED'
  | 'REPORT_MARKER_SELECTED'
  | 'CAMERA_PERMISSION_GRANTED'
  | 'CAMERA_PERMISSION_DENIED'
  | 'EVIDENCE_PHOTO_CAPTURED'
  | 'VAULT_DOCUMENT_SAVED'
  | 'VAULT_DOCUMENT_DELETED';

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

export function recordAuditEvent(event: AuditEvent): void {
  if (__DEV__) console.info('[AUDIT]', event);
}