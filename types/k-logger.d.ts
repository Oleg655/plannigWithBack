declare module "k-logger" {
    interface Config {
        path?: string;
        access?: string;
        accessLogWriteAfter?: string;
        accessLogFormat?: string;
        error: string;
        errorCreateAlways?: boolean;
        errorSuppressHeadLine?: boolean;
        errorNewLineAtRecordEnd?: boolean;
        debug?: string;
        debugLevel?: string | number;
        debugFilter?: string;
        debugRelPath?: boolean;
        debugNewLineAtRecordEnd?: boolean;
        info?: string;
        infoSuppressHeadLine?: boolean;
        warning: string;
        warningCreateAlways?: boolean;
        warningSuppressHeadLine?: boolean;
        action?: string;
        custom?: string;
    }

    type LoggerOptins = {
        level?: number;
        preprocess?: Function;
        filters?: Function[];
        levels?: object;
        revLevels?: object;
        relpath?: boolean;
        format?: string;
        newLineAfterRecord?: boolean;
    };

    type LogRecordInfo = {
        args: any[];
        level?: number;
        slevel?: string;
        opts?: LoggerOptins;
        site?: any;
        scope?: any;
        fileName?: string;
        functionName?: string;
        line?: number;
        column?: number;
        message?: string;
    };
    
    function get(name?: String | Config, cfg?: Config): Logger;

    type Logger = {
        AccessLog: (...args: any[]) => any;
        DEBUG: () => string;
        ERROR: (...args: any[]) => string;
        INFO: (...args: any[]) => string;
        WARNING: (...args: any[]) => string;
        close: (msgs = {}) => Promise<void>;
    }
}
