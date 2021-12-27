import routes from './routes';

describe('./routes', () => {
  describe('.default', () => {
    it('should declare routes', () => {
      expect(routes()).toBeDefined();
    });
  });
});
