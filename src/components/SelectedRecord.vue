<script setup>
    import { storeToRefs } from "pinia";
    import { useGetStoreFk } from "@/stores/modules/getStoreFk";

    const getStoreFk = useGetStoreFk();
    const { selectedRecord } = storeToRefs(getStoreFk);
</script>

<template>
    <div>{{ selectedRecord }}</div>
</template>
