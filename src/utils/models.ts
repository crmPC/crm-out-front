export const User2 = {
    foo: "bar",
};

export interface User {
    id_user: number;

    login: string;

    password: string;

    banned: boolean;

    banReason: string;

    fk_id_person: number;

    person: Person;

    user_role: UserRole;
}

export enum UserRole {
    ADMIN = "admin",
    USER = "worker",
    MODERATOR = "not_activated",
}

export interface Person {
    id_person: number;

    name: string;

    surname: string;

    patronymic: string;

    dob: Date;

    fk_job_title: number;

    job_title: JobTitle;

    communications?: Communication[];
}

export interface Communication {
    id_communication?: number;

    type?: string;

    value?: string;

    communicationLinks?: CommunicationLink[];
}
export interface AccessUsersCompany {
    id_access_users_company?: number;

    fk_id_user?: number;

    fk_id_company?: number;

    user?: User;

    company?: Company;
}

export interface Address {
    id_address?: number;

    zipCode?: string;

    country?: string;

    region?: string;

    city?: string;

    street?: string;

    house?: string;

    apartment?: string;

    companies?: Company;
}

export enum CommunicationTypeEnum {
    PHONE = "phone",
    EMAIL = "email",
}

export interface CommunicationLink {
    id_communication_link?: number;

    fk_id_communication?: number;

    fk_id_company?: number;

    fk_id_person?: number;

    communication?: Communication;

    company?: Company;

    person?: Person;
}

export enum FormatEnum {
    OAO = "ОАО",
    OOO = "ООО",
    IP = "ИП",
    AO = 'АО',
    ZAO = "ЗАО"
}

export interface Company {
    id_company?: number;

    fk_id_domain_ad?: number;

    domainAd?: DomainAd;

    fk_contact_id_person?: number;

    fk_id_address?: number;

    address?: Address;

    format?: string;

    INN?: string;

    prefix?: string;

    email_domain?: string;

    description?: string;

    domainMails?: DomainMail[];

    communicationLinks?: CommunicationLink[];

    officeEquips?: OfficeEquip[];
}

export interface DomainAd {
    id_domain_ad?: number;

    name?: string;

    who_changed?: string;

    companies?: Company[];
}

export interface DomainMail {
    id_domain_mail?: number;

    fk_id_company?: number;

    name?: string;

    who_changed?: string;

    company?: Company;

    emails?: Email[];
}

export interface JobTitle {
    id_job_title: number;

    name: string;

    description: string;
}

export interface Log {
    id_log?: number;

    fk_id_user?: number;

    action_type?: string;

    time?: Date;

    details?: string;

    user?: User;
}

export interface Email {
    id_email?: number;

    fk_id_domain_mail?: number;

    name?: string;

    name_with_domain?: string;

    password?: string;

    domainMail?: DomainMail;
}

export interface OfficeEquip {
    id_office_equip?: number;

    fk_id_company?: number;

    fk_id_office_equip_types?: number;

    name?: string;

    description?: string;

    company?: Company;

    officeEquipTypes?: OfficeEquipTypes;
}

export interface OfficeEquipTypes {
    id_office_equip_types?: number;

    name?: string;

    description?: string;

    officeEquips?: OfficeEquip[];
}

export interface Pass {
    id_pass?: number;

    fk_id_person?: number;

    number?: string;

    person?: Person;
}
