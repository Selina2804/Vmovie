const movieApi = {
  // Lấy danh sách phim
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { id: 1, name: "Thanh Gươm Diệt Quỷ", country: "Nhật Bản", genre: "Anime", duration: "24 tập" },
          ],
        });
      }, 300);
    });
  },

  // Thêm phim
  create: async (movie) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: { id: Date.now(), ...movie } }), 300);
    });
  },

  // Cập nhật phim
  update: async (id, movie) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: { id, ...movie } }), 300);
    });
  },

  // Xóa phim
  delete: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: { id } }), 200);
    });
  },
};

export default movieApi;
