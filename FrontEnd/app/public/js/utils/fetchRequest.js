//fetch 요청을 간략하게 사용하기 위한 Builder Patter 클래스 
class FetchRequestBuilder {

    constructor() {
        this.url = "";
        this.method = "GET";
        this.headers = {};
        this.body = null;
        this.credentials = "same-origin";
        this.pollingCount = 0;
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    setMethod(method) {
        this.method = method;
        return this;
    }

    addHeader(key, value) {
        this.headers[key] = value;
        return this;
    }

    addBody(body) {
        if (body instanceof FormData) {
            this.body = body;
        } else if (typeof body === "object") {
            this.body = JSON.stringify(body);
            this.addHeader("Content-Type", "application/json");
        } else {
            this.body = body;
        }
        return this;
    }

    setCredentials(useCredentials) {
        this.credentials = useCredentials ? "include" : "same-origin";
        return this;
    }

    setPollingCount(count) {
        this.pollingCount = count;
        return this;
    }

    async build() {

        if (!this.url)
        {
            throw new Error("URL is required");
        }

        const requestOptions = {
            method: this.method,
            headers: this.headers,
            credentials: this.credentials
        };

        if (this.body)
        {
            requestOptions.body = this.body;
        }

        let response = null;

        // Show loading spinner
        this.showLoadingSpinner();

        for (let i = 0; i <= this.pollingCount; i++)
        {
            response = await fetch(this.url, requestOptions);

            if (response.ok)
            {
                break;
            }
        }

        // Hide loading spinner
        this.hideLoadingSpinner();

        return response; //응답을 반환
    }

    showLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.style.position = 'fixed';
        spinner.style.top = '50%';
        spinner.style.left = '50%';
        spinner.style.transform = 'translate(-50%, -50%)';
        spinner.style.zIndex = '9999';
        spinner.innerHTML = `
            <div style="border: 16px solid #f3f3f3; border-top: 16px solid #3498db; border-radius: 50%; width: 120px; height: 120px; animation: spin 2s linear infinite;"></div>
            <p style="text-align: center; margin-top: 10px;">처리 중...</p>
        `;
        document.body.appendChild(spinner);

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    hideLoadingSpinner() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }

};


export default FetchRequestBuilder;

