import { AutoFlareDB } from "..";
import { FlareCollectionReference } from "./collection";
import { FlareDocumentSnapshot } from "./document";

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

export class QuerySnapshot {
    constructor(private meta: any, private rows: any[]) {
    }

    get size() {
        return this.rows.length;
    }

    get empty() {
        return this.rows.length === 0;
    }

    get docs() {
        return this.rows.map((row) => new FlareDocumentSnapshot(this.meta, row));
    }

    get metadata() {
        return this.meta;
    }
    
    forEach(callback: (doc: FlareDocumentSnapshot) => void) {
        return this.docs.forEach((doc) => {
            callback(new FlareDocumentSnapshot(this.meta, doc));
        });
    }
}

export class FlareQuery {
    private selectString: string | undefined = undefined;
    private whereString: string = "";
    private limitString: string = "";
    private values: any[] = [];
    constructor(private dbRef: AutoFlareDB, private collectionRef: FlareCollectionReference) {
    }

    select(columns: string[]): FlareQuery {
        this.selectString = `SELECT ${columns.join(", ")} FROM ${this.collectionRef.name}`;
        return this;
    }

    where(column: string, operator: Operator | StringOperator, value: any): FlareQuery {
        if (this.whereString === "") {
            this.whereString = ` WHERE ${column} ${operator} ?1`;
        } else {
            this.whereString += ` AND ${column} ${operator} ?${this.values.length + 1}`;
        }
        this.values.push(value);
        return this;
    }

    limit(limit: number): FlareQuery {
        this.limitString = ` LIMIT ${limit}`;
        return this;
    }

    private buildQuery() {
        return (this.selectString ?? `SELECT * from ${this.collectionRef.name}`) + this.whereString + this.limitString;
    }

    async get(): Promise<QuerySnapshot> {
        const queryResult = await this.dbRef.exec(this.buildQuery(), this.values);
        if (!queryResult.success) {
            throw new Error(queryResult.error);
        }
        return new QuerySnapshot(queryResult.meta, queryResult.results);
    }
}