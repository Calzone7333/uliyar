import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getImgUrl } from '../config';

/**
 * Fetches an image and returns as ArrayBuffer
 */
const getImageBuffer = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Image fetch failed');
        const blob = await response.blob();
        return await blob.arrayBuffer();
    } catch (error) {
        console.error('Error fetching image for Excel:', error);
        return null;
    }
};

export const exportJobsToExcel = async (jobs) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Admin Jobs');

    // Define Columns
    worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Job Title', key: 'title', width: 30 },
        { header: 'Company', key: 'company', width: 25 },
        { header: 'Category', key: 'category', width: 20 },
        { header: 'Sub Category', key: 'subCategory', width: 20 },
        { header: 'Job Type', key: 'type', width: 15 },
        { header: 'Location', key: 'location', width: 20 },
        { header: 'Salary', key: 'salary', width: 15 },
        { header: 'Contact Phone', key: 'contactPhone', width: 15 },
        { header: 'Contact Email', key: 'contactEmail', width: 25 },
        { header: 'Announced Date', key: 'jobAnnouncedDate', width: 15 },
        { header: 'Social Media Date', key: 'socialMediaDate', width: 15 },
        { header: 'Posted At', key: 'postedAt', width: 15 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Requirements', key: 'requirements', width: 40 },
        { header: 'Social Media Image', key: 'socialMediaImageCol', width: 30 },
        { header: 'Newspaper Image', key: 'newspaperImageCol', width: 30 }
    ];

    // Style Header
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' } // Blue-600
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 30;

    let currentRow = 2;

    for (const job of jobs) {
        const rowData = {
            id: job.id,
            title: job.title,
            company: job.company || job.companyName || 'N/A',
            category: job.category,
            subCategory: job.subCategory || 'N/A',
            type: job.type || job.jobType || 'N/A',
            location: job.location,
            salary: job.salary,
            contactPhone: job.contactPhone || 'N/A',
            contactEmail: job.contactEmail || 'N/A',
            jobAnnouncedDate: job.jobAnnouncedDate || 'N/A',
            socialMediaDate: job.socialMediaDate || 'N/A',
            postedAt: job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'N/A',
            description: job.description || 'N/A',
            requirements: job.requirements || 'N/A'
        };

        const row = worksheet.addRow(rowData);
        row.height = 100; // Set row height to fit images
        row.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

        // Process Social Media Image
        if (job.socialMediaImage) {
            const buffer = await getImageBuffer(getImgUrl(job.socialMediaImage));
            if (buffer) {
                const imageId = workbook.addImage({
                    buffer: buffer,
                    extension: 'jpeg',
                });
                worksheet.addImage(imageId, {
                    tl: { col: 15, row: currentRow - 1 },
                    ext: { width: 120, height: 120 },
                    editAs: 'oneCell'
                });
            }
        }

        // Process Newspaper Image
        if (job.newspaperImage) {
            const buffer = await getImageBuffer(getImgUrl(job.newspaperImage));
            if (buffer) {
                const imageId = workbook.addImage({
                    buffer: buffer,
                    extension: 'jpeg',
                });
                worksheet.addImage(imageId, {
                    tl: { col: 16, row: currentRow - 1 },
                    ext: { width: 120, height: 120 },
                    editAs: 'oneCell'
                });
            }
        }

        currentRow++;
    }

    // Border for all cells
    worksheet.eachRow((row) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
    });

    // Write to Buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Uliyar_Admin_Jobs_${new Date().toISOString().split('T')[0]}.xlsx`);
};
