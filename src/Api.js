import axios from "axios";
import { getAuthToken, removeAuthToken, setAuthToken } from "./TokenUtil";

let getHeaders = () => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + getAuthToken(),
  };
};

//#region AR管理API
export const fetchDataCall = async (
  api,
  method,
  payload = null,
  download = false
) => {
  var config = {
    method: method,
    url: `${window.apiUrl}/api/AREditior/${api}`,
    headers: getHeaders(),
    params: null,
    data: null,
  };

  if (method == "get") {
    if (payload != null) {
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "") {
          delete payload[key];
        }
      });
    }
    config.params = payload;
  } else {
    config.data = payload;
  }

  if (download) {
    config.responseType = "blob";
  }

  let apiReturn = await axios
    .request(config)
    .then(async function (response) {
      if (response.data.token != null) {
        setAuthToken(response.data.token);
      }

      if (response.data.code == "1001") {
        removeAuthToken();
        window.location.href = "/";
      }
      if (!download) {
        return response.data;
      } else {
        return response;
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  return apiReturn;
};

export const fetchDataCallFile = async (api, method, data) => {
  let apiReturn = await axios
    .put(`${window.apiUrl}/api/AREditior/${api}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken(),
      },
    })
    .then(async function (response) {
      if (response.data.token != null) {
        setAuthToken(response.data.token);
      }

      if (response.data.code == "1001") {
        removeAuthToken();
        window.location.href = "/";
      }
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error.response.data.errors));
    });
  return apiReturn;
};
//#endregion

// // 用于发送文本数据的API调用
export const apiGetKnowledgeBase = (jsonData) =>
  fetchDataCall("SubmitKnowledgeBaseForm", "post", jsonData);

// // 用于文件上传的API调用
export const uploadFile = (fileData) =>
  fetchDataCallFile("FileUploadEndpoint", "post", fileData);
