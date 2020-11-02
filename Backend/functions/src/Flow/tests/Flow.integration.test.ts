import {testDayStat} from './Tasks.integration.data';

const Flow = require('../Flow');
const intUtil = require('../../IntegrationTestUtil');

describe('get sorted tasks', () => {
	beforeAll(async () => {
		// await intUtil.createDayStat(testDayStat);
	});

	afterAll(async () => {
		// await intUtil.deleteDayStat(testDayStat);
	});

	it('gets tasks', async () => {
		await Flow.calcFlowTimes(intUtil.adminApp);
		// todo check if the userData changed etc
	});
});
