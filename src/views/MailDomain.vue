<script setup>
    import { getSimpleProps, notNullAndHasOwn } from "@/stores/modules/current";

    const { domain } = defineProps(["domain"]);
    // console.log(domain);
</script>

<template>
    <a-card title="@ domain" :bordered="false">
        <a-descriptions
            :title="domain.name"
            :column="1"
            size="small"
            :layout="'horizontal'"
            bordered
        >
            <a-descriptions-item v-for="(value, prop) in getSimpleProps(domain)" :label="prop">
                {{ value }}
            </a-descriptions-item>
        </a-descriptions>
        <a-divider />
        <a-descriptions
            v-for="email in domain.emails"
            v-if="notNullAndHasOwn(domain, 'emails')"
            :title="email.name_with_domain"
            size="small"
            :layout="'horizontal'"
            bordered
        >
            <a-descriptions-item v-for="(value, prop) in email" :label="prop">
                {{ value }}
            </a-descriptions-item>
        </a-descriptions>
    </a-card>
</template>
