import Bills from "../../models/Bills";
import { USSD_STRINGS, DATA_PACKAGES } from "../../utils/constants";
import agent from "superagent";

//SERVICE PENDING
export const getbalance = async (user, { phonenumber }) => {
  try {
    //RUN USSD FOR CHECKING DATA BALANCE FOR PROVIDED PHONE NUMBER
    //RETURN BALANCE RECIEVED ABOVE
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const getpackages = async () => {
  try {
    if (!DATA_PACKAGES) {
      throw new Error("Data Packages Not found");
    }
    return {
      success: true,
      packages: DATA_PACKAGES,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const purchasedata = async (user, { telco, phonenumber, code }) => {
  let ammount = 0;
  let agentAmount = 0;
  try {
    const billsaccount = await Bills.findOne({ userid: user._id });
    if (billsaccount === null) {
      throw new Error("Bills Account not found");
    }
//Code for agent CashBack
    if(user.type === 'agent'){
      agentAmount = (DATA_PACKAGES[code].amount) * 5 / 100
      ammount = DATA_PACKAGES[code].amount - agentAmount;
    }else {
      ammount = DATA_PACKAGES[code].amount
    }
    const ussdstring = `${
      USSD_STRINGS[telco.toUpperCase()].PURCHASE_DATA
    }${phonenumber}*${ammount}#`;   

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
      DataPackageSubscription: `${DATA_PACKAGES[code].code}`,
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

export const getbeneficiaries = async (user) => {
  try {
    const billsaccount = Bills.findOne({ userid: user._id });
    if (billsaccount === null) {
      throw new Error("No Bills Account available");
    }
    return {
      success: true,
      beneficiaries: billsaccount.beneficiaries,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const addbeneficiary = async (user, { number, description }) => {
  try {
    const billsaccount = await Bills.findOne({ userid: user._id });
    if (billsaccount === null) {
      throw new Error("No Bills Account available");
    }
    const newbeneficiaries = billsaccount.beneficiaries.push({
      number,
      description,
    });
    console.log(newbeneficiaries);
    const newbillsaccount = await Bills.findByIdAndUpdate(
      billsaccount._id,
      { ...billsaccount, newbeneficiaries },
      { new: true }
    );
    return {
      success: true,
      beneficiaries: newbillsaccount.beneficiaries,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

//SERVICE PENDING
export const transferdata = async (user, { body }) => {};
