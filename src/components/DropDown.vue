<script setup>
    import { defineProps } from "vue";
    import { DownOutlined } from "@ant-design/icons-vue";

    const emit = defineEmits(["update:modelValue"]);
    const props = defineProps(["column", "record", "col"]);
    function handleMenuClick(event) {
        const selectedValue = event.key;
        // console.log(event.key);
        emit("update:modelValue", selectedValue);
    }
</script>

<template>
    <a-dropdown>
        <a class="ant-dropdown-link" @click.prevent>
            {{ props.record[props.col.dataIndex] }}
            <DownOutlined />
        </a>
        <template #overlay>
            <a-menu @click="handleMenuClick">
                <a-menu-item v-for="en in props.column.enum" :key="en">{{ en }}</a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>
