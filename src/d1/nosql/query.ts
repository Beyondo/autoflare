import { D1PreparedStatement } from "../types";
import { FlareDocument } from "./document";

export class FlareQuery {
    private statement: D1PreparedStatement;
    constructor(statement: D1PreparedStatement) {
        this.statement = statement;
    }

    async get(): Promise<FlareDocument[]> {
        const queryResult = await this.statement.all();
        console.log(queryResult);
        return [];
    }

    // limit(limit: number): FlareQuery {
}