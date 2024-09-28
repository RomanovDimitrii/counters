// api/addresses.ts
import axios from 'axios';

export const getAddresses = async (ids: number[]) => {
  return axios.get('http://showroom.eis24.me/api/v4/test/areas/', {
    params: {
      id__in: ids.join(','), // Параметр для передачи списка id
    },
  });
};
