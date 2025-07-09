import { TestBed } from '@angular/core/testing';
import { SweetAlertService } from './sweet-alert.service';

describe('SweetAlertService', () => {
  let service: SweetAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SweetAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have success method', () => {
    expect(service.success).toBeDefined();
    expect(typeof service.success).toBe('function');
  });

  it('should have error method', () => {
    expect(service.error).toBeDefined();
    expect(typeof service.error).toBe('function');
  });

  it('should have warning method', () => {
    expect(service.warning).toBeDefined();
    expect(typeof service.warning).toBe('function');
  });

  it('should have info method', () => {
    expect(service.info).toBeDefined();
    expect(typeof service.info).toBe('function');
  });

  it('should have confirm method', () => {
    expect(service.confirm).toBeDefined();
    expect(typeof service.confirm).toBe('function');
  });

  it('should have deleteConfirm method', () => {
    expect(service.deleteConfirm).toBeDefined();
    expect(typeof service.deleteConfirm).toBe('function');
  });

  it('should have deleteSuccess method', () => {
    expect(service.deleteSuccess).toBeDefined();
    expect(typeof service.deleteSuccess).toBe('function');
  });

  it('should have showLoading method', () => {
    expect(service.showLoading).toBeDefined();
    expect(typeof service.showLoading).toBe('function');
  });

  it('should have closeLoading method', () => {
    expect(service.closeLoading).toBeDefined();
    expect(typeof service.closeLoading).toBe('function');
  });

  it('should have custom method', () => {
    expect(service.custom).toBeDefined();
    expect(typeof service.custom).toBe('function');
  });
});
