import { test } from '@ctt/service-utils';

const {
  routes: { validate },
} = test;

import create, { ROUTE_NAME, findMedication, removeMedication, updateMedication, findAllMedications } from './routes';

describe(`Routes: ${ROUTE_NAME}`, () => {
  const uid = '5c3cab69ffb5bd22494a8484';
  const services = {
    medications: {
      create: jest.fn().mockReturnValue('Medication entry created'),
      findById: jest.fn().mockReturnValue('Medication entry fetched'),
      removeById: jest.fn().mockReturnValue('Medication entry deleted'),
      updateById: jest.fn().mockReturnValue('Medication entry modified'),
      findAll: jest.fn().mockReturnValue('Medication entries fetched'),
    },
  };

  describe(`POST /${ROUTE_NAME}`, () => {
    const router: any = create({ services, validate }); // eslint-disable-line @typescript-eslint/no-explicit-any
    const responseData = 'Medication entry created';
    const statusCode = 201;
    const contentType = 'application/json';
    let mockRequest = { log: null };
    let mockResponse = null;
    let mockData = null;
    let mockStatusCode = null;
    let mockContentType = null;

    beforeEach(() => {
      mockData = jest.fn();
      mockStatusCode = jest.fn();
      mockContentType = jest.fn();

      mockResponse = {
        response: mockData,
        code: mockStatusCode,
        type: mockContentType,
      };
      mockData.mockImplementation(() => mockResponse);
      mockStatusCode.mockImplementation(() => mockResponse);
      mockContentType.mockImplementation(() => mockResponse);
      mockRequest = { log: jest.fn() };
    });

    it(`sets HTTP method POST on /${ROUTE_NAME} path`, () => {
      expect(router.method).toBe('POST');
      expect(router.path).toBe(`/${ROUTE_NAME}`);
    });

    it('sets validation on request payload', () => {
      const { payload } = router.options.validate;
      expect(payload).toBeDefined();
    });

    it(`sets response HTTP status code to ${statusCode} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockStatusCode.mock.calls[0][0]).toBe(statusCode);
    });

    it(`sets response HTTP header Content-Type to ${contentType} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockContentType.mock.calls[0][0]).toBe(contentType);
    });

    it('returns response data on success', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockData.mock.calls[0][0]).toBe(responseData);
    });

    it('logs tagged request', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockRequest.log.mock.calls[0][0]).toEqual([`/${ROUTE_NAME}`]);
    });
  });

  describe(`GET /${ROUTE_NAME}`, () => {
    const router: any = findMedication({ services, validate }); // eslint-disable-line @typescript-eslint/no-explicit-any
    const responseData = 'Medication entry fetched';
    const statusCode = 200;
    const contentType = 'application/json';
    let mockRequest = { log: null, params: null };
    let mockResponse = null;
    let mockData = null;
    let mockStatusCode = null;
    let mockContentType = null;

    beforeEach(() => {
      mockData = jest.fn();
      mockStatusCode = jest.fn();
      mockContentType = jest.fn();

      mockResponse = {
        response: mockData,
        code: mockStatusCode,
        type: mockContentType,
      };
      mockData.mockImplementation(() => mockResponse);
      mockStatusCode.mockImplementation(() => mockResponse);
      mockContentType.mockImplementation(() => mockResponse);
      mockRequest = {
        log: jest.fn(),
        params: jest.fn().mockReturnValue({ medicationId: uid }),
      };
    });

    it(`sets HTTP method GET on /${ROUTE_NAME} path`, () => {
      expect(router.method).toBe('GET');
      expect(router.path).toBe(`/${ROUTE_NAME}/Id}`);
    });

    it('sets validation on request params', () => {
      const { params } = router.options.validate;
      expect(params.medicationId).toBeDefined();
    });

    it(`sets response HTTP status code to ${statusCode} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockStatusCode.mock.calls[0][0]).toBe(statusCode);
    });

    it(`sets response HTTP header Content-Type to ${contentType} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockContentType.mock.calls[0][0]).toBe(contentType);
    });

    it('returns response data on success', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockData.mock.calls[0][0]).toBe(responseData);
    });

    it('logs tagged request', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockRequest.log.mock.calls[0][0]).toEqual([`/${ROUTE_NAME}`]);
    });
  });

  describe(`DELETE /${ROUTE_NAME}`, () => {
    const router: any = removeMedication({ services, validate }); // eslint-disable-line @typescript-eslint/no-explicit-any
    const responseData = 'Medication entry deleted';
    const statusCode = 204;
    let mockRequest = { log: null, params: null };
    let mockResponse = null;
    let mockData = null;
    let mockStatusCode = null;

    beforeEach(() => {
      mockData = jest.fn();
      mockStatusCode = jest.fn();

      mockResponse = {
        response: mockData,
        code: mockStatusCode,
        type: jest.fn(),
      };
      mockData.mockImplementation(() => mockResponse);
      mockStatusCode.mockImplementation(() => mockResponse);
      mockRequest = {
        log: jest.fn(),
        params: jest.fn().mockReturnValue({ medicationId: uid }),
      };
    });

    it(`sets HTTP method DELETE on /${ROUTE_NAME} path`, () => {
      expect(router.method).toBe('DELETE');
      expect(router.path).toBe(`/${ROUTE_NAME}/Id}`);
    });

    it('sets validation on request params', () => {
      const { params } = router.options.validate;
      expect(params.medicationId).toBeDefined();
    });

    it(`sets response HTTP status code to ${statusCode} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockStatusCode.mock.calls[0][0]).toBe(statusCode);
    });

    it('returns response data on success', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockData.mock.calls[0][0]).toBe(responseData);
    });

    it('logs tagged request', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockRequest.log.mock.calls[0][0]).toEqual([`/${ROUTE_NAME}`]);
    });
  });

  describe(`PATCH /${ROUTE_NAME}`, () => {
    const router: any = updateMedication({ services, validate }); // eslint-disable-line @typescript-eslint/no-explicit-any
    const responseData = 'Medication entry modified';
    const statusCode = 200;
    let mockRequest = { log: null, params: null, payload: null };
    let mockResponse = null;
    let mockData = null;
    let mockStatusCode = null;

    beforeEach(() => {
      mockData = jest.fn();
      mockStatusCode = jest.fn();

      mockResponse = {
        response: mockData,
        code: mockStatusCode,
        type: jest.fn(),
      };
      mockData.mockImplementation(() => mockResponse);
      mockStatusCode.mockImplementation(() => mockResponse);
      mockRequest = {
        log: jest.fn(),
        params: jest.fn().mockReturnValue({ medicationId: uid }),
        payload: jest.fn().mockReturnValue({}),
      };
    });

    it(`sets HTTP method PATCH on /${ROUTE_NAME} path`, () => {
      expect(router.method).toBe('PATCH');
      expect(router.path).toBe(`/${ROUTE_NAME}/Id}`);
    });

    it('sets validation on request payload and params', () => {
      const { payload } = router.options.validate;
      const { params } = router.options.validate;
      expect(params.medicationId).toBeDefined();
      expect(payload).toBeDefined();
    });

    it(`sets response HTTP status code to ${statusCode} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockStatusCode.mock.calls[0][0]).toBe(statusCode);
    });

    it('returns response data on success', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockData.mock.calls[0][0]).toBe(responseData);
    });

    it('logs tagged request', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockRequest.log.mock.calls[0][0]).toEqual([`/${ROUTE_NAME}`]);
    });
  });

  describe('GET /medications', () => {
    const router: any = findAllMedications({ services, validate }); // eslint-disable-line @typescript-eslint/no-explicit-any
    const responseData = 'Medication entries fetched';
    const statusCode = 200;
    const contentType = 'application/json';
    let mockRequest = { log: null, query: null };
    let mockResponse = null;
    let mockData = null;
    let mockStatusCode = null;
    let mockContentType = null;

    beforeEach(() => {
      mockData = jest.fn();
      mockStatusCode = jest.fn();
      mockContentType = jest.fn();

      mockResponse = {
        response: mockData,
        code: mockStatusCode,
        type: mockContentType,
      };
      mockData.mockImplementation(() => mockResponse);
      mockStatusCode.mockImplementation(() => mockResponse);
      mockContentType.mockImplementation(() => mockResponse);
      mockRequest = {
        log: jest.fn(),
        query: jest.fn().mockReturnValue({
          offset: 'offset',
          page: 1,
          from: '2018-10-27T22:15:04.417Z',
          to: '2018-12-29T20:04:06.313Z',
          limit: 10,
        }),
      };
    });

    it('sets HTTP method GET on /medications path', () => {
      expect(router.method).toBe('GET');
      expect(router.path).toBe('/medications');
    });

    it('sets validation on query params', () => {
      const { query } = router.options.validate;
      expect(query.offset).toBeDefined();
      expect(query.page).toBeDefined();
      expect(query.from).toBeDefined();
      expect(query.to).toBeDefined();
      expect(query.limit).toBeDefined();
    });

    it(`sets response HTTP status code to ${statusCode} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockStatusCode.mock.calls[0][0]).toBe(statusCode);
    });

    it(`sets response HTTP header Content-Type to ${contentType} on success`, async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockContentType.mock.calls[0][0]).toBe(contentType);
    });

    it('returns response data on success', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockData.mock.calls[0][0]).toBe(responseData);
    });

    it('logs tagged request', async () => {
      await router.handler(mockRequest, mockResponse);
      expect(mockRequest.log.mock.calls[0][0]).toEqual([`/${ROUTE_NAME}`]);
    });
  });
});
