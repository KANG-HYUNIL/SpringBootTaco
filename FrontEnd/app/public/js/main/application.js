import { fetchApplicationData, displayApplications } from "../utils/applicationUtils.js";

document.addEventListener("DOMContentLoaded", function() {
    const url = '/api/getApplicationData';
    fetchApplicationData(url, displayApplications);
});