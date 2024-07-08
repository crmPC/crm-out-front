<template>
    <div>
        <div class="task">
            <div v-if="!!props.task">{{ props.task.strCron }}</div>
            <ToolOutlined class="small-button" @click="modalHandler" />
            <CloseOutlined
                class="small-button"
                @click="TaskService.delTask(props.record.id_domain_ad)"
                v-if="!!props.task"
            />
        </div>

        <a-modal
            v-model:open="isOpenModal"
            title="Настройка расписания синхронизации"
            width="200px"
            class="task-modal"
            @ok="
                TaskService.sendValueToApi(
                    {
                        idAd: props.record.id_domain_ad,
                        cronTime: value,
                    },
                    modalHandler
                )
            "
        >
            <div class="task-modal">
                <cron-ant
                    v-model="value"
                    :button-props="{
                        type: 'primary',
                        shape: 'round',
                        style: { backgroundColor: '#0277BD' },
                    }"
                    @error="error = $event"
                />
                <!--                <div class="text-lightest pt-2">cron expression: {{ value }}</div>-->
            </div>
        </a-modal>
    </div>
</template>

<script setup>
    import { CloseOutlined, ToolOutlined } from "@ant-design/icons-vue";
    import { onMounted, ref, watch } from "vue";
    import { TaskService } from "@/services/Task.Service";

    const value = ref("* * * * *");
    const error = ref("");
    const isOpenModal = ref(false);
    const props = defineProps(["task", "record"]);
    console.log("✅", props.task, !!props.task);

    function modalHandler() {
        value.value = props.task?.cronTime ? props.task.cronTime : "* * * * *";
        isOpenModal.value = !isOpenModal.value;
    }
</script>

<style lang="scss">
    .task {
        display: flex;
    }
    .small-button {
        margin: 5px;
    }
    .task-modal {
        display: flex;
        //width: 201px;
        flex-direction: column;
    }
</style>
