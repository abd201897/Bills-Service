import fetch from "node-fetch";

export const getToken = async (body) => {
  try {
    const ownerData = {
      wallet: body.wallet,
      username: body.payvice_username,
      password: body.password,
      identifier: body.identifier,
    };

    const response = await fetch(
      `http://197.253.19.78:1880/api/vas/authenticate/me`,
      {
        method: "POST",
        body: JSON.stringify(ownerData),
        headers: {
          "Content-Type": "application/json",
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



export const getEncryptedPin = async (body) => {
    try {
      const ownerData = {
        wallet: body.wallet,
        username: body.payvice_username,
        password: body.password,
        identifier: body.identifier,
      };
  
      const response = await fetch(
        `http://197.253.19.78:1880/api/vas/credentials/encrypt-pin`,
        {
          method: "POST",
          body: JSON.stringify(ownerData),
          headers: {
            "Content-Type": "application/json",
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


  export const getWallet = async (body) => {
    try {
      const ownerData = {
        "wallet": body.wallet,
        "username": body.username,
      };
  
      const response = await fetch(
        `http://197.253.19.78:1880/api/vas/wallet/balance`,
        {
          method: "POST",
          body: JSON.stringify(ownerData),
          headers: {
            "Content-Type": "application/json",
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
  
  