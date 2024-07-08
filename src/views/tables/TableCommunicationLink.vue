<script setup>
    import CrudTable from "@/components/CrudTable.vue";
    import { columns } from "@/views/columns";
    import { useGetStore } from "@/stores/modules/getStore";

    const ROUTE = "communicationLink";

    const store = useGetStore();
</script>

<template>
    <CrudTable :store="store" :columns="columns.communicationlink" :route="ROUTE" />
</template>

<style lang="scss" scoped></style>
