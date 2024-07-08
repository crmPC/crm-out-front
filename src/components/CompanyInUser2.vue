<script lang="ts" setup>
    import _ from "lodash";
    import { toTheRecord } from "@/utils/functions";

    const { payload } = defineProps(["payload"]);
</script>

<template>
    <div v-if="_.has(payload, 'company.name')">
        Состоит в организации:
        <a @click="toTheRecord(payload.company, 'company')">{{ payload.company.name }}</a>
    </div>
</template>
