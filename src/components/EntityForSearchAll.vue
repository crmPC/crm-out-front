<script lang="ts" setup>
    import { columns, getFkModels } from "@/utils/columns";
    import SubTable from "@/components/SubTable.vue";

    const { payload, modelType } = defineProps(["payload", "modelType"]);
    const currentColumns = columns[modelType];
    const models = getFkModels(modelType, payload);
</script>

<template>
    <div>
        <!--        {{ payload }}-->
        <!--        {{ currentColumns }}-->
        <!--        {{ modelType }}-->
    </div>
    <a-table :columns="currentColumns" :data-source="payload">
        <template #expandedRowRender="data">
            <SubTable :models="models" :data="data" />
            <!--          {{data}}-->
            <!--            <div>{{ column }}{{ record }}{{index}}{{indent}}{{expanded}}</div>-->
        </template>
    </a-table>
</template>
