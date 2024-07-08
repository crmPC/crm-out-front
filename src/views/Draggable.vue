<template>
    <div>
        Настроить порядок столбцов и показать / скрыть
        <a-switch v-model:checked="isShowList" />
    </div>
    <div v-if="isShowList" class="flex m-10">
        <draggable class="dragArea list-group w-full" :list="list" @change="log">
            <div
                :class="{
                    'd-list-el': true,
                }"
                v-for="element in list"
                :key="element.dataIndex"
                @click="clickOnColumn(element)"
            >
                <a-typography-text v-if="element.show" code>
                    {{ element.title }}
                </a-typography-text>
                <a-typography-text v-else delete>
                    {{ element.title }}
                </a-typography-text>
            </div>
        </draggable>
    </div>
</template>
<script lang="ts" setup>
    import config from "@/config";
    import { onMounted, ref } from "vue";
    import { VueDraggableNext as draggable } from "vue-draggable-next";
    import { columns } from "@/utils/columns";
    import { ax } from "@/utils/axios";
    import { Column, ColumnWithShow } from "@/stores/modules/getStore";
    import _ from "lodash";
    const props = defineProps(["route", "modelValue"]);
    const currentColumns = columns[props.route];
    const emit = defineEmits(["update:modelValue"]);
    const isShowList = ref(false);

    const list = ref<ColumnWithShow[]>([]);

    onMounted(async () => {
        await fetchColumnsFromServer(currentColumns);
    });

    function emitList() {
        emit(
            "update:modelValue",
            list.value.filter((el) => el.show)
        );
    }

    async function fetchColumnsFromServer(currentCols: Column[]) {
        if (!config.fetchColumnsFromServer) {
            console.log("✅", "Отключен по умолчанию запрос колонок с сервера");
            list.value = addShowToArray(currentColumns);
            emitList();
        } else {
            const res = await ax.get("columns");
            if (res.data && _.has(res.data.columns, props.route)) {
                console.log("колонки с сервера прилетели и мы их сейчас отобразим");
                list.value = res.data.columns[props.route];
                emitList();
            } else {
                console.log("колонки с сервера не прилетели, ставим колонки по умолчанию");
                list.value = addShowToArray(currentColumns);
                emitList();
                console.log("✅", "Сохраняем колонки на бек");
                await saveColumns(list.value);
            }
        }
    }

    function addShowToArray(currentColumns: Column[]): ColumnWithShow[] {
        return currentColumns.map((col) => {
            return { ...col, show: true };
        });
    }
    async function log(event: any) {
        console.log("change drag", event);
        emitList();
        await saveColumns(list.value);
    }

    async function saveColumns(columnsPayload: ColumnWithShow[]) {
        console.log("save columns to backend");
        let toServer = {};
        const res = await ax.get("columns");
        if (res.data) {
            console.log("Колонки есть на сервере");
            toServer = {
                ...res.data.columns,
                [props.route]: columnsPayload,
            };
        } else {
            console.log("Колонок на сервере нету");
            toServer = {
                [props.route]: columnsPayload,
            };
        }
        ax.post("columns", {
            columns: toServer,
        }).then(() => console.log("columns save successfull"));
    }

    async function clickOnColumn(columnRef: any) {
        columnRef.show = !columnRef.show;
        emitList();
        console.log("click on column", columnRef);
        await saveColumns(list.value);
    }
</script>

<style lang="scss">
    .d {
        &-list-el {
            margin: 5px;
        }
    }
</style>
