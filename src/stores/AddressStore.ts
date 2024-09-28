import { types, flow } from 'mobx-state-tree';
import { getAddresses } from '../utils/apiAdresses';

const AddressModel = types.model({
  id: types.identifier,
  address: types.string,
});

export const AddressStore = types
  .model({
    addresses: types.map(AddressModel),
    isLoading: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    fetchAddressById: flow(function* (id: string) {
      if (self.hasAddress(id)) {
        return self.addresses.get(id);
      }

      self.isLoading = true;
      try {
        const response = yield getAddresses([id]);
        const addressData = response.data.results[0];

        const addressModel = {
          id: addressData.id, // Идентификатор адреса
          address: `${addressData.house.address}, кв ${addressData.str_number}`, // Полный адрес дома
        };

        // Сохраняем адрес в store
        self.addresses.set(addressModel.id, addressModel);
        return addressModel; // Возвращаем загруженный адрес
      } catch (error) {
        console.error('Ошибка загрузки адреса:', error);
      } finally {
        self.isLoading = false;
      }
    }),

    getAddressById(id: string) {
      return self.addresses.get(id);
    },
  }))
  .views((self) => ({
    hasAddress(id: string) {
      return self.addresses.has(id);
    },
  }));

export default AddressStore;
