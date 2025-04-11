import { fetchApplicationData, displayApplications } from "../../utils/applicationUtils.js";
import * as URLS from "../../utils/fetchURLStr.js";

document.addEventListener("DOMContentLoaded", function() {
    const url = URLS.API.GetApplicationData;
    fetchApplicationData(url, (applications) => displayApplications(applications, true));
});