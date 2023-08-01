import { AppointmentService } from "./appointments-cart-services.model";

export type AppointmentCart = {
    cartId: number,
    cartTitle: string,
    cartStatus: boolean,
    cartComments?: string,
    fullName: string,
    birthday: string,
    patientId: number,
    ssn?: string,
    patientServices: Array<any>
};