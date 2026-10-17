/// <mls fileReference="_102036_/l2/shared/interfaces.ts" enhancement="_blank"/>
// GENERATED from collab-messages/src/global.ts by "pnpm run interfaces:102036". Do not edit by hand.



export enum HttpStatus {
  OK = 200,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  CONFLICT = 409,
  SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  SERVICE_UNAVAILABLE = 503
}

export interface RequestBase {
  action: string;
}

export interface ResponseBase {
  statusCode: HttpStatus;
  msg?: string; // error message from 400 or 500 status code
}

export interface RequestAddMessage extends RequestBase {
  action: "addMessage";
  userId: string;
  threadId: string;
  content: string;
  contextToBot?: Record<string, any>;
  replyTo?: string; // use createAt of the message being replied to, obs. orderAt is not used for replyTo, because it can be changed when message is edited
  senderDeviceId?: string; // device that sent; absent = unknown (skip entire author)
}

export interface ResponseAddMessage extends ResponseBase {
  message: Message;
  messages?: Message[];
  task?: TaskData;
  taskRoomThread?: Thread;
  botOutputs?: BotOutput[];
  integrationOutputs?: IntegrationOutput[];
}

export interface RequestCreateAttachmentUpload extends RequestBase {
  action: "createAttachmentUpload";
  userId: string;
  threadId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface ResponseCreateAttachmentUpload extends ResponseBase {
  attachmentId: string;
  storageKey: string;
  uploadUrl: string;
  headers: Record<string, string>;
  expiresAt: string;
}

export interface AttachmentUploadCompletion {
  attachmentId: string;
  storageKey: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface RequestCompleteAttachmentUpload extends RequestBase {
  action: "completeAttachmentUpload";
  userId: string;
  threadId: string;
  content?: string;
  replyTo?: string;
  attachments: AttachmentUploadCompletion[];
}

export interface ResponseCompleteAttachmentUpload extends ResponseBase {
  message: Message;
}

export interface RequestDeleteAttachment extends RequestBase {
  action: "deleteAttachment";
  userId: string;
  threadId: string;
  messageId: string;
  attachmentId: string;
}

export interface ResponseDeleteAttachment extends ResponseBase {
  message: Message;
}

export interface RequestGetAttachmentUrl extends RequestBase {
  action: "getAttachmentUrl";
  userId: string;
  threadId: string;
  messageId: string;
  attachmentId: string;
}

export interface ResponseGetAttachmentUrl extends ResponseBase {
  url: string;
  expiresAt: string;
}

export interface RequestUpdateMessage extends RequestBase {
  action: "updateMessage";
  userId: string; // owner of the thread
  threadId: string;
  messageId: string;
  reaction?: string; // emoji or text to add or update or remove from reactions, if the user already reacted with this reaction it will be removed, otherwise it will be added
  pin?: boolean;
  favorite?: boolean;
  readConfirmation?: "request" | "confirm" | "cancel" | "requestExecution" | "reviewExecution";
  messageAction?: "delete" | "moderate" | "createTask";
  editContent?: string;
  taskTitle?: string;
}

export interface ResponseUpdateMessage extends ResponseBase {
  message: Message;
  thread?: Thread;
  messages?: Message[];
  user?: User;
  users?: User[];
}

export interface RequestAddMessageAI extends RequestBase {
  action: "addMessageAI";
  userId: string;
  threadId: string;
  taskTitle: string;
  userMessage: string;
  agentName: string;
  inputAI: IAMessageInputType[];
  longTermMemory?: Record<string, string>; // long term memory
  replyTo?: string; // use createAt of the message being replied to, obs. orderAt is not used for replyTo, because it can be changed when message is edited
}

export interface ResponseAddMessageAI extends ResponseBase {
  message: Message;
  task: TaskData;
}

export interface RequestApplyIntents extends RequestBase {
  action: "applyIntents";
  userId: string;
  intents: AgentIntent[];
}

export interface ResponseApplyIntents extends ResponseBase {
  message?: Message;
  task: TaskData;
}

export interface RequestAddUser extends RequestBase {
  action: "addUser";
  name: string;
  avatar_url?: string;
}

export interface ResponseAddUser extends ResponseBase {
  user: User;
}

export interface RequestAddOrUpdateOpenClawConnector extends RequestBase {
  action: "addOrUpdateOpenClawConnector";
  userId: string;
  connectorId: string;
  name: string;
  baseUrl: string;
  gatewayToken: string;
  inboundToken: string;
  enabled: boolean;
  defaultTimeoutMs?: number;
  defaultOutputMode?: OpenClawOutputMode;
}

export interface ResponseAddOrUpdateOpenClawConnector extends ResponseBase {
  connector: OpenClawConnector;
}

export interface RequestRemoveOpenClawConnector extends RequestBase {
  action: "removeOpenClawConnector";
  userId: string;
  connectorId: string;
}

export interface ResponseRemoveOpenClawConnector extends ResponseBase {
  connectorId: string;
}

export interface RequestListOpenClawConnectors extends RequestBase {
  action: "listOpenClawConnectors";
  userId: string;
}

export interface ResponseListOpenClawConnectors extends ResponseBase {
  connectors: OpenClawConnector[];
}

export interface RequestListOpenClawAvailableAgents extends RequestBase {
  action: "listOpenClawAvailableAgents";
  userId: string;
  connectorId: string;
}

export interface ResponseListOpenClawAvailableAgents extends ResponseBase {
  connectorId: string;
  defaultId: string;
  mainKey: string;
  scope: "per-sender" | "global";
  agents: OpenClawRemoteAgentSummary[];
}

export interface RequestCreateOpenClawAgent extends RequestBase {
  action: "createOpenClawAgent";
  userId: string;
  connectorId: string;
  name: string;
  workspace: string;
  emoji?: string;
  avatar?: string;
  soulMd?: string;
  identityMd?: string;
}

export interface ResponseCreateOpenClawAgent extends ResponseBase {
  connectorId: string;
  agent: OpenClawRemoteAgentSummary;
  collabUserId: string;
}

export interface RequestDeleteOpenClawAgent extends RequestBase {
  action: "deleteOpenClawAgent";
  userId: string;
  connectorId: string;
  agentId: string;
  deleteFiles?: boolean;
}

export interface ResponseDeleteOpenClawAgent extends ResponseBase {
  connectorId: string;
  agentId: string;
  collabUserId?: string;
  updatedThreadIds: string[];
}

export interface RequestUpdateUserDetails extends RequestBase {
  action: "updateUserDetails";
  userId: string;
  name?: string;
  status?: "active" | "blocked" | "deleted";
  avatar_url?: string;
  md?: string;
  deviceId?: string; // device id for push notifications
  subscription?: PushSubscriptionData;
}

export interface ResponseUpdateUserDetails extends ResponseBase {
  user: User;
}

export interface RequestAddThread extends RequestBase {
  action: "addThread";
  userId: string;
  name: string;
  visibility: ThreadVisibility;
  status: ThreadStatus;
  group: ThreadGroup;
  languages: string[];
  avatar_url: string;
  defaultTopics?: string[];
  welcomeMessage?: string;
  // firsstMessage?: string;
}

export interface ResponseAddThread extends ResponseBase {
  thread: Thread;
}

export type HumanDmErrorCode =
  | "not_found"
  | "self"
  | "schema"
  | "not_human"
  | "legacy_ambiguous"
  | "archived"
  | "pair_corrupt"
  | "storage_unavailable"
  | "contention_exhausted"
  | "unknown_outcome";

export interface RequestEnsureHumanDm extends RequestBase {
  action: "ensureHumanDm";
  userId: string;
  recipientUserId: string;
  group: ThreadGroup;
}

export interface ResponseEnsureHumanDm extends ResponseBase {
  outcome?: "created" | "existing";
  thread?: Thread;
  code?: HumanDmErrorCode;
}

export interface RequestEnsureModuleThread extends RequestBase {
  action: 'ensureModuleThread';
  userId: string;
  email: string;
  project: string;
  module: string;
  name: string;
}

export interface ResponseEnsureModuleThread {
  userId: string;
  thread: Thread;
  created: boolean;
}

export interface RequestOpenModuleTask extends RequestBase {
  action: 'openModuleTask';
  userId: string;
  threadId: string;
  title: string;
  content: string;
  ref: TaskModuleRef;
  step: string;
}

export interface ResponseOpenModuleTask {
  task: TaskData;
  taskRoomThread: Thread;
  created: boolean;
}

export interface RequestDeleteThread extends RequestBase {
  action: "deleteThread";
  userId: string; // owner of the thread
  threadId: string;
}

export interface ResponseDeleteThread extends ResponseBase {
  thread: Thread;
}

export interface RequestUpdateThread extends RequestBase {
  action: "updateThread";
  userId: string; // owner of the thread
  threadId: string;
  newOwnerId?: string;
  name?: string;
  visibility?: ThreadVisibility;
  status?: ThreadStatus;
  group?: ThreadGroup;
  languages?: string[];
  avatar_url?: string;
  defaultTopics?: string[];
  welcomeMessage?: string;
  notification?: ThreadNotification;
}

export interface ResponseUpdateThread extends ResponseBase {
  thread: Thread;
}

export interface RequestGetTaskUpdate extends RequestBase {
  action: "getTaskUpdate";
  userId: string;
  messageId: string;
  taskId: string;
}

export interface ResponseGetTaskUpdate extends ResponseBase {
  task: TaskData;
}

export interface RequestAddTaskAISteps extends RequestBase {
  action: "addTaskAISteps";
  userId: string;
  messageId: string;
  taskId: string;
  parentStepId: number;
  stepdIdToChangeStatus: number | null;
  newStatus: AIStepStatus; // status to set in stepdIdToChangeStatus
  traceMsg: string | null;
  newTaskTitle: string;
  steps: AIPayload[];
}

export interface ResponseAddTaskAISteps extends ResponseBase {
  task: TaskData;
}

/**
 * add new prompts to a existing interaction,
 * change status of stepIdToChangeStatus to newStatus
 * change status of interactionStepId to 'in_progress'
 * start LLM
 */
export interface RequestAppendPromptToInteraction extends RequestBase {
  action: "appendPromptToInteraction";
  userId: string;
  messageId: string;
  taskId: string;
  interactionStepId: number; // stepId with child interaction
  inputAI: IAMessageInputType[];
  stepdIdToChangeStatus: number;
  newStatus: AIStepStatus; // status to set in stepdIdToChangeStatus
  traceMsg?: string; // optional trace message
}

export interface ResponseAppendPromptToInteraction extends ResponseBase {
  task: TaskData;
}

export interface RequestUpdateStepStatus extends RequestBase {
  action: "updateStepStatus";
  userId: string;
  messageId: string;
  taskId: string;
  stepId: number;
  status: AIStepStatus;
  traceMsg?: string; // optional trace message
  newTaskTitle?: string; // optional new task title to set
  newTaskStatus?: TaskStatus; // optional new task status to set
}

export interface ResponseUpdateStepStatus extends ResponseBase {
  task: TaskData;
  message?: Message; // optional message if task was updated with new status
}

export interface RequestAddTaskAIInteraction extends RequestBase {
  action: "addTaskAIInteraction";
  userId: string;
  messageId: string;
  taskId: string;
  parentStepId: number;
  inputAI: IAMessageInputType[]
}

export interface ResponseAddTaskAIInteraction extends ResponseBase {
  task: TaskData;
}

export interface RequestUpdateTaskTitle extends RequestBase {
  action: "updateTaskTitle";
  userId: string;
  messageId: string;
  taskId: string;
  newTitle: string;
}

export interface ResponseUpdateTaskTitle extends ResponseBase {
  task: TaskData;
}

export interface RequestEnsureTaskRoom extends RequestBase {
  action: "ensureTaskRoom";
  userId: string;
  taskId: string;
  parentThreadId?: string;
}

export interface ResponseEnsureTaskRoom extends ResponseBase {
  task: TaskData;
  thread: Thread;
}

export type UserMemorySectionName =
  | 'identity_hints'
  | 'communication_style'
  | 'work_rhythm'
  | 'decision_style'
  | 'authority_hints'
  | 'learned_preferences';

export interface UserMemorySourceInput {
  kind: 'message' | 'memory_section' | 'confirmation';
  ref: string;
}

export interface RequestGetUserMemory extends RequestBase {
  action: 'getUserMemory';
  userId: string;
  threadId: string;
  openSourceMessageId?: string;
}

export interface RequestProposeUserMemory extends RequestBase {
  action: 'proposeUserMemory';
  userId: string;
  threadId: string;
  expectedVersion: number;
  idempotencyKey: string;
  updates: Partial<Record<UserMemorySectionName, string>>;
  sources?: Partial<Record<UserMemorySectionName, UserMemorySourceInput[]>>;
  reason: string;
}

export interface RequestDecideUserMemoryProposal extends RequestBase {
  action: 'decideUserMemoryProposal';
  userId: string;
  threadId: string;
  proposalId: string;
  decision: 'confirm' | 'reject';
  expectedVersion: number;
  idempotencyKey: string;
  reviewMessageId?: string;
}

export interface RequestCorrectUserMemory extends RequestBase {
  action: 'correctUserMemory';
  userId: string;
  threadId: string;
  section: UserMemorySectionName;
  content: string;
  sources?: UserMemorySourceInput[];
  expectedVersion: number;
  idempotencyKey: string;
  reviewMessageId?: string;
}

export interface RequestInvalidateUserMemory extends RequestBase {
  action: 'invalidateUserMemory';
  userId: string;
  threadId: string;
  section: UserMemorySectionName | 'all';
  expectedVersion: number;
  idempotencyKey: string;
  reviewMessageId?: string;
}

export interface ResponseUserMemory extends ResponseBase {
  memory: unknown;
}

export interface RequestGetE01Execution extends RequestBase {
  action: 'getE01Execution';
  userId: string;
  threadId: string;
  executionId?: string;
  sourceMessageId?: string;
  openSourceMessageId?: string;
}

export interface RequestCancelE01Execution extends RequestBase {
  action: 'cancelE01Execution';
  userId: string;
  threadId: string;
  executionId: string;
}

export interface ResponseE01Execution extends ResponseBase {
  execution: unknown;
}

export interface RequestGetMessagesAfter extends RequestBase {
  action: "getMessagesAfter";
  threadId: string;
  lastOrderAt: string;
  userId: string;
}

export interface ResponseGetMessagesAfter extends ResponseBase {
  data: Message[];
  hasMore: boolean;
}

export interface RequestGetMessagesBefore extends RequestBase {
  action: "getMessagesBefore";
  threadId: string;
  orderAt: string;
  userId: string;
}

export interface ResponseGetMessagesBefore extends ResponseBase {
  data: Message[];
  hasMore: boolean;
}

export interface RequestGetMessage extends RequestBase {
  action: "getMessage";
  threadId: string;
  messageId: string;
  userId: string;
}

export interface ResponseGetMessage extends ResponseBase {
  message: Message;
}

export interface RequestAddUserInThread extends RequestBase {
  action: "addUserInThread";
  userId: string; // userId from executor
  userIdOrName: string;
  threadId: string;
  auth: UserAuth;
}

export interface ResponseAddUserInThread extends ResponseBase {
  thread: Thread;
}

export interface RequestAddOrUpdateThreadOpenClawAgent extends RequestBase {
  action: "addOrUpdateThreadOpenClawAgent";
  userId: string;
  threadId: string;
  alias: string;
  connectorId: string;
  agentId: string;
  collabUserId: string;
  enabled: boolean;
  sessionMode?: OpenClawSessionMode;
  handoffThreadRole?: OpenClawHandoffThreadRole;
  defaultForThread?: boolean;
}

export interface ResponseAddOrUpdateThreadOpenClawAgent extends ResponseBase {
  thread: Thread;
}

export interface RequestRemoveThreadOpenClawAgent extends RequestBase {
  action: "removeThreadOpenClawAgent";
  userId: string;
  threadId: string;
  alias: string;
}

export interface ResponseRemoveThreadOpenClawAgent extends ResponseBase {
  thread: Thread;
}

export interface RequestListThreadOpenClawAgents extends RequestBase {
  action: "listThreadOpenClawAgents";
  userId: string;
  threadId: string;
}

export interface ResponseListThreadOpenClawAgents extends ResponseBase {
  threadId: string;
  agents: OpenClawAgentBinding[];
}

export interface RequestRemoveUserInThread extends RequestBase {
  action: "removeUserInThread";
  userId: string; // usersId from executor
  userIdOrName: string; // usersId for user to be removed
  threadId: string;
  eventVisibility?: "all" | "admin";
}

export interface ResponseRemoveUserInThread extends ResponseBase {
  thread: Thread;
  messages?: Message[];
}

export interface RequestGetThreadUpdate extends RequestBase {
  action: "getThreadUpdate";
  userId: string;
  threadId: string;
  deviceId?: string; // device id for push notifications
  lastOrderAt?: string; // optional, to get messages after this orderAt
  // explicit first load: last N messages (tail). Absence of lastOrderAt still means "no messages".
  initialLoad?: boolean;
}

export interface ResponseGetThreadUpdate extends ResponseBase {
  thread: Thread;
  users: User[];
  messages?: Message[]; // optional, if lastOrderAt is provided
  threadsPending: string[]; // threads that the user has to sync
  hasMore?: boolean; // more messages newer than this page (incremental sync)
  hasOlder?: boolean; // more messages older than this page (tail / first load)
}

export interface RequestGetUserUpdate extends RequestBase {
  action: "getUserUpdate";
  userId?: string;
  name?: string;
  avatar_url?: string;
}

export interface RequestHeartbeat extends RequestBase {
  action: "heartbeat";
  userId: string;
  deviceId: string;
}

export interface ResponseHeartbeat extends ResponseBase {
  pending: string[];
  online: { users: number; devices: number };
}

export interface ResponseGetUserUpdate extends ResponseBase {
  user: User;
}

export interface RequestGetUsers extends RequestBase {
  action: "getUsers";
  userId: string;
  status: "active" | "blocked";
  prefixName: string;
}

export interface ResponseGetUsers extends ResponseBase {
  users: {
    userId: string; // compact UTC format `yyyyMMddHHmmss.nnn` unique sorted index, nnn is a sequence number
    name: string;
    isAgent?: true; // present only for pma, synthetic_agent, or metadata.agentType
    isHuman?: true; // present only for non-agent users with email or sub
  }[]
}

export interface RequestAppendLongTermMemory extends RequestBase {
  action: "appendLongTermMemory";
  userId: string;
  messageId: string;
  taskId: string;
  longTermMemory: Record<string, string>; // long term memory
}

export interface ResponseAppendLongTermMemory extends ResponseBase {
  task: TaskData;
}

export interface RequestAddOrUpdateThreadBot extends RequestBase {
  action: "addOrUpdateThreadBot";
  userId: string; // userId from executor
  threadId: string;
  botId: string;                  // Unique ID for this bot in the thread, ex: "agentBotWeddingGifts"
  llmPrompt: string;              // prompt for this bot with {{ var }} variables
  status: "active" | "disabled";
  config?: Record<string, any>;  // Optional runtime config for the bot, sent to the LLM
}

export interface ResponseAddOrUpdateThreadBot extends ResponseBase {
  thread: Thread;
}

export interface BotFlexibleResultBase {
  ref?: string; // complementary key for bot memory, ex: "thread/.../bot/.../ref"
  output?: string; // string to return to user
  [key: string]: any; // additional properties
}

export interface BotOutput {
  botId: string;
  cost: number;
  output: string;
}

// ====================
// INTEGRATIONS
// ====================

export type IntegrationType = "openclaw"; // extensible: add "slack" | "teams" etc. in the future

export interface ThreadIntegration {
  integrationId: string;          // Unique ID for this integration in the thread
  type: IntegrationType;
  status: "active" | "disabled";
  config: ThreadIntegrationConfig;
  triggers: ThreadBotTrigger[];   // reuse existing trigger system
  lastExecutionAt?: string;       // compact UTC format
}

export interface ThreadIntegrationConfig {
  url: string;           // base URL of the external service, e.g. "http://openclaw-host:3000"
  bearerToken: string;   // Bearer token for outbound calls to the external service
  inboundToken: string;  // token the external service sends in x-integration-token header
  agentId?: string;      // optional: specific agent/assistant id on the external service
  sessionId?: string;    // optional: session id for conversation continuity
}

export interface IntegrationOutput {
  integrationId: string;
  type: IntegrationType;
  responseMessageId?: string; // orderAt of the response message posted back, if any
  responseMessage?: Message;
  error?: string;             // error message if execution failed
}

export interface RequestAddOrUpdateThreadIntegration extends RequestBase {
  action: "addOrUpdateThreadIntegration";
  userId: string;
  threadId: string;
  integrationId: string;
  type: IntegrationType;
  status: "active" | "disabled";
  config: ThreadIntegrationConfig;
  triggers: ThreadBotTrigger[];
}

export interface ResponseAddOrUpdateThreadIntegration extends ResponseBase {
  thread: Thread;
}

export interface RequestRemoveThreadIntegration extends RequestBase {
  action: "removeThreadIntegration";
  userId: string;
  threadId: string;
  integrationId: string;
}

export interface ResponseRemoveThreadIntegration extends ResponseBase {
  thread: Thread;
}

export interface RequestWebhookInbound {
  threadId: string;
  integrationId?: string;
  connectorId?: string;
  agentId?: string;
  content: string;
  type?: Message['type'];
  replyTo?: string;
  externalCaseId?: string;
  channel?: string;
  customerIdentity?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  metadata?: Record<string, any>;
}

export interface ResponseWebhookInbound extends ResponseBase {
  message: Message;
}


// ====================

export interface User {
  userId: string; // compact UTC format `yyyyMMddHHmmss.nnn` unique sorted index, nnn is a sequence number
  name: string;
  status: "active" | "blocked" | "deleted";
  avatar_url?: string;
  md?: string;
  threads: string[];
  notifications?: UserNotifications[];
  favorites?: string[];
  readConfirmations?: UserReadConfirmations;
  kind?: UserKind;
  metadata?: UserMetadata;
  // collab-auth identity binding (see layer_3_usecases/identity.ts).
  // `sub` is the stable collab-auth subject id and is the canonical key used to
  // verify the JWT presenting the request owns this record. `email` is stored
  // for display/cross-reference. Both are set once (trust-on-first-use for
  // pre-existing records) and compared afterwards.
  sub?: string;
  email?: string;
}

export interface UserReadConfirmations {
  pending?: string[];
  requested?: string[];
}
export interface PushSubscriptionData {
  endpoint: string;
  keys: { p256dh: string; auth: string }; // base64url, as the browser returns them
  expirationTime?: number | null;
}

export interface UserNotifications {
  deviceId: string;
  subscription: PushSubscriptionData;
}

export type UserKind = "human" | "synthetic_agent" | "pma";

export interface UserMetadata {
  source?: "collab" | "openclaw" | "external";
  agentType?: "pma" | "agent" | "external_agent";
  definitionRef?: string;
  definitionVersion?: string;
  modelType?: string;
  connectorId?: string;
  agentId?: string;
  [key: string]: any;
}


export interface UserPerformanceCache extends User {
  // ----
  // only on frontend
  //
  lastSync?: string; // compact UTC format `yyyyMMddHHmmss`
}


// ====================
// THREADS
// ====================


export type UserAuth = "admin" | "moderator" | "read" | "write" | "none";

export interface ThreadUsers {
  userId: string;
  auth: UserAuth;
  notification?: ThreadNotification;
}

export type ThreadGroup = "CRM" | "TASK" | "DOCS" | "CONNECT" | "APPS" | "MOMENTS";
export type ThreadVisibility = "public" | "private" | "company" | "team"; // use private for only users in this thread
export type ThreadStatus = "active" | "archived" | "deleting" | "deleted";
export type ThreadNotification = "all" | "mentions" | "never";

export interface Thread {
  threadId: string; // compact UTC format `yyyyMMddHHmmss.nnn` unique sorted index, nnn is a sequence number
  name: string; // name of the thread (room)
  users: ThreadUsers[];
  visibility: ThreadVisibility;
  status: ThreadStatus;
  group: ThreadGroup;
  history: ThreadHistoryEntry[]; // history of actions in this thread
  languages: string[]; // iso 639-1 codes, example: ['en', 'pt', 'es']
  defaultTopics?: string[];
  welcomeMessage?: string;
  avatar_url: string;
  bots?: ThreadBot[];
  integrations?: ThreadIntegration[];
  openClawAgents?: OpenClawAgentBinding[];
  agentDm?: AgentDirectMessageBinding;
  personalMemoryProtection?: {
    kind: 'e01-personal-dm';
    ownerUserId: string;
    agentUserId: string;
    protectedAt: string;
  };
  pinnedMessages?: PinnedMessage[];
  kind?: 'thread' | 'task-room';
  taskRoom?: {
    taskId: string;
    parentThreadId: string;
    workflowType: WorkflowType;
    pmaId?: string;
    pmaStatus?: "active" | "paused" | "disabled";
    pmaConfigRef?: string;
    lastDecisionLogRef?: string;
  };
  archivedAt?: string; // compact UTC format `yyyyMMddHHmmss` when this thread was archived
  archivedBy?: string;
  deletedAt?: string; // compact UTC format `yyyyMMddHHmmss` when this thread was deleted
  createdAt: string; // compact UTC format `yyyyMMddHHmmss` when this thread was created
}

export interface MomentsPublisher {
  userId: string;
  name: string;
  avatar_url: string;
}

export interface MomentsFeedItem {
  threadId: string;
  publisher: MomentsPublisher;
  message: Message;
  seen: boolean;
  reach?: number;
}

export interface MomentsSeenItem {
  threadId: string;
  messageId: string;
}

export interface MomentsSubscriptionItem {
  threadId: string;
  publisher: MomentsPublisher;
  muted: boolean;
}

export interface MomentsStatsPost {
  messageId: string;
  createAt: string;
  preview: string;
  reach: number;
  reactions: number;
}

export interface RequestEnsureMomentsRoom extends RequestBase {
  action: "ensureMomentsRoom";
  userId: string;
}

export type MomentsAudience = 'all' | 'selected';

export interface ResponseEnsureMomentsRoom extends ResponseBase {
  thread: Thread;
  audience: MomentsAudience;
}

export interface RequestSetMomentsAudience extends RequestBase {
  action: "setMomentsAudience";
  userId: string;
  audience: MomentsAudience;
}

export interface ResponseSetMomentsAudience extends ResponseBase {
  thread: Thread;
  audience: MomentsAudience;
}

export interface RequestSetMomentsReaders extends RequestBase {
  action: "setMomentsReaders";
  userId: string;
  add?: string[];
  remove?: string[];
}

export interface ResponseSetMomentsReaders extends ResponseBase {
  thread: Thread;
}

export interface RequestGetMomentsFeed extends RequestBase {
  action: "getMomentsFeed";
  userId: string;
  limit?: number;
  before?: string;
}

export interface ResponseGetMomentsFeed extends ResponseBase {
  items: MomentsFeedItem[];
}

export interface RequestMarkMomentSeen extends RequestBase {
  action: "markMomentSeen";
  userId: string;
  items: MomentsSeenItem[]; // 1 to 50 items
}

export interface ResponseMarkMomentSeen extends ResponseBase {
  ok: true;
}

export interface RequestSetMomentsMute extends RequestBase {
  action: "setMomentsMute";
  userId: string;
  threadId: string;
  muted: boolean;
}

export interface ResponseSetMomentsMute extends ResponseBase {
  ok: true;
}

export interface RequestGetMomentsSubscriptions extends RequestBase {
  action: "getMomentsSubscriptions";
  userId: string;
}

export interface ResponseGetMomentsSubscriptions extends ResponseBase {
  items: MomentsSubscriptionItem[];
}

export interface RequestGetMomentsStats extends RequestBase {
  action: "getMomentsStats";
  userId: string;
  limit?: number;
}

export interface ResponseGetMomentsStats extends ResponseBase {
  audience: number;
  posts: MomentsStatsPost[];
}

export interface PinnedMessage {
  messageId: string;
  pinnedBy: string;
  pinnedAt: string;
  excerpt?: string;
}

export interface AgentDirectMessageBinding {
  enabled: boolean;
  agentId: string;
  agentUserId: string;
  agentType: "pma" | "agent";
  status: "active" | "paused" | "disabled";
  configRef?: string;
}

export interface ThreadHistoryEntry {
  action: string;
  userId: string;
  timestamp: string; // UTC format `yyyyMMddHHmmss`
}

export interface ThreadBot {
  botId: string;                  // Unique ID for this bot in the thread
  llmPrompt: string;              // prompt for this bot with {{ var }} variables
  threadFeature: ThreadFeature; // Feature this bot is associated with
  threadPermissionLevel: ThreadPermissionLevel; // Permission level for this bot
  triggers: ThreadBotTrigger[];
  status: "idle" | "running" | "disabled";
  lastExecutionAt?: string;      // UTC format
  memoryRef?: string;            // Reference to stored memory or context
  config?: Record<string, any>;  // Optional runtime config for the bot, sent to the LLM
}

export type OpenClawOutputMode = "final_only" | "status_and_final";
export type OpenClawSessionMode = "thread" | "thread_user";
export type OpenClawHandoffThreadRole = "handoff" | "collaboration";

export interface OpenClawConnector {
  connectorId: string;
  name: string;
  baseUrl: string;
  gatewayToken: string;
  inboundToken: string;
  enabled: boolean;
  defaultTimeoutMs: number;
  defaultOutputMode: OpenClawOutputMode;
  protocolVersion?: number;
  transport?: "ws" | "http";
}

export interface OpenClawAgentBinding {
  alias: string;
  connectorId: string;
  agentId: string;
  collabUserId: string;
  enabled: boolean;
  sessionMode?: OpenClawSessionMode;
  handoffThreadRole?: OpenClawHandoffThreadRole;
  defaultForThread?: boolean;
}

export interface OpenClawRemoteAgentSummary {
  id: string;
  name?: string;
  identity?: {
    name?: string;
    theme?: string;
    emoji?: string;
    avatar?: string;
    avatarUrl?: string;
  };
  workspace?: string;
  model?: {
    primary?: string;
    fallbacks?: string[];
  };
}

export interface OpenClawDeviceState {
  deviceId: string;
  publicKey: string;
  privateKeyPem: string;
  publicKeyPem?: string;
  deviceToken?: string;
  authorizedAt?: string;
}

export enum ThreadFeature {
  Summary = "summary",
  CustomPlugin = "custom_plugin",
  Tasks = "tasks",
  Workflow = "workflow",
  Notifications = "notifications",
  Voting = "voting",
  Moderation = "moderation",
  Feedback = "feedback"
}

export type ThreadPermissionLevel = "all" | "members" | "admin";

export interface ThreadBotTrigger {
  type: BotTriggerType;
  match?: "any" | "all"; // Optional: defines if all or any conditions are required (default: "any")
  conditions?: BotTriggerCondition[]; // Filters applied only for type "onNewMessage"
  args?: BotTriggerArgs; // Optional arguments depending on trigger type
}

export enum BotTriggerType {
  OnNewMessage = "onNewMessage",
  OnMention = "onMention",
  OnTaskCompleted = "onTaskCompleted",
  Schedule = "schedule",
  Manual = "manual"
}

export interface BotTriggerCondition {
  type: "hasTag" | "mention" | "startsWith" | "contains";
  value: string;
}

export type BotTriggerArgs =
  | { cron: string }                      // For type: "schedule", e.g. "0 18 * * 5"
  | { taskType: string }                 // For type: "onTaskCompleted"
  | Record<string, any>;                 // Generic fallback


export interface ThreadPerformanceCache extends Thread {
  // ----
  // only on frontend
  //
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  lastSync?: string; // compact UTC format `yyyyMMddHHmmss`
}


// ====================
// MESSAGES
// ====================


export interface Message {
  threadId: string;
  orderAt: string; // compact UTC format `yyyyMMddHHmmss.nnn` unique sorted index, nnn is a sequence number
  createAt: string; // compact UTC format `yyyyMMddHHmmss`
  updatedAt?: string; // compact UTC format `yyyyMMddHHmmss`
  senderId: string;
  content: string;
  language_detected?: string;
  externalPlatform?: string;
  translations?: Record<string, string>;
  reactions?: Record<string, string[]>; // key is reaction (emoji or text), value is array of userIds who reacted
  readConfirmations?: MessageReadConfirmation[];
  attachments?: MessageAttachment[];
  moderation?: MessageModeration;
  edits?: MessageEditVersion[];
  editedAt?: string;
  editedBy?: string;
  type?: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact'; // default is `text`
  pin?: boolean;
  taskId?: string;
  stepId?: number;
  taskRoomRole?: 'conversation' | 'system' | 'agent' | 'workflow';

  taskTitle?: string; // title of the task, if this message is related to a task
  taskStatus?: TaskStatus; // status of the task, if this message is related to a task
  taskResults?: string[]; // resume of results of the task, if this message is related to a task
  taskResultsTranslated?: Record<string, string>; // translated results of the task, if this message is related to a task
  taskTitleTranslated?: Record<string, string>; // translated title of the task, if this message is related

  // updates?: object[];
  visibility?: "admin"; // only for admin, example: user left the thread
  url?: string;
  replyTo?: string; // use createAt of the message being replied to, obs. orderAt is not used for replyTo, because it can be changed when message is edited
}

export type MessageAttachmentKind = 'image' | 'video' | 'audio' | 'document' | 'file';
export type MessageAttachmentStatus = 'active' | 'deleted';

export interface MessageAttachment {
  attachmentId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  kind: MessageAttachmentKind;
  storageKey: string;
  uploadedBy: string;
  uploadedAt: string;
  status: MessageAttachmentStatus;
  deletedBy?: string;
  deletedAt?: string;
  url?: string;
}

export interface MessageReadConfirmation {
  kind?: "read" | "execution";
  requestedBy: string;
  requestedAt: string;
  targetUserIds: string[];
  confirmedBy?: Record<string, string>;
  canceledAt?: string;
  canceledBy?: string;
  followupHistory?: MessageFollowupHistoryEntry[];
}

export interface MessageFollowupHistoryEntry {
  userId: string;
  reaction: string;
  at: string;
}

export type MessageModerationStatus = "deleted" | "moderated";

export interface MessageModeration {
  status: MessageModerationStatus;
  by: string;
  at: string;
}

export interface MessageEditVersion {
  content: string;
  editedBy: string;
  editedAt: string;
}

export interface MessagePerformanceCache extends Message {
  // ----
  // only on frontend
  //
  lastSync?: string; // compact UTC format `yyyyMMddHHmmss`
  status?: 'read' | 'unread' | 'edited';
  footers: {
    title?: string;
    lines: string[];
    icon?: string; // icon to show in footer, ex: "fa fa-check"
    color?: string; // color of the footer, ex: "#00ff00"
    backgroundColor?: string; // background color of the footer, ex: "#000000"
    timestamp?: string;
  }[];
}

export type TaskOperationType = "create" | "read" | "update" | "delete" | "query";

export interface TaskOperation {
  operation: TaskOperationType;
  taskId?: string;
  data?: Partial<TaskData>;
  filters?: Record<string, any>;
  message?: string | null; // clarification message
}

export type TaskModuleRef = {
  project: string;
  module: string;
  entity: string;
  recordId: string;
  processId: string;
  workflowVersion: string | null;
};

export type TaskModuleProgressEntry = {
  at: string;
  by: string;
  from: string;
  step: string;
  note?: string;
};

export type TaskModuleProgress = {
  step: string;
  actingUserId?: string;
  history: TaskModuleProgressEntry[];
};

export interface TaskData {
  PK: string; // Primary key, format: `task/#{taskId}`
  SK: 'metadata'; // Sort key of the composite primary key (legacy: “range key")
  title: string;
  owner: string; // who created this task, userId
  team: 'unassigned' | string | null; // team assigned to this task
  assignees?: string[]; // userIds assigned to this task
  dueDate?: string; // ISO date YYYY-MM-DD, managed by /setDueDate
  status: TaskStatus;
  last_updated: 0 | number; // Date.now()
  last_update_log: string | null; // description of last update
  source?: string; // source of the task, ex: "user", "system", "api", default is "user"
  url?: string; // ? not used ever
  description?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  effort?: number; // estimated effort in hours
  cost?: number;
  iaCompressed?: IACompressed; // steps , prompts
  tags?: string[];
  attachmentsUrl?: string[]; // urls of attachments related to this task
  messageid_created?: string; // thread id and message id from origin this task. ex: 20250521144240.1000/20250706203939.1000
  messageid_refs?: string[]; // messages id referenced in this task
  taskRoom?: {
    enabled: boolean;
    threadId?: string;
    workflowType?: WorkflowType;
    parentThreadId?: string;
    memoryRef?: string;
    status?: 'active' | 'archived' | 'deleted';
    pmaId?: string;
    pmaStatus?: "active" | "paused" | "disabled";
    pmaConfigRef?: string;
    lastDecisionLogRef?: string;
  };
  module?: { ref: TaskModuleRef; progress: TaskModuleProgress };
}

export type TaskStatus = 'todo' | 'in progress' | 'paused' | 'done' | 'failed';
export type WorkflowType = 'staticWorkflow' | 'dynamicWorkflow';

export interface TaskDataToSave extends Omit<TaskData, 'iaCompressed'> {
  iaCompressed?: string;
}

//
// ====================
// AI TASKS
// ====================


export interface IACompressed {
  // this object can be compressed to a string for saving in DB
  nextSteps: AIPayload[];
  longMemory: Record<string, string>; // long term memory
  isTest?: boolean; // true if this is a test execution
  queueBackEnd: AgentIntent[]; // queue to be processed in backend
  queueFrontEnd: AgentHooks[]; // queue to be processed in frontend
}

export interface AIInteraction {
  input: IAMessageInputType[];
  tools?: LLMTool[];
  toolChoice?: LLMToolChoice;
  cost: number; // cost in this interaction , with no deep cost
  trace: string[]; // optional trace of the steps
  payload: AIPayload[] | null; // Tree of steps or null for not processed
  /** Typed accounting evidence for one local E01 gateway request. */
  e01GatewayReceipt?: {
    localRequests: 1;
    providerAttempts: number | null;
    costChargedUsd: number | null;
  };
}

export interface LLMTool {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
}

export type LLMToolChoice =
  'auto' |
  'none' |
  'required' |
  {
    type: 'function';
    function: {
      name: string;
    };
  };

export interface IAMessageInputType {
  type: 'system' | 'human' | 'ai';
  content: string;
}

/**
 * Narrow transport-only input for the E02 audio worker. The regular agent
 * contract above deliberately remains text-only: audio bytes may exist only
 * while one bounded gateway request is being assembled.
 */
export interface IAudioHumanMessageInputType {
  type: 'human';
  content: [
    { type: 'text'; text: string },
    { type: 'input_audio'; input_audio: { data: string; format: 'mp3' | 'wav' } },
  ];
}

export type IProxyMessageInputType = IAMessageInputType | IAudioHumanMessageInputType;

export type AIStepStatus =
  'waiting_dependency' | // not ready yet
  'waiting_human_input' | // for parallel steps waiting for human input
  'waiting_after_prompt' | // for parallel steps waiting for afterPrompt processing
  'waiting_after_prompt_with_error' | // for parallel steps waiting for afterPrompt processing
  'pending' | // already created, waiting to be processed
  'in_progress' | // being processed in LLM
  'completed' | // completed successfully
  'failed'; // failed execution

export interface AIStepProgress {
  total: number;
  completed: number;
  failed: number;
  templateTitle: string; // ex: "preparing file {{completed}} of {{total}}, errors: {{failed}}"
}

export type AIStepPlanningExecutionMode =
  'sequential' |
  'parallel_static' |
  'parallel_dynamic' |
  'manual_later';

export interface AIStepPlanningDynamicSource {
  sourcePlanId?: string;
  selectorField?: string;
  argsField?: string;
}

export interface AIStepPlanning {
  planId: string;
  dependsOn: string[];
  executionMode: AIStepPlanningExecutionMode;
  executionHost?: 'client' | 'server' | 'either';
  dynamicSource?: AIStepPlanningDynamicSource;
}

export interface AIStep {
  type: AIPayload['type'];
  stepId: number; // unique id , from first interaction
  status: AIStepStatus;
  stepTitle?: string;
  progress?: AIStepProgress;
  planning?: AIStepPlanning;
  // If null => interaction not prepared yet
  // If undefined => no LLM interaction needed for this step (e.g., tool call)
  // If defined => contains prompt/response used in this step
  interaction: AIInteraction | null | undefined;
  nextSteps: AIPayload[] | null; // Tree of steps or null for not processed or [] if no next steps
}

export type AIPayload = AIAgentStep | AIToolStep | AIClarificationStep | AIResultStep | AIFlexibleResultStep;

export interface AIWorkflowStep {
  type: WorkflowType;
  stepId: number;
  status: AIStepStatus;
  stepTitle?: string;
  progress?: AIStepProgress;
  planning?: AIStepPlanning;
  interaction: AIInteraction | null | undefined;
  nextSteps: AIPayload[] | null;
  workflowName?: string;
}

export interface AIAgentStep extends AIStep {
  type: 'agent';
  agentName: string;
  /** Private service-step controls consumed only by the existing backend scheduler. */
  e01Execution?: {
    schemaVersion: 1;
    executionId: string;
    organizationId: string;
    userId: string;
    threadId?: string;
    manifestRef: string;
    maxAttempts: 1;
    maxOutputTokens: number;
    deadlineAt: string;
    executionMode?: 'bounded' | 'legacy-supervised-pilot';
    pilotId?: string;
    pilotExpiresAt?: string;
    pilotOperationalBudgetUsd?: number;
    pilotLocalRequestLimit?: 6;
    pilotNextRequestCostEstimateUsd?: number;
  };
  /** Compact E02 identity. Audio bytes and transcript text never enter TaskRecord. */
  e02Audio?: {
    schemaVersion: 1;
    processingId: string;
    executionId: string;
    organizationId: string;
    ownerUserId: string;
    threadId: string;
    phase: 'transcription' | 'interpretation';
  };
  prompt?: string;
  rags: string[] | null; // name of files RAG to search
  onFailure?: 'fail' // default
  | 'continue' // continue workflow even if this step fail, use with caution, mark this step status = 'failed', don't mark parent step as failed.
  | 'wait_after_prompt' // afterPromptStep will be triggered with stepStatus = "waiting_after_prompt_with_error"
  | 'skip'; // skip this step and continue workflow as if it was completed successfully, mark this step status = 'completed'
}

export interface AIToolStep extends AIStep {
  type: 'tool';
  toolName: string;
  args: string; // JSON stringified
}

export interface AIClarificationStep extends AIStep {
  type: 'clarification';
  json?: string;
}

export interface AIResultStep extends AIStep {
  type: 'result';
  result: string;
}

export interface AIFlexibleResultStep extends AIStep {
  type: 'flexible';
  result: any; // Flexible JSON result, parsed and handled by afterPrompt function
}

export interface ExecutionContext {
  message: Message;
  task: TaskData | undefined; // use undefined for start new task
  isTest: boolean; // true if this is a test execution
}

// ===================
// AGENT INTENTS
// commands from frontend to backend
// ===================

export type AgentIntentUpdateStatus = {
  type: 'update-status';
  messageId: string;
  threadId: string;
  taskId: string;
  hookSequential: number;
  parentStepId: number;
  stepId: number;
  status: AIStepStatus;
  traceMsg?: string;
  cleaner?: 'input' | 'input_output'; // how to clean previous interactions in this step
  newTaskTitle?: string; // optional: rename the running task (e.g. a step that just resolved the module name)
}

export type AgentIntentAddStep = {
  type: 'add-step';
  messageId: string;
  threadId: string;
  taskId: string;
  parentStepId: number;
  step: AIPayload;
  stepTitle?: string;
  executionMode?: ExecutionMode;
}

export type AgentIntentPauseOrContinue = {
  type: 'pause-or-continue';
  messageId: string;
  threadId: string;
  taskId: string;
  reason: string
}

export type AgentIntentAddMessageAI = {
  type: 'add-message-ai';
  stepTitle?: string;
  request: Omit<RequestAddMessageAI, 'userId'>;
  executionMode?: ExecutionMode;
  skipRootLLM?: boolean;
}

export type ExecutionMode = {
  type: 'parallel';
  args: string[];
  maxParallel?: number; // max parallel items to process, default = 5
};

/**
 * Parallel steps execution mechanism.
 * Child steps inherit the system prompt from their parent step.
 * Human prompts are prepared client-side using compact args (via beforePrompt hook).
 * Keep args short, unique, and deterministic.
 *
 * Parallel execution flow:
 *
 * 1. Frontend requests creation of a parent step (via API) with system prompt only
 *    and one or more AgentIntentParallelSteps.
 *
 * 1.1 Frontend enforces max parallel items per request.
 *     Use pagination (offset/limit or batch markers) in args when more items exist.
 *
 * 2. Backend:
 *    - Creates parent step with status "in_progress"
 *    - Enqueues AgentIntentParallelSteps in queueBackEnd
 *    - Immediately creates a batch of "waiting_human_input" child steps (no human prompt yet)
 *
 * 2.1 Parent remains "in_progress" until all children reach terminal state ("completed" or "failed").
 *
 * 2.2 Child steps are pre-allocated and reused as prompts arrive.
 *
 * 3. Backend enqueues multiple AgentHookBeforePrompt (one per waiting_human_input child) for frontend.
 *
 * 4. Frontend prepares human prompts and returns AgentIntentContinueParallelStep items.
 *
 * 5. Backend:
 *    - Updates child steps with received human prompts
 *    - Applies strong deduplication (ignore duplicates by parentStepId + args)
 *    - Cleans queueBackEnd and queueFrontEnd
 *
 * 6. Backend executes child steps as they become ready.
 *
 * 6.1 After each child execution, backend sends feedback AgentHook to frontend
 *     (success or error). Frontend then requests child status update to "completed" or "failed".
 *
 * 7. When ALL children are in terminal state, backend finalizes the parent step.
 *
 * 7.1 Finished child steps are deleted to reduce task object size.
 *
 * Critical implementation notes:
 * - Uniqueness key: parentStepId + args (must be collision-resistant)
 * - Step 5 MUST implement strict idempotency and duplicate rejection
 * - Error handling, child retries, and stuck-state timeouts are responsibility of other system layers
 */
export type AgentIntentParallelSteps = {
  type: 'parallel-steps';
  parentStepId: number; // parentStepId + args must be unique to identify this parallel execution
  args: string;         // compact args to identify unique step arguments
};

export type AgentIntentPromptReady = {
  type: 'prompt_ready';
  messageId: string;
  threadId: string;
  taskId: string;
  hookSequential: number; // unique sequential id of the corresponding AgentHookBeforePrompt
  parentStepId: number;
  args: string;           // original args (for validation/deduplication)
  humanPrompt: string;    // prepared human prompt ready for execution
  systemPrompt?: string;  // optional updated system prompt for this step
  tools?: LLMTool[];
  toolChoice?: LLMToolChoice;
};

export type AgentIntentRemoveHook = {
  type: 'remove-hook';
  messageId: string;
  threadId: string;
  taskId: string;
  hookSequential: number;
};

export type AgentIntentModuleProgress = {
  type: 'module-progress';
  taskId: string;
  from: string;
  to: string;
  actingUserId?: string;
  note?: string;
  done?: boolean;
};

export type AgentIntent = AgentIntentAddStep | AgentIntentPauseOrContinue | AgentIntentUpdateStatus | AgentIntentParallelSteps | AgentIntentPromptReady | AgentIntentAddMessageAI | AgentIntentRemoveHook | AgentIntentModuleProgress;

// ===================
// AGENT HOOKS
// functions to be executed in frontend
// ===================

export type AgentHookBase = {
  hookSequential: number; // unique sequential id to order hooks
  stepId: number,
}

export type AgentHookBeforePromptStep = AgentHookBase & {
  type: 'beforePromptStep', // prepare new prompt after agent or tool step or parallel step
  parentStepId: number,
  args: string,
}

export type AgentHookBeforeTool = AgentHookBase & {
  type: 'beforeTool', // prepare new prompt after agent or tool step or parallel step
  parentStepId: number,
  args: string,
}

export type AgentHookAfterPromptStep = AgentHookBase & {
  type: 'afterPromptStep' // after human prompt step is added
  parentStepId: number,
}

export type AgentHookPooling = AgentHookBase & {
  type: 'pooling' // pooling to check for updates
  executionCount: number; // number of times this pooling has been executed
  afterMs: number; // milliseconds to wait before next pooling
}

export type AgentHooks = AgentHookBeforePromptStep | AgentHookAfterPromptStep | AgentHookPooling | AgentHookBeforeTool;
export * from '/_102036_/l2/shared/interfacesFrontend.js';
