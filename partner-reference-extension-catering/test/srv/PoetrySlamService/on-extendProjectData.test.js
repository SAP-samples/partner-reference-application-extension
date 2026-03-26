const handler = require('../../../srv/PoetrySlamService/on-extendProjectData'); // adjust the path as needed
const testdata = require('./testdata/on-extendProjectData.json');

describe('Unit Test: Project Task Extension Function', () => {

  test('should add a new extension element to project', async () => {
    const mockRequest = {
      data: testdata.ProjectRecord
    }
    const result = await handler(mockRequest);
    // Assert
    expect(result.to_EnterpriseProjectElement).toHaveLength(2);
    const addedElement = result.to_EnterpriseProjectElement[1];
    expect(addedElement.ProjectElement).toBe('PRJ001-EXT-CAT');
    expect(addedElement.ProjectElementDescription).toBe('Catering Management');
    expect(addedElement.PlannedStartDate).toBe('2025-01-01');
    expect(addedElement.PlannedEndDate).toBe('2025-12-31');
  });

  test('should add extension project task even if task from base application is empty', async () => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    const mockRequest = {
      data: testdata.EmptyProjectRecord
    }
    const result = await handler(mockRequest);
    // Assert
    expect(result.to_EnterpriseProjectElement).toHaveLength(1);
    const addedElement = result.to_EnterpriseProjectElement[0];
    expect(addedElement.ProjectElement).toBe('PRJ001-EXT-CAT');
    expect(addedElement.ProjectElementDescription).toBe('Catering Management');
    expect(addedElement.PlannedStartDate).toBe(formattedToday);
    expect(addedElement.PlannedEndDate).toBe('9999-12-31');
  });

  test('should handle invalid JSON in Project Record gracefully', async () => {
    const mockRequest = {
      data: testdata.InvalidProjectRecord,
      reject: (code, message) => {
        const err = new Error(message);
        err.status = code;
        throw err;
      }
    };
    await expect(handler(mockRequest)).rejects.toEqual(expect.objectContaining({
      message: 'Invalid or missing Project record',
      status: 422
    }));
  });

  test('should handle null Project Record gracefully', async () => {
    const mockRequest = {
      data: testdata.NullProjectRecord,
      reject: (code, message) => {
        const err = new Error(message);
        err.status = code;
        throw err;
      }
    };
    await expect(handler(mockRequest)).rejects.toEqual(expect.objectContaining({
      message: 'Invalid or missing Project record',
      status: 422
    }));
  });

  test('should handle excessive to_EnterpriseProjectElement entries gracefully', async () => {
    const largeProjectRecord = Array.from({ length: 100000 }, () => ({
      PlannedStartDate: '2025-01-01',
      PlannedEndDate: '2025-12-31'
    }));
    const mockRequest = {
      data: {
        Project: {
          Project: 'PRJ001',
          to_EnterpriseProjectElement: largeProjectRecord
        }
      }
    };

    const result = await handler(mockRequest);
    expect(result.to_EnterpriseProjectElement).toHaveLength(100001);
  });

});
