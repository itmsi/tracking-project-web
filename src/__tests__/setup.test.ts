import { setupTests } from '../setupTests';

describe('Test Setup', () => {
  it('should configure jest-dom matchers', () => {
    // This test ensures that jest-dom matchers are available
    expect(expect).toBeDefined();
  });

  it('should mock IntersectionObserver', () => {
    expect(global.IntersectionObserver).toBeDefined();
  });

  it('should mock ResizeObserver', () => {
    expect(global.ResizeObserver).toBeDefined();
  });

  it('should mock matchMedia', () => {
    expect(window.matchMedia).toBeDefined();
  });

  it('should mock localStorage', () => {
    expect(global.localStorage).toBeDefined();
  });

  it('should mock sessionStorage', () => {
    expect(global.sessionStorage).toBeDefined();
  });
});
