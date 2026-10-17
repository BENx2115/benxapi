declare module 'benxapi' {
    interface BenxApiOptions {
        urlBase?: string;
        token?: string;
    }

    interface RequestOptions {
        maxBytes?: number;
        returnData?: boolean;
        timeoutMs?: number;
        signal?: RequestSignal;
    }

    interface RequestSignal {
        readonly aborted: boolean;
        addEventListener(type: 'abort', listener: () => void, options?: { once?: boolean }): void;
        removeEventListener(type: 'abort', listener: () => void): void;
    }

    interface ApiResponse<T = unknown> {
        req: unknown;
        res: unknown;
        statusCode: number;
        ok: boolean;
        headers: Record<string, string | string[] | undefined>;
        data?: T | Uint8Array;
    }

    class benxApi {
        constructor(options?: BenxApiOptions);
        get(url: string, options?: RequestOptions): Promise<ApiResponse>;
        post(url: string, data?: object, options?: RequestOptions): Promise<ApiResponse>;
        put(url: string, data?: object, options?: RequestOptions): Promise<ApiResponse>;
        delete(url: string, data?: object, options?: RequestOptions): Promise<ApiResponse>;
    }

    export = benxApi;
}
