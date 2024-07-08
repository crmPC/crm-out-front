import _ from "lodash";
import { message } from "ant-design-vue";
import { ObjectT } from "@/stores/modules/current";
import { ax } from "@/utils/axios";
import { emitter } from "@/main";

export async function getLdapUsers(record: ObjectT) {
    // console.log(record);
    const loading = message.loading(
        "В процессе загрузки пользователей, это может занять некоторое время",
        0
    );
    if (!_.has(record, "id_domain_ad")) throw Error("Нет id ad domain");
    const result = await ax
        .get("ad-actions", {
            params: {
                id: record.id_domain_ad,
            },
        })
        .catch((e) => {
            loading();
            return e;
        });
    loading();
    emitter.emit("REFETCH");
    message.success(result.data.message);
}
