<script setup>
    import { columns } from "@/views/columns";
    import CrudTable from "@/components/CrudTable.vue";
    import { useGetStore } from "@/stores/modules/getStore";

    const ROUTE = "person";

    const store = useGetStore();
</script>

<template>
    <CrudTable :store="store" :columns="columns.person" :route="ROUTE" />
</template>

<style lang="scss" scoped></style>
