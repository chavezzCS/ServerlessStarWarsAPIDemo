import axios from "axios";

export async function getPlanetData(id: string) {
  const res = await axios.get(`https://swapi.info/api/planets/${id}`);
  return res.data;
}
