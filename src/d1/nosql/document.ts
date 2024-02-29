import { AutoFlareDB } from "..";
import { FlareCollectionReference } from "./collection";

const convertFieldsToSQL = (fields: any) => {
    // {name: "John", age: 30} => { text: `(name, age) VALUES (?1, ?2)`, values: ["John", 30] }
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const query = `(${keys.join(", ")}) VALUES (${values.map((_, index) => `?${index + 1}`).join(", ")})`;
    return { query, keys, values };
}

export declare interface FlareDocumentData {
    [field: string]: any;
}

export class FlareDocumentSnapshot {
    constructor(private meta: any, private row: any) {
    }

    get exists() {
        return this.row !== undefined;
    }

    get metadata() {
        return this.meta;
    }

    data(): FlareDocumentData | undefined;
    data(options: { requireExists: true }): FlareDocumentData;

    // Implementation signature
    data(options?: { requireExists: boolean }): FlareDocumentData | undefined {
        if (options?.requireExists && !this.exists) {
            throw new Error("Document does not exist");
        }
        return this.row;
    }
}

function hasAllFields(objA: any, objB: any) {
    return Object.keys(objB).every(key => objA.hasOwnProperty(key));
}

export class FlareDocumentReference {
    constructor(public d1Ref: AutoFlareDB, public parent: FlareCollectionReference, public uid: string) {
        
    }
    
    async set(data: any): Promise<FlareDocumentReference> {
        const table = this.parent.table;
        const keys = Object.keys(data);
        const values = Object.values(data);
        
        if (!hasAllFields(table.schema, data)) {
            throw new Error("Document data does not match the table schema");
        }
        

        const result = await this.d1Ref.exec(`INSERT INTO ${this.parent.name} ${text}`, values);
        if (!result.success) {
            throw new Error(result.error);
        }
        return this;
    }

    async get() {
        const query = `SELECT * FROM ${this.parent.name} WHERE uid = $1`;
        const result = await this.d1Ref.exec(query, [this.uid]);
        if (!result.success) {
            throw new Error(result.error);
        }
        console.log(result);
        return new FlareDocumentSnapshot(result.meta, result.results[0]);
    }
}