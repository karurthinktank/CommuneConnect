import express from 'express';
import pdf from 'html-pdf';
import fs from 'fs';
import path from 'path';
import PDFMerger from 'pdf-merger-js';

const app = express();

// Define a route to generate and download the multi-page PDF
app.get('/generate-pdf', (req, res) => {
    // HTML content for first page
    const htmlContentPage1 = `
        <html>
            <head><title>Page 1</title></head>
            <body>
                <h1>Page 1</h1>
                <p>This is the content for page 1.</p>
            </body>
        </html>
    `;

    // HTML content for second page
    const htmlContentPage2 = `
        <html>
            <head><title>Page 2</title></head>
            <body>
                <h1>Page 2</h1>
                <p>This is the content for page 2.</p>
            </body>
        </html>
    `;

    // Temporary file paths for the PDFs
    const filePathPage1 = path.join(__dirname, 'temp', 'page1.pdf');
    const filePathPage2 = path.join(__dirname, 'temp', 'page2.pdf');
    const filePathMerged = path.join(__dirname, 'temp', 'merged.pdf');

    // Generate PDF for page 1
    pdf.create(htmlContentPage1).toFile(filePathPage1, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        } else {
            // Generate PDF for page 2
            pdf.create(htmlContentPage2).toFile(filePathPage2, (err) => {
                if (err) {
                    return res.status(500).send(err.message);
                } else {
                    // Merge PDFs
                    const merger = new PDFMerger(); // Create a new instance of PDFMerger
                    merger.add(filePathPage1); // Add page 1 PDF
                    merger.add(filePathPage2); // Add page 2 PDF
                    merger.save(filePathMerged) // Save merged PDF
                        .then(() => {
                            // Send the merged PDF as a download
                            res.download(filePathMerged, 'multi-page.pdf', (err) => {
                                if (err) {
                                    return res.status(500).send(err.message);
                                } else {
                                    // Remove the temporary PDF files after download
                                    fs.unlinkSync(filePathPage1);
                                    fs.unlinkSync(filePathPage2);
                                    fs.unlinkSync(filePathMerged);
                                }
                            });
                        })
                        .catch((err) => {
                            return res.status(500).send(err.message);
                        });
                }
            });
        }
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
