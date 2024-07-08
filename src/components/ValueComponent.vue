<script setup>
    import dayjs from "dayjs";
    import { getFkDataForEntity, getModelTypeForEntity2RouterLink } from "@/utils/columns";

    const { val, dataType, prop, modelType } = defineProps([
        "val",
        "dataType",
        "prop",
        "modelType",
        "payload",
    ]);
    function getData(dateValue) {
        return dateValue ? dayjs(dateValue).format("DD-MM-YYYY hh:mm") : "---";
    }
</script>

<template>
    <div v-if="dataType === 'date'">{{ getData(val) }}</div>
    <div v-if="dataType === 'string'">{{ val }}</div>
    <div v-if="dataType === 'fk'">
        <router-link
            :to="{
                path: 'current',
                query: {
                    modelType: getModelTypeForEntity2RouterLink(modelType, prop),
                    id: val,
                },
            }"
        >
            {{ getFkDataForEntity(val, prop, modelType, payload) }}
        </router-link>
    </div>
    <div v-if="dataType === 'enum'">{{ val }}</div>

    <div v-if="dataType === 'boolean'">
        <a-tag :color="val ? 'red' : 'green'">
            {{ val }}
        </a-tag>
    </div>
</template>
