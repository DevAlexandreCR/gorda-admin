import {ClientInterface} from "@/types/ClientInterface";

export default class Client implements ClientInterface {
    id: string
    name: string
    phone: string
}