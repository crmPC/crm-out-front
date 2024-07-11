import { createRouter, createWebHistory, LocationQuery } from "vue-router";
import TableUser from "@/views/tables/TableUser.vue";
import TableAddress from "@/views/tables/TableAddress.vue";
import TableCommunication from "@/views/tables/TableCommunication.vue";
import TableCompany from "@/views/tables/TableCompany.vue";
import TableDomainAd from "@/views/tables/TableDomainAd.vue";
import TableDomainMail from "@/views/tables/TableDomainMail.vue";
import TableJobTitle from "@/views/tables/TableJobTitle.vue";
import TableMail from "@/views/tables/TableMail.vue";
import TableOfficeEquip from "@/views/tables/TableOfficeEquip.vue";
import TableOfficeEquipTypes from "@/views/tables/TableOfficeEquipTypes.vue";
import TablePass from "@/views/tables/TablePass.vue";
import TableWSUser from "@/views/tables/TableWSUser.vue";
import TableWSGroup from "@/views/tables/TableWSGroup.vue";
import TableVendor from "@/views/tables/TableVendor.vue";
import TableIps from "@/views/tables/TableIps.vue";
import TableAccessUsersCompany from "@/views/tables/TableAccessUsersCompany.vue";
import NotFound from "@/views/NotFound.vue";

import { useAuthStore } from "@/stores/modules/auth";

export interface QueryParamsCurrent extends LocationQuery {
    modelType: string;
    id: string;
}

export function getHandBook() {
    const authStore = useAuthStore();
    const exclude = ["Админы", "Уровни доступа", "AD Домены","IP адреса"];
    if (authStore.data?.user_role === "admin") {
        return handBook;
    } else {
        return handBook.filter((handBook) => !exclude.includes(handBook.name));
    }
}

export const handBook = [
    {
        name: "Админы",
        path: "User",
        component: TableUser,
    },

    {
        name: "Адреса",
        path: "Address",
        component: TableAddress,
    },
    {
        name: "Средства связи",
        path: "Communication",
        component: TableCommunication,
    },
    {
        name: "Организации",
        path: "Company",
        component: TableCompany,
    },
    {
        name: "AD Домены",
        path: "DomainAd",
        component: TableDomainAd,
    },
    {
        name: "AD Пользователи",
        path: "wsuser",
        component: TableWSUser,
    },
    {
        name: "AD Группы",
        path: "wsgroup",
        component: TableWSGroup,
    },
    {
        name: "Email домены",
        path: "DomainMail",
        component: TableDomainMail,
    },
    {
        name: "Должности",
        path: "JobTitle",
        component: TableJobTitle,
    },
    {
        name: "Email почты",
        path: "Email",
        component: TableMail,
    },
    {
        name: "Оргтехника",
        path: "OfficeEquip",
        component: TableOfficeEquip,
    },
    {
        name: "Виды оргтехники",
        path: "officeequiptypes",
        component: TableOfficeEquipTypes,
    },
    {
        name: "Производители оргтехники",
        path: "vendor",
        component: TableVendor,
    },
    {
        name: "Пропуска",
        path: "Pass",
        component: TablePass,
    },

    {
        name: "Уровни доступа",
        path: "AccessUsersCompany",
        component: TableAccessUsersCompany,
    },

    {
        name: "IP адреса",
        path: "allowedip",
        component: TableIps,
    },
];

// // console.log(childrenRoutes);
export const router = createRouter({
    history: createWebHistory(),
    routes: [

        {
            path: "/:catchAll(.*)", // Ловим все несуществующие пути
            component: NotFound,
        },
        {
            path: "/",
            name: "Страница входа",
            component: () => import("@/views/PageLogin.vue"), // Замените "Home" на ваш компонент для домашней страницы
        },
        {
            path: "/signup",
            name: "Страница регистрации",
            component: () => import("@/views/PageSignup.vue"), // Замените "Home" на ваш компонент для домашней страницы
        },
        {
            path: "/main",
            name: "Dashboard",
            component: () => import("@/views/Main.vue"), // Замените "Home" на ваш компонент для домашней страницы
            children: [
                ...handBook,
                {
                    path: "",
                    name: "Главная",
                    component: () => import("@/views/MainDefault.vue"),
                },
                {
                    path: "current",
                    name: "Сущность",
                    component: () => import("@/views/Current.vue"),
                },

                {
                    path: "searchall3",
                    name: "Поиск по сотрудникам клиентским организаций",
                    component: () => import("@/views/SearchAll3.vue"),
                },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore(); // Получаем доступ к authStore
    if (to.name === "Страница регистрации") {
        // console.log("Идем на страницу регистрации");
        next();
    }
    // Если в authStore нет токена и маршрут защищенный, перенаправляем на страницу входа
    else if (!authStore.token && to.name !== "Страница входа") {
        // console.log("Нет токена, идем на страницу входа");
        next({ name: "Страница входа" });
    } else if (authStore.token && to.name === "Страница входа") {
        // console.log("Токен имеется, сворачиваем со страницы входа на дашбоард");
        next({ name: "Dashboard" }); // Продолжаем навигацию
    } else {
        // console.log("Просто продолжаем навигацию");
        next(); // Продолжаем навигацию
    }
});
