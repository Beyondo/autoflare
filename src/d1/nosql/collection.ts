import { AutoFlareDB } from "..";
import { FlareDocumentReference } from "./document";
import { FlareQuery, Operator, StringOperator } from "./query";

//export type WhereOperation = "==" | "!=" | ">" | "<" | ">=" | "<=" | "like" | "not-like" | "in" | "not-in";

export class FlareCollectionReference {
    constructor(public d1Ref: AutoFlareDB, public name: string) {
    }

    where(column: string, operator: Operator | StringOperator, value: any): FlareQuery {
        return new FlareQuery(this.d1Ref, this).where(column, operator, value);
    }

    select(columns: string[]): FlareQuery {
        return new FlareQuery(this.d1Ref, this).select(columns);
    }

    doc(uid: string): FlareDocumentReference {
        return new FlareDocumentReference(this.d1Ref, this, uid);
    }
}
/*
let testCollection = new FlareCollection(new AutoFlareDB(), 'test');

testCollection.where('name', "==", 'John');
*/