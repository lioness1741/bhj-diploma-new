/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ({url, data = {}, method, callback = () => {}}) => {
  const xhr = new XMLHttpRequest();
  const formData = new FormData;
  xhr.responseType = "json"; 
  
  if(method === "GET") {
    for (let key in data) {
      url += `?${key}=${data[key]}&`;
    }
  }  else {
      for (key in data) {
      formData.append(key, data[key]);
    }
  }

    try {
    xhr.open(method, url);
    if (method == "GET") {
      xhr.send();
    } else {
      xhr.send(formData);
    }
  }
  catch (err) {
    callback(err);
  }

  xhr.onload = () => {
    if (xhr.status != 200) {
      callback(err);
      console.log(xhr.status, xhr.responseText);
    } else {
      callback(null, xhr.response);
    }
  }  
};