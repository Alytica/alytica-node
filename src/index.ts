import { Api } from "./api";
export type TrackHandlerPayload =
  | {
      type: "track";
      payload: TrackPayload;
    }
  | {
      type: "alias";
      payload: AliasPayload;
    }
  | {
      type: "identify";
      payload: IdentifyPayload;
    };
export type TrackPayload = {
  name: string;
  properties?: Record<string, unknown>;
  $userId?: string;
};
export type TrackProperties = {
  [key: string]: unknown;
  distinctId?: string;
};
export type IdentifyPayload = {
  $userId: string;
  properties?: Record<string, unknown>;
};
export type AliasPayload = {
  $distinctId: string;
  $alias: string;
};
export type AlyticaOptions = {
  clientId: string;
  clientSecret?: string;
  apiUrl?: string;
  debug?: boolean;
  disabled?: boolean;
  processProfile?: boolean;
};
export class Alytica {
  api: Api;
  distinctId?: string;
  global?: Record<string, unknown>;
  queue: TrackHandlerPayload[] = [];

  constructor(public options: AlyticaOptions) {
    const defaultHeaders: Record<string, string> = {
      "alytica-client-id": options.clientId,
    };
    if (options.clientSecret) {
      defaultHeaders["alytica-client-secret"] = options.clientSecret;
    }
    this.api = new Api({
      baseUrl: options.apiUrl || "http://localhost:3002",
      defaultHeaders,
    });
  }

  // placeholder for future use
  init() {
    // empty
  }

  ready() {
    this.flush();
  }

  async send(payload: TrackHandlerPayload) {
    if (this.options.disabled) {
      return Promise.resolve();
    }
    if (this.options.debug) {
      console.log(`Event sent to Alytica API: ${payload}`);
    }
    return this.api.fetch("/track", payload);
  }

  setGlobalProperties(properties: Record<string, unknown>) {
    this.global = {
      ...this.global,
      ...properties,
    };
  }

  async track(name: string, properties?: TrackProperties) {
    return this.send({
      type: "track",
      payload: {
        name,
        properties: {
          $distinctId: properties?.distinctId ?? this.distinctId,
          $processProfiles: this.options.processProfile,
          ...(this.global ?? {}),
          ...(properties ?? {}),
        },
      },
    });
  }

  async identify(payload: IdentifyPayload) {
    return this.send({
      type: "identify",
      payload: {
        $userId: payload.$userId,
        properties: {
          ...this.global,
          ...payload.properties,
        },
      },
    });
  }

  async alias(payload: AliasPayload) {
    if (payload.$distinctId) {
      if (payload.$alias === payload.$distinctId) return;
      return this.send({
        type: "alias",
        payload,
      });
    }
  }

  clear() {
    this.distinctId = undefined;
  }

  flush() {
    this.queue.forEach((item) => {
      this.send(item);
    });
    this.queue = [];
  }
}
