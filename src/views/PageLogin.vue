<script lang="ts" setup>
    import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
    import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
    import { reactive, UnwrapRef } from "vue";
    import { login } from "@/utils/axios";

    interface FormState {
        login: string;
        password: string;
    }
    const formState: UnwrapRef<FormState> = reactive({
        login: "",
        password: "",
    });

    const handleFinish = (values: FormState) => {
        // console.log("fetch");
        login(formState);
    };

    const handleFinishFailed = (errors: ValidateErrorEntity<FormState>) => {
        // console.log(errors);
    };
</script>

<template>
    <div class="login">
        <a-form
            layout="horizontal"
            :model="formState"
            @finish="handleFinish"
            @finishFailed="handleFinishFailed"
        >
            <a-form-item>
                <a-input v-model:value="formState.login" placeholder="login">
                    <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-input v-model:value="formState.password" type="password" placeholder="Password">
                    <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-button
                    type="primary"
                    html-type="submit"
                    :disabled="formState.login === '' || formState.password === ''"
                >
                    Войти
                </a-button>
                или
                <router-link :to="{ path: '/signup' }">зарегистрироваться</router-link>
            </a-form-item>
        </a-form>
    </div>
</template>

<style lang="scss">
    .login {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        width: fit-content;
        height: 100vh;
        margin: 0 auto;
    }
</style>
