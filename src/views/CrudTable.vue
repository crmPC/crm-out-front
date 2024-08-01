<script setup lang="ts">
    import { defineProps, onMounted, onUnmounted, ref } from "vue";
    import { storeToRefs } from "pinia";
    import { PaginationConfig } from "ant-design-vue/es/pagination";
    import { SorterResult } from "ant-design-vue/es/table/interface";
    import _ from "lodash";
    import { useRouter } from "vue-router";
    import { CloseOutlined } from "@ant-design/icons-vue";
    import { Column, useGetStore } from "@/stores/modules/getStore";
    import DateComponent from "@/components/DateComponent.vue";
    import DropDown from "@/components/DropDown.vue";
    import UserBanButtons from "@/components/UserBanButtons.vue";
    import { getColumnsByModelName, getFkDataForColumn, getPk } from "@/utils/columns";
    import { ObjectT } from "@/stores/modules/current";
    import { emitter } from "@/main";
    import { getLdapUsers } from "@/utils/getLdapUsers";
    import Draggable from "@/views/Draggable.vue";
    import Task from "@/views/Task.vue";

    const router = useRouter();

    const props = defineProps(["route", "columns", "store", "notShowAddButton", "add"]);

    const routeAll = `${props.route}/all`;
    const getStore = useGetStore();
    const { data, query, loading, total, columnsProps } = storeToRefs(props.store);
    const isLoading = ref(false);

    onMounted(() => {
        console.warn("CRUD TABLE MOUNTED");
        props.store.setColumns(props.columns, props.route);
        props.store.getData(routeAll);
        isLoading.value = true;
        emitter.on("REFETCH", () => {
            console.log("refetch");
            props.store.getData(routeAll);
        });
    });
    onUnmounted(() => {
        emitter.off("REFETCH");
    });

    const showedColumnsDraggable = ref([]);

    function tableChangeHandler(config: PaginationConfig, pag: any, sorter: SorterResult) {
        console.log("tableChangeHandler");
        props.store.changeFilter(config, pag, sorter, routeAll);
    }

    function fn(e: any) {
        props.store.search(e.target.value, routeAll);
        // console.log("debounce");
    }

    const search2 = _.debounce(fn, 300);

    const customRow = (record: any) => {
        return {
            onClick: () => {
                emitter.emit("REFETCH_CURRENT", record);
                // console.log("customRow click");
                if (props.add) {
                    getStore.selectRecordFk(record, props.route);
                }
            },
        };
    };

    function isShow(column: Column, col: Column, record: ObjectT) {
        if (!column.editable) {
            return column.dataIndex === col.key;
        }
        return column.dataIndex === col.key && !record.isEdited;
    }

    function goToRecord(record: ObjectT, route: string) {
        if (!props.add) {
            const query1 = {
                modelType: props.route,
                id: record[getPk(props.route) as string],
            };
            console.log(query1);
            router.push({
                path: "current",
                query: query1,
            });
        }
    }

    function del() {
        localStorage.removeItem("columnsProps");
    }
</script>

<template>
    <div v-if="isLoading">
        <!--        <button @click='del'>clear columnsProps</button>-->
        <!--        <div>finded index {{ findColumnsPropIndex }}</div>-->
        <Draggable :route="route" v-model:modelValue="showedColumnsDraggable" />

        <div class="flex flex-between align-items-center">
            <div>
                <a-space align="center" style="margin-bottom: 8px; margin-top: 8px">
                    Показывать удаленные записи:
                    <a-switch
                        v-model:checked="query.paranoid"
                        @change="props.store.getData(routeAll)"
                    ></a-switch>
                </a-space>
                {{ total }}
            </div>
            <a-button
                v-if="!props.notShowAddButton"
                size="small"
                type="primary"
                style="margin: 0 0 0 10px"
                @click="
                    props.store.newModalCreateRecord(
                        getColumnsByModelName(props.route),
                        props.route
                    )
                "
            >
                Добавить запись
            </a-button>
        </div>

        <!--  <a-button v-if="!props.notShowAddButton" type="primary" @click="props.store.showModal">-->
        <!--    Добавить запись-->
        <!--  </a-button>-->
        <a-input
            v-model:value="query.search"
            placeholder="Поле для поиска по текстовым полям сущностей"
            size="middle"
            @change="search2"
            style="margin: 0 0 8px 0"
        />
        <a-table
            v-if="showedColumnsDraggable.length !== 0"
            :columns="props.add ? props.columns : showedColumnsDraggable"
            :custom-row="customRow"
            :data-source="data"
            :pagination="props.store.getPagination"
            :loading="loading"
            @change="tableChangeHandler"
            size="small"
        >
            <!--
  -->
            <template #bodyCell="{ column, record, _index }">
                <div v-for="(col, i) in props.columns" :key="i">
                    <div v-if="col.dataType === 'string'">
                        <template v-if="isShow(column, col, record)">
                            {{ record[col.dataIndex] }}
                        </template>

                        <template
                            v-if="
                                column.dataIndex === col.key && record.isEdited && column.editable
                            "
                        >
                            <a-input
                                v-model:value="record[col.dataIndex]"
                                placeholder="Basic usage"
                            />
                        </template>
                    </div>

                    <div v-if="col.dataType === 'enum'">
                        <template v-if="isShow(column, col, record)">
                            {{ record[col.dataIndex] }}
                        </template>

                        <template
                            v-if="
                                column.dataIndex === col.key && record.isEdited && column.editable
                            "
                        >
                            <DropDown
                                v-model:modelValue="record[col.dataIndex]"
                                :record="record"
                                :column="column"
                                :col="col"
                            />
                        </template>
                    </div>

                    <div v-if="col.dataType === 'fk'">
                        <template v-if="isShow(column, col, record)">
                            <!--                            {{ record[col.dataIndex] }}-->
                            <router-link
                                :to="{
                                    path: 'current',
                                    query: {
                                        modelType: column.fkTableName,
                                        id: record[col.dataIndex],
                                    },
                                }"
                            >
                                {{ getFkDataForColumn(record, route, column) }}
                            </router-link>
                        </template>
                        <template
                            v-if="
                                column.dataIndex === col.key && record.isEdited && column.editable
                            "
                        >
                            <a-button
                                :type="record[col.dataIndex] !== null ? 'default' : 'primary'"
                                @click="getStore.selectFkEntityFromCruTable(col, props.route)"
                            >
                                <span v-if="record[col.dataIndex] !== null">
                                    <a>Выбран {{ getFkDataForColumn(record, route, column) }}</a>
                                </span>
                                <span v-if="record[col.dataIndex] === null">Выбрать</span>
                            </a-button>
                            <CloseOutlined
                                @click="getStore.changeFkValueToNull(col, 'ADD_WITH_MODAL')"
                            />

                            <!--                        fk:{{ record[col.dataIndex] }}-->
                        </template>
                    </div>

                    <div v-if="col.dataType === 'task'">
                        <template v-if="isShow(column, col, record)">
                            <Task :task="record[col.dataIndex]" :record='record' />
                        </template>
                    </div>

                    <div v-if="col.dataType === 'int'">
                        <template v-if="isShow(column, col, record)">
                            {{ record[col.dataIndex] }}
                        </template>

                        <template
                            v-if="
                                column.dataIndex === col.key && record.isEdited && column.editable
                            "
                        >
                            <a-input
                                v-model:value="record[col.dataIndex]"
                                placeholder="Basic usage"
                            />
                        </template>
                    </div>

                    <div v-if="col.dataType === 'date'">
                        <template v-if="isShow(column, col, record)">
                            <DateComponent :column="column" :record="record" />
                        </template>

                        <template
                            v-if="
                                column.dataIndex === col.key && record.isEdited && column.editable
                            "
                        >
                            <a-date-picker v-model:value="record[col.dataIndex]" />
                        </template>
                    </div>

                    <div v-if="col.dataType === 'boolean'">
                        <template v-if="isShow(column, col, record)">
                            <span>
                                <a-tag :color="record[column.dataIndex] ? 'red' : 'green'">
                                    {{ record[column.dataIndex] }}
                                </a-tag>
                            </span>
                        </template>

                        <template
                            v-if="
                                column.dataIndex === col.key && record.isEdited && column.editable
                            "
                        >
                            <span>
                                <a-tag :color="record[column.dataIndex] ? 'red' : 'green'">
                                    {{ record[column.dataIndex] }}
                                </a-tag>
                            </span>
                        </template>
                    </div>

                    <div v-if="col.dataType === 'action'">
                        <template v-if="column.key === 'action'">
                            <span v-if="props.add">
                                <a @click="props.store.selectRecordFk(record, props.route)">
                                    Выбрать
                                    <br />
                                </a>
                            </span>
                            <span v-else>
                                <UserBanButtons
                                    :route="props.route"
                                    :get-store="store"
                                    :record="record"
                                />

                                <a
                                    v-if="record.deletedAt == null"
                                    @click="
                                        props.store.deleteEntity2(
                                            props.route,
                                            record[props.columns[0].dataIndex]
                                        )
                                    "
                                >
                                    Удалить
                                    <br />
                                </a>

                                <a
                                    v-if="record.deletedAt !== null"
                                    @click="
                                        props.store.deleteEntity2(
                                            props.route,
                                            record[props.columns[0].dataIndex]
                                        )
                                    "
                                >
                                    Восстановить
                                    <br />
                                </a>

                                <a
                                    v-if="!record.isEdited"
                                    @click="
                                        props.store.newModalEditRecord(
                                            getColumnsByModelName(route),
                                            route,
                                            record
                                        )
                                    "
                                >
                                    Редактировать
                                    <br />
                                </a>

                                <a
                                    v-if="record.isEdited"
                                    @click="
                                        props.store.change(
                                            props.route,
                                            record[props.columns[0].dataIndex],
                                            record
                                        )
                                    "
                                >
                                    Сохранить
                                    <br />
                                </a>

                                <a v-if="record.isEdited" @click="props.store.getData(routeAll)">
                                    Отменить
                                    <br />
                                </a>
                                <a v-if="!record.isEdited" @click="goToRecord(record, props.route)">
                                    Перейти
                                    <br />
                                </a>
                                <a
                                    v-if="!record.isEdited && props.route === 'domainad'"
                                    @click="getLdapUsers(record)"
                                >
                                    Запросить юзеров ldap
                                    <br />
                                </a>
                            </span>
                        </template>
                    </div>
                </div>
            </template>
        </a-table>
    </div>
</template>
