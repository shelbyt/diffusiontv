// pages/api/report.js

import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import prisma from '../../../utils/prismaClient'
// const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { reportType, iid, uuid } = req.body;
        //export async function submitReport(reportType: number, iid : string, uuid: string) {
        try {
            const reportRes = await prisma.report.create({
                data: {
                    type: reportType,
                    imageId: iid,
                    userId: uuid

                }
            });
            res.status(200).json(reportRes);
        } catch (e) {
            res.status(500).json({ error: 'Unable to create report' });
        }
    } else {
        // Handle any non-POST requests
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
