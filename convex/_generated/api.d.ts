/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents from "../agents.js";
import type * as costs from "../costs.js";
import type * as documents from "../documents.js";
import type * as fix_loki from "../fix_loki.js";
import type * as http from "../http.js";
import type * as messages from "../messages.js";
import type * as openclaw from "../openclaw.js";
import type * as queries from "../queries.js";
import type * as rpgSeed from "../rpgSeed.js";
import type * as seed from "../seed.js";
import type * as tasks from "../tasks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agents: typeof agents;
  costs: typeof costs;
  documents: typeof documents;
  fix_loki: typeof fix_loki;
  http: typeof http;
  messages: typeof messages;
  openclaw: typeof openclaw;
  queries: typeof queries;
  rpgSeed: typeof rpgSeed;
  seed: typeof seed;
  tasks: typeof tasks;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
