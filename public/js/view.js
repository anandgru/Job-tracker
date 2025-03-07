function displayJobs(jobs) {
    const jobList = document.getElementById("jobList");
    jobList.innerHTML = "";
    jobs.forEach((job) => {
        const li = document.createElement("li");
        li.textContent = `${job.companyName} - ${job.jobTitle} (${job.status})`;
        jobList.appendChild(li);
    });
}
