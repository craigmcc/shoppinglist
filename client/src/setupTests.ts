// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Internal Modules
import {reset} from "./test/services/MockDatabase";
import {server} from "./test/server";

// Configure mock service workers
beforeAll(() => server.listen());
beforeEach(() => reset());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
