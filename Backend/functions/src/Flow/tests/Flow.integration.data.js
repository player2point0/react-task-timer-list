const testUserId = 'bi5D3kIatZgcddB17WyiRg54AFn2';
exports.testUserId = testUserId;

// todo download a real dayStat for this
// todo download a userdata

exports.testDayStat = {
	id: '2o352thohs7wd2rz5ol4md3sszva0rz0',
	userId: testUserId,
	date: formatDayMonth(new Date()),
};

// todo move to separate node module
function formatDayMonth(d) {
	let date = d.getDate();
	let month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
	let year = d.getFullYear();

	return date + '/' + month + '/' + year;
}
