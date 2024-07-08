import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { SorterResult } from "ant-design-vue/es/table/interface";
import { PaginationConfig } from "ant-design-vue/es/pagination";
import dayjs from "dayjs";
import { ApiResponse, AppStoreTypeFk } from "@/types/store";
import { ax } from "@/utils/axios";
import { Column, setColumns, User } from "@/stores/modules/getStore";
import { columns } from "@/utils/columns";

export const useGetStoreFk = defineStore({
    id: "dataFk",
    state: (): AppStoreTypeFk<any> => {
        return {
            data: [],
            query: {
                sort: [],
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
            modal: true,
            addData: {},
            selectedRecord: {},
            selectedCol: undefined,

            // selectedColumns: [],
            // showedColumns: [],

            columnsProps: [],
        };
    },
    getters: {
        getPagination: (state) => {
            return {
                total: state.currentTotal,
                pageSize: state.query.limit,
                showSizeChanger: true,
                showQuickJumper: true,
                current: state.query.page,
                pageSizeOptions: ["10", "15", "20", "50"],
            };
        },
    },
    actions: {
        changeFilter(config: PaginationConfig, pag: any, sorter: SorterResult, path: string) {
            this.query.limit = config.pageSize ? config.pageSize : 10;
            this.query.page = config.current ? config.current : 1;

            if (sorter.field !== undefined) {
                // console.log(1);
                if (this.query.sort && this.query.sort.length !== 0) {
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
            // console.log("getFirstData");
            this.clear();
            this.getData(path);
        },
        async getData(path: string) {
            this.loading = true;
            // console.log(this.query);
            const res = await ax.post<ApiResponse<any>>(path, {
                ...this.query,
            });
            // console.log("GET_FK_DATA", res.data.data);
            this.loading = false;
            if (res.data.data) {
                this.data = res.data.data?.map((record) => {
                    for (const prop in record) {
                        const find = this.columns.find((colEl: any) => colEl.dataIndex === prop);
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
        setColumns(payloadColumns: Column[], route: string) {
            setColumns(this, payloadColumns, route);
        },
    },
});

function getSortDir(andOrderDir: string | undefined) {
    const isAsc = andOrderDir === "ascend";
    return isAsc ? "asc" : "desc";
}
