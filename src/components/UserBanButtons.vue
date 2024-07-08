<script setup>
    const { record, getStore, route } = defineProps(["getStore", "record", "route"]);
</script>

<template>
    <a v-if="record.banned && route === 'user'" @click="getStore.userBan(record, 'reason')">
        Разбанить
        <br />
    </a>
    <a v-if="!record.banned && route === 'user'" @click="getStore.userBan(record, 'reason')">
        Забанить
        <br />
    </a>
</template>
