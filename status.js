
const Status = raw => {
    this.raw = raw;
    let overallProgress = 0;
    let progressReported = 0;

    const renderHeader = line => {
        return `<span class="status_line status_header">${line}</span>`

    };

    const updateOverallProgress = (percentage, isBoolean, booleanStatus) => {
        let increment;
        if (isBoolean) {
            if (booleanStatus) {
                increment = 1;
            } else {
                increment = 0;
            }
        } else {
            increment = percentage/100;
        }
        overallProgress += increment;
        progressReported +=1;
    }

    const renderProgressDetails = details => {
        let trimmed = details.trim();
        if (trimmed.length>2 && trimmed[0] === '(' && trimmed[trimmed.length-1] === ')') {
            return trimmed.substring(1,trimmed.length-1);
        }
       return trimmed;
    };

    const renderProgressBar = progress => {
        let percentage;
        let isBoolean;
        let booleanStatus;

        if (progress.indexOf('%') > -1) {
            percentage = +progress.split('%')[0];
        } else if (progress.indexOf('/') > -1) {
            const [_,left,right] = progress.match('([0-9]+)\/([0-9]+)');
            percentage = Math.ceil(100*left/right);
        } else {
            isBoolean = true;
            if (progress.indexOf('x') > -1) {
                booleanStatus = true;
            }
        }
        console.log(percentage,isBoolean,booleanStatus);

        updateOverallProgress(percentage,isBoolean,booleanStatus);

        if (isBoolean) {

            return `<span class="checkbox">${booleanStatus ? `<span class="checkbox_tick"></span>` : ''}</span>`;
        } else {
            return `<span class="progress_bar"><span class="progress_bar_complete" style="width: ${percentage}%"></span>${percentage}%</span>`;
        }

    };


    const renderProgress = line => {
        const [_, text, progress, details] = line.match(/([^\[]*)\[([^\]]*)\](.*)/);
        return `<span class="status_line status_progress">
            <span class="status_progress_text">${text}</span>
            <span class="status_progress_percentage">${renderProgressBar(progress)}</span>
            ${details.trim() && `<span class="status_progress_details">${renderProgressDetails(details)}</span>`}
            </span>`;
    };


    const renderLink = link => {
        const [text, url] = link.match(/.*(https?:\/\/[^\s]+)/);
        console.log(text,url);
        const textWithoutUrl = link.replace(url,'');
        return `<span class="status_line status_link"><a href="${url}">${textWithoutUrl}</a></span>`;
    }

    const isProgress = line => line.indexOf('[') > -1 && line.indexOf(']') > -1;
    const isLink = line => line.indexOf('http') > -1;
    const isHeader = line => !isLink(line) && !isProgress(line);

    

    const renderLine = line => {
        if (isProgress(line)) {
            return renderProgress(line);
        } else if (isLink(line)) {
            return renderLink(line);
        } else if (isHeader(line)) {
            return renderHeader(line);
        }
    };

    render = () => {
        const lines = raw.split('\n');
        console.log(overallProgress, progressReported);
        return `<link rel="stylesheet" href="https://raw.githack.com/zdanowiczkonrad/status-markdown/master/style.css"><div class="status_container">${lines.map(renderLine).join('\n')}
        <div class="overall_progress" style="width:${Math.round(overallProgress/progressReported*100)}%">${Math.round(overallProgress/progressReported*100)}%</div>
        </div>`;

    };
    return {
        mount: element => {
            element.innerHTML = render();
        }
    }
}

window.Status = Status;

document.addEventListener('DOMContentLoaded',function(){
    Status(document.body.innerHTML).mount(document.body);
});
