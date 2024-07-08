<script setup lang="ts">
    import { storeToRefs } from "pinia";
    import { CloseOutlined } from "@ant-design/icons-vue";
    import { useGetStore } from "@/stores/modules/getStore";
    import CustomDatePicker from "@/components/CustomDatePicker.vue";
    import { getFkDataForColumn } from "@/utils/columns";

    const getStore = useGetStore();
    const { newModal } = storeToRefs(getStore);
</script>

<template>
    <a-modal
        v-model:open="newModal.open"
        :title="newModal.mode.includes('EDIT') ? 'Редактировать' : 'Создать'"
        width="50%"
        @ok="getStore.addEntity2()"
        @cancel="getStore.clearAddData()"
    >
        <!--        {{newModal.columns}}-->
        <div v-for="(col, i) in newModal.columns" :key="i">
            <div
                v-if="
                    col.dataType === 'fk' &&
                    col.editable &&
                    newModal.notShowFkColumn !== col.dataIndex
                "
            >
                <a-form-item :label="col.title" :name="col.title" :label-col="{ span: 5 }">
                    <a-button
                        type="primary"
                        @click="getStore.closeModalAndShowFkTable(col, 'ADD_WITH_MODAL')"
                    >
                        <span v-if="newModal.record[col.dataIndex] !== null">Выбран</span>
                        <span v-if="newModal.record[col.dataIndex] === null">Не выбран</span>
                    </a-button>
                    <a>
                        {{ " " }} {{ getFkDataForColumn(newModal.record, newModal.modelType, col) }}
                    </a>
                    <CloseOutlined @click="getStore.changeFkValueToNull(col, 'ADD_WITH_MODAL')" />
                </a-form-item>
            </div>
            <div v-if="col.dataType === 'fk' && newModal.notShowFkColumn === col.dataIndex">
                <a-tag :color="'green'">
                    Связанная запись с {{ col.fkTableName }} id {{ newModal.record[col.dataIndex] }}
                </a-tag>
            </div>

            <div v-if="col.dataType === 'string' && col.editable">
                <a-form-item :label="col.title" :name="col.title" :label-col="{ span: 5 }">
                    <a-input
                        v-model:value="newModal.record[col.dataIndex]"
                        :placeholder="col.title"
                    />
                </a-form-item>
            </div>

            <div v-if="col.dataType === 'enum' && col.editable">
                <a-form-item :label="col.title" :name="col.title" :label-col="{ span: 5 }">
                    <a-select
                        v-model:value="newModal.record[col.dataIndex]"
                        style="width: 120px"
                        :options="getStore.enum2(col.dataIndex)"
                    ></a-select>
                </a-form-item>
            </div>

            <div v-if="col.dataType === 'int' && col.editable">
                <a-form-item :label="col.title" :name="col.title" :label-col="{ span: 5 }">
                    <a-input
                        v-model:value="newModal.record[col.dataIndex]"
                        :placeholder="col.title"
                    />
                </a-form-item>
            </div>

            <div v-if="col.dataType === 'date' && col.editable">
                <a-form-item :label="col.title" :name="col.title" :label-col="{ span: 5 }">
                    <CustomDatePicker
                        v-model:modelValue="newModal.record[col.dataIndex]"
                        :new-modal="newModal"
                        :col="col"
                    />
                </a-form-item>
            </div>
        </div>
    </a-modal>
</template>
