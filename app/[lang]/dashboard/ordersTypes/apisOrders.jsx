import axios from "axios";

export const fetchOrders = async (token, apiBaseUrl, dayNumber) => {
  const response = await axios.get(
    `${apiBaseUrl}/callcenter/orders?api_token=${token}&from=${dayNumber}`
  );

  const message = response?.data?.message;

  if (
    typeof message === "string" &&
    message.toLowerCase().includes("invalid token")
  ) {
    // نرمي error عشان نوصله في onError
    throw new Error("Invalid token");
  }

  return response.data.data;
};


export const fetchViewOrder = async (token, apiBaseUrl, orderId) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/callcenter/order/${orderId}?api_token=${token}`
    );

    return response.data.data;
    // console.log("response.data.data ", response.data.data);
  } catch (error) {
    console.error("Error fetching Orders:", error);
    throw error;
  }
};

export const fetchUserByPhoneAndId = async (
  orderIdOrPhone,
  token,
  apiBaseUrl
) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/callcenter/search/order?q=${orderIdOrPhone}&api_token=${token}`
    );
    // console.log("serach user ", response.data.data.orders);
    return response.data.data.orders;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
