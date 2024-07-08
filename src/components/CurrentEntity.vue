<script lang="ts" setup>
    import { onMounted, onUnmounted, ref } from "vue";
    import Entity2 from "@/components/Entity2.vue";
    import { ax } from "@/utils/axios";
    import { getPk } from "@/utils/columns";
    import { ObjectT } from "@/stores/modules/current";
    import { emitter } from "@/main";

    const props = defineProps(["payload", "modelType", "sub"]);
    const payloadRef = ref({});
    const isShowEntity = ref(false);

    // // console.log("CurrentEntity.vue setup ");

    async function getEntity(payload: ObjectT | undefined, modelType: string) {
        const currentPayload = payload || (payloadRef.value as ObjectT);
        const id = currentPayload[getPk(modelType) as string];
        const res = await ax.get<ObjectT>(modelType, {
            params: {
                id,
            },
        });
        return res;
    }

    async function updateRef(payload: ObjectT) {
        console.log("update ref");

        // isShowEntity.value = false;
        // console.log("update ref");
        const res = await getEntity(payload, props.modelType);
        // console.log("update ref DATA", res.data);
        payloadRef.value = res.data;
        isShowEntity.value = true;
    }
    onMounted(async () => {
        emitter.on("REFETCH_CURRENT", (payload) => updateRef(payload as ObjectT));
    });

    onUnmounted(() => {
        emitter.off("REFETCH_CURRENT");
    });
</script>
<template>
    <!--    {{ payload }}-->
    <!--    {{ payloadRef }}-->
    <Entity2
        v-if="isShowEntity"
        :payload="payloadRef"
        :model-type="props.modelType"
        :sub="props.sub"
    />
</template>
