<script lang="ts" setup>
    import { useRoute } from "vue-router";
    import { onMounted, onUnmounted, ref, watch } from "vue";
    import { ax } from "@/utils/axios";
    import { ApiResponse } from "@/types/store";
    import type { QueryParamsCurrent } from "@/router/router";
    import Entity2 from "@/components/Entity2.vue";
    import { emitter } from "@/main";

    const route = useRoute();
    const query = route.query as QueryParamsCurrent;

    const entityRef = ref({});
    const isLoaded = ref(false);
    const modelType = ref(query.modelType);
    const id = ref(query.id);

    async function getEntity() {
        console.log("getEntity");
        isLoaded.value = false;
        const res = await ax.get<ApiResponse<any>>(modelType.value, {
            params: {
                id: id.value,
            },
        });
        isLoaded.value = true;

        console.log("entityRef__", res.data);
        entityRef.value = res.data.data;
        console.log("get data", res.data.data);
    }
    onMounted(() => {
        emitter.on("UPDATE_CURRENT", () => {
            getEntity();
        });
        emitter.on("REFETCH", () => {
            getEntity();
        });
    });
    onUnmounted(() => {
        emitter.off("UPDATE_CURRENT");
        emitter.off("REFETCH");
    });

    onMounted(async () => {
        getEntity();
    });

    watch(
        () => route.query as QueryParamsCurrent,
        (query: QueryParamsCurrent) => {
            isLoaded.value = false;

            // Здесь вызывайте вашу функцию, которая должна срабатывать при изменении URL
            // console.log("URL изменен:", query);
            modelType.value = query.modelType;
            id.value = query.id;

            getEntity();
        }
    );
</script>

<template>
    <!--    {{ entityRef }}-->
    <Entity2 v-if="isLoaded" :payload="entityRef" :model-type="modelType" :sub="true" />
    <!--    <Entity v-if="isLoaded" :payload="entityRef" :modelType="modelType" :sub="true" />-->
</template>

<style lang="scss" scoped></style>
