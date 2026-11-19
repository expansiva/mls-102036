/// <mls fileReference="_102036_/l2/shared/api.ts" enhancement="_blank"/>

import * as msg from '/_102036_/l2/shared/interfaces.js';
import { environment } from '/_102036_/l2/environmentContract.js';

async function handleRequest<T>(promise: Promise<T & { statusCode: number; msg?: string }>): Promise<ApiResult<T>> {
	try {
		const res = await promise;

		if (res.statusCode >= 200 && res.statusCode < 300) {
			return {
				success: true,
				response: res,
				statusCode: res.statusCode
			};
		}

		return {
			success: false,
			error: res?.msg || 'Request failed',
			statusCode: res.statusCode
		};

	} catch (err: any) {
		return {
			success: false,
			error: err?.message || 'Unexpected error',
			statusCode: err?.statusCode || 500
		};
	}
}

/** What the cm answers (403) when the `userId` of the body is not the person of the token. */
const IDENTITY_REFUSED = 'userId does not match authenticated user';

type IdentityRefusedHandler = () => Promise<string>;

let identityRefusedHandler: IdentityRefusedHandler | undefined;
let identitySwapInFlight: Promise<string> | undefined;
/** Old id -> the id that replaced it: a call refused a moment after the swap reuses it instead of swapping again. */
const swappedIds = new Map<string, string>();

/**
 * Registers the one handler that runs when the cm refuses the saved identity: it drops what was saved for the old user and returns the id of the
 * person the token belongs to. Registering again replaces it; `undefined` removes it (and forgets the swaps made).
 */
export function setIdentityRefusedHandler(handler: IdentityRefusedHandler | undefined): void {
	identityRefusedHandler = handler;
	identitySwapInFlight = undefined;
	swappedIds.clear();
}

function isIdentityRefused(error: unknown): boolean {
	const failure = error as { statusCode?: number; message?: string } | undefined;
	return failure?.statusCode === msg.HttpStatus.FORBIDDEN && typeof failure.message === 'string' && failure.message.includes(IDENTITY_REFUSED);
}

/** The id of the person after the swap for `oldId`; calls refused together wait for the same swap. A failure of the handler is logged and thrown. */
async function swapIdentity(oldId: string): Promise<string> {
	const done = swappedIds.get(oldId);
	if (done) return done;
	const handler = identityRefusedHandler;
	if (!handler) throw new Error('No handler for a refused identity');
	if (!identitySwapInFlight) {
		identitySwapInFlight = handler().then(
			(newId) => {
				identitySwapInFlight = undefined;
				swappedIds.set(oldId, newId);
				return newId;
			},
			(error: unknown) => {
				identitySwapInFlight = undefined;
				console.error('Could not replace the refused identity', error);
				throw error;
			}
		);
	}
	const newId = await identitySwapInFlight;
	swappedIds.set(oldId, newId);
	return newId;
}

/** What the cm answers (409) for a room it does not hold: `Thread not found: <threadId>` (after `DomainError: ` on the client). */
const THREAD_NOT_FOUND = /Thread not found: ([^\s,;]+)/;

type ThreadNotFoundHandler = (threadId: string) => Promise<void> | void;

let threadNotFoundHandler: ThreadNotFoundHandler | undefined;
/** The rooms the handler already ran for: a room that keeps failing (every sync) does not run it again. */
const threadsGone = new Set<string>();

/** Registers the one handler that runs with the id of a room the cm does not know. Registering again replaces it; `undefined` removes it and forgets the rooms done. */
export function setThreadNotFoundHandler(handler: ThreadNotFoundHandler | undefined): void {
	threadNotFoundHandler = handler;
	threadsGone.clear();
}

/** The room id inside a 409 `Thread not found: <id>`, from the message (not from the body of the request); nothing for any other error. */
export function threadNotFoundId(error: unknown): string | undefined {
	const failure = error as { statusCode?: number; message?: string } | undefined;
	if (failure?.statusCode !== msg.HttpStatus.CONFLICT || typeof failure.message !== 'string') return undefined;
	return threadNotFoundIdInMessage(failure.message);
}

/** The same, from a message alone: for a caller that only has the text (the error was wrapped into a new `Error`). */
export function threadNotFoundIdInMessage(message: string | undefined): string | undefined {
	return typeof message === 'string' ? THREAD_NOT_FOUND.exec(message)?.[1] : undefined;
}

/** Does not wait and does not repeat the request: the error goes up as it is. A failure of the handler is logged. */
function reportThreadNotFound(error: unknown): void {
	const threadId = threadNotFoundId(error);
	if (!threadId || !threadNotFoundHandler || threadsGone.has(threadId)) return;
	threadsGone.add(threadId);
	const handler = threadNotFoundHandler;
	void Promise.resolve()
		.then(() => handler(threadId))
		.catch((failure: unknown) => { console.error(`Could not drop the room ${threadId} the cm does not know`, failure); });
}

export async function post<T = msg.ResponseBase>(
	args: msg.RequestBase
): Promise<T> {
	try {
		return await postOnce<T>(args);
	} catch (error) {
		reportThreadNotFound(error);
		const sent = (args as { userId?: string }).userId;
		if (!sent || !identityRefusedHandler || !isIdentityRefused(error)) throw error;
		let newId: string;
		try {
			newId = await swapIdentity(sent);
		} catch {
			throw error;
		}
		if (!newId || newId === sent) throw error;
		// once: a second refusal goes up as it is
		return postOnce<T>({ ...args, userId: newId } as msg.RequestBase);
	}
}

async function postOnce<T = msg.ResponseBase>(
	args: msg.RequestBase
): Promise<T> {
	let urlHttp = environment.config.getApiUrl();

	try {
		const response = await fetch(urlHttp, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(args),
			credentials: environment.config.getApiCredentials()
		});

		if (response.status !== msg.HttpStatus.OK) {
			throw (await getPostError(response, args));
		}

		const data = await response.json();

		if (!data) {
			throw new Error("No data on cbePost");
		}

		return data as T;

	} catch (error) {
		console.info(error)
		throw error;
	}
}

export async function getPostError(response: Response, args: msg.RequestBase): Promise<Error> {
	const data = await response.json()
		.catch(err => {
			console.error("Error on getPostError: ", err);
			return new Error(`No data on cbePost error: ${err}`);
		});

	const errorMsg = (typeof data.msg === 'string') ? data.msg : data.error || 'Unknown error';
	const makeError = (message: string) => {
		const error = new Error(message) as Error & { statusCode?: number };
		error.statusCode = response.status;
		return error;
	};
	if (response.status === msg.HttpStatus.BAD_REQUEST) {
		console.error(`Error on cbePost, status: ${response.status}, msg: ${errorMsg}, invalid args: `, JSON.stringify(args));
		return makeError(`Invalid args, msg: ${errorMsg}`);
	}
	if (response.status === msg.HttpStatus.CONFLICT) {
		return makeError(`DomainError: ${errorMsg}`);
	}
	const msg2 = `Error on cbePost, status: ${response.status} - ${response.statusText}, error: ${errorMsg}`;
	console.error(msg2);
	return makeError(msg2);
}

export async function msgGetUsers(
	args: Omit<msg.RequestGetUsers, "action">
): Promise<ApiResult<msg.ResponseGetUsers>> {

	return handleRequest<msg.ResponseGetUsers>(
		post<msg.ResponseGetUsers>({
			action: "getUsers",
			...args
		})
	);
}

export function msgGetUserUpdate(
	args: Omit<msg.RequestGetUserUpdate, "action">
) {
	return handleRequest<msg.ResponseGetUserUpdate>(
		post<msg.ResponseGetUserUpdate>({
			action: "getUserUpdate",
			...args
		})
	);
}

export function msgUpdateUserDetails(
	args: Omit<msg.RequestUpdateUserDetails, "action">
) {
	return handleRequest<msg.ResponseUpdateUserDetails>(
		post<msg.ResponseUpdateUserDetails>({
			action: "updateUserDetails",
			...args
		})
	);
}

export function msgAddThread(
	args: Omit<msg.RequestAddThread, "action">
) {
	return handleRequest<msg.ResponseAddThread>(
		post<msg.ResponseAddThread>({
			action: "addThread",
			...args
		})
	);
}

export function msgUpdateThread(
	args: Omit<msg.RequestUpdateThread, "action">
) {
	return handleRequest<msg.ResponseUpdateThread>(
		post<msg.ResponseUpdateThread>({
			action: "updateThread",
			...args
		})
	);
}

export function msgRemoveParticipantFromThread(
	args: Omit<msg.RequestRemoveUserInThread, "action">
) {
	return handleRequest<msg.ResponseRemoveUserInThread>(
		post<msg.ResponseRemoveUserInThread>({
			action: "removeUserInThread",
			...args
		})
	);
}

export function msgAddParticipantToThread(
	args: Omit<msg.RequestAddUserInThread, "action">
) {
	return handleRequest<msg.ResponseAddUserInThread>(
		post<msg.ResponseAddUserInThread>({
			action: "addUserInThread",
			...args
		})
	);
}

export function msgGetThreadUpdates(
	args: Omit<msg.RequestGetThreadUpdate, "action">
) {
	return handleRequest<msg.ResponseGetThreadUpdate>(
		post<msg.ResponseGetThreadUpdate>({
			action: "getThreadUpdate",
			...args
		})
	);
}

export function msgGetTaskUpdate(
	args: Omit<msg.RequestGetTaskUpdate, "action">
) {
	return handleRequest<msg.ResponseGetTaskUpdate>(
		post<msg.ResponseGetTaskUpdate>({
			action: "getTaskUpdate",
			...args
		})
	);
}

export function msgAddMessage(
	args: Omit<msg.RequestAddMessage, "action">
) {
	return handleRequest<msg.ResponseAddMessage>(
		post<msg.ResponseAddMessage>({
			action: "addMessage",
			...args
		})
	);
}

export function msgCreateAttachmentUpload(
	args: Omit<msg.RequestCreateAttachmentUpload, "action">
) {
	return handleRequest<msg.ResponseCreateAttachmentUpload>(
		post<msg.ResponseCreateAttachmentUpload>({
			action: "createAttachmentUpload",
			...args
		})
	);
}

export function msgCompleteAttachmentUpload(
	args: Omit<msg.RequestCompleteAttachmentUpload, "action">
) {
	return handleRequest<msg.ResponseCompleteAttachmentUpload>(
		post<msg.ResponseCompleteAttachmentUpload>({
			action: "completeAttachmentUpload",
			...args
		})
	);
}

export function msgReportAttachmentUploadFailure(
	args: Omit<msg.RequestReportAttachmentUploadFailure, "action">
) {
	return handleRequest<msg.ResponseReportAttachmentUploadFailure>(
		post<msg.ResponseReportAttachmentUploadFailure>({
			action: "reportAttachmentUploadFailure",
			...args
		})
	);
}

export function msgDeleteAttachment(
	args: Omit<msg.RequestDeleteAttachment, "action">
) {
	return handleRequest<msg.ResponseDeleteAttachment>(
		post<msg.ResponseDeleteAttachment>({
			action: "deleteAttachment",
			...args
		})
	);
}

export function msgGetAttachmentUrl(
	args: Omit<msg.RequestGetAttachmentUrl, "action">
) {
	return handleRequest<msg.ResponseGetAttachmentUrl>(
		post<msg.ResponseGetAttachmentUrl>({
			action: "getAttachmentUrl",
			...args
		})
	);
}

export function msgEnsureTaskRoom(
	args: Omit<msg.RequestEnsureTaskRoom, "action">
) {
	return handleRequest<msg.ResponseEnsureTaskRoom>(
		post<msg.ResponseEnsureTaskRoom>({
			action: "ensureTaskRoom",
			...args
		})
	);
}

export function msgAddMessageAI(
	args: Omit<msg.RequestAddMessageAI, "action">
) {
	return handleRequest<msg.ResponseAddMessageAI>(
		post<msg.ResponseAddMessageAI>({
			action: "addMessageAI",
			...args
		})
	);
}

export function msgAddOrUpdateThreadBot(
	args: Omit<msg.RequestAddOrUpdateThreadBot, "action">
) {
	return handleRequest<msg.ResponseAddOrUpdateThreadBot>(
		post<msg.ResponseAddOrUpdateThreadBot>({
			action: "addOrUpdateThreadBot",
			...args
		})
	);
}

export function msgAddOrUpdateThreadIntegration(
	args: Omit<msg.RequestAddOrUpdateThreadIntegration, "action">
) {
	return handleRequest<msg.ResponseAddOrUpdateThreadIntegration>(
		post<msg.ResponseAddOrUpdateThreadIntegration>({
			action: "addOrUpdateThreadIntegration",
			...args
		})
	);
}

export function msgGetMessagesAfter(
	args: Omit<msg.RequestGetMessagesAfter, "action">
) {
	return handleRequest<msg.ResponseGetMessagesAfter>(
		post<msg.ResponseGetMessagesAfter>({
			action: "getMessagesAfter",
			...args
		})
	);
}

export function msgGetMessagesBefore(
	args: Omit<msg.RequestGetMessagesBefore, "action">
) {
	return handleRequest<msg.ResponseGetMessagesBefore>(
		post<msg.ResponseGetMessagesBefore>({
			action: "getMessagesBefore",
			...args
		})
	);
}

export function msgGetMessage(
	args: Omit<msg.RequestGetMessage, "action">
) {
	return handleRequest<msg.ResponseGetMessage>(
		post<msg.ResponseGetMessage>({
			action: "getMessage",
			...args
		})
	);
}

export function msgUpdateMessage(
	args: Omit<msg.RequestUpdateMessage, "action">
) {
	return handleRequest<msg.ResponseUpdateMessage>(
		post<msg.ResponseUpdateMessage>({
			action: "updateMessage",
			...args
		})
	);
}

export function msgAddOrUpdateOpenClawConnector(
	args: Omit<msg.RequestAddOrUpdateOpenClawConnector, "action">
) {
	return handleRequest<msg.ResponseAddOrUpdateOpenClawConnector>(
		post<msg.ResponseAddOrUpdateOpenClawConnector>({
			action: "addOrUpdateOpenClawConnector",
			...args
		})
	);
}

export function msgRemoveOpenClawConnector(
	args: Omit<msg.RequestRemoveOpenClawConnector, "action">
) {
	return handleRequest<msg.ResponseRemoveOpenClawConnector>(
		post<msg.ResponseRemoveOpenClawConnector>({
			action: "removeOpenClawConnector",
			...args
		})
	);
}

export function msgListOpenClawConnectors(
	args: Omit<msg.RequestListOpenClawConnectors, "action">
) {
	return handleRequest<msg.ResponseListOpenClawConnectors>(
		post<msg.ResponseListOpenClawConnectors>({
			action: "listOpenClawConnectors",
			...args
		})
	);
}

export function msgListOpenClawConnectorAgents(
	args: Omit<msg.RequestListOpenClawConnectors, "action">
) {
	return handleRequest<msg.ResponseListOpenClawConnectors>(
		post<msg.ResponseListOpenClawConnectors>({
			action: "listOpenClawConnectors",
			...args
		})
	);
}

export function msgListThreadOpenClawAgents(
	args: Omit<msg.RequestListThreadOpenClawAgents, "action">
) {
	return handleRequest<msg.ResponseListThreadOpenClawAgents>(
		post<msg.ResponseListThreadOpenClawAgents>({
			action: "listThreadOpenClawAgents",
			...args
		})
	);
}

export function msgAddOrUpdateThreadOpenClawAgent(
	args: Omit<msg.RequestAddOrUpdateThreadOpenClawAgent, "action">
) {
	return handleRequest<msg.ResponseAddOrUpdateThreadOpenClawAgent>(
		post<msg.ResponseAddOrUpdateThreadOpenClawAgent>({
			action: "addOrUpdateThreadOpenClawAgent",
			...args
		})
	);
}

export function msgRemoveThreadOpenClawAgent(
	args: Omit<msg.RequestRemoveThreadOpenClawAgent, "action">
) {
	return handleRequest<msg.ResponseRemoveThreadOpenClawAgent>(
		post<msg.ResponseRemoveThreadOpenClawAgent>({
			action: "removeThreadOpenClawAgent",
			...args
		})
	);
}

export function msgCreateOpenClawAgent (
	args: Omit<msg.RequestCreateOpenClawAgent , "action">
) {

	return handleRequest<msg.ResponseCreateOpenClawAgent >(
		post<msg.ResponseCreateOpenClawAgent >({
			action: "createOpenClawAgent",
			...args
		})
	);
}

export function msgDeleteOpenClawAgent   (
	args: Omit<msg.RequestDeleteOpenClawAgent , "action">
) {

	return handleRequest<msg.ResponseDeleteOpenClawAgent   >(
		post<msg.ResponseDeleteOpenClawAgent   >({
			action: "deleteOpenClawAgent",
			...args
		})
	);
}


export function msgListOpenClawAvailableAgents  (
	args: Omit<msg.RequestListOpenClawAvailableAgents  , "action">
) {
	return handleRequest<msg.ResponseListOpenClawAvailableAgents  >(
		post<msg.ResponseListOpenClawAvailableAgents  >({
			action: "listOpenClawAvailableAgents",
			...args
		})
	);
}

export type ApiResult<T> = {
	success: boolean;
	response?: T;
	error?: string;
	statusCode: number;
};

// ── Agent-orchestration helpers (raw: resolve to the response, throw on non-2xx)
// Used cross-project by 102027/102020/100554. Kept raw to match the contract
// those call sites already rely on. Single client — routes via getApiUrl (102036).
export function msgApplyIntents(
	args: Omit<msg.RequestApplyIntents, "action">
): Promise<msg.ResponseApplyIntents> {
	return post<msg.ResponseApplyIntents>({ action: "applyIntents", ...args });
}

export function msgAppendLongTermMemory(
	args: Omit<msg.RequestAppendLongTermMemory, "action">
): Promise<msg.ResponseAppendLongTermMemory> {
	return post<msg.ResponseAppendLongTermMemory>({ action: "appendLongTermMemory", ...args });
}
