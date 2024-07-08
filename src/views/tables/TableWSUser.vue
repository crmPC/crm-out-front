<script setup>
    import { useGetStore } from "@/stores/modules/getStore";
    import { columns } from "@/utils/columns";
    import CrudTable from "@/views/CrudTable.vue";

    const ROUTE = "wsuser";
    const store = useGetStore();
</script>

<template>
    <CrudTable :notShowAddButton="false" :store="store" :columns="columns.wsuser" :route="ROUTE" />
</template>

<style lang="scss" scoped></style>
