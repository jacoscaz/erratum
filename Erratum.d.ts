
declare class Erratum {
    
    constructor(data: object | string, message?: string);

    toJSON(): { message: string, name: string };

    toString(): string;

    name: string;

    message: string;

    stack: string;

    static assert(check: boolean, data: object | string, message?: string): void;

    static defaults: object;

}

export = Erratum;
