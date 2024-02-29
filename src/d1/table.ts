import { SQLColumn } from "./column";

export class SQLTable {
    constructor(
        public name: string,
        public schema: { [key: string]: SQLColumn } = {}
    ) {
    }

    getColumn(name: string): SQLColumn | undefined {
        return this.schema[name];
    }

    get columnsString() {
        //return this.schema.map(column => column.toString()).join(", ");
        return Object.values(this.schema).map(column => column.toString()).join(", ");
    }

    createColumnString(columnName: string, sqlite = false) { 
        //const index = this.schema.findIndex((column) => column.name === columnName);
        const columns = Object.values(this.schema);
        const index = columns.findIndex((column) => column.name === columnName);
        if (index === -1) {
            throw new Error(`Column ${columnName} does not exist in table ${this.name}`);
        }
        //let query = `ALTER TABLE '${this.name}' ADD '${columnName}' ${this.columns[index].toString()}`;
        let query = `ALTER TABLE '${this.name}' ADD '${columnName}' ${columns[index].toString()}`;
        if (index === 0) {
            query += " FIRST;";
        } else if (!sqlite) {
            //query += ` AFTER '${this.columns[index - 1].name}';`;
            query += ` AFTER '$columns[index - 1].name}';`;
        } else {
            query += ";";
        }
        return query;
    }

    get createString() {
        return `CREATE TABLE \`${this.name}\` (${this.columnsString});`;
    }

    get insertString() {
        //return `INSERT INTO ${this.name} (${this.columns.map(column => column.name).join(", ")}) VALUES (${this.columns.map(column => "?").join(", ")});`;
        return `INSERT INTO ${this.name} (${Object.values(this.schema).map(column => column.name).join(", ")}) VALUES (${Object.values(this.schema).map(column => "?").join(", ")});`;
    }

    get selectString() {
        //return `SELECT ${this.columns.map(column => column.name).join(", ")} FROM ${this.name};`;
        return `SELECT ${Object.values(this.schema).map(column => column.name).join(", ")} FROM ${this.name};`;
    }

    get updateString() {
        //return `UPDATE ${this.name} SET ${this.columns.map(column => `${column.name} = ?`).join(", ")} WHERE id = ?;`;
        return `UPDATE ${this.name} SET ${Object.values(this.schema).map(column => `${column.name} = ?`).join(", ")} WHERE id = ?;`;
    }

    get deleteString() {
        return `DELETE FROM ${this.name} WHERE id = ?;`;
    }
}