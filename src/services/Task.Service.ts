import { ax } from "@/utils/axios";
import { emitter } from "@/main";
import { message } from "ant-design-vue";

export interface TaskI {
    id: number;
    strCron: string;
    cronTime: string;
    idAd: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null | string;
}
interface SendI {
    idAd: string;
    cronTime: string;
}
export class TaskService {
    static async delTask(idAd: string) {
        await ax
            .delete("/adtask", {
                data: {
                    idAd: idAd,
                },
            })
            .then(() => {
                emitter.emit("REFETCH");
                message.success("Успешно удалено!");
            });
    }
    static async sendValueToApi({ idAd, cronTime }: SendI, closeModalFunction: Function) {
        await ax
            .post("/adtask", {
                idAd: idAd,
                cronTime: cronTime,
            })
            .then(() => {
                closeModalFunction();
                emitter.emit("REFETCH");
                message.success("Успешно!");
            });
    }
}
