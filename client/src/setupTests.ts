// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Internal Modules
import {reset} from "./test/services/MockDatabase";
import {server} from "./test/server";

// Configure mock service workers
beforeAll(() => {
  server.listen();
});
beforeEach(() => {
  reset();
  global.localStorage.clear();
});
afterEach(() => {
  server.resetHandlers()
});
afterAll(() => {
  server.close()
});
import { jestPreviewConfigure } from 'jest-preview'
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
// TODO: To add your global css here
import './index.css';

jestPreviewConfigure({
  // Opt-in to automatic mode to preview failed test case automatically.
  autoPreview: true,
})
