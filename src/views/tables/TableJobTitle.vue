<script setup>
    import { columns } from "@/utils/columns";
    import CrudTable from "@/views/CrudTable.vue";
    import { useGetStore } from "@/stores/modules/getStore";

    const ROUTE = "jobtitle";

    const store = useGetStore();
</script>

<template>
    <CrudTable :store="store" :columns="columns.jobtitle" :route="ROUTE" />
</template>

<style lang="scss" scoped></style>
