import {REPORTTYPE } from '@prisma/client';

export async function submitReport(reportType: REPORTTYPE, iid: string, uuid: string='unauth') {
	try {
		console.log("got = ", reportType, iid, uuid)
		if (!Object.values(REPORTTYPE).includes(reportType)) {
			throw new Error('Invalid report type');
		}
		const response = await fetch('/api/report', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ reportType, iid, uuid }),
		});
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return await response.json();
	} catch (error) {
		console.error('Failed to submit report:', error);
		throw error;
	}
}
