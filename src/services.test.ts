import services from './services';
import { emptyFn } from '../test/utils/mock';
import { Dict } from '@ctt/crud-api';

describe('./services', () => {
  const db = emptyFn<Dict>();

  describe('.default', () => {
    it('should declare services', () => {
      expect(services(db)).toBeDefined();
    });
  });
});
