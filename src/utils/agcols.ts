export const agcols = [
    {
        headerName: "id_user2",
        field: "id_user2",
        filter: "agMultiColumnFilter",
    },
    {
        headerName: "fk_id_ws_user",
        field: "fk_id_ws_user",
        editable: true,
        filterParams: {
            filters: [
                {
                    filter: "agTextColumnFilter",
                    filterParams: { defaultOption: "startsWith" },
                },
                { filter: "agSetColumnFilter" },
            ],
        },
    },
    { headerName: "fk_id_person", field: "fk_id_person" },
    { headerName: "fk_id_company", field: "fk_id_company" },
    { headerName: "fk_id_email", field: "fk_id_email" },
    { headerName: "fk_job_title", field: "fk_job_title" },
    { headerName: "fk_communication", field: "fk_communication" },
    { headerName: "fk_pass", field: "fk_pass" },
    { headerName: "fk_who_create", field: "fk_who_create" },
    { headerName: "prim", field: "prim" },
];
