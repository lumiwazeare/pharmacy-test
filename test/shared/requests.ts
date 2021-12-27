import { http } from '@ctt/service-utils';
import { Map } from '../../src/server';
import { parsedResponse } from '../utils/requestHelper';

const {
  response: { JSON_TYPE },
} = http;

const expiredToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsbmFtZSI6IkJvbGF0YW4gSWJyYWhpbSIsInJvbGUiOiI1ZWIwMWQ3NjJhNzhlOGU3NGMzZmY1NmYiLCJlbWFpbCI6ImVoYnJhaGVlbUBnbWFpbC5jb20iLCJpYXQiOjE1ODk1NTM1MzYsImV4cCI6MTU4OTYzOTkzNn0.72tvRTbup06-XTACbAZIwTwTRFhtUBfqgpCfwlyhR98';
const tokenFromOtherSources =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const invalidJwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const ShoulBehaveLikeUnauthorized = (msg, requestFn): void => {
  const makeBearer = (token: string): Map<string> => ({ authorization: token });

  describe(msg, () => {
    it('When token is not provided', async () => {
      const response = await requestFn();

      const expected = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Missing authentication',
      };

      expect(response.statusCode).toBe(401);
      expect(response.statusMessage).toBe('Unauthorized');
      expect(response.headers['content-type']).toMatch(JSON_TYPE);

      const res = parsedResponse(response);
      expect(res).not.toHaveProperty('attributes');

      Object.keys(expected).forEach(key => {
        expect(res).toHaveProperty(key);
        expect(res[key]).toEqual(expected[key]);
      });
    });

    it('When expired token is provided', async () => {
      const response = await requestFn(makeBearer(expiredToken));

      const expected = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token',
        attributes: {
          error: 'Invalid token',
        },
      };

      expect(response.statusCode).toBe(401);
      expect(response.statusMessage).toBe('Unauthorized');
      expect(response.headers['content-type']).toMatch(JSON_TYPE);

      const res = parsedResponse(response);
      Object.keys(expected).forEach(key => {
        expect(res).toHaveProperty(key);
        expect(res[key]).toEqual(expected[key]);
      });
    });

    it('When token signed by other party is provided', async () => {
      const response = await requestFn(makeBearer(tokenFromOtherSources));

      const expected = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token',
        attributes: {
          error: 'Invalid token',
        },
      };

      expect(response.statusCode).toBe(401);
      expect(response.statusMessage).toBe('Unauthorized');
      expect(response.headers['content-type']).toMatch(JSON_TYPE);

      const res = parsedResponse(response);
      Object.keys(expected).forEach(key => {
        expect(res).toHaveProperty(key);
        expect(res[key]).toEqual(expected[key]);
      });
    });

    it('When invalid JWT token is provided', async () => {
      const response = await requestFn(makeBearer(invalidJwtToken));

      const expected = {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token',
        attributes: {
          error: 'Invalid token',
        },
      };

      expect(response.statusCode).toBe(401);
      expect(response.statusMessage).toBe('Unauthorized');
      expect(response.headers['content-type']).toMatch(JSON_TYPE);

      const res = parsedResponse(response);
      Object.keys(expected).forEach(key => {
        expect(res).toHaveProperty(key);
        expect(res[key]).toEqual(expected[key]);
      });
    });
  });
};
