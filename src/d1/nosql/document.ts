import { AutoFlareDB } from "..";
import { FlareCollectionReference } from "./collection";

const convertFieldsToSQL = (fields: any) => {
    // {name: "John", age: 30} => { text: `(name, age) VALUES ($1, $2)`, values: ["John", 30] }
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    const text = `(${keys.join(", ")}) VALUES (${placeholders})`;
    return { text, values };
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

export class FlareDocumentReference {
    constructor(public d1Ref: AutoFlareDB, public parent: FlareCollectionReference, public uid: string) {
    }
    
    async set(data: any): Promise<FlareDocumentReference> {
        const { text, values } = convertFieldsToSQL(data);
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