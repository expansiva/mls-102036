/// <mls fileReference="_102036_/l2/environmentContract.ts" enhancement="_blank"/>

import { IAgentMeta, IOpenClawIntegration, Thread, ToolsBeforeSendMessage, ExecutionContext, TaskData, Message } from '/_102036_/l2/shared/interfaces.js'

/**
 * CONTRACT
 */
export interface CollabMessagesEnvironment {
    getAgents?(): Promise<IAgentMeta[]>;

    getIntegrationsOpenClaw?(): Promise<IOpenClawIntegration[]>;
    setIntegrationsOpenClaw?(integrations: IOpenClawIntegration[]): Promise<void>;

    config?: {
        getMenuMode?(): 'default' | 'custom',
        generateSvgAvatarEnabled?(): boolean
    }

    tasks?: {
        openTaskDetails?(messageId: string, taskId: string, task: TaskData, message: Message): Promise<{ openLocal: boolean, element: HTMLElement | undefined }>
    }

    agents?: {
        loadAgent?(agentName: string): Promise<IAgentMeta | null>;
        executeAgent?(agentToCall: string, context: ExecutionContext): Promise<void>;
        generateSvgAvatar?(threadId: string, userId: string, promptToAvatar: string): Promise<string | null>;
    }

    notifications?: {
        getFCMTokenForBackend?(): Promise<string | null>;
        getNotifySoundUrl?(): Promise<string | null>;
        sendRequestMissed?(): Promise<void>;
        sendACK?(id: string): Promise<void>;
    };

    bots?: {
        getArgsToBots?(): Promise<Record<string, any>>;
        getBotContextVarsBeforeMessageSend?(thread: Thread, messageText: string): Promise<string[]>;
        getBotContextVarsBeforeMessageSend2?(vars: string[], myArgs: Record<string, any>): Promise<ToolsBeforeSendMessage[]>;
    };
}

/**
 * RUNTIME TYPES 
 */
type NotificationsRuntime = {
    getFCMTokenForBackend: () => Promise<string | null>;
    getNotifySoundUrl: () => Promise<string | null>;
    sendRequestMissed: () => Promise<void>;
    sendACK: (id: string) => Promise<void>;
};

type BotsRuntime = {
    getArgsToBots: () => Promise<Record<string, any>>;
    getBotContextVarsBeforeMessageSend: (thread: Thread, messageText: string) => Promise<string[]>;
    getBotContextVarsBeforeMessageSend2: (vars: string[], myArgs: Record<string, any>) => Promise<ToolsBeforeSendMessage[]>;
};

type AgentsRuntime = {
    generateSvgAvatar: (threadId: string, userId: string, promptToAvatar: string) => Promise<string | null>;
    executeAgent: (agentToCall: string, context: ExecutionContext) => Promise<void>;
    loadAgent: (agentName: string) => Promise<IAgentMeta | null>;
};

type TaskRuntime = {
    openTaskDetails: (messageId: string, taskId: string, task: TaskData, message: Message) => Promise<{ openLocal: boolean, element: HTMLElement | undefined }>
};

type ConfigRuntime = {
    getMenuMode: () => 'default' | 'custom';
    generateSvgAvatarEnabled: () => boolean
};

/**
 * DEFAULTS (fallback)
 */
const defaultNotifications: NotificationsRuntime = {
    getFCMTokenForBackend: () => Promise.resolve(null),
    getNotifySoundUrl: () => Promise.resolve(null),
    sendRequestMissed: () => Promise.resolve(),
    sendACK: () => Promise.resolve(),
};

const defaultBots: BotsRuntime = {
    getArgsToBots: () => Promise.resolve({}),
    getBotContextVarsBeforeMessageSend: () => Promise.resolve([]),
    getBotContextVarsBeforeMessageSend2: () => Promise.resolve([]),
};

const defaultAgents: AgentsRuntime = {
    generateSvgAvatar: () => Promise.resolve(null),
    executeAgent: () => Promise.resolve(),
    loadAgent: () => Promise.resolve(null),
};

const defaultTasks: TaskRuntime = {
    openTaskDetails: () => Promise.resolve({ openLocal: false, element: undefined }),
};

const defaultConfig: ConfigRuntime = {
    getMenuMode: () => 'default',
    generateSvgAvatarEnabled: () => false
};

/**
 * ENV GLOBAL
 */
let _envCollabMessages: CollabMessagesEnvironment | null = null;

export function setEnvironment(env: CollabMessagesEnvironment) {
    _envCollabMessages = env;
}

function getEnv(): CollabMessagesEnvironment {
    return _envCollabMessages ?? {};
}

/**
 * NORMALIZERS
 */
function getEnvNotifications(): NotificationsRuntime {
    return {
        ...defaultNotifications,
        ...getEnv().notifications,
    };
}

function getEnvBots(): BotsRuntime {
    return {
        ...defaultBots,
        ...getEnv().bots,
    };
}

function getEnvAgents(): AgentsRuntime {
    return {
        ...defaultAgents,
        ...getEnv().agents,
    };
}

function getEnvTasks(): TaskRuntime {
    return {
        ...defaultTasks,
        ...getEnv().tasks,
    };
}

function getEnvConfig(): ConfigRuntime {
    return {
        ...defaultConfig,
        ...getEnv().config,
    };
}

/**
 * FACADE FINAL
 */
export const environment = {
    getAgents: () =>
        getEnv().getAgents?.() ?? Promise.resolve([] as IAgentMeta[]),

    getIntegrationsOpenClaw: () =>
        getEnv().getIntegrationsOpenClaw?.() ?? Promise.resolve([] as IOpenClawIntegration[]),

    setIntegrationsOpenClaw: (integrations: IOpenClawIntegration[]) =>
        getEnv().setIntegrationsOpenClaw?.(integrations) ?? Promise.resolve(),

    notifications: {
        getFCMTokenForBackend: () =>
            getEnvNotifications().getFCMTokenForBackend(),

        getNotifySoundUrl: () =>
            getEnvNotifications().getNotifySoundUrl(),

        sendRequestMissed: () =>
            getEnvNotifications().sendRequestMissed(),

        sendACK: (id: string) =>
            getEnvNotifications().sendACK(id),
    },

    bots: {
        getArgsToBots: () =>
            getEnvBots().getArgsToBots(),

        getBotContextVarsBeforeMessageSend: (thread: Thread, messageText: string) =>
            getEnvBots().getBotContextVarsBeforeMessageSend(thread, messageText),

        getBotContextVarsBeforeMessageSend2: (vars: string[], myArgs: Record<string, any>) =>
            getEnvBots().getBotContextVarsBeforeMessageSend2(vars, myArgs),
    },

    agents: {
        generateSvgAvatar: (threadId: string, userId: string, promptToAvatar: string) =>
            getEnvAgents().generateSvgAvatar(threadId, userId, promptToAvatar),

        executeAgent: (agentToCall: string, context: ExecutionContext) =>
            getEnvAgents().executeAgent(agentToCall, context),

        loadAgent: (agentName: string) =>
            getEnvAgents().loadAgent(agentName),
    },

    tasks: {
        openTaskDetails: (messageId: string, taskId: string, task: TaskData, message: Message) => getEnvTasks().openTaskDetails(messageId, taskId, task, message)
    },
    config: {
        getMenuMode: () =>
            getEnvConfig().getMenuMode(),
        generateSvgAvatarEnabled: () =>
            getEnvConfig().generateSvgAvatarEnabled()
    }
};