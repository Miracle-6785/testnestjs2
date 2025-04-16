import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health status', () => {
      // Mock the date to have a consistent value for testing
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      const originalDate = global.Date;
      global.Date = jest.fn(() => mockDate) as unknown as typeof Date;
      global.Date.now = jest.fn(() => mockDate.getTime());

      const result = controller.check();
      
      expect(result).toEqual({
        status: 'ok',
        timestamp: mockDate.toISOString(),
      });

      // Restore the original Date implementation
      global.Date = originalDate;
    });
  });
}); 