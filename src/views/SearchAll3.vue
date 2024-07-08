<script lang="ts" setup>
    import CurrentEntity from "@/components/CurrentEntity.vue";
    import { useGetStore } from "@/stores/modules/getStore";
    import { columns } from "@/utils/columns";
    import CrudTable from "@/views/CrudTable.vue";
    import { onMounted, ref } from "vue";
    import { storeToRefs } from "pinia";
    const recordRef = ref({});
    const ROUTE = "wsuser";
    const store = useGetStore();
    const { query } = storeToRefs(store);

    onMounted(() => {
        store.getCompanies();
    });
</script>

<template>
    <div>
        <a-select
            v-model:value="query.companies"
            mode="multiple"
            style="width: 100%; margin: 0 0 8px 0"
            placeholder="Искать по конкретным организациям"
            :options="store.companyOptions"
            @change="store.filterChange"
        />
        <CrudTable
            :notShowAddButton="true"
            :store="store"
            :columns="columns.wsuser"
            :route="ROUTE"
        />
        <CurrentEntity :payload="recordRef" :model-type="'wsuser'" :sub="true" />
    </div>
</template>
