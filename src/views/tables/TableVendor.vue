<script setup>
    import { columns } from "@/utils/columns";
    import CrudTable from "@/views/CrudTable.vue";
    import { useGetStore } from "@/stores/modules/getStore";

    const ROUTE = "vendor";

    const store = useGetStore();
</script>

<template>
    <CrudTable :store="store" :columns="columns.vendor" :route="ROUTE" />
</template>

<style lang="scss" scoped></style>
