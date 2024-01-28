import SQLColumn from "./column";

export default class SQLTable {
    constructor(
        public name: string,
        public columns: SQLColumn[] = []
    ) {
        this.columns = columns;
    }

    getColumn(name: string) {
        return this.columns.find(column => column.name === name);
    }

    column(name: string) {
        const column = new SQLColumn(name);
        this.columns.push(column);
        return column;
    }

    get columnsString() {
        return this.columns.map(column => column.toString()).join(", ");
    }

    createColumnString(columnName: string, sqlite = false) { 
        const index = this.columns.findIndex((column) => column.name === columnName);
        if (index === -1) {
            throw new Error(`Column ${columnName} does not exist in table ${this.name}`);
        }
        let query = `ALTER TABLE '${this.name}' ADD '${columnName}' ${this.columns[index].toString()}`;
        if (index === 0) {
            query += " FIRST;";
        } else if (!sqlite) {
            query += ` AFTER '${this.columns[index - 1].name}';`;
        } else {
            query += ";";
        }
        return query;
    }

    get createString() {
        return `CREATE TABLE '${this.name}' (${this.columnsString});`;
    }

    get insertString() {
        return `INSERT INTO ${this.name} (${this.columns.map(column => column.name).join(", ")}) VALUES (${this.columns.map(column => "?").join(", ")});`;
    }

    get selectString() {
        return `SELECT ${this.columns.map(column => column.name).join(", ")} FROM ${this.name};`;
    }

    get updateString() {
        return `UPDATE ${this.name} SET ${this.columns.map(column => `${column.name} = ?`).join(", ")} WHERE id = ?;`;
    }

    get deleteString() {
        return `DELETE FROM ${this.name} WHERE id = ?;`;
    }
}