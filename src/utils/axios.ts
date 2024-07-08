import axios, { AxiosError } from "axios";
import { message } from "ant-design-vue";
import _ from "lodash";
import { useAuthStore } from "@/stores/modules/auth";
import { router } from "@/router/router";
import { ServerResponse, useGetStore } from "@/stores/modules/getStore";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const ax = axios.create({
    baseURL: SERVER_URL,
    timeout: 95000,
    // timeout: 1000000,
    // headers: {'X-Custom-Header': 'foobar'}
});

const MAX_RETRY_COUNT = 1000; // Максимальное количество повторных запросов
const RETRY_DELAY = 4000; // Задержка между повторными запросами в миллисекундах (3 секунды)

let retryCount = 0;

ax.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const { token } = authStore;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

ax.interceptors.response.use(
    (response) => {
        retryCount = 0; // Сбрасываем счетчик повторных запросов при успешном ответе
        return response;
    },
    (error: AxiosError<ServerResponse>) => {
        message.error(JSON.stringify(error.response?.data.message));
        if (_.has(error, "response.status") && error.response?.status === 401) {
            const getStore = useGetStore();
            getStore.clearAddData();

            const authStore = useAuthStore();
            authStore.clearToken();

            router.push("/");
        } else if (!_.has(error, "response")) {
            message.error("Попробуйте перезагрузить страницу");
        }

        // console.log("ax.interceptors - error", error);
        // const messageExist = !!error.response?.data.message;
        // if (!messageExist && retryCount < MAX_RETRY_COUNT) {
        //     retryCount++;
        //     return new Promise((resolve) => {
        //         setTimeout(() => {
        //             // console.log("повторный запрос");
        //             // @ts-ignore
        //             resolve(ax(error.config)); // Повторный запрос
        //         }, RETRY_DELAY);
        //     });
        // }
        return Promise.reject(error);
    }
);

interface authData {
    login: string;
    password: string;
}

export async function login(loginData: authData) {
    const authStore = useAuthStore();
    try {
        // console.log('fetch to login');
        // console.log('SERVER_URL',SERVER_URL);
        const result = await ax.post("login", {
            login: loginData.login,
            password: loginData.password,
        });

        authStore.setAuthData(result.data);
        await router.push({ path: "/main" });
    } catch (error) {
        console.error("Ошибка входа:", error);
    }
}

export async function exit() {
    // console.log("exit");
    const authStore = useAuthStore();
    authStore.clearToken();
    await router.push({ path: "/" });
}
