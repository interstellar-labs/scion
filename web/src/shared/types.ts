/**
 * Shared types for server and client
 */

/**
 * User information
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | undefined;
}

/**
 * Initial page data passed from SSR to client
 */
export interface PageData {
  /** Current URL path */
  path: string;
  /** Page title */
  title: string;
  /** Current user (if authenticated) */
  user?: User | undefined;
  /** Additional page-specific data */
  data?: Record<string, unknown> | undefined;
}

/**
 * Route definition for client-side routing
 */
export interface RouteConfig {
  path: string;
  component: string;
  action?: () => Promise<void>;
}

/**
 * Grove status enumeration
 */
export type GroveStatus = 'active' | 'inactive' | 'error';

/**
 * Grove information from the Hub API
 */
export interface Grove {
  id: string;
  name: string;
  path: string;
  status: GroveStatus;
  agentCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Agent status enumeration
 */
export type AgentStatus = 'running' | 'stopped' | 'provisioning' | 'error';

/**
 * Agent session status
 */
export type AgentSessionStatus = 'idle' | 'active' | 'busy' | 'disconnected';

/**
 * Agent information from the Hub API
 */
export interface Agent {
  id: string;
  name: string;
  groveId: string;
  template: string;
  status: AgentStatus;
  sessionStatus?: AgentSessionStatus;
  taskSummary?: string;
  createdAt: string;
  updatedAt: string;
}
