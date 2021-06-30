import dotenv from "dotenv";

dotenv.config();
const CURRENT_URL = process.env.CURRENT_URL;

export const generateCustomerValidationLink = (customerID) => {
    return `${CURRENT_URL}/customers/validate/${customerID}`;
}