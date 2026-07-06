/// <mls fileReference="_102036_/l2/environmentContract.ts" enhancement="_blank"/>

import { IAgentMeta, IOpenClawIntegration, Thread, ToolsBeforeSendMessage, ExecutionContext, TaskData, Message } from '/_102036_/l2/shared/interfaces.js'

export interface CollabProgramMenuItem {
    title: string;
    icon: string;
    url: string;
    pageName: string;
    target?: string;
    children?: CollabProgramMenuItem[];
}

export interface CollabProgramMenu {
    name: string;
    icon: string;
    project: number;
    path: string;
    menu: CollabProgramMenuItem[];
}

/**
 * CONTRACT
 */
export interface CollabMessagesEnvironment {
    getAgents?(): Promise<IAgentMeta[]>;

    getIntegrationsOpenClaw?(): Promise<IOpenClawIntegration[]>;
    setIntegrationsOpenClaw?(integrations: IOpenClawIntegration[]): Promise<void>;

    config?: {
        getMenuMode?(): 'default' | 'custom',
        generateSvgAvatarEnabled?(): boolean,
        getApiUrl?(): string,
        getApiCredentials?(): RequestCredentials,
        getDefaultUserName?(): string
    }

    tasks?: {
        openTaskDetails?(messageId: string, taskId: string, task: TaskData, message: Message): Promise<{ openLocal: boolean, element: HTMLElement | undefined }>
    }

    apps?: {
        getProgramMenu?(): Promise<CollabProgramMenu[]>;
        openProgram?(item: CollabProgramMenuItem & { project?: number; module?: string; path?: string }): Promise<void>;
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

type AppsRuntime = {
    getProgramMenu: () => Promise<CollabProgramMenu[]>;
    openProgram: (item: CollabProgramMenuItem & { project?: number; module?: string; path?: string }) => Promise<void>;
};

type ConfigRuntime = {
    getMenuMode: () => 'default' | 'custom';
    generateSvgAvatarEnabled: () => boolean;
    getApiUrl: () => string;
    getApiCredentials: () => RequestCredentials;
    getDefaultUserName: () => string;
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
    openTaskDetails: async (_messageId: string, _taskId: string, task: TaskData, message: Message) => {
        const element = document.createElement('collab-messages-task-info-102025') as HTMLElement & {
            task?: TaskData,
            message?: Message
        };
        element.task = task;
        element.message = message;
        return { openLocal: true, element };
    },
};

const defaultApps: AppsRuntime = {
    getProgramMenu: () => Promise.resolve([]),
    openProgram: () => Promise.resolve(),
};

const defaultConfig: ConfigRuntime = {
    getMenuMode: () => 'default',
    generateSvgAvatarEnabled: () => false,
    getApiUrl: () => 'https://on.collab.codes/exec',
    getApiCredentials: () => 'include',
    getDefaultUserName: () => 'User',
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

function getEnvApps(): AppsRuntime {
    return {
        ...defaultApps,
        ...getEnv().apps,
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
    apps: {
        getProgramMenu: () =>
            getEnvApps().getProgramMenu(),
        openProgram: (item: CollabProgramMenuItem & { project?: number; module?: string; path?: string }) =>
            getEnvApps().openProgram(item),
    },
    config: {
        getMenuMode: () =>
            getEnvConfig().getMenuMode(),
        generateSvgAvatarEnabled: () =>
            getEnvConfig().generateSvgAvatarEnabled(),
        getApiUrl: () =>
            getEnvConfig().getApiUrl(),
        getApiCredentials: () =>
            getEnvConfig().getApiCredentials(),
        getDefaultUserName: () =>
            getEnvConfig().getDefaultUserName()
    }
};
