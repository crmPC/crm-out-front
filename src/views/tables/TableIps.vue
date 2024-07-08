<script setup>
    import CrudTable from "@/views/CrudTable.vue";
    import { columns } from "@/utils/columns";
    import { useGetStore } from "@/stores/modules/getStore";

    const ROUTE = "allowedip";

    const store = useGetStore();
</script>

<template>
    <CrudTable :store="store" :columns="columns.allowedip" :route="ROUTE" />
</template>

<style lang="scss" scoped></style>
