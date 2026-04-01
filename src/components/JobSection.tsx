import { JobEntry } from "../types/resume";
import { EditableInline, EditableTextArea } from "./EditableFields";

type JobComponentProps = {
    jobs: JobEntry[],
    onChange: (jobs:JobEntry[]) => void,
}

export function JobSection({jobs,onChange}: JobComponentProps){
    const updateJobField = (id:string,key:string,value:string) => {
        onChange(jobs.map((job) => (
            job.id === id 
            ? {...job, [key]:value}
            : job
        )));
    };

    const updateJobBullet = (jobId:string, bulletIndex:number, content:string) => {
        onChange(jobs.map(job => (
            job.id === jobId 
            ? {...job, bullets: job.bullets.map((b,i) => i === bulletIndex ? content : b )} 
            : job
        )));
    }

    const addJobBullet = (jobId:string) => {
        onChange(jobs.map(job => (
            job.id === jobId
            ? {...job, bullets: [...job.bullets, '']}
            : job
        )));
    };

    const deleteJobBullet = (jobId:string, bulletIndex:number) => {
        onChange(jobs.map( job =>(
            job.id === jobId
            ? {...job, bullets: job.bullets.filter((_,i) => i !== bulletIndex )}
            : job
        )));
    }
    return (
        <section className="section">
            <h2 className="section-title">Work Experience</h2>
            {jobs.map((job : JobEntry) => (
                <div className="job" key={job.id}>
                    <div className="job-header">
                        <span className="job-title-line"><EditableInline className='editable' content={job.role} handleChange={(text)=>updateJobField(job.id,'role',text)} /> — <EditableInline className='editable' content={job.company} handleChange={(text)=>updateJobField(job.id,'company',text)} />{job.location && <> — <EditableInline className='editable' content={job.location} handleChange={(text)=>updateJobField(job.id,'location',text)} /></>}</span>
                        <span className="job-date"><EditableInline className='editable' content={job.startDate} handleChange={(text)=>updateJobField(job.id,'startDate',text)} /> - <EditableInline className='editable' content={job.endDate} handleChange={(text)=>updateJobField(job.id,'endDate',text)} /></span>
                    </div>
                    <ul className="job-bullets">
                        {job.bullets.map((bullet, i) => (
                            <li key={i} className="bullet-row">
                                <EditableTextArea className='editable' content={bullet} handleChange={(text) => updateJobBullet(job.id,i,text)}/>
                                <button className='bullet-controls' onClick={() => deleteJobBullet(job.id,i)}>×</button>
                            </li>
                        ))}
                    </ul>
                    <button className='add-bullet-controls' onClick={() => addJobBullet(job.id)}>+</button>
                </div>
            ))}
            </section>
    )
}