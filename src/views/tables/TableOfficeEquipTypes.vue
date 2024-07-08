<script setup>
    import CrudTable from "@/views/CrudTable.vue";
    import { columns } from "@/utils/columns";
    import { useGetStore } from "@/stores/modules/getStore";

    const ROUTE = "officeequiptypes";

    const store = useGetStore();
</script>

<template>
    <CrudTable :store="store" :columns="columns.officeequiptypes" :route="ROUTE" />
</template>

<style lang="scss" scoped></style>
