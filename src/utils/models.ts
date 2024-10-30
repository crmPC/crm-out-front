export const User2 = {
    foo: "bar",
};

export interface User {
    idUser: number;

    login: string;

    password: string;

    banned: boolean;

    banReason: string;

    fk_id_person: number;

    person: Person;

    userRole: UserRole;
}

export enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    USER = "worker",
    MODERATOR = "not_activated",
}

export interface Person {
    idPerson: number;

    name: string;

    surname: string;

    patronymic: string;

    dob: Date;

    fk_job_title: number;

    job_title: JobTitle;

    communications?: Communication[];
}

export interface Communication {
    idCommunication?: number;

    type?: string;


    value?: string;

    communicationLinks?: CommunicationLink[];
}
export interface AccessUsersCompany {
    idAccessUsersCompany?: number;

    fk_id_user?: number;

    fk_id_company?: number;

    user?: User;

    company?: Company;
}

export interface Address {
    idAddress?: number;

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
    idCommunicationLink?: number;

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
    idCompany?: number;

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
    idDomain_ad?: number;

    name?: string;

    who_changed?: string;

    companies?: Company[];
}

export interface DomainMail {
    idDomainMail?: number;

    fk_id_company?: number;

    name?: string;

    who_changed?: string;

    company?: Company;

    emails?: Email[];
}

export interface JobTitle {
    idJobTitle: number;

    name: string;

    description: string;
}

export interface Log {
    idLog?: number;

    fk_id_user?: number;

    action_type?: string;

    time?: Date;

    details?: string;

    user?: User;
}

export interface Email {
    idEmail?: number;

    fk_id_domain_mail?: number;

    name?: string;

    name_with_domain?: string;

    password?: string;

    domainMail?: DomainMail;
}

export interface OfficeEquip {
    idOfficeEquip?: number;

    fk_id_company?: number;

    fk_id_office_equip_types?: number;

    name?: string;

    description?: string;

    company?: Company;

    officeEquipTypes?: OfficeEquipTypes;
}

export interface OfficeEquipTypes {
    idOfficeEquipTypes?: number;

    name?: string;

    description?: string;

    officeEquips?: OfficeEquip[];
}

export interface Pass {
    idPass?: number;

    fk_id_person?: number;

    number?: string;

    person?: Person;
}
