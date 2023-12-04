import { user } from "./api_client.js";
import { alertTags, log } from "./main.js";
export let navigate = (p) => {
  history.pushState({}, document.title, p);
  window.dispatchEvent(new Event("popstate"));
};

export let self = {
  get_username: async () => {
    let u = localStorage.getItem("username");
    if (!u) {
      return (await save_user_info())["username"];
    }
    return u;
  },
};

export const download = async (id) => {
  let info = await user.get_book_info(id);
  let filename = `${info.data.title}.${info.data.file_type.name}`;
  let blob = await user.download_book(id);
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.style = "display: none;";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
}

export let save_user_info = async () => {
  let info;
  try {
    info = await user.info("@me");
    localStorage.setItem("username", info.username);
  } catch {
    info = { username: "" };
  }
  return info;
};

export let token = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  return `${localStorage.getItem("token_type")} ${token}`;
};

export const save_tokens_from_response = (res) => {
  localStorage.setItem("token", res.token);
  localStorage.setItem("token_type", res.token_type);
  localStorage.setItem("token_exp", res.expiration);
};
export let submit = {
  login: async (event) => {
    event.preventDefault();
    let form = event.target;
    let uname = form.querySelector("input[name='username']").value;
    let passwd = form.querySelector("input[name='password']").value;
    let res = await user.login(uname, passwd);
    if (res.status !== "error") {
      save_tokens_from_response(res);
      await save_user_info();
      navigate("/");
    } else {
      alertTags("Error!", "Couldn't login!", ["error"], 5)
    }
    return false;
  },
  register: async (event) => {
    event.preventDefault();
    let form = event.target;
    let uname = form.querySelector("input[name='username']").value;
    let passwd = form.querySelector("input[name='password']").value;
    let res = await user.register(uname, passwd);
    if (res.status !== "error") {
      save_tokens_from_response(res);
      await save_user_info();
      navigate("/");
    } else { 
      alertTags("Error!", "Couldn't register!", ["error"], 5)
    }
    return false;
  },
  upload: async (event) => {
    event.preventDefault();
    let form = event.target;
    let files = form.querySelector("input[name='file']").files;
    for (let file of files) {
      let res = await user.upload(file);
      if (res === "ok") {
        alertTags("Success!", `Book successfully uploaded.`, ["success"], 3)
      } else {
        alertTags("Error!", `Couldn't upload book!`, ["error"], 5)
      }
    }
    form.querySelector("input[name='file']").value = null;
    return false;
  },
};
