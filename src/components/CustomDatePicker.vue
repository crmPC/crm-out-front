<script lang="ts" setup>
    import { CloseOutlined } from "@ant-design/icons-vue";
    import { defineProps } from "vue";
    import dayjs from "dayjs";
    import type { Dayjs } from "dayjs";
    import _ from "lodash";

    const emit = defineEmits(["update:modelValue"]);
    const { newModal, col } = defineProps(["newModal", "col"]);

    function handleChange(selectedValue: Dayjs) {
        emit("update:modelValue", selectedValue.toJSON());
    }

    function makeNull() {
        emit("update:modelValue", null);
    }

    function makeNow() {
        emit("update:modelValue", new Date().toJSON());
    }
</script>

<template>
    <a-button v-if="_.isNull(newModal.record[col.dataIndex])" @click="makeNow">
        Выбрать дату
    </a-button>
    <a-date-picker
        v-if="!_.isNull(newModal.record[col.dataIndex])"
        :value="dayjs(newModal.record[col.dataIndex])"
        @change="handleChange"
    />
    <CloseOutlined @click="makeNull" />
</template>
