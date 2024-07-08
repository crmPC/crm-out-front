import { defineStore } from "pinia";
import { ax } from "@/utils/axios";
import { ApiResponse } from "@/types/store";

export const useSearchAllStore = defineStore({
    id: "search",
    state: (): any => {
        return {
            data: {},
            query: {
                sort: [],
                limit: 5,
                page: 1,
                search: "",
                paranoid: false,
            },
            loading: true,
        };
    },
    getters: {},
    actions: {
        clear() {
            // console.log("clear search");
            this.query.search = "";
        },
        async getFirstAll() {
            // console.log("mounted");
            this.getAll();
        },
        async getAll() {
            // console.log("getall");
            this.isLoading = true;
            // console.log(this.query);
            const res = await ax.post<ApiResponse<any>>("search", {
                ...this.query,
            });
            // console.log(res.data);
            this.isLoading = false;
            this.data = res.data;
        },
        searchf(searchText: string, path: string) {
            this.query.search = searchText;
            this.query.page = 1;
            this.getAll();
        },
    },
});
