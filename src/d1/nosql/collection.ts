import { AutoFlareDB } from "..";
import { FlareQuery } from "./query";

//export type WhereOperation = "==" | "!=" | ">" | "<" | ">=" | "<=" | "like" | "not-like" | "in" | "not-in";

export enum Operator {
    EQUALS = "==",
    NOT_EQUALS = "!=",
    GREATER_THAN = ">",
    LESS_THAN = "<",
    GREATER_THAN_EQUALS = ">=",
    LESS_THAN_EQUALS = "<=",
    LIKE = "LIKE",
    NOT_LIKE = "NOT LIKE",
    IN = "IN",
    NOT_IN = "NOT IN"
}

export type StringOperator = "==" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "NOT LIKE" | "IN" | "NOT IN";

export class FlareCollection {
    constructor(public d1Ref: AutoFlareDB, public name: string) {
    }

    where(column: string, operator: Operator | StringOperator, value: any): FlareQuery {
        const query_string = `SELECT * FROM ${this.name} WHERE ${column} ${operator} ?`;
        const statement = this.d1Ref.binding?.prepare(query_string).bind(value);
        if (!statement) {
            throw new Error("Failed to prepare query");
        } else {
            return new FlareQuery(statement);
        }
    }
}
/*
let testCollection = new FlareCollection(new AutoFlareDB(), 'test');

testCollection.where('name', "==", 'John');
*/