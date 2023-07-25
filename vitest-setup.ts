import matchers from '@testing-library/jest-dom/matchers';
import {afterAll, afterEach, beforeAll, expect} from 'vitest';
import {server} from "./tests/mocks/server";

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

expect.extend(matchers);
