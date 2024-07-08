<script setup>
    import { columns } from "@/utils/columns";
    import CrudTable from "@/views/CrudTable.vue";
    import { useGetStore } from "@/stores/modules/getStore";

    const ROUTE = "accessuserscompany";

    const store = useGetStore();
</script>

<template>
    <CrudTable :store="store" :columns="columns.accessuserscompany" :route="ROUTE" />
</template>

<style lang="scss" scoped></style>
