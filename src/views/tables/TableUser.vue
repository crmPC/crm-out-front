<script setup>
    import { useGetStore } from "@/stores/modules/getStore";
    import { columns } from "@/utils/columns";
    import CrudTable from "@/views/CrudTable.vue";

    const ROUTE = "user";
    const store = useGetStore();
</script>

<template>
    <CrudTable :notShowAddButton="true" :store="store" :columns="columns.user" :route="ROUTE" />
</template>

<style lang="scss" scoped></style>
