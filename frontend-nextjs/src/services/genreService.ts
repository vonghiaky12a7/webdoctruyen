// services/genreService.ts
import { Genre } from "@/models/genre";
import axiosInstance from "@/utils/axiosInstance";

export class GenreService {
  static async getGenres(): Promise<Genre[]> {
    const response = await axiosInstance.get("/genres");
    return response.data;
  }

  static async getGenre(id: number): Promise<Genre> {
    const response = await axiosInstance.get(`/genres/${id}`);
    return response.data;
  }

  static async createGenre(genreData: { genreName: string }): Promise<Genre> {
    const response = await axiosInstance.post("/genres", genreData);
    return response.data;
  }

  static async updateGenre(
    id: number,
    genreData: { genreName: string }
  ): Promise<Genre> {
    const response = await axiosInstance.put(`/genres/${id}`, genreData);
    return response.data;
  }

  static async deleteGenre(id: number): Promise<void> {
    await axiosInstance.delete(`/genres/${id}`);
  }
}
