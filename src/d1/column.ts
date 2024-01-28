export default class SQLColumn {
    private _primaryKey: boolean = false;
    private _autoIncrement: boolean = false;
    private _notNull: boolean = false;
    private _unique: boolean = false;
    private _index: boolean = false;
    private _type: string = "VARCHAR(255)";
    private _default: any = undefined;
    constructor(
        public name: string
    ) {}

    primaryKey(value = true) {
        this._primaryKey = value;
        return this;
    }

    autoIncrement(value = true) {
        this._autoIncrement = value;
        return this;
    }

    notNull(value = true) {
        this._notNull = value;
        return this;
    }

    unique(value = true) {
        this._unique = value;
        return this;
    }

    index(value = true) {
        this._index = value;
        return this;
    }

    bit() {
        this._type = "BIT";
        return this;
    }

    binary(length: number) {
        this._type = `BINARY(${length})`;
        return this;
    }

    varchar(length: number) {
        this._type = `VARCHAR(${length})`;
        return this;
    }

    integer() {
        this._type = "INTEGER";
        return this;
    }

    char(length: number) {
        this._type = `CHAR(${length})`;
        return this;
    }

    text() {
        this._type = "TEXT";
        return this;
    }

    blob() {
        this._type = "BLOB";
        return this;
    }

    datetime() {
        this._type = "DATETIME";
        return this;
    }

    default(value: any) {
        this._default = value;
        return this;
    }

    toString() {
        let str = `${this.name} ${this._type}`;

        if (this._autoIncrement) {
            str += " AUTO_INCREMENT";
        }
        if (this._primaryKey) {
            str += " PRIMARY KEY";
        }
        if (this._notNull) {
            str += " NOT NULL";
        }
        if (this._unique) {
            str += " UNIQUE";
        }
        if (!this._unique && this._index) {
            str += " INDEX";
        }
        if (this._default !== undefined) {
            str += ` DEFAULT ${typeof this._default === "string" ? `'${this._default}'` : this._default}`;
        }
        return str;
    }
}