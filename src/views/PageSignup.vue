<script lang="ts" setup>
    import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
    import { reactive, ref } from "vue";
    import type { Rule } from "ant-design-vue/es/form";
    import type { FormInstance } from "ant-design-vue";
    import { useAuthStore } from "@/stores/modules/auth";

    interface FormState {
        login: string;
        pass: string;
        checkPass: string;
    }
    const formRef = ref<FormInstance>();
    const formState = reactive<FormState>({
        login: "",
        pass: "",
        checkPass: "",
    });

    const authStore = useAuthStore();

    const validatePass = async (_rule: Rule, value: string) => {
        if (value === "") {
            return Promise.reject("Please input the password");
        }
        if (formState.checkPass !== "") {
            formRef.value?.validateFields("checkPass");
        }
        return Promise.resolve();
    };
    const validatePass2 = async (_rule: Rule, value: string) => {
        if (value === "") {
            return Promise.reject("Please input the password again");
        }
        if (value !== formState.pass) {
            return Promise.reject("Two inputs don't match!");
        }
        return Promise.resolve();
    };

    const rules: Record<string, Rule[]> = {
        pass: [{ required: true, validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }],
    };
    const layout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 14 },
    };
    const handleFinish = (values: FormState) => {
        // console.log(values, formState);
        authStore.signup({
            password: formState.pass,
            login: formState.login,
        });
    };
    const handleFinishFailed = (errors: any) => {
        // console.log(errors);
    };
    const resetForm = () => {
        formRef.value?.resetFields();
    };
    const handleValidate = (...args: any) => {
        // console.log(args);
    };
</script>

<template>
    <div class="login">
        <a-form
            ref="formRef"
            class="custom-form"
            name="custom-validation"
            :model="formState"
            :rules="rules"
            v-bind="layout"
            @finish="handleFinish"
            @validate="handleValidate"
            @finishFailed="handleFinishFailed"
        >
            <a-form-item style="width: 100%" name="login">
                <a-input
                    v-model:value="formState.login"
                    placeholder="login"
                    autocomplete="off"
                    style="width: 100%"
                >
                    <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                </a-input>
            </a-form-item>
            <a-form-item has-feedback name="pass">
                <a-input
                    v-model:value="formState.pass"
                    type="password"
                    placeholder="Password"
                    autocomplete="off"
                />
            </a-form-item>
            <a-form-item has-feedback name="checkPass">
                <a-input
                    v-model:value="formState.checkPass"
                    type="password"
                    placeholder="Confirm"
                    autocomplete="off"
                />
            </a-form-item>

            <a-form-item>
                <div class="sign-down-button">
                    <a-button type="primary" html-type="submit">Зарегистрироваться</a-button>
                    <a-button style="margin-left: 10px" @click="resetForm">Сбросить</a-button>
                </div>
            </a-form-item>
        </a-form>
    </div>
</template>

<style lang="scss">
    .custom-form {
        //width: 87%;
    }
    .sign-down-button {
        display: flex;
        justify-content: space-between;
    }
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
