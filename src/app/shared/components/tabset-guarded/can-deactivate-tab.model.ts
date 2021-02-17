import { Observable } from 'rxjs';

/**
 * Interface for implementing tab deactivation events.
 */
export interface CanDeactivateTabInterface {
  canDeactivateTab(deactivationType: DeactivationType): Observable<boolean>;
}

export type DeactivationType = 'tabChange' | 'pageChange';
