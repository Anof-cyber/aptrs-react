import { beforeAll, describe, expect, expectTypeOf, test } from 'vitest';
import * as factory from './factory';
import * as definitions from '../src/lib/data/definitions';
import * as api from '../src/lib/data/api';
const BEFORE_ALL_TIMEOUT = 30000; // 30 sec

describe('Fetch project list', () => {
  let adminUser: definitions.LoginUser
  let projectList: definitions.FilteredSet
  beforeAll(async () => {
    adminUser = await factory.loginAdminUser()
    projectList = await api.fetchFilteredProjects({limit:20})
  }, BEFORE_ALL_TIMEOUT);
  
  test('Should return filtered set'), () => {
      expect(projectList).toEqual({
        results: expect.anything(),
        count: expect.any(Number),
        next: expect.any(String),
        previous: null
      })
  }
  test('Should have count > 20'), () => {
    expect(projectList.count).toBeGreaterThan(20)
  }
  
  test('Should be an array of 20 projects', () => {
    expect(projectList.results).toHaveProperty('length')
    expect(projectList.results.length).toBe(20)
  })
});

