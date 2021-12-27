import services from '../services';

describe('Services: medications', () => {
  const config = {
    get: (): unknown => jest.fn(),
  };

  const medication = {
    name: 'Bolatan Ibrahim',
    id: '5c3cab69ffb5bd22494a8484',
  };
  const json = jest.fn().mockReturnValue(() => medication);

  describe('.create', () => {
    const payload = {};

    it('returns stringified record of newly created medication', async () => {
      const db = {
        medications: {
          create: jest.fn().mockReturnValue(medication),
        },
      };

      const { medications } = services(db);
      const actual = await medications.create({ json, config, payload });
      expect(JSON.parse(JSON.stringify(actual))).toEqual(medication);
    });

    it('throws an error when new record creation fails', async () => {
      const db = {
        medications: {
          create: jest.fn().mockReturnValue(Promise.reject(new Error('db Error'))),
        },
      };

      try {
        await expect(
          await (async (): Promise<unknown> => services(db).medications.create({ json, config, payload }))()
        ).resolves.toThrow();
      } catch (e) {
        expect(e).toEqual(new Error('db Error'));
      }
    });
  });

  describe('.findById', () => {
    let db = {
      medications: {
        findById: jest.fn().mockReturnValue(medication),
      },
    };
    const payload = { id: '5c3cab69ffb5bd22494a8484' };

    it('returns hal-json formatted record of fetched medication', async () => {
      const { medications } = services(db);
      const actual = await medications.findById({ payload, json, config });
      expect(JSON.parse(JSON.stringify(actual))).toEqual(medication);
    });

    it('raises exception when medication not found', async () => {
      db = {
        medications: {
          findById: jest.fn().mockReturnValue(null),
        },
      };

      try {
        await expect(
          await (async (): Promise<unknown> => services(db).medications.findById({ json, config, payload }))()
        ).resolves.toThrow();
      } catch (e) {
        expect(e).toEqual(new Error(null));
      }
    });
  });
});
