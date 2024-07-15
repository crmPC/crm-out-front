import { defineStore } from "pinia";
import _ from "lodash";
import { message } from "ant-design-vue";
import { router } from "@/router/router";
import { ax } from "@/utils/axios";
import { SignUpData } from "@/types/store";

export interface AppStoreType {
    token: undefined | string;
    data: undefined | UserWithoutPasswordAndBanreason;
}

export interface UserWithoutPasswordAndBanreason {
    id_user: number;
    name: string | null;
    surname: string | null;
    patronymic: string | null;
    dob: string | Date | null;
    login: string;
    banned: boolean;
    user_role: null | string;
}

interface AuthDataFromServer {
    data: string;
    //data: UserWithoutPasswordAndBanreason;
    message: string;
}

function unZipUserData(): UserWithoutPasswordAndBanreason | undefined {
    const str = localStorage.getItem("data");
    if (_.isString(str)) {
        try {
            const parse = JSON.parse(str);
            return parse;
        } catch (e) {
            throw Error("В localStorage невалидный json для user data");
        }
    } else {
        return undefined;
    }
}

export const useAuthStore = defineStore({
    id: "auth",
    state: (): AppStoreType => {
        return {
            token: localStorage.getItem("token") || undefined,
            data: unZipUserData(),
        };
    },
    getters: {},
    actions: {
        setAuthData(data: AuthDataFromServer) {
            // this.data = data.data;
            this.token = data.data;
            localStorage.setItem("token", data.data); // Save the token in localStorage
            localStorage.setItem("data", JSON.stringify(data.data));
            // console.log("token set success", data.token);
        },
        clearToken() {
            this.token = undefined;
            localStorage.removeItem("token");
            localStorage.removeItem("data"); // Remove the token from localStorage
        },
        logout() {},
        async signup(signupData: SignUpData) {
            // const router = useRouter();
            const result = await ax.post("user/signup", {
                login: signupData.login,
                password: signupData.password,
            });
            message.success("Вы успешно зарегистрировались, теперь вы можете войти");
            router.push({ name: "Страница входа" });
        },
    },
});
