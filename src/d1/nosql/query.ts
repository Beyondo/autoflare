import { D1PreparedStatement } from "../types";

export class FlareQuery {
    private statement: D1PreparedStatement;
    constructor(statement: D1PreparedStatement) {
        this.statement = statement;
    }
}