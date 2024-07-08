import { ObjectT } from "@/stores/modules/current";
import { getPk } from "@/utils/columns";
import { router } from "@/router/router";

export function toTheRecord(record: ObjectT, route: string) {
    const query1 = {
        modelType: route,
        id: record[getPk(route) as string],
    };
    // // console.log(query1);
    router.push({
        path: "current",
        query: query1,
    });
}
