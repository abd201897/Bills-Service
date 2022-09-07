import Bills from "../../models/Bills";
import { USSD_STRINGS } from "../../utils/constants";
import fetch from 'node-fetch'
import agent from "superagent";

export const getbalance = async (user, { phonenumber }) => {
  try {

    const ussdstring = `${USSD_STRINGS[telco.toUpperCase()].CHECK_BALANCE}${phonenumber}`; 

    //SEND USSD_QUERY TO USER MOBILE
    const data = [
    `key=${process.env.TEXTNG_API}`,
    `ussd=${ussdstring}`,
    `amount=${body.amount}`, 
    `ussd_steps="1,2"`,
    `pin=${body.pin}`,
    `bypasscode=${process.env.BYPASSCODE}`];

    const response = await fetch("https://api.textng.xyz/carrier_ussd/",{
      method: "POST",
      body: data.join('&'),
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    });

    const result = JSON.parse(response.text).D.details[0];

    if (result.status !== "successful") {
      throw new Error("An Error Occured with the transaction");
    }

    //RUN USSD FOR CHECKING DATA BALANCE FOR PROVIDED PHONE NUMBER
    //RETURN BALANCE RECIEVED ABOVE
    return {
      success: true,
      data: result
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};



export const purchaseairtime = async (user, { telco, phonenumber, amount }) => {
  try {
    const billsaccount = await Bills.findOne({ userid: user._id });
    if (billsaccount === null) {
      throw new Error("Bills Account not found");
    }
    const ussdstring = `${USSD_STRINGS[telco.toUpperCase()].PURCHASE_AIRTIME}${phonenumber}*${amount}#`;   // MTN82392839*900#

    //SEND DATA TO PURCHASE AIRTIME FOR USER 
    const data = [
    `key=${process.env.TEXTNG_API}`,
    `ussd=${ussdstring}`,
    `amount=${body.amount}`, 
    `ussd_steps="1,2"`,
    `pin=${body.pin}`,
    `bypasscode=${process.env.BYPASSCODE}`];

    const response = await fetch("https://api.textng.xyz/carrier_ussd/",{
      method: "POST",
      body: data.join('&'),
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    });

    const result = JSON.parse(response.text).D.details[0];

    if (result.status !== "successful") {
      throw new Error("An Error Occured with the transaction");
    }

    const transaction = {
      amount,
      beneficiary: phonenumber,
      transactiontime: new Date().toISOString(),
      transactiontype: "INCOMING",
      refid: result.ref_id,
    };
    const updatedtransactions = [
      ...billsaccount.airtime.transactions,
      transaction,
    ];

    await Bills.findByIdAndUpdate(
      billsaccount._id,
      {
        airtime: { ...billsaccount.airtime, transactions: updatedtransactions },
      },
      { new: true }
    );
    return {
      success: true,
      data: transaction,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
