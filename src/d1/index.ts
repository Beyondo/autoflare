import SQLTable from "./table";
import SQLColumn from "./column";
import { D1Database, D1Result } from "./types";

const createTable = async (db: AutoFlareD1, table: SQLTable) : Promise<boolean> => {
    const query = table.createString;
    const res = await db.exec(query);
    return res.success;
}

const createColumn = async (db: AutoFlareD1, table: SQLTable, columnName: string) : Promise<boolean> => {
    const query = table.createColumnString(columnName, true);
    const res = await db.exec(query);
    return res.success;
}

const getMissingTable = (exceptionString: string) : string | null => {
    const match = exceptionString.match(/no such table: (.*)/);
    if (match) {
        return match[1];
    }
    return null;
}

const getMissingColumn = (exceptionString: string) : string | null => {
    const match = exceptionString.match(/no such column: (.*)/);
    if (match) {
        return match[1];
    }
    return null;
}

export default class AutoFlareD1 {
    constructor(public binding?: D1Database, public tables: Map<string, SQLTable> = new Map()) {
    }

    bind(binding: D1Database) {
        if (!binding) {
            throw new Error("Tried to bind an empty binding");
        }
        this.binding = binding;
    }

    async exec(query: string, params?: any[]): Promise<D1Result> {
        if (!this.binding) {
            throw new Error("No database was bound AutoFlareD1");
        }
        try {
            return await this.binding.prepare(query).bind(...(params ?? [])).run();
        } catch (e: any) {
            const missingTable = getMissingTable(e.message);
            if (missingTable) {
                const table = this.tables.get(missingTable);
                if (table) {
                    const created = await createTable(this, table);
                    if (created) {
                        console.log("Created table", missingTable);
                        return await this.exec(query, params);
                    }
                }
            }
            const missingColumn = getMissingColumn(e.message);
            if (missingColumn) {
                const table = this.tables.get(missingColumn);
                if (table) {
                    const created = await createColumn(this, table, missingColumn.split(".")[1]);
                    if (created) {
                        console.log("Created column", missingColumn);
                        return await this.exec(query, params);
                    }
                }
            }
            throw e;
        }
    }
};

export { SQLTable, SQLColumn };