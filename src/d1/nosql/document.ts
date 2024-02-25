import { AutoFlareDB } from "..";
import { FlareCollection } from "./collection";
import { FlareQuery } from "./query";

const convertFieldsToSQL = (fields: any) => {
    // {name: "John", age: 30} => { text: `(name, age) VALUES ($1, $2)`, values: ["John", 30] }
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    const text = `(${keys.join(", ")}) VALUES (${placeholders})`;
    return { text, values };
}


export class FlareDocument {
    constructor(public d1Ref: AutoFlareDB, public collection: FlareCollection, public uid: string) {
    }
    
    set(data: any): FlareQuery {
        const fields = convertFieldsToSQL(data);
        const statement = this.d1Ref.binding?.prepare(`INSERT INTO ${this.collection} ${fields.text}`).bind(fields.values);
        if (!statement) {
            throw new Error("Failed to prepare query");
        } else {
            return new FlareQuery(statement);
        }
    }
}