function printOperation() {
  const formElement = document.getElementById("operationForm");

  // Open a new window for printing
  const printWindow = window.open('', '', 'width=900,height=700');

  // Build the HTML content for print
  printWindow.document.write(`
    <html>
    <head>
      <title></title>  <!-- Removed the text here -->
      <style>
        /* Basic Reset */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0.5rem;
          color: #333;
          font-size: 12px; /* smaller font size */
          line-height: 1.2;
        }
        /* Style the form container */
        .operationM-form-container {
          max-width: 100%;
          margin: auto;
          border: 1px solid #0077cc;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          page-break-inside: avoid;
        }
        .operationM-form-header {
          font-size: 1.3rem;
          font-weight: 700;
          color: #0077cc;
          margin-bottom: 0.6rem;
          border-bottom: 2px solid #0077cc;
          padding-bottom: 0.2rem;
          text-align: center;
        }
        .operationM-form-section {
          margin-bottom: 0.6rem;
          page-break-inside: avoid;
        }
        .operationM-form-section-title {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.3rem;
          color: #005a9c;
          border-left: 3px solid #0077cc;
          padding-left: 0.4rem;
        }
        .operationM-form-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          page-break-inside: avoid;
        }
        .operationM-form-group {
          flex: 1 1 100%; /* full width for each field to stack vertically */
          display: flex;
          flex-direction: column;
          margin-bottom: 0.4rem;
        }
        .operationM-form-group label {
          font-weight: 600;
          margin-bottom: 0.1rem;
          font-size: 0.85rem;
        }
        .operationM-form-group input,
        .operationM-form-group select,
        .operationM-form-group textarea {
          padding: 0.25rem 0.4rem;
          font-size: 0.9rem;
          border: 1px solid #ccc;
          border-radius: 3px;
          font-family: inherit;
          resize: vertical;
          background: #fff;
          pointer-events: none; /* disable input interaction on print */
        }
        .operationM-full-width {
          flex: 1 1 100%;
        }
        /* Hide buttons on print */
        .operationM-form-actions {
          display: none !important;
        }
        /* Print page size and margins */
        @page {
          size: A4 portrait;
          margin: 10mm 10mm 10mm 10mm; /* smaller margins */
        }
        /* Avoid breaking input fields across pages */
        input, textarea, select {
          page-break-inside: avoid;
        }
        /* Responsive for smaller print widths */
        @media print {
          .operationM-form-row {
            flex-direction: column;
          }
        }
      </style>
    </head>
    <body>
      <div class="operationM-form-container">
        ${formElement.innerHTML}
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
}
