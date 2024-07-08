<script setup lang="ts">
    import Entity from "./Entity.vue";
    import Entity2 from "./Entity2.vue";
    import { columns } from "@/utils/columns";

    const { data, models } = defineProps(["data", "models"]);

    const sub = true;
</script>
<template>
    <div v-for="model in models" v-if="sub">
        <!--            {{ models }}-->
        <div v-if="model.count === 'one'">
            <!--            {{ data.record[model.name] }}-->
            <a-tag :color="'green'">Связанная запись {{ model.name }}</a-tag>

            <a-table
                :columns="columns[model.name]"
                :data-source="[data.record[model.name]]"
            ></a-table>
            <br />
            {{ model.name }}
        </div>
        <div v-for="sub in data.record[model.name]" v-if="model.count === 'many'">
            <div>
                div
                {{ sub }}
                <br />
                {{ model.name }}
            </div>
            <Entity2 :payload="sub" :model-type="model.name" />
        </div>
    </div>
</template>
