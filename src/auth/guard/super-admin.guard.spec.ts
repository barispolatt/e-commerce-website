import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { SuperAdminGuard } from './super-admin.guard';

describe('SuperAdminGuard', () => {
  let guard: SuperAdminGuard;
  // Only declare reflector if you're going to use it in tests

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SuperAdminGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = moduleRef.get<SuperAdminGuard>(SuperAdminGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
