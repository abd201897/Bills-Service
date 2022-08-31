import fetch from "node-fetch";
import { getToken } from "./controller";

export const validateMeter = async (body, token, signature) => {
  try {
    const userBillData = {
      meterNo: body.meterNo,
      accountType: body.accountType,
      service: body.services,
      amount: body.ammount,
      channel: body.channel,
    };
    const response = await fetch(
      `http://197.253.19.78:1880/api/v1/vas/electricity/payment`,
      {
        method: "POST",
        body: JSON.stringify(userBillData),
        headers: {
          "Content-Type": "application/json",
          token: token,
          signature: signature,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const payment = async (body, token, signature) => {
  try {
    const userPaymentData = {
      customerPhoneNumber: body.customerPhoneNumber,
      paymentMethod: body.paymentMethod,
      service: body.service,
      clientReference: body.clientReference,
      pin: body.pin,
      productCode: body.productCode,
      card: { ...body.cardInfo },
    };
    const response = await fetch(
      `http://197.253.19.78:1880/api/v1/vas/electricity/payment`,
      {
        method: "POST",
        body: JSON.stringify(userPaymentData),
        headers: {
          "Content-Type": "application/json",
          token: token,
          signature: signature,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};
