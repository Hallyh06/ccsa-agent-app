import React from "react";
import html2pdf from "html2pdf.js";

const GenerateReport = ({ farmerData }) => {
  const createPDF = () => {
    if (!farmerData) {
      alert("No farmer data available.");
      return;
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${farmerData.farmerID}`;

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; }
            .logo { height: 60px; vertical-align: middle; margin-right: 10px; }
            .title { font-size: 22px; font-weight: bold; display: inline-block; vertical-align: middle; }
            .container { padding: 20px; background: white; border-radius: 10px; }
            .subheader { font-size: 18px; margin-top: 20px; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .row { display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 10px; }
            .row p { flex: 1; margin: 5px 10px; min-width: 150px; }
            p { font-size: 16px; margin: 6px 0; }
            .qr-container { margin-top: 30px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png" class="logo" />
              <span class="title">Centre for Climate Smart Agriculture</span>
            </div>
            <h2 style="text-align: center;">Registered Farmer Certificate</h2>

            <p><strong>Registered ID:</strong> ${farmerData.farmerID}</p>

            <div class="subheader">Farmer Information</div>
            <p><strong>NIN:</strong> ${farmerData.nin}</p>

            <div class="row">
              <p><strong>Last Name:</strong> ${farmerData.lastname}</p>
              <p><strong>First Name:</strong> ${farmerData.firstname}</p>
              <p><strong>Middle Name:</strong> ${farmerData.middlename}</p>
            </div>

            <div class="row">
              <p><strong>Email:</strong> ${farmerData.email}</p>
              <p><strong>Phone Number:</strong> ${farmerData.phone}</p>
              <p><strong>WhatsApp Number:</strong> ${farmerData.whatsappNumber}</p>
            </div>

            <p><strong>Gender:</strong> ${farmerData.gender}</p>
            <p><strong>Marital Status:</strong> ${farmerData.maritalStatus}</p>
            <p><strong>Highest Educational Qualification:</strong> ${farmerData.highestQualification}</p>

            <div class="subheader">Farm Information</div>
            <div class="row">
              <p><strong>State:</strong> ${farmerData.state}</p>
              <p><strong>Local Government:</strong> ${farmerData.lga}</p>
              <p><strong>Ward:</strong> ${farmerData.ward}</p>
              <p><strong>Polling Unit:</strong> ${farmerData.pollingUnit}</p>
            </div>

            <div class="row">
              <p><strong>Latitude:</strong> ${farmerData.latitude}</p>
              <p><strong>Longitude:</strong> ${farmerData.longitude}</p>
              <p><strong>Farming Season:</strong> ${farmerData.farmingSeason}</p>
            </div>
            <p><strong>Farm Size:</strong> ${farmerData.farmSize}</p>

            <div class="subheader">Banking Information</div>
            <div class="row">
              <p><strong>Bank Name:</strong> ${farmerData.bankname}</p>
              <p><strong>Account Name:</strong> ${farmerData.accountname}</p>
            </div>

            <div class="row">
              <p><strong>Account Number:</strong> ${farmerData.accountnumber}</p>
              <p><strong>BVN:</strong> ${farmerData.bvn}</p>
            </div>

            <div class="qr-container">
              <p><strong>Farmer Code</strong></p>
              <img src="${qrCodeUrl}" alt="QR Code" />
            </div>
          </div>
        </body>
      </html>
    `;

    const opt = {
      margin: 0.5,
      filename: `Farmer_Report_${farmerData.farmerID}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(htmlContent).set(opt).save();
  };

  return (
    <div style={styles.container}>
      <button onClick={createPDF} style={styles.button}>
        Generate Certificate
      </button>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "20px",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default GenerateReport;
