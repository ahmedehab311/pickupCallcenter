import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export const fetchAllSections = async (token, apiBaseUrl, name, id) => {
  try {
    const url = id
      ? `${apiBaseUrl}/v1/call-center/${name}/${id}?api_token=${token}`
      : `${apiBaseUrl}/v1/call-center/${name}?api_token=${token}`;
    const response = await axios.get(url);

    // console.log("response", response);
    return response.data.response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};

export const useSections = (token, apiBaseUrl, name, id) =>
  useQuery({
    queryKey: ["SectionList", name, id],
    queryFn: () => fetchAllSections(token, apiBaseUrl, name, id),
    enabled: !!token && !!name,
    cacheTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

export const AssignItemToSection = async (token, apiBaseUrl, Itemid, body) => {
  try {
    const res = await axios.patch(
      `/api/assign-item-to-section?api_token=${token}&apiBaseUrl=${apiBaseUrl}&Itemid=${Itemid}`,
      body
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};
export const saveArrangement = async (token, apiBaseUrl, name, body) => {
  try {
    const response = await axios.patch(
      `/api/save-arrangement?name=${name}&api_token=${token}&apiBaseUrl=${apiBaseUrl}`,
      body
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};
export const changeItemStatus = async (apiBaseUrl, token, id, name) => {
  try {
    const res = await fetch(
      `/api/status-item?name=${name}&id=${id}&api_token=${token}&apiBaseUrl=${apiBaseUrl}`,
      {
        method: "PATCH",
      }
    );

    console.log("apiBaseUrl from client", apiBaseUrl);

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};

export const restoreItem = async (token, apiBaseUrl, id, name) => {
  try {
    const res = await fetch(
      `/api/restore-item?name=${name}&id=${id}&api_token=${token}&apiBaseUrl=${apiBaseUrl}`,
      {
        method: "PATCH",
      }
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};
export const deleteItem = async (apiBaseUrl, token, id, name) => {
  try {
    const res = await fetch(
      `/api/delete-item?name=${name}&id=${id}&api_token=${token}&apiBaseUrl=${apiBaseUrl}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error deleting item:", err);
    throw err;
  }
};
export const deleteItemTest = async (apiBaseUrl, token, id, name) => {
  try {
    const url = `${apiBaseUrl}/v1/call-center/${name}/${id}?api_token=${token}`;
    console.log("url", url);
    console.log("apiBaseUrl", apiBaseUrl);

    const res = await axios.delete(url);

    console.log("res", res);
    return res.data;
  } catch (err) {
    console.error("Error deleting item:", err);
    throw err;
  }
};
