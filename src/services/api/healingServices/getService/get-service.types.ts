import type {Service} from '../getServices/services.types';

/**
 * `data` payload of the `GetService` operation.
 *
 * `getService` is nullable: an unknown `slug` resolves to `null` instead of
 * raising a GraphQL error, so callers must treat `null` as "service not
 * found" rather than as a failure. `Service.astrologerMappings` is nullable
 * too, and may be an empty array when a service has no astrologer assigned.
 */
export interface GetServiceResponse {
  getService: Service | null;
}
