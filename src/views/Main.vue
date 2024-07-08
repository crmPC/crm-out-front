<script setup lang="ts">
    import {
        LeftSquareOutlined,
        MenuOutlined,
        PieChartOutlined,
        UsergroupAddOutlined,
    } from "@ant-design/icons-vue";
    import { computed, ref } from "vue";
    import { RouteRecordRaw, useRoute, useRouter } from "vue-router";
    import { useGetStore } from "@/stores/modules/getStore";
    import { getHandBook } from "@/router/router";
    import { useSearchAllStore } from "@/stores/modules/searchAll";
    import AddEntityModal2 from "@/components/AddEntityModal2.vue";
    import AddEntityTable2 from "@/components/AddEntityTable2.vue";
    import { exit } from "@/utils/axios";

    const handBook = getHandBook();
    const collapsed = ref<boolean>(false);

    const router = useRouter();
    const route = useRoute();
    // console.log(route);

    interface RouteMeta {
        title?: string;
    }

    const selected = computed(() => {
        try {
            // console.log("computed");
            if (handBook.find((el) => el.name === route.matched[1].name)) {
                return ["Справочники", route.matched[1].name];
            }
            return [route.matched[1].name];
        } catch (e) {
            // console.log(e);
            return [];
        }
    });

    // Вычисляемые свойства для хлебных крошек
    // Вычисляемые свойства для хлебных крошек
    const breadcrumbs = computed<string[]>(() => {
        const crumbs: string[] = [];
        route.matched.forEach((record: RouteRecordRaw) => {
            // // console.log(record.path);
            const meta: RouteMeta = record.meta || {};

            // Имя маршрута может быть определено или нет, поэтому сначала проверяем его наличие
            if (record.name) {
                crumbs.push(`${String(record.name)}`); // Преобразование "symbol" в строку
            } else if (meta.title) {
                // Если у маршрута есть мета-данные с заголовком, то используем его
                crumbs.push(meta.title);
            }
        });
        return crumbs;
    });

    const getStore = useGetStore();
    const searchAllStore = useSearchAllStore();

    function goToAndClear(path: string) {
        // /// console.log('clear');
        searchAllStore.clear();
        getStore.clear();
        router.push({ path });
    }
</script>
<template>
    <AddEntityModal2 />
    <AddEntityTable2 />

    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <a-menu theme="dark" :selected-keys="selected" mode="inline">
                <a-menu-item key="Главная" @click="router.push({ path: '/main' })">
                    <pie-chart-outlined />
                    <span>Главная</span>
                </a-menu-item>
                <a-sub-menu key="Справочники">
                    <template #title>
                        <span>
                            <menu-outlined />
                            <span>Справочники</span>
                        </span>
                    </template>
                    <a-menu-item
                        v-for="ref in handBook"
                        :key="ref.name"
                        @click="goToAndClear('/main/' + ref.path)"
                    >
                        {{ ref.name }}
                    </a-menu-item>
                </a-sub-menu>
                <a-menu-item
                    key="Поиск по сотрудникам клиентским организаций"
                    @click="goToAndClear('/main/searchall3')"
                >
                    <usergroup-add-outlined />
                    <span>Поиск по сотрудникам клиентским организаций</span>
                </a-menu-item>
                <a-menu-item key="Выход" @click="exit">
                    <left-square-outlined />
                    <span>Выйти</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-content style="margin: 0 16px">
                <a-breadcrumb style="margin: 16px 0">
                    <!-- Отображаем текущий путь маршрута в хлебных крошках -->
                    <a-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index">
                        {{ crumb }}
                    </a-breadcrumb-item>
                </a-breadcrumb>

                <div
                    :style="{
                        padding: '24px',
                        background: '#fff',
                        minHeight: '360px',
                    }"
                >
                    <router-view></router-view>
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">andrey frolov 2023</a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<style>
    #components-layout-demo-side .logo {
        height: 32px;
        margin: 16px;
        background: rgba(255, 255, 255, 0.3);
    }

    .site-layout .site-layout-background {
        background: #fff;
    }
    [data-theme="dark"] .site-layout .site-layout-background {
        background: #141414;
    }
</style>
