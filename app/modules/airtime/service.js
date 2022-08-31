import Bills from "../../models/Bills";
import { USSD_STRINGS } from "../../utils/constants";
import agent from "superagent";

export const getbalance = async (user, { phonenumber }) => {
  try {

    const ussdstring = `${
      USSD_STRINGS[telco.toUpperCase()].CHECK_BALANCE
    }${phonenumber}`; 

    const res = await agent
      .post("https://api.textng.xyz/carrier_ussd/")
      .type("form")
      .field("key", process.env.TEXTING_KEY)
      .field("bypasscode", process.env.BYPASSCODE)
      .field("ussd", ussdstring)
      .field("ussd_steps", 1)
      .field("amt", 0)
      .field("pin", process.env.SECRET_PIN);

    const result = JSON.parse(res.text).D.details[0];

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
    const ussdstring = `${
      USSD_STRINGS[telco.toUpperCase()].PURCHASE_AIRTIME
    }${phonenumber}*${amount}#`;                   // MTN82392839*900#

    const res = await agent
      .post("https://api.textng.xyz/carrier_ussd/")
      .type("form")
      .field("key", process.env.TEXTING_KEY)
      .field("bypasscode", process.env.BYPASSCODE)
      .field("ussd", ussdstring)
      .field("ussd_steps", 1)
      .field("amt", 0)
      .field("pin", process.env.SECRET_PIN);

    const result = JSON.parse(res.text).D.details[0];

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
