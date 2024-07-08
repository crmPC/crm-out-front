import "@/scss/main.scss";
import { createApp } from "vue";
import Antd from "ant-design-vue";
import store from "./stores/store";
import SvgIconComponent from "@/components/utils/SvgIcon.vue";
import GeneralHeadComponent from "@/components/utils/GeneralHead.vue";
import App from "@/layouts/default.vue";
import "ant-design-vue/dist/reset.css";
import { router } from "@/router/router";
import mitt from "mitt";
// @ts-ignore
import cronAnt from "@vue-js-cron/ant";
import "@vue-js-cron/ant/dist/ant.css";

export const emitter = mitt();

const app = createApp(App);
app.config.globalProperties.emitter = emitter;
app.use(router)
    .use(store)
    .use(Antd)
    .use(cronAnt)
    .component("SvgIcon", SvgIconComponent)
    .component("GeneralHead", GeneralHeadComponent)
    .mount("#app-mount");

// TODO axios interceptors for 403 code
