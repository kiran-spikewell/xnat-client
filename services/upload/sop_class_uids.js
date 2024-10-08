const SOPClassUIDs = [
    {"SOPClassUID":"1.2.840.10008.1.1","label":"Verification SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.1.20.1","label":"Storage Commitment Push Model SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.1.20.2","label":"Storage Commitment Pull Model SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.1.3.10","label":"Media Storage Directory Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.1.40","label":"Procedural Event Logging SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.1.9","label":"Basic Study Content Notification SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.3.1.2.1.1","label":"Detached Patient Management SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.3.1.2.1.4","label":"Detached Patient Management  Meta SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.3.1.2.2.1","label":"Detached Visit Management SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.3.1.2.3.1","label":"Detached Study Management SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.3.1.2.3.2","label":"Study Componenet Management SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.3.1.2.3.3","label":"Modality Performed Procedure Step SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.3.1.2.3.4","label":"Modality Performed Procedure Step Retrieve  SOP  Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.3.1.2.3.5","label":"Modality Performed Procedure Step Notification  SOP  Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.3.1.2.5.1","label":"Detached Results  Management   SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.3.1.2.5.4","label":"Detached Results  Management Meta   SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.3.1.2.5.5","label":"Detached Study  Management   Meta SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.3.1.2.6.1","label":"Detached Interpretation  Management   SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.4.2","label":"Storage Service Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.1","label":"Basic Film Session SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.14","label":"Print Job SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.15","label":"Basic Annotation Box SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.16","label":"Printer SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.16.376","label":"Printer  Configuration Retrieval SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.18","label":"Basic Color Print Management Meta SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.18.1","label":"Referenced Color Print Management Meta SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.1.2","label":"Basic Film Box SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.22","label":"VOI LUT Box SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.23","label":"Presentation LUT SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.24","label":"Image Overlay Box SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.1.24.1","label":"Basic Print Image Overlay Box SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.1.26","label":"Print Queue Management SOP Classs","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.1.27","label":"Stored Print Storage SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.1.29","label":"Hardcopy Grayscale Image Storage SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.1.30","label":"Hardcopy Color Image Storage SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.1.31","label":"Pull Print Request SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.1.32","label":"Pull Stored Print Management Meta SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.1.33","label":"Media Creation Management SOP Class UID","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.4","label":"Basic Grayscale Image Box SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.4.1","label":"Basic Color Image Box SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.4.2","label":"Referenced Image Box SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.1.9","label":"Basic Grayscale Print Management Meta SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.1.9.1","label":"Referenced Grayscale Print Management Meta SOP Class","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.1","label":"CR Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.1.1","label":"Digital X-Ray Image Storage – for Presentation","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.1.1.1","label":"Digital X-Ray Image Storage – for Processing","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.1.2","label":"Digital Mammography X-Ray Image Storage – for Presentation","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.1.2.1","label":"Digital Mammography X-Ray Image Storage – for Processing","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.1.3","label":"Digital Intra – oral X-Ray Image Storage – for Presentation","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.1.3.1","label":"Digital Intra – oral X-Ray Image Storage – for Processing","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.10","label":"Standalone Modality LUT Storage","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.104.1","label":"Encapsulated PDF Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.11","label":"Standalone VOI LUT Storage","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.11.1","label":"Grayscale Softcopy Presentation State Storage SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.11.2","label":"Color Softcopy Presentation State Storage SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.11.3","label":"Pseudocolor Softcopy Presentation Stage Storage SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.11.4","label":"Blending Softcopy Presentation State Storage SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.12.1","label":"X-Ray Angiographic Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.12.1.1","label":"Enhanced XA Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.12.2","label":"X-Ray Radiofluoroscopic Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.12.2.1","label":"Enhanced XRF Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.12.3","label":"X-Ray Angiographic Bi-plane Image Storage","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.128","label":"Positron Emission Tomography Curve Storage","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.129","label":"Standalone Positron Emission Tomography Curve Storage","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.2","label":"CT Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.2.1","label":"Enhanced CT Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.20","label":"NM Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.3","label":"Ultrasound Multiframe Image Storage","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.3.1","label":"Ultrasound Multiframe Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.4","label":"MR Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.4.1","label":"Enhanced MR Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.4.2","label":"MR Spectroscopy Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.481.1","label":"Radiation Therapy Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.481.2","label":"Radiation Therapy Dose Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.481.3","label":"Radiation Therapy Structure Set Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.481.4","label":"Radiation Therapy Beams Treatment Record Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.481.5","label":"Radiation Therapy Plan Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.481.6","label":"Radiation Therapy Brachy Treatment Record Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.481.7","label":"Radiation Therapy Treatment Summary Record Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.481.8","label":"Radiation Therapy Ion Plan Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.481.9","label":"Radiation Therapy Ion Beams Treatment Record Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.5","label":"NM Image Storage","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.6","label":"Ultrasound Image Storage","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.6.1","label":"Ultrasound Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.66","label":"Raw Data Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.66.1","label":"Spatial Registration Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.66.2","label":"Spatial Fiducials Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.66.3","label":"Deformable Spatial Registration Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.66.4","label":"Segmentation Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.67","label":"Real World Value Mapping Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.7","label":"Secondary Capture Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.7.1","label":"Multiframe Single Bit Secondary Capture Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.7.2","label":"Multiframe Grayscale Byte Secondary Capture Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.7.3","label":"Multiframe Grayscale Word Secondary Capture Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.7.4","label":"Multiframe True Color Secondary Capture Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.77.1","label":"VL (Visible Light) Image Storage","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.77.1.1","label":"VL endoscopic Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.77.1.1.1","label":"Video Endoscopic Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.77.1.2","label":"VL Microscopic Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.77.1.2.1","label":"Video Microscopic Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.77.1.3","label":"VL Slide-Coordinates Microscopic Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.77.1.4","label":"VL Photographic Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.77.1.4.1","label":"Video Photographic Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.77.1.5.1","label":"Ophthalmic Photography 8-Bit Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.77.1.5.2","label":"Ophthalmic Photography 16-Bit Image Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.77.1.5.3","label":"Stereometric Relationship Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.77.2","label":"VL Multiframe Image Storage","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.8","label":"Standalone Overlay Storage","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.88.11","label":"Basic Text SR","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.88.22","label":"Enhanced SR","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.88.33","label":"Comprehensive SR","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.88.40","label":"Procedure Log Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.88.50","label":"Mammography CAD SR","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.88.59","label":"Key Object Selection Document","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.88.65","label":"Chest CAD SR","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.88.67","label":"X-Ray Radiation Dose SR","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.9","label":"Standalone Curve Storage","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.9.1.1","label":"12-lead ECG Waveform Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.9.1.2","label":"General ECG Waveform Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.9.1.3","label":"Ambulatory ECG Waveform Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.9.2.1","label":"Hemodynamic Waveform Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.9.3.1","label":"Cardiac Electrophysiology Waveform Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.1.9.4.1","label":"Basic Voice Audio Waveform Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.2.1.1","label":"Patient Root Query/Retrieve Information Model – FIND","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.2.1.2","label":"Patient Root Query/Retrieve Information Model – MOVE","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.2.1.3","label":"Patient Root Query/Retrieve Information Model – GET","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.2.2.1","label":"Study Root Query/Retrieve Information Model – FIND","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.2.2.2","label":"Study Root Query/Retrieve Information Model – MOVE","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.2.2.3","label":"Study Root Query/Retrieve Information Model – GET","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.2.3.1","label":"Patient/Study Only Query/Retrieve Information Model – FIND","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.2.3.2","label":"Patient/Study Only Query/Retrieve Information Model – MOVE","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.1.2.3.3","label":"Patient/Study Only Query/Retrieve Information Model – GET","retired":true},
    {"SOPClassUID":"1.2.840.10008.5.1.4.31","label":"Modality Worklist Information Model – FIND","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.32","label":"General Purpose Worklist Management Meta SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.32.1","label":"General Purpose Worklist Information Model – FIND","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.32.2","label":"General Purpose Scheduled Procedure Step SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.32.3","label":"General Purpose Performed Procedure Step SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.33","label":"Instance Availability Notification SOP Class","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.37.1","label":"General Relevant Patient Information Query","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.37.2","label":"Breast Imaging Relevant Patient Information Query","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.37.3","label":"Cardiac Relevant Patient Information Query","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.38.1","label":"Hanging Protocol Storage","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.38.2","label":"Hanging Protocol Information Model – FIND","retired":false},
    {"SOPClassUID":"1.2.840.10008.5.1.4.38.3","label":"Hanging Protocol Information Model – MOVE","retired":false}
]

function findSOPClassUID(SOPClassUID) {
    const item = SOPClassUIDs.find(item => {
        return item["SOPClassUID"] === SOPClassUID
    })

    return item ? item : {label: `[${SOPClassUID}]`}
}


module.exports = {
    SOPClassUIDs,
    findSOPClassUID
}