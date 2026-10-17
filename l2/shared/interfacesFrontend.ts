/// <mls fileReference="_102036_/l2/shared/interfacesFrontend.ts" enhancement="_blank"/>

export type IAgentMeta = {
  visibility: 'public' | 'private';
  agentName: string;
  agentProject?: number;
  agentFolder?: string;
  scope?: string[];
  avatar_url?: string;
  agentDescription: string;
}

// Interfaces Integrations
export interface IOpenClawAgent {
  id: string;
  name: string;
  avatarUrl: string;
  collabUserId: string; // collabMessages user id
  createdAt: string;
}

export interface IOpenClawIntegration {
  id: string;
  name: string;
  url: string;
  connectorId: string;
  bearerToken: string;
  agents: IOpenClawAgent[];
  createdAt: string;
}


export interface ToolsBeforeSendMessage {
  toolName: string;
  args: Record<string, any>;
}
