// Path params for /organizations/{id} and /organizations/{id}/environments
export interface ListEnvironmentsPathParams {
  /** Organization ID (path: {id}) */
  id: string;
}

// Query params (?limit=)
export interface ListEnvironmentsQueryParams {
  /** Limit queries for list of resources */
  limit?: number;
}

// Organization (200 response body for GET /organizations/{id})
// Based on components.schemas.Organization in the Testkube Control Plane OpenAPI
export interface Organization {
  /** Organization ID */
  id: string;
  /** Organization name */
  name: string;
  /** Human- and URL friendly identifier */
  slug: string;

  // Optional fields from BasicObject
  description?: string;
  labels?: Record<string, string>;
  createdAt?: string; // ISO date-time
  updatedAt?: string; // ISO date-time
}

// Environment status values from the spec
export type EnvironmentStatus = 'Green' | 'Yellow' | 'Red';

// Environment feature
export interface EnvironmentFeature {
  /** Feature name (machine-readable) */
  name: string;
  /** Feature display name */
  displayName?: string;
  /** Feature description */
  description?: string;
  /** URL to learn more about the feature */
  learnMoreUrl?: string;
  /** Is feature enabled? */
  enabled: boolean;
}

// Single environment item
export interface Environment {
  // From BasicObject
  id: string;
  name: string;
  description?: string;
  labels?: Record<string, string>;
  createdAt?: string; // ISO date-time
  updatedAt?: string; // ISO date-time

  // Environment-specific
  slug?: string;
  /** State of the agent connection */
  connected?: boolean;
  /** State of the environment */
  status?: EnvironmentStatus;
  organizationID?: string;
  sourceOfTruthSince?: string; // ISO date-time

  // Agent / connect commands
  agentToken?: string;
  connectCommand?: string;
  disconnectCommand?: string;
  installCommand?: string;
  installCommandCli?: string;
  configureContextCommand?: string;

  // Features & commands
  features?: EnvironmentFeature[];
  runDockerCommand?: string;
  runDockerCommandCli?: string;
  upgradeDockerCommand?: string;
  upgradeDockerCommandCli?: string;

  // Architecture / storage flags
  cloudStorage?: boolean;
  newArchitecture?: boolean;

  // Runner-related
  runnerJoinToken?: string;
  runnerConcurrencyLimit?: number;
  environmentQueueLimit?: number;
  installRunnerCommand?: string;
}

// 200 response body for GET /organizations/{id}/environments
export interface ListEnvironmentsResponse {
  elements: Environment[];
}
