<template>
    <div>
        {{ formattedDate }}
    </div>
</template>

<script setup>
    import { computed, defineProps } from "vue";

    const props = defineProps(["column", "record"]);
    const formattedDate = computed(() => {
        const { dataIndex } = props.column;
        const dateValue = props.record[dataIndex];
        return dateValue ? dateValue.format("DD-MM-YYYY HH:mm:ss") : "---";
    });
</script>
