const CREATABLE_STATES = new Set(['drafted', 'quality_blocked', 'review_ready']);

type ExistingAutomationState = {
  published: boolean;
  automationStatus?: string | null;
};

type RequestedAutomationState = {
  published?: boolean;
  automationStatus?: string;
};

export type PublishedAutomationDisposition = 'mutable' | 'idempotent' | 'blocked';
export type AutomationRunRetryDisposition = 'idempotent' | 'promote_quality_blocked' | 'conflict';

export function isCreatableAutomationState(status?: string | null) {
  return CREATABLE_STATES.has(status || 'drafted');
}

/**
 * A stable automation run may be replayed after an upstream failure. Matching
 * private drafts are read-only successes, except for one fail-closed recovery:
 * a quality-blocked draft may become review-ready after the create route has
 * revalidated the complete replacement payload. All other state changes stay
 * on their dedicated review endpoints.
 */
export function getAutomationRunRetryDisposition(
  existing: ExistingAutomationState,
  requested: RequestedAutomationState,
): AutomationRunRetryDisposition {
  if (existing.published || existing.automationStatus === 'published') return 'conflict';

  const existingStatus = existing.automationStatus || 'drafted';
  const requestedStatus = requested.automationStatus || 'drafted';
  if (existingStatus === requestedStatus) return 'idempotent';

  if (
    existingStatus === 'quality_blocked' &&
    requestedStatus === 'review_ready' &&
    requested.published !== true
  ) {
    return 'promote_quality_blocked';
  }

  return 'conflict';
}

/**
 * Once a post is public, the automation credential must not be able to alter
 * its copy, metadata or media. The one exception is an exact replay of the
 * two-field approval request: n8n may retry after a network timeout even when
 * the first request already succeeded, so that replay is a read-only success.
 */
export function getPublishedAutomationDisposition(
  existing: ExistingAutomationState,
  requested: RequestedAutomationState,
): PublishedAutomationDisposition {
  if (!existing.published && existing.automationStatus !== 'published') return 'mutable';

  const requestedKeys = Object.keys(requested);
  const isExactApprovalReplay =
    requested.published === true &&
    requested.automationStatus === 'approved' &&
    requestedKeys.length === 2 &&
    requestedKeys.every((key) => key === 'published' || key === 'automationStatus');

  return isExactApprovalReplay ? 'idempotent' : 'blocked';
}

/**
 * Protects the public CMS from invalid or replayed bot transitions.
 * Ordinary metadata edits that do not request an automation-state change pass.
 */
export function getAutomationTransitionError(
  existing: ExistingAutomationState,
  requested: RequestedAutomationState
): { status: number; message: string } | null {
  if (existing.published && requested.published === false) {
    return { status: 409, message: 'The automation API cannot unpublish an already-published post' };
  }

  if (requested.automationStatus === 'approved' && requested.published !== true) {
    return { status: 400, message: 'Approved status is valid only in the same request that publishes the post' };
  }

  if (requested.automationStatus === 'published') {
    return { status: 400, message: 'Published status is set by the server after a successful approval' };
  }

  if (
    requested.automationStatus === 'rejected' &&
    !['review_ready', 'rejected'].includes(existing.automationStatus || '')
  ) {
    return { status: 409, message: 'Only a review-ready draft can be rejected' };
  }

  if (
    requested.automationStatus === 'review_ready' &&
    existing.automationStatus !== 'review_ready'
  ) {
    return { status: 409, message: 'Only a review-ready draft can receive a regenerated cover' };
  }

  return null;
}
