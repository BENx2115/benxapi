declare module 'benxapi' {
    interface BenxApiOptions {
        urlBase?: string;
        token?: string;
    }

    interface RequestOptions {
        maxBytes?: number;
        returnData?: boolean;
    }

    class benxApi {
        constructor(options: BenxApiOptions);
        get(url: string, options?: RequestOptions): Promise<any>;
        post(url: string, data: object, options?: RequestOptions): Promise<any>;
        put(url: string, data: object, options?: RequestOptions): Promise<any>;
        delete(url: string, data: object, options?: RequestOptions): Promise<any>;
    }

    export = benxApi;
}
