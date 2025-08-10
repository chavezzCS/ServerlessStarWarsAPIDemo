import axios from "axios";

export async function getElevacion(lat: number, lon: number) {
  const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`);
  return res.data.elevation;
}
