import axios from 'axios';

export const fetchMeters = async (limit: number, offset: number) => {
  return axios.get('http://showroom.eis24.me/api/v4/test/meters/', {
    params: { limit, offset },
  });
};

export const deleteMeter = async (meterId: number) => {
  return axios.delete(
    `http://showroom.eis24.me/api/v4/test/meters/${meterId}/`
  );
};
