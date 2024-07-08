<script setup>
    import { storeToRefs } from "pinia";
    import { useGetStoreFk } from "@/stores/modules/getStoreFk";
    import { columns } from "@/utils/columns";
    import CrudTable from "@/views/CrudTable.vue";
    import { useGetStore } from "@/stores/modules/getStore";

    const store = useGetStoreFk();
    const getStore = useGetStore();
    const { newModal } = storeToRefs(getStore);
</script>

<template>
    <a-modal
        v-model:open="newModal.openFkTable"
        :footer="null"
        width="100%"
        wrap-class-name="full-modal"
        @cancel="getStore.newModalCloseFkTable()"
    >
        <CrudTable
            :add="true"
            :not-show-add-button="true"
            :store="store"
            :columns="columns[newModal.currentFkCol.fkTableName]"
            :route="newModal.currentFkCol.fkTableName"
        />
    </a-modal>
</template>

<style lang="scss" scoped>
    .full-modal {
        .ant-modal {
            max-width: 100%;
            top: 0;
            padding-bottom: 0;
            margin: 0;
        }
        .ant-modal-content {
            display: flex;
            flex-direction: column;
            height: calc(100vh);
        }
        .ant-modal-body {
            flex: 1;
        }
    }
</style>
