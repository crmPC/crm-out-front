import { defineStore } from "pinia";
import { AxiosError, AxiosResponse } from "axios";
import { SorterResult } from "ant-design-vue/es/table/interface";
import { PaginationConfig } from "ant-design-vue/es/pagination";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import _ from "lodash";
import { ax } from "@/utils/axios";
import { ApiResponse, AppStoreType, ColumnPropT } from "@/types/store";
import { columns, getPk, Relation } from "@/utils/columns";
import { ObjectT } from "@/stores/modules/current";
import { useSearchAllStore } from "@/stores/modules/searchAll";
import { emitter } from "@/main";
import { useGetStoreFk } from "@/stores/modules/getStoreFk";

export interface User {
    id_user: number;
    login: string;
    password: string;
    banned: boolean;
    banReason: string;
    user_role: string;
}

export interface ServerResponse {
    status: number;
    message: string;
}

export interface Column {
    title: string;
    dataIndex: string;
    key: string;
    fkTableName?: string;
    showOnAdd: boolean;
    dataType: string;
    sorter: boolean;
    editable: boolean;
    enum?: string[];
    primary?: boolean;
    showOnEntity?: boolean;
    showProps?: string[];
    filters?: {
        text: string;
        value: string;
    }[];
}

export interface ColumnWithShow extends Column {
    show: boolean;
}

export const useGetStore = defineStore({
    id: "data",
    state: (): /* any */ AppStoreType<ObjectT> => {
        return {
            data: [],
            query: {
                sort: [
                    // {
                    //     field: 'email',
                    //     sortDir: 'asc',
                    // },
                ],
                limit: 10,
                page: 1,
                search: "",
                paranoid: false,
                companies: [],
            },
            total: 100,
            currentTotal: 100,
            loading: true,
            columns: [],
            route: "",
            modal: false,
            addData: {},

            fkModal: false,
            mode: "",

            // selectedColumns: [],
            // showedColumns: [],
            columnsProps: [],
            newModal: {
                record: {},
                mode: "NEW_FROM_ENTITY", // EDIT_FROM_CRUD_TABLE EDIT_FROM_ENTITY
                columns: [],
                modelType: undefined,
                open: false,
                openFkTable: false,
                fkModel: {} as Relation,

                currentFkCol: {} as Column,
                notShowFkColumn: "",
                parentRecord: {} as ObjectT,
            },

            companyOptions: [],
        };
    },
    getters: {
        enum2(state) {
            return function (dataIndex: string) {
                const modelType = _.get(state, "newModal.modelType");

                if (!_.isUndefined(modelType)) {
                    const find = _.find(
                        columns[modelType],
                        (el) => _.get(el, "dataIndex") === dataIndex
                    );

                    if (find) {
                        const enums = _.get(find, "enum", null);

                        if (enums) {
                            return _.map(enums, (enumStr: string) => ({
                                value: enumStr,
                                label: enumStr,
                            }));
                        }
                    }
                }
                throw new Error("Проблема с геттером enum");
            };
        },
        getPagination: (state) => {
            return {
                total: state.currentTotal,
                pageSize: state.query.limit,
                showSizeChanger: true,
                showQuickJumper: true,
                current: state.query.page,
                pageSizeOptions: ["3", "5", "10", "15", "20", "50"],
            };
        },
    },
    actions: {
        filterChange(e: any) {
            console.log("filterChange", e);
            this.query.page = 1;
            this.getData("wsuser/all");
        },
        async getCompanies() {
            const response = await ax.get("all-companies");
            this.companyOptions = response.data
        },
        async deleteEntity2(path: string, id: number, from: string | undefined) {
            await this.del(path, id);
            emitter.emit("REFETCH");
        },
        async del(path: string, id: number) {
            const res = await ax.delete(path, {
                params: {
                    id,
                },
            });
            message.success("del success");
            return res;
        },
        async addEntity2() {
            if (this.newModal.mode === "EDIT_FROM_ENTITY") {
                await this.put(
                    this.newModal.modelType as string,
                    this.newModal.record,
                    this.newModal.record[getPk(this.newModal.modelType as string) as string]
                );
            } else if (
                this.newModal.mode === "NEW_FROM_ENTITY" ||
                this.newModal.mode === "NEW_FROM_ENTITY_WITH_FK_ONE"
            ) {
                const res = await this.post(
                    this.newModal.modelType as string,
                    this.newModal.record
                );
                if (res) {
                    // message.success(`Запись ${this.newModal.fkModel.name} успешно создана`);
                    if (
                        this.newModal.mode === "NEW_FROM_ENTITY_WITH_FK_ONE" &&
                        res.data[getPk(this.newModal.fkModel.name as string) as string]
                    ) {
                        const entityId =
                            res.data[getPk(this.newModal.fkModel.name as string) as string];
                        const t = this.newModal.fkModel.table as string;
                        const pkValue =
                            this.newModal.parentRecord[
                                getPk(this.newModal.fkModel.table as string) as string
                            ];
                        const fk = this.newModal.fkModel.fk as string;
                        const obj = {} as ObjectT;
                        obj[fk] = entityId;
                        const checkUndefined = [entityId, t, pkValue, fk].forEach((el) => {
                            if (_.isUndefined(el)) {
                                throw new Error("Эти значения должны определены");
                            }
                        });

                        const putRes = await this.put(t, obj, pkValue);
                        emitter.emit("REFETCH");
                        if (putRes) {
                            message.success(`Запись ${this.newModal.fkModel.name} связана с ${t}`);
                        } else {
                            message.error(
                                `Ошибка при попытке связать ${this.newModal.fkModel.name}  с ${this.newModal.fkModel.table}`
                            );
                        }
                    }
                }

                // if (this.newModal.parentRecord) debugger;
            }
            this.newModal.open = false;
            emitter.emit("REFETCH");
            emitter.emit("UPDATE_CURRENT");
        },
        async post(path: string, record: ObjectT) {
            const result = await ax.post(path, record);
            message.success("post success");
            return result;
        },
        async put(path: string, record: ObjectT, id: number) {
            const result = await ax.put(path, record, {
                params: {
                    id,
                },
            });
            message.success("put success");
            return result;
        },

        setReactiveAddDataObject2(columns: Column[]) {
            this.newModal.record = {};
            columns.forEach((col) => {
                if (col.dataType === "string" && col.showOnAdd) {
                    this.newModal.record[col.dataIndex] = "";
                } else if (col.dataType === "int" && col.showOnAdd) {
                    this.newModal.record[col.dataIndex] = "";
                } else if (col.dataType === "date" && col.showOnAdd) {
                    this.newModal.record[col.dataIndex] = dayjs();
                } else if (col.dataType === "enum" && col.showOnAdd) {
                    this.newModal.record[col.dataIndex] = col.enum ? col.enum[0] : "";
                } else if (col.dataType === "boolean") {
                    this.newModal.record[col.dataIndex] = false;
                } else if (col.dataType === "fk") {
                    this.newModal.record[col.dataIndex] = null;
                }
            });
        },
        async selectRecordFk(record: any, route: string) {
            console.log(route);
            const fkId = record[getPk(this.newModal.currentFkCol.fkTableName as string) as string];
            ax.get(route, {
                params: {
                    id: fkId,
                },
            }).then((result) => {
                if (result.data) {
                    this.newModal.record[this.newModal.currentFkCol.fkTableName as string] =
                        result.data.data;
                }
            });

            this.newModal.record[this.newModal.currentFkCol.dataIndex] = fkId;
            this.newModalCloseFkTable();
        },

        closeModalAndShowFkTable(col: Column, mode: string) {
            // console.log("closeModalAndShowFkTable");
            this.newModal.currentFkCol = col;
            this.newModal.open = false;
            this.newModal.openFkTable = true;
            this.clearFkAndGetNewDataForFkTable();
        },
        changeFkValueToNull(col: Column, mode: string) {
            this.newModal.currentFkCol = col;
            this.newModal.record[this.newModal.currentFkCol.dataIndex] = null;
            this.newModal.record[col.fkTableName as string] = null;
        },
        clearFkAndGetNewDataForFkTable() {
            const fkStore = useGetStoreFk();
            fkStore.clear();
            fkStore.setColumns(
                columns[this.newModal.currentFkCol.fkTableName as string],
                this.newModal.currentFkCol.fkTableName as string
            );
            /* fkStore.setColumns(this.newModal.currentFkCol.fkTableName) */
            fkStore.getData(`${this.newModal.currentFkCol.fkTableName}/all`);
        },
        newModalCloseFkTable() {
            console.warn("ЗАКРЫТЬ FK TABLE");
            this.newModal.openFkTable = false;
            if (this.newModal.mode === "EDIT_FROM_CRUD_TABLE") {
                this.newModal.open = false;
            } else if (
                this.newModal.mode === "EDIT_FROM_ENTITY" ||
                this.newModal.mode === "NEW_FROM_ENTITY" ||
                this.newModal.mode === "NEW_FROM_ENTITY_WITH_FK_ONE"
            ) {
                console.warn("ОТКРЫТЬ МОДАЛЬНОЕ ОКНО С СУЩНОСТЬЮ");
                this.newModal.open = true;
            }
        },
        selectFkEntityFromCruTable(columns: Column, modeType: string) {
            this.newModal.mode = "EDIT_FROM_CRUD_TABLE";
            this.newModal.currentFkCol = columns;
            this.newModal.open = false;
            this.newModal.openFkTable = true;

            this.clearFkAndGetNewDataForFkTable();
        },
        addMeta(columns: Column[], modeType: string, payload: ObjectT) {
            this.newModal.columns = columns;
            this.newModal.record = payload;
            this.newModal.modelType = modeType;
            this.newModal.open = true;
            // console.log("modeType", modeType);
            // console.log("columns", columns);
            // console.log("payload", payload);
        },
        createRelatedEntityOne(fkModel: Relation, parentRecord: ObjectT, parentModelType: string) {
            this.newModal.mode = "NEW_FROM_ENTITY_WITH_FK_ONE";
            const parentColumns = columns[fkModel.name];
            this.newModal.columns = parentColumns;
            this.newModal.modelType = fkModel.name;
            this.newModal.fkModel = fkModel;
            this.newModal.parentRecord = parentRecord;
            this.setReactiveAddDataObject2(parentColumns);

            const parentPkValue = parentRecord[getPk(parentModelType) as string];

            const childModel = columns[fkModel.name].find(
                (rel) => rel.fkTableName === parentModelType
            );
            const fkCol = childModel?.dataIndex as string;
            this.newModal.record[fkCol] = parentPkValue;
            this.newModal.notShowFkColumn = fkCol;

            this.newModal.open = true;
        },
        createRelatedEntity(fkModel: Relation, parentRecord: ObjectT, parentModelType: string) {
            if (_.has(fkModel, "tableName")) {
                this.newModal.mode = "NEW_FROM_ENTITY";
                const parentColumns = columns[fkModel.tableName as string];
                this.newModal.columns = parentColumns;
                this.newModal.modelType = fkModel.tableName;

                this.setReactiveAddDataObject2(parentColumns);

                const parentPkValue = parentRecord[getPk(parentModelType) as string];

                const childModel = columns[fkModel.tableName as string].find(
                    (rel) => rel.fkTableName === parentModelType
                );
                const fkCol = childModel?.dataIndex as string;
                this.newModal.record[fkCol] = parentPkValue;
                this.newModal.notShowFkColumn = fkCol;

                this.newModal.open = true;
            } else throw new Error("fk model name undefined");
        },
        newModalCreateRecord(columns: Column[], modeType: string) {
            this.newModal.mode = "NEW_FROM_ENTITY";
            // this.addMeta(columns, modeType, payload);
            this.newModal.columns = columns;
            // this.newModal.record = payload;
            this.newModal.modelType = modeType;
            this.newModal.open = true;
            this.setReactiveAddDataObject2(columns);
        },

        newModalEditRecord(columns: Column[], modeType: string, payload: ObjectT) {
            console.log("newModalEditRecord", columns, modeType, payload);
            this.newModal.mode = "EDIT_FROM_ENTITY";
            this.addMeta(columns, modeType, payload);
        },
        changeFilter(config: PaginationConfig, pag: any, sorter: SorterResult, path: string) {
            this.query.limit = config.pageSize ? config.pageSize : 10;
            this.query.page = config.current ? config.current : 1;

            if (sorter.field !== undefined) {
                // console.log(1);
                if (this.query.sort && this.query.sort.length !== 0) {
                    console.log("✅", "set Query Sort");
                    this.query.sort[0] = {
                        field: sorter.field as string,
                        sortDir: getSortDir(sorter.order as string),
                    };
                }
            } else {
                this.query.sort = [];
            }
            // console.log(2);

            this.getData(path);
            console.warn("___change", config, pag, sorter);
        },
        clear() {
            console.log("clear query");
            this.data = [];
            this.query = {
                sort: [],
                limit: 10,
                page: 1,
                search: "",
                paranoid: false,
                companies: [],
            };
            this.total = 100;
            this.currentTotal = 100;
            this.loading = true;
        },
        getFirstData(path: string) {
            console.log("getFirstData");
            this.clear();
            this.getData(path);
        },
        async getData(path: string) {
            console.log("get data");
            this.loading = true;
            console.log(this.query);
            const res = await ax.post<ApiResponse<any>>(path, {
                ...this.query,
            });
            this.loading = false;
            if (res.data.data) {
                console.log("getData DATA ", res.data.data);
                this.data = res.data.data?.map((record) => {
                    for (const prop in record) {
                        const find = this.columns.find((colEl) => colEl.dataIndex === prop);
                        if (find) {
                            const type = find.dataType;
                            if (type === "date" && record[prop] !== null) {
                                record[prop] = dayjs(record[prop]);
                            }
                        }
                    }
                    return { ...record, isEdited: false };
                });
                this.updateMeta(res);
            }
        },
        search(searchText: string, path: string) {
            this.query.search = searchText;
            this.query.page = 1;
            this.getData(path);
            // console.log(searchText);
        },
        updateMeta(res: AxiosResponse<ApiResponse<User>>) {
            this.total = res.data.total;
            this.currentTotal = res.data.currentTotal;
        },
        async change(path: string, id: number, record: any) {
            // console.log("change", path, id);
            await this.put(path, record, id);
            message.success("Success");
            await this.getData(`${path}/all`);
        },
        edit(path: string, id: number, record: any, idName: string, columns: Column[]) {
            this.mode = "EDIT_FROM_CRUD_TABLE";
            // this.addMeta(columns, path, record);
            this.newModal.columns = columns;
            this.newModal.record = record;
            this.newModal.modelType = path;

            // console.log("edit", path, id, "data", record, idName);
            const index = this.data.findIndex((el) => el[idName] === id);
            this.data.forEach((el, i) => {
                if (i !== index) {
                    el.isEdited = false;
                }
            });
            this.data[index].isEdited = true;
        },
        userBan(record: User, reason: string) {
            console.log({
                id_user: Number(record.id_user),
                banReason: reason,
            });
            ax.put("user/ban", {
                id_user: Number(record.id_user),
                banReason: reason,
            })
                .then((res) => {
                    message.success("Success");
                    this.getData("user/all");
                })
                .catch((error: AxiosError<ServerResponse>) => {
                    // console.log(error);
                    message.error(error.response?.data.message);
                });
        },
        async deleteEntity(path: string, id: number, from: string | undefined) {
            const searchStore = useSearchAllStore();
            // console.log("delete", path, id);
            const res = await ax.delete(path, {
                params: {
                    id,
                },
            });
            message.success("Success");
            from ? searchStore.getAll() : this.getData(`${path}/all`);
            return true;
        },
        setColumns(columns: Column[], route: string) {
            setColumns(this, columns, route);

            // const router = useRouter();
            // router.push({
            //     query: this.query,
            // });

            // this.showedColumns = columns.map((col: Column) => {
            //     return {
            //         value: col.dataIndex,
            //         label: col.title,
            //     };
            // });
            //
            // this.selectedColumns = columns.map((col: Column) => col.dataIndex);
            //
            // this.route = route;
            this.setReactiveAddDataObject(columns);
            // this.columns = columns;
            console.log("✅", "set Query Sort 2");
            this.query.sort = [
                {
                    field: columns[0].dataIndex,
                    sortDir: "asc",
                },
            ];
        },
        setReactiveAddDataObject(columns: any[]) {
            columns.forEach((col) => {
                if (col.dataType === "string" && col.showOnAdd) {
                    this.addData[col.dataIndex] = "";
                } else if (col.dataType === "int" && col.showOnAdd) {
                    this.addData[col.dataIndex] = "";
                } else if (col.dataType === "date" && col.showOnAdd) {
                    this.addData[col.dataIndex] = dayjs();
                } else if (col.dataType === "enum" && col.showOnAdd) {
                    this.addData[col.dataIndex] = col.enum[0];
                } else if (col.dataType === "boolean") {
                    this.addData[col.dataIndex] = false;
                }
            });
        },

        clearAddData() {
            this.newModal.record = {};
            this.newModal.mode = "NEW_FROM_ENTITY";
            this.newModal.columns = [];
            this.newModal.modelType = undefined;
            this.newModal.open = false;
            this.newModal.openFkTable = false;
            this.newModal.currentFkCol = {} as Column;
        },
    },
});

export function getSortDir(andOrderDir: string | undefined) {
    const isAsc = andOrderDir === "ascend";
    return isAsc ? "asc" : "desc";
}

export function setColumns(cthis: any, columns: Column[], route: string) {
    console.log("set columns");
    const ColumnPropInStore = cthis.columnsProps.find((col: ColumnPropT) => col.route);

    const columnProp = {} as ColumnPropT;
    columnProp.showedColumns = columns
        .map((col) => {
            return {
                value: col.dataIndex,
                label: col.title,
            };
        })
        .filter((col) => col.label !== "action");
    columnProp.selectedColumns = columns.map((col) => col.dataIndex).filter((col) => col);
    columnProp.route = route;

    const findIndex = cthis.columnsProps.find((el: ColumnPropT) => el.route === route);
    if (findIndex !== -1) {
        cthis.columnsProps.push(columnProp);
    } else {
        cthis.columnsProps[findIndex] = columnProp;
    }

    cthis.route = route;
    cthis.columns = columns;
}
