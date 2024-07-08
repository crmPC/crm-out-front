import { Column } from "@/stores/modules/getStore";
import { ObjectT } from "@/stores/modules/current";
import { Relation } from "@/utils/columns";

interface SelectT {
    value: string;
    label: string;
}

export interface AppStoreType<T> {
    data: T[]; // Теперь используем дженерик T для типизации массива persons
    query: FindAllDto;
    total: number;
    currentTotal: number;
    loading: boolean;
    route: string;
    columns: Column[];
    modal: boolean;
    addData: any;
    fkModal: boolean;
    mode: string;

    // selectedColumns: string[];
    // showedColumns: SelectT[];
    columnsProps: ColumnPropT[];

    newModal: {
        mode: string;
        record: ObjectT;
        columns: Column[];
        modelType: string | undefined;
        open: boolean;
        openFkTable: boolean;
        currentFkCol: Column;
        notShowFkColumn: string;
        fkModel: Relation;
        parentRecord: ObjectT;
    };

    companyOptions: any[];
}
export interface ColumnPropT {
    route: string;
    selectedColumns: string[];
    showedColumns: SelectT[];
}

export interface AppStoreTypeFk<T> {
    data: T[]; // Теперь используем дженерик T для типизации массива persons
    query: FindAllDto;
    total: number;
    currentTotal: number;
    loading: boolean;
    columns: any[];
    modal: boolean;
    addData: any;

    selectedRecord: MyObject;
    selectedCol: Column | undefined;

    // selectedColumns: string[];
    // showedColumns: SelectT[];
    columnsProps: ColumnPropT[];
}
export interface selectedRecord {
    value: MyObject;
    route: string;
}
interface MyObject {
    [key: string]: selectedRecord;
}

export interface ApiResponse<T> {
    page: number;
    limit: number;
    total: number;
    currentTotal: number;
    data?: T[];
}
export interface PaginationConfig {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger: boolean;
    showQuickJumper: boolean;
    pageSizeOptions: string[];
}
export interface FindAllDto {
    sort?: SortByDto[];
    limit: number;
    page: number;
    search?: string;
    paranoid: boolean;
    companies: string[];
}

export interface SortByDto {
    field: string;
    sortDir: string;
}

export interface SignUpData {
    login: string;
    password: string;
}
