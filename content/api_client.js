import { http } from "./http.js";
export let get_info = async () => null;

export const user = {
  get_files: async () => await http.get("/api/books").json(),
  get_book_info: async (id) => await http.get(`/api/book/${id}`).json(),
  download_book: async (id) => await http.get(`/api/book/${id}/dl`).blob(),
  upload: async (file) => {
    let fd = new FormData();
    fd.append("file", file);
    return await http.put("/api/book", { body: fd }).text();
  },
  delete_book: async (id) => await http.delete(`/api/book/${id}`).json(),
  login: async (username, password) =>
    await http
      .post("/na/user", {
        json: { username, password, identifier: "password" },
        noauth: 1,
      })
      .json(),
  register: async (username, password) =>
    await http
      .put("/na/user", {
        json: { username, password, identifier: "password" },
        noauth: 1,
      })
      .json(),
};
