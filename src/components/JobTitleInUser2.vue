<script lang="ts" setup>
    import _ from "lodash";

    const { payload } = defineProps(["payload"]);
</script>

<template>
    <div v-if="_.has(payload, 'jobtitle.name')">
        Должность:
        <a>{{ payload.jobtitle.name }}</a>
    </div>
</template>
