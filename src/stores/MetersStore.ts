// MetersStore.ts
import { types, flow } from 'mobx-state-tree';
import { fetchMeters, deleteMeter } from '../utils/apiMeters';

const Meter = types.model({
  id: types.identifier,
  _type: types.array(types.string),
  area: types.model({
    id: types.string,
  }),
  is_automatic: types.maybeNull(types.boolean),
  communication: types.maybe(types.string),
  description: types.string,
  serial_number: types.maybeNull(types.string),
  installation_date: types.string,
  brand_name: types.maybeNull(types.string),
  model_name: types.maybeNull(types.string),
  initial_values: types.array(types.number),
});

const MetersStore = types
  .model({
    meters: types.array(Meter),
    limit: types.optional(types.number, 20),
    offset: types.optional(types.number, 0),
    loading: types.optional(types.boolean, false),
    count: types.optional(types.number, 0),
    next: types.maybeNull(types.string),
    previous: types.maybeNull(types.string),
  })
  .actions((self) => ({
    fetchMeters: flow(function* (limit?: number, offset?: number) {
      self.loading = true;
      try {
        const response = yield fetchMeters(
          limit || self.limit,
          offset || self.offset
        );
        self.meters = response.data.results || [];
        self.count = response.data.count;
        self.next = response.data.next;
        self.previous = response.data.previous;
      } catch (error) {
        console.error('Ошибка загрузки данных', error);
      } finally {
        self.loading = false;
      }
    }),

    deleteMeter: flow(function* (id: string) {
      try {
        yield deleteMeter(id);
        self.meters = self.meters.filter((meter) => meter.id !== id); // Удаляем счётчик из store
      } catch (error) {
        console.error('Ошибка удаления счётчика', error);
      }
    }),
  }));

export default MetersStore;
