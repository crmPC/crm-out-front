<script lang="ts" setup>
    //@ts-nocheck
    import { DownOutlined } from "@ant-design/icons-vue";
    import ValueComponent from "@/components/ValueComponent.vue";
    import _ from "lodash";
    import Entity2 from "@/components/Entity2.vue";
    import { useGetStore } from "@/stores/modules/getStore";
    import {
        delFk,
        delTimeStamp,
        format,
        getColumnsByModelName,
        getDataType,
        getFkModels,
        getPk,
        getPropName,
        getShowOnEntityProperty,
        modelRelations,
        Relation,
    } from "@/utils/columns";
    import { ObjectT } from "@/stores/modules/current";
    import CompanyInUser2 from "@/components/CompanyInUser2.vue";
    import JobTitleInUser2 from "@/components/JobTitleInUser2.vue";

    const store = useGetStore();

    const { payload, modelType, sub, searchAll } = defineProps([
        "payload",
        "modelType",
        "sub",
        "searchAll",
    ]);

    const models = sub ? getFkModels(modelType, payload) : [];
    console.log("models: "+ models);
    const emit = defineEmits(["reload"]);

    function check(payload: ObjectT, modelName: string) {
        if (payload[modelName] !== null) {
            return true;
        }
        return false;
    }

    function check2(payload: ObjectT, relation: Relation) {
        const isObj = _.isObject(payload[relation.name as string]);
        if (payload[relation.fk as string] !== null && isObj) {
            return true;
        }
        return false;
    }

    const pk = getPk(modelType);
    console.log("Entity2 setup", payload);
</script>

<template>
    <a-card class="card">
        <template #title>
            <div class="en-title">
                <router-link
                    :to="{
                        path: 'current',
                        query: {
                            modelType,
                            id: payload[pk],
                        },
                    }"
                >
                    <!--                    {{ modelType }}-->
                    {{ getShowOnEntityProperty(payload, modelType) }}
                    <!--                    <a-tag color="gray">Создан: {{ payload.createdAt }}</a-tag>-->
                </router-link>
                <!--   CRUD кнопки   -->
                <div>
                    <a-dropdown-button>
                        Действия
                        <template #overlay>
                            <a-menu>
                                <a-menu-item key="1">
                                    <a
                                        class="edit-but"
                                        @click="
                                            store.newModalCreateRecord(
                                                getColumnsByModelName(modelType),
                                                modelType
                                            )
                                        "
                                    >
                                        Создать
                                    </a>
                                </a-menu-item>
                                <a-menu-item key="2">
                                    <a
                                        class="edit-but"
                                        @click="
                                            store.newModalEditRecord(
                                                getColumnsByModelName(modelType),
                                                modelType,
                                                payload
                                            )
                                        "
                                    >
                                        Редактировать
                                    </a>
                                </a-menu-item>
                                <a-menu-item key="3">
                                    <a
                                        v-if="payload.deletedAt == null"
                                        class="edit-but"
                                        @click="
                                            store.deleteEntity2(
                                                modelType,
                                                payload[getPk(modelType)],
                                                'SEARCHALL'
                                            )
                                        "
                                    >
                                        Удалить
                                    </a>
                                </a-menu-item>
                                <a-menu-item key="4">
                                    <a
                                        v-if="payload.deletedAt !== null"
                                        class="edit-but"
                                        @click="
                                            store.deleteEntity2(
                                                modelType,
                                                payload[getPk(modelType)],
                                                'SEARCHALL'
                                            )
                                        "
                                    >
                                        Восстановить
                                    </a>
                                </a-menu-item>

                                <a-menu-item v-for="model in modelRelations[modelType]">
                                    <a-button
                                        v-if="model.count === 'many' && model.showOnAdd"
                                        @click="
                                            store.createRelatedEntity(model, payload, modelType)
                                        "
                                    >
                                        Создать {{ model.title }}
                                    </a-button>
                                    <a-button
                                        v-if="model.count === 'one' && model.showOnAdd"
                                        :disabled="check2(payload, model)"
                                        @click="
                                            store.createRelatedEntityOne(model, payload, modelType)
                                        "
                                    >
                                        Создать {{ model.title }}
                                    </a-button>
                                </a-menu-item>
                            </a-menu>
                        </template>
                        <template #icon>
                            <DownOutlined />
                        </template>
                    </a-dropdown-button>
                </div>
            </div>
        </template>

        <a-descriptions size="small">
            <a-descriptions-item
                v-for="(val, prop) in delTimeStamp(payload)"
                :label="getPropName(prop, modelType)"
            >
                <ValueComponent
                    :data-type="getDataType(payload, modelType, prop)"
                    :val="val"
                    :prop="prop"
                    :modelType="modelType"
                    :payload="payload"
                />
            </a-descriptions-item>
        </a-descriptions>
        <!--      createdAt-->
        <!--      updatedAt-->
        <!--      deletedAt-->

        <!--        кнопки для создания связанных моделей-->

        <!--        связанные модели-->
        <CompanyInUser2 :payload="payload" />
        <JobTitleInUser2 :payload="payload" />
        <div v-for="model in models" v-if="sub">
            <!--            {{ models }}-->
            <!--            {{ payload[model.name] }}-->
            <!--            {{ model.count }}-->

            <Entity2
                v-if="model.count === 'one' && check(payload, model.name)"
                :payload="payload[model.name]"
                :model-type="model.tableName"
            />
            <div
                v-for="sub in payload[model.name]"
                v-if="
                    model.count === 'many' &&
                    _.has(payload, model.name) &&
                    _.isArray(payload[model.name]) &&
                    !_.isEmpty(payload[model.name])
                "
            >
                <Entity2 :payload="sub" :model-type="model.name" />
            </div>
        </div>
        <div>
            Создан:
            {{ format(payload.createdAt) }}
            Изменен:
            {{ format(payload.updatedAt) }}
            <span v-if="payload.deletedAt !== null">Удален: {{ format(payload.deletedAt) }}</span>
        </div>
    </a-card>
</template>

<style lang="scss" scoped>
    .card {
        margin-top: 20px;
    }

    .edit-but:not(:last-child) {
        margin-right: 20px;
    }

    .en-title {
        display: flex;
        justify-content: space-between;
    }
</style>
