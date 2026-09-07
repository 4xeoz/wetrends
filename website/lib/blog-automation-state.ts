const CREATABLE_STATES = new Set(['drafted', 'quality_blocked', 'review_ready']);

type ExistingAutomationState = {
  published: boolean;
  automationStatus?: string | null;
};

type RequestedAutomationState = {
  published?: boolean;
  automationStatus?: string;
};

export function isCreatableAutomationState(status?: string | null) {
  return CREATABLE_STATES.has(status || 'drafted');
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
